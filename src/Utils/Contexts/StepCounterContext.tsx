import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
} from 'react-native';
const { StepCounterModule } = NativeModules;

type StepCounterType = {
  children: ReactNode;
};

type StepCounterContextProps = {
  steps: number;
};

export const StepCounterContext = createContext<StepCounterContextProps>({
  steps: 0,
});

async function requestActivityRecognitionPermission() {
  if (Platform.OS !== 'android') return true;

  if (Platform.Version >= 29) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      {
        title: 'Step Tracking Permission',
        message: 'We need access to your physical activity to track steps.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

export default function StepCounterProvider({ children }: StepCounterType) {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const initSet = async () => {
      const steps = await StepCounterModule.getCurrentSteps();
      setSteps(steps);
    };
    initSet();
  }, []);

  useEffect(() => {
    const initService = async () => {
      const permissionGranted = await requestActivityRecognitionPermission();
      if (permissionGranted) {
        StepCounterModule.startStepService();
      }
    };

    initService();

    const sub = DeviceEventEmitter.addListener('StepEvent', setSteps);
    return () => {
      sub.remove();
    };
  }, []);

  return (
    <StepCounterContext.Provider value={{ steps }}>
      {children}
    </StepCounterContext.Provider>
  );
}
