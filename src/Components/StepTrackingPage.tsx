import React, { useEffect, useState } from 'react';
import { View, Text, NativeModules, DeviceEventEmitter } from 'react-native';
const { StepCounterModule } = NativeModules;

export default function StepTrackingPage() {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const initSet = async () => {
      const steps = await StepCounterModule.getCurrentSteps();
      setSteps(steps);
    };
    initSet();
  }, []);

  useEffect(() => {
    StepCounterModule.startStepService();

    const sub = DeviceEventEmitter.addListener('StepEvent', setSteps);

    return () => {
      sub.remove();
      StepCounterModule.stopStepService();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, color: 'white' }}>Steps Today:</Text>
      <Text style={{ fontSize: 48, color: 'white', marginTop: 20 }}>
        {steps}
      </Text>
    </View>
  );
}
