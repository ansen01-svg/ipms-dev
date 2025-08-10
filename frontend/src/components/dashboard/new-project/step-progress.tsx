import { Check, Edit, Eye, Send } from "lucide-react";

type FormStep = "form" | "review" | "submit";

const steps = [
  { key: "form", label: "Fill Details", icon: Edit, step: 1 },
  { key: "review", label: "Review", icon: Eye, step: 2 },
  { key: "submit", label: "Submit", icon: Send, step: 3 },
];

export const StepProgress = ({ currentStep }: { currentStep: FormStep }) => {
  const getStepIndex = (step: FormStep) => {
    return steps.findIndex((s) => s.key === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.key}
              className={`flex items-center ${isLast ? "" : "flex-1"}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 text-sm rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-teal-600 border-teal-600 text-white"
                      : isActive
                      ? " bg-gray-100 border-teal-600 text-teal-600"
                      : "bg-gray-100 border-teal-600 text-teal-600"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    // <Icon className="w-5 h-5" />
                    <span>{step.step}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive
                      ? "text-teal-600"
                      : isCompleted
                      ? "text-teal-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                    index < currentIndex ? "bg-teal-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
