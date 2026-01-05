package com.salubris.stepcounter;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
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

    public static void sendStepEvent(int steps) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("StepEvent", steps);
        }
    }

    @ReactMethod
    public void getCurrentSteps(Promise promise) {
        SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(
                "step_counter_prefs", Context.MODE_PRIVATE);

        long today = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        long storedDay = prefs.getLong("last_day", today);
        int steps = prefs.getInt("steps_today", 0);

        if (today != storedDay) {
            steps = 0;
        }

        promise.resolve(steps);
    }



}
