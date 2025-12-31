package com.salubris.stepcounter;
import com.salubris.R;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class StepCounterService extends Service implements SensorEventListener {

    private static final String CHANNEL_ID = "step_counter_channel";

    private SensorManager sensorManager;
    private Sensor stepSensor;

    private float startOfDaySteps = -1;

    @Override
    public void onCreate() {
        super.onCreate();

        createNotificationChannel();
        startForeground(1, buildNotification());

        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        if (sensorManager != null) {
            stepSensor = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
            if (stepSensor != null) {
                sensorManager.registerListener(
                        this,
                        stepSensor,
                        SensorManager.SENSOR_DELAY_NORMAL
                );
            }
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        float totalSteps = event.values[0];

        if (startOfDaySteps < 0) {
            startOfDaySteps = totalSteps;
        }

        float dailySteps = totalSteps - startOfDaySteps;

        StepEventEmitter.emit((int) dailySteps);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    private Notification buildNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Step Tracking Active")
                .setContentText("Counting your steps")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setOngoing(true)
                .build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel =
                    new NotificationChannel(
                            CHANNEL_ID,
                            "Step Counter",
                            NotificationManager.IMPORTANCE_LOW
                    );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }
}
