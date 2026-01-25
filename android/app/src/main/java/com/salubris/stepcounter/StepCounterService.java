package com.salubris.stepcounter;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.util.Calendar;

public class StepCounterService extends Service implements SensorEventListener {

    private static final String TAG = "StepCounterService";
    private static final String CHANNEL_ID = "step_counter_channel";
    private static final int NOTIFICATION_ID = 1001;

    private SensorManager sensorManager;
    private Sensor stepCounterSensor;
    private SharedPreferences prefs;

    // STEP_COUNTER specific variables
    private float initialStepCount = -1;  // Initial step count when service starts
    private float lastStepCount = -1;     // Last recorded step count
    private int stepsToday = 0;           // Steps counted today
    private long currentDay = 0;          // Current day for reset tracking

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Service onCreate");

        prefs = getSharedPreferences("step_counter_prefs", MODE_PRIVATE);
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);

        // Get current day
        currentDay = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        long storedDay = prefs.getLong("last_day", currentDay);

        // Restore today's steps from storage
        stepsToday = prefs.getInt("steps_today", 0);

        // Check if day changed
        if (currentDay != storedDay) {
            Log.d(TAG, "New day detected, resetting steps");
            stepsToday = 0;
            prefs.edit().putInt("steps_today", 0).putLong("last_day", currentDay).apply();
        }

        // Initialize sensor
        initializeStepCounter();
        startForegroundService();
    }

    private void initializeStepCounter() {
        stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);

        if (stepCounterSensor == null) {
            Log.e(TAG, "STEP_COUNTER sensor not available on this device");
            stopSelf();
            return;
        }

        Log.d(TAG, "STEP_COUNTER sensor found: " + stepCounterSensor.getName());

        // Try to get the last saved step counter value
        float savedStepCounterValue = prefs.getFloat("last_sensor_value", -1);

        // Register listener
        boolean registered = sensorManager.registerListener(
                this,
                stepCounterSensor,
                SensorManager.SENSOR_DELAY_NORMAL
        );

        if (registered) {
            Log.d(TAG, "STEP_COUNTER sensor registered successfully");
            Log.d(TAG, "Restored steps today: " + stepsToday);
            Log.d(TAG, "Saved sensor value: " + savedStepCounterValue);
        } else {
            Log.e(TAG, "Failed to register STEP_COUNTER sensor");
            stopSelf();
        }
    }

    private void startForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Step Counter",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Step counting service is running");
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Step Counter")
                .setContentText("Steps today: " + stepsToday)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .build();

        startForeground(NOTIFICATION_ID, notification);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER) {
            return;
        }

        float currentSensorValue = event.values[0];
        Log.d(TAG, "STEP_COUNTER value: " + currentSensorValue);

        // First reading after service start
        if (lastStepCount < 0) {
            lastStepCount = currentSensorValue;

            // Check if we have a saved initial value
            float savedInitial = prefs.getFloat("initial_sensor_value", -1);
            float savedLast = prefs.getFloat("last_sensor_value", -1);

            if (savedInitial >= 0 && savedLast >= 0) {
                // Calculate steps since initial
                stepsToday = (int)(currentSensorValue - savedInitial);
                Log.d(TAG, "Calculated steps from saved initial: " + stepsToday);
            }

            // Save initial value if not already saved
            if (savedInitial < 0) {
                prefs.edit().putFloat("initial_sensor_value", currentSensorValue).apply();
            }

            // Save current as last
            prefs.edit().putFloat("last_sensor_value", currentSensorValue).apply();

            // Update notification and emit event
            updateNotification();
            StepCounterModule.sendStepEvent(stepsToday);
            return;
        }

        // Calculate steps since last reading
        float stepsDifference = currentSensorValue - lastStepCount;

        // Handle sensor reset (device reboot)
        if (stepsDifference < 0) {
            Log.w(TAG, "Sensor reset detected (possibly device reboot). Current: " +
                    currentSensorValue + ", Last: " + lastStepCount);

            // Reset initial value to current
            prefs.edit().putFloat("initial_sensor_value", currentSensorValue).apply();
            lastStepCount = currentSensorValue;
            stepsToday = 0; // Reset daily count as sensor was reset

            Log.d(TAG, "Reset initial value to: " + currentSensorValue);
        } else {
            // Normal case: add the difference
            stepsToday += stepsDifference;
            lastStepCount = currentSensorValue;

            Log.d(TAG, "Added " + stepsDifference + " steps. Total today: " + stepsToday);
        }

        // Save state
        saveState(currentSensorValue);

        // Update notification and emit event
        updateNotification();
        StepCounterModule.sendStepEvent(stepsToday);
    }

    private void saveState(float currentSensorValue) {
        long today = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);

        // Check if day changed
        if (today != currentDay) {
            Log.d(TAG, "Day changed. Resetting daily count.");
            stepsToday = 0;
            currentDay = today;

            // Reset initial value for new day
            prefs.edit().putFloat("initial_sensor_value", currentSensorValue).apply();
        }

        // Save to preferences
        prefs.edit()
                .putInt("steps_today", stepsToday)
                .putLong("last_day", currentDay)
                .putFloat("last_sensor_value", currentSensorValue)
                .apply();

        Log.d(TAG, "Saved state - Steps today: " + stepsToday + ", Sensor value: " + currentSensorValue);
    }

    private void updateNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                        .setContentTitle("Step Counter")
                        .setContentText("Steps today: " + stepsToday)
                        .setSmallIcon(android.R.drawable.ic_dialog_info)
                        .setPriority(NotificationCompat.PRIORITY_LOW)
                        .setOngoing(true)
                        .build();

                notificationManager.notify(NOTIFICATION_ID, notification);
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Not typically needed for STEP_COUNTER
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "Service onStartCommand. Current steps: " + stepsToday);

        // Update notification
        updateNotification();

        // Send current steps immediately
        StepCounterModule.sendStepEvent(stepsToday);

        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Service onDestroy");

        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }

        // Save final state
        if (lastStepCount >= 0) {
            saveState(lastStepCount);
        }
    }
}