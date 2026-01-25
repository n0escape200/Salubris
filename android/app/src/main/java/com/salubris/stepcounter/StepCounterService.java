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
    private float lastStepCount = -1;     // Last recorded step count
    private int stepsToday = 0;           // Steps counted today
    private long currentDay = 0;          // Current day for reset tracking

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Service onCreate");
        
        // MUST call startForeground() FIRST before anything else
        startForegroundService();
        
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
    }

    private void startForegroundService() {
        // Create notification channel (required for Android 8.0+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Step Counter",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Step counting service is running");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Step Counter")
                .setContentText("Steps today: " + stepsToday)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .build();

        // CRITICAL: Must call startForeground() within 5 seconds of startForegroundService()
        startForeground(NOTIFICATION_ID, notification);
        Log.d(TAG, "Foreground service started with notification");
    }

    private void initializeStepCounter() {
        if (sensorManager == null) {
            Log.e(TAG, "SensorManager is null");
            return;
        }
        
        stepCounterSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);

        if (stepCounterSensor == null) {
            Log.e(TAG, "STEP_COUNTER sensor not available on this device");
            // Don't stopSelf() - just log and keep service running
            // Users might want to see 0 steps if sensor is unavailable
            return;
        }

        Log.d(TAG, "STEP_COUNTER sensor found: " + stepCounterSensor.getName());

        // Register listener
        try {
            boolean registered = sensorManager.registerListener(
                    this,
                    stepCounterSensor,
                    SensorManager.SENSOR_DELAY_NORMAL
            );

            if (registered) {
                Log.d(TAG, "STEP_COUNTER sensor registered successfully");
            } else {
                Log.e(TAG, "Failed to register STEP_COUNTER sensor");
            }
        } catch (SecurityException e) {
            Log.e(TAG, "Permission denied for step counter sensor", e);
        } catch (Exception e) {
            Log.e(TAG, "Error registering sensor listener", e);
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER) {
            return;
        }

        if (event.values.length == 0) {
            Log.w(TAG, "Sensor event has no values");
            return;
        }

        float currentSensorValue = event.values[0];
        Log.d(TAG, "STEP_COUNTER value: " + currentSensorValue);

        // First reading after service start
        if (lastStepCount < 0) {
            lastStepCount = currentSensorValue;
            
            // Try to restore previous state
            float savedLast = prefs.getFloat("last_sensor_value", -1);
            if (savedLast >= 0) {
                // Calculate steps since last saved value
                stepsToday += (int)(currentSensorValue - savedLast);
                if (stepsToday < 0) stepsToday = 0; // Handle sensor reset
            }
            
            // Save initial state
            saveState(currentSensorValue);
            
            // Update notification and emit event
            updateNotification();
            StepCounterModule.sendStepEvent(stepsToday);
            return;
        }

        // Calculate steps since last reading
        float stepsDifference = currentSensorValue - lastStepCount;
        
        // Handle sensor reset (device reboot or sensor reset)
        if (stepsDifference < 0) {
            Log.w(TAG, "Sensor reset detected. Current: " + currentSensorValue + ", Last: " + lastStepCount);
            // Reset tracking
            stepsToday = 0;
            lastStepCount = currentSensorValue;
        } else {
            // Normal case: add the difference
            stepsToday += (int) stepsDifference; // CAST to int
            lastStepCount = currentSensorValue;
            Log.d(TAG, "Added " + (int)stepsDifference + " steps. Total today: " + stepsToday);
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