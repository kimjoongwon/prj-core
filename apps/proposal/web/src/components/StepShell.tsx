"use client";

import { Button, VStack, HStack, Typography, Container } from "@cocrepo/ui";

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
    <Container width="page" className="flex min-h-[calc(100vh-120px)] flex-col justify-between py-6">
      <VStack gap="section">
        <VStack gap="dense" alignItems="center">
          <Typography.Heading level={2} align="center">
            {title}
          </Typography.Heading>
          <Typography.Paragraph size="sm" color="muted" align="center">
            {description}
          </Typography.Paragraph>
        </VStack>
        <VStack gap="section">{children}</VStack>
      </VStack>

      <div className="sticky bottom-0 mt-6 border-t border-separator bg-background/80 py-4 backdrop-blur">
        <HStack justifyContent="between" fullWidth>
          {onPrev ? (
            <Button variant="outline" size="md" onClick={onPrev}>
              ← 이전
            </Button>
          ) : (
            <span />
          )}
          <Typography.Paragraph size="xs" color="muted">
            {stepNumber} / {totalSteps}
          </Typography.Paragraph>
          <Button variant="primary" size="md" isDisabled={!canNext} onClick={onNext}>
            {isLastStep ? "결과 보기 ✓" : "다음 →"}
          </Button>
        </HStack>
      </div>
    </Container>
  );
}
