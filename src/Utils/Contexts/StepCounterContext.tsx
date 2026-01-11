import { createContext, ReactNode, useEffect, useState } from 'react';
import { DeviceEventEmitter, NativeModules } from 'react-native';
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
    StepCounterModule.startStepService();

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
