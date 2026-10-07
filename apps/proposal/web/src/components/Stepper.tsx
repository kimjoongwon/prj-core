"use client";

import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function Stepper({ currentStep, totalSteps, labels }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-1 overflow-x-auto px-4 py-4">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isDone = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={labels[i]} className="flex items-center">
            {i > 0 && (
              <div
                className={`h-0.5 w-6 sm:w-10 ${
                  isDone ? "bg-accent" : "bg-separator"
                }`}
              />
            )}
            <button
              type="button"
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all sm:h-8 sm:w-8 ${
                isCurrent
                  ? "bg-accent text-accent-foreground scale-110"
                  : isDone
                    ? "bg-accent-soft text-accent"
                    : "bg-surface-secondary text-foreground/40"
              }`}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </button>
            {i < totalSteps - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-10 ${
                  i < currentStep - 1 ? "bg-accent" : "bg-separator"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
