"use client";

import { HStack } from "@cocrepo/ui";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export function Stepper({ currentStep, totalSteps }: StepperProps) {
  return (
    <HStack gap="dense" justifyContent="center" fullWidth className="py-4">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isDone = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <HStack key={i} gap="dense" alignItems="center">
            {i > 0 && (
              <span className={`h-px w-8 ${isDone ? "bg-accent" : "bg-separator"}`} />
            )}
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                isCurrent
                  ? "scale-110 bg-accent text-accent-foreground"
                  : isDone
                    ? "bg-accent-soft text-accent"
                    : "bg-surface-secondary text-foreground/40"
              }`}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            {i < totalSteps - 1 && (
              <span className={`h-px w-8 ${i < currentStep ? "bg-accent" : "bg-separator"}`} />
            )}
          </HStack>
        );
      })}
    </HStack>
  );
}
