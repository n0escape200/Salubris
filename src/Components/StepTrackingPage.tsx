import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

const { StepCounter } = NativeModules;
const stepEmitter = new NativeEventEmitter(StepCounter);

export default function StepTrackingPage() {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    console.log('stepEmitter', stepEmitter);
    const subscription = stepEmitter.addListener('StepUpdate', count => {
      setSteps(count);
    });

    return () => subscription.remove(); // clean up on unmount
  }, []);
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: 'white' }}>Steps: {steps}</Text>
      <Button title="Start" onPress={() => StepCounter.startService()} />
      <Button title="Stop" onPress={() => StepCounter.stopService()} />
    </View>
  );
}
