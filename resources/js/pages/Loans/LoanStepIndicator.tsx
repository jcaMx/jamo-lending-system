import { User, Users, Home, DollarSign, CreditCard } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  const icons = [ DollarSign, Users, Home, CreditCard];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
      {steps.map((step, index) => {
        const Icon = icons[index];
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        const circleClasses = isActive
          ? "bg-golden text-white"
          : isCompleted
          ? "bg-golden-light text-white"
          : "bg-gray-300 text-gray-500";

        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${circleClasses}`}
              aria-current={isActive ? "step" : undefined}
            >
              {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6" />}
            </div>
            {stepNumber < steps.length && (
              <div
                className={`w-8 md:w-16 h-1 ${
                  isCompleted ? "bg-golden" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
