package com.salubris.stepcounter;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class StepCounterModule extends ReactContextBaseJavaModule {

    public StepCounterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        StepEventEmitter.setContext(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "StepCounter";
    }

    // Required for NativeEventEmitter
    @ReactMethod
    public void addListener(String eventName) {
        // No-op, required for RN >= 0.65
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // No-op, required for RN >= 0.65
    }

    @ReactMethod
    public void startService() {
        Intent intent = new Intent(getReactApplicationContext(), StepCounterService.class);
        getReactApplicationContext().startForegroundService(intent);
    }

    @ReactMethod
    public void stopService() {
        Intent intent = new Intent(getReactApplicationContext(), StepCounterService.class);
        getReactApplicationContext().stopService(intent);
    }
}
