import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { StepCounterContext } from '../Utils/Contexts/StepCounterContext';

export default function StepTrackingPage() {
  const StepContext = useContext(StepCounterContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, color: 'white' }}>Steps Today:</Text>
      <Text style={{ fontSize: 48, color: 'white', marginTop: 20 }}>
        {StepContext.steps}
      </Text>
    </View>
  );
}