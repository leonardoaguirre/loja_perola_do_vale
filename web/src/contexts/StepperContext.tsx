import { createContext, ReactNode, useEffect, useState } from "react";

interface StepperContextData {
  currentStep: number;
  setCurrentStepNumber: (stepNumber: number) => void;
}

interface StepperContextProviderProps {
  children: ReactNode;
}

export const StepperContext = createContext({} as StepperContextData);

export function StepperProvider({ children }: StepperContextProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(3);

  useEffect(() => {
    setCurrentStep(3);
  }, []);

  function setCurrentStepNumber(stepNumber: number) {
    setCurrentStep(stepNumber);
  }

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        setCurrentStepNumber,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
}
