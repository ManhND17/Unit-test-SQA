import { CheckIcon } from 'lucide-react';
type FormStep = {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
};

interface StepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Tiến trình đặt lịch" className="mb-8">
      <ol className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full
                    text-sm md:text-base font-semibold transition-all duration-300
                    ${isCompleted ? 'bg-teal-600 text-white' : isActive ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-gray-200 text-gray-500'}
                  `}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <CheckIcon
                      className="w-4 h-4 md:w-5 md:h-5"
                      aria-hidden="true"
                    />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`
                    hidden sm:block text-sm md:text-base font-medium transition-colors duration-300
                    ${isActive ? 'text-teal-700' : isCompleted ? 'text-teal-600' : 'text-gray-500'}
                  `}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    w-8 md:w-16 lg:w-24 h-0.5 mx-2 md:mx-4 transition-colors duration-300
                    ${currentStep > step.id ? 'bg-teal-600' : 'bg-gray-200'}
                  `}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
