package com.salubris.stepcounter;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Calendar;

public class StepCounterModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    public StepCounterModule(@NonNull ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "StepCounterModule";
    }

    @ReactMethod
    public void startStepService() {
        Intent serviceIntent = new Intent(reactContext, StepCounterService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent);
        } else {
            reactContext.startService(serviceIntent);
        }
    }

    @ReactMethod
    public void stopStepService() {
        Intent serviceIntent = new Intent(reactContext, StepCounterService.class);
        reactContext.stopService(serviceIntent);
    }

    @ReactMethod
    public void checkStepCounterAvailable(Promise promise) {
        try {
            SensorManager sensorManager = (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE);
            Sensor stepCounter = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
            promise.resolve(stepCounter != null);
        } catch (Exception e) {
            promise.reject("SENSOR_ERROR", "Failed to check step counter availability", e);
        }
    }

    public static void sendStepEvent(int steps) {
        if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("StepEvent", steps);
        }
    }

    @ReactMethod
    public void getCurrentSteps(Promise promise) {
        try {
            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(
                    "step_counter_prefs", Context.MODE_PRIVATE);

            long today = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
            long storedDay = prefs.getLong("last_day", today);
            int steps = prefs.getInt("steps_today", 0);

            if (today != storedDay) {
                steps = 0;
                prefs.edit().putLong("last_day", today).putInt("steps_today", 0).apply();
            }

            promise.resolve(steps);
        } catch (Exception e) {
            promise.reject("STORAGE_ERROR", "Failed to get current steps", e);
        }
    }

    @ReactMethod
    public void resetStepCount(Promise promise) {
        try {
            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(
                    "step_counter_prefs", Context.MODE_PRIVATE);
            long today = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
            prefs.edit().putInt("steps_today", 0).putLong("last_day", today).apply();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("RESET_ERROR", "Failed to reset step count", e);
        }
    }

    @ReactMethod
    public void getServiceStatus(Promise promise) {
        SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(
                "step_counter_prefs", Context.MODE_PRIVATE);
        boolean hasData = prefs.contains("steps_today");
        promise.resolve(hasData);
    }

    @ReactMethod
    public void getStepSensorInfo(Promise promise) {
        try {
            SensorManager sensorManager = (SensorManager) reactContext.getSystemService(Context.SENSOR_SERVICE);
            Sensor stepCounter = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);

            if (stepCounter == null) {
                promise.resolve("STEP_COUNTER not available");
                return;
            }

            SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(
                    "step_counter_prefs", Context.MODE_PRIVATE);

            float initialValue = prefs.getFloat("initial_sensor_value", -1);
            float lastValue = prefs.getFloat("last_sensor_value", -1);
            int stepsToday = prefs.getInt("steps_today", 0);

            String info = "Sensor: " + stepCounter.getName() + "\n" +
                    "Vendor: " + stepCounter.getVendor() + "\n" +
                    "Initial Value: " + initialValue + "\n" +
                    "Last Value: " + lastValue + "\n" +
                    "Steps Today: " + stepsToday;

            promise.resolve(info);
        } catch (Exception e) {
            promise.reject("SENSOR_INFO_ERROR", "Failed to get sensor info", e);
        }
    }
}