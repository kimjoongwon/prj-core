"use client";

import { Button, VStack, Typography, Container } from "@cocrepo/ui";

interface StepShellProps {
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  canNext: boolean;
  onNext: () => void;
  onPrev?: () => void;
  isLastStep?: boolean;
  children: React.ReactNode;
}

export function StepShell({
  title,
  description,
  stepNumber,
  totalSteps,
  canNext,
  onNext,
  onPrev,
  isLastStep,
  children,
}: StepShellProps) {
  return (
    <Container width="content" className="flex min-h-[calc(100vh-120px)] flex-col justify-between">
      <VStack gap="page" alignItems="center">
        <VStack gap="dense" alignItems="center">
          <Typography.Heading level={2} className="text-center">
            {title}
          </Typography.Heading>
          <p className="text-center text-foreground/60">{description}</p>
        </VStack>
        <div className="w-full">{children}</div>
      </VStack>
      <div className="sticky bottom-0 flex items-center justify-between border-t border-separator bg-background/80 py-4 backdrop-blur">
        <div>
          {onPrev ? (
            <Button variant="outline" size="md" onPress={onPrev}>
              ← 이전
            </Button>
          ) : (
            <span />
          )}
        </div>
        <span className="text-xs text-foreground/40">
          {stepNumber} / {totalSteps}
        </span>
        <div>
          <Button variant="primary" size="md" isDisabled={!canNext} onPress={onNext}>
            {isLastStep ? "결과 보기 ✓" : "다음 →"}
          </Button>
        </div>
      </div>
    </Container>
  );
}
