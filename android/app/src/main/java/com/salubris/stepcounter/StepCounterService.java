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
    private SensorManager sensorManager;
    private Sensor stepSensor;
    private SharedPreferences prefs;



    @Override
    public void onCreate() {
        super.onCreate();
        prefs = getSharedPreferences("step_counter_prefs", MODE_PRIVATE);
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);
        startForegroundService();
        registerSensor();
    }

    private void startForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Step Counter",
                    NotificationManager.IMPORTANCE_LOW
            );
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Step Counter Active")
                .setContentText("Tracking your steps")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .build();
        startForeground(1, notification);
    }

    private void registerSensor() {
        if (stepSensor != null) {
            sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
        } else {
            Log.d(TAG, "No step detector sensor found!");
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_STEP_DETECTOR) return;

        int steps = getTodaySteps();
        steps += event.values.length; // increment by detected steps
        saveTodaySteps(steps);

        // Emit to React Native
        StepCounterModule.sendStepEvent(steps);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) { }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Emit current step count when React Native connects
        StepCounterModule.sendStepEvent(getTodaySteps());
        return START_STICKY;
    }

    private int getTodaySteps() {
        long today = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        long storedDay = prefs.getLong("last_day", today);
        int steps = prefs.getInt("steps_today", 0);

        if (today != storedDay) {
            steps = 0; // reset at midnight
            prefs.edit().putLong("last_day", today).putInt("steps_today", 0).apply();
        }
        return steps;
    }

    private void saveTodaySteps(int steps) {
        long today = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        prefs.edit().putInt("steps_today", steps).putLong("last_day", today).apply();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        sensorManager.unregisterListener(this);
    }
}
