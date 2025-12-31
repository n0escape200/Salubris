package com.salubris.stepcounter;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class StepEventEmitter {

    private static ReactApplicationContext reactContext;

    public static void setContext(ReactApplicationContext context) {
        reactContext = context;
    }

    public static void emit(int steps) {
        if (reactContext != null) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("StepUpdate", steps);
        }
    }
}
