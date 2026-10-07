"use client";

import { useState, useCallback } from "react";
import { Button, Container, VStack, HStack, Typography, Chip } from "@cocrepo/ui";
import { Card } from "@heroui/react";
import { Rocket, CheckCircle2 } from "lucide-react";
import { Stepper } from "../components/Stepper";
import { StepShell } from "../components/StepShell";
import { ChoiceCard } from "../components/ChoiceCard";
import { SummaryView } from "../components/SummaryView";
import { frontendStep } from "../data/frontend";
import { backendStep } from "../data/backend";
import { infrastructureStep } from "../data/infrastructure";
import { storageStep, databaseStep } from "../data/fixed";
import { aiServiceStep, aiStack } from "../data/ai-service";
import type { SelectionState } from "../data/types";
import { TOTAL_STEPS } from "../data/types";

const INITIAL: SelectionState = {
  frontend: null,
  backend: null,
  infrastructure: null,
  aiService: false,
};

export default function Page() {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<SelectionState>(INITIAL);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => {
    setStep(0);
    setSelection(INITIAL);
  }, []);

  const canNext = () => {
    if (step === 1) return selection.frontend !== null;
    if (step === 2) return selection.backend !== null;
    if (step === 3) return selection.infrastructure !== null;
    return true;
  };

  const select = (field: keyof SelectionState, value: string) => {
    setSelection((prev) => ({ ...prev, [field]: value }));
  };

  const renderComparisonTable = (
    headers: string[],
    rows: { label: string; values: Record<string, string> }[]
  ) => (
    <Card className="w-full overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-separator bg-surface-secondary">
              <th className="px-4 py-2 text-left">
                <Typography.Paragraph size="xs" color="muted" className="font-semibold">비교</Typography.Paragraph>
              </th>
              {headers.map((h) => (
                <th key={h} className="px-4 py-2 text-left">
                  <Typography.Paragraph size="xs" className="font-semibold">{h}</Typography.Paragraph>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-separator last:border-0">
                <td className="px-4 py-2">
                  <Typography.Paragraph size="xs" color="muted" className="font-medium">{row.label}</Typography.Paragraph>
                </td>
                {headers.map((h) => {
                  const key = h.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <td key={h} className="px-4 py-2">
                      <Typography.Paragraph size="xs">{row.values[key] ?? row.values[h] ?? "—"}</Typography.Paragraph>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const renderRecommendations = (
    recs: { scenario: string; pick: string; reason: string }[]
  ) => (
    <HStack gap="inline" className="flex-wrap">
      {recs.map((r) => (
        <Chip key={r.scenario} size="sm" variant="soft">
          {r.scenario} → {r.pick}
        </Chip>
      ))}
    </HStack>
  );

  return (
    <main className="min-h-screen">
      {step > 0 && step <= TOTAL_STEPS && (
        <Stepper currentStep={step} totalSteps={TOTAL_STEPS} />
      )}

      {step === 0 && (
        <Container width="narrow" className="flex min-h-screen flex-col items-center justify-center">
          <VStack gap="roomy" alignItems="center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
              <Rocket className="h-8 w-8 text-accent-foreground" />
            </span>
            <Typography.Heading level={1} align="center">기술 스택 선택</Typography.Heading>
            <Typography.Paragraph size="base" color="muted" align="center">
              프로젝트에 사용할 기술을 단계별로 선택해주세요. 각 단계에서 비교 자료를 보여드리고,
              모든 선택이 끝나면 최종 구성과 예상 비용을 확인할 수 있습니다.
            </Typography.Paragraph>
            <HStack gap="inline" className="flex-wrap justify-center">
              {["프론트엔드", "백엔드", "인프라", "저장소", "DB", "AI"].map((label) => (
                <Chip key={label} size="sm">{label}</Chip>
              ))}
            </HStack>
            <Button variant="primary" size="lg" onClick={next} className="mt-4">
              시작하기 →
            </Button>
          </VStack>
        </Container>
      )}

      {step === 1 && (
        <StepShell
          title={frontendStep.title}
          description={frontendStep.description}
          stepNumber={1} totalSteps={TOTAL_STEPS}
          canNext={canNext()} onNext={next} onPrev={prev}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {frontendStep.options.map((opt) => (
              <ChoiceCard
                key={opt.id}
                selected={selection.frontend === opt.id}
                onSelect={() => select("frontend", opt.id)}
                option={opt}
              />
            ))}
          </div>
          {renderComparisonTable(frontendStep.options.map((o) => o.name), frontendStep.comparison)}
          {renderRecommendations(frontendStep.recommendations)}
        </StepShell>
      )}

      {step === 2 && (
        <StepShell
          title={backendStep.title}
          description={backendStep.description}
          stepNumber={2} totalSteps={TOTAL_STEPS}
          canNext={canNext()} onNext={next} onPrev={prev}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {backendStep.options.map((opt) => (
              <ChoiceCard
                key={opt.id}
                selected={selection.backend === opt.id}
                onSelect={() => select("backend", opt.id)}
                option={opt}
              />
            ))}
          </div>
          {renderComparisonTable(backendStep.options.map((o) => o.name), backendStep.comparison)}
          {renderRecommendations(backendStep.recommendations)}
        </StepShell>
      )}

      {step === 3 && (
        <StepShell
          title={infrastructureStep.title}
          description={infrastructureStep.description}
          stepNumber={3} totalSteps={TOTAL_STEPS}
          canNext={canNext()} onNext={next} onPrev={prev}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {infrastructureStep.options.map((opt) => (
              <ChoiceCard
                key={opt.id}
                selected={selection.infrastructure === opt.id}
                onSelect={() => select("infrastructure", opt.id)}
                option={opt}
              />
            ))}
          </div>
          {renderComparisonTable(infrastructureStep.options.map((o) => o.name), infrastructureStep.comparison)}
          {renderRecommendations(infrastructureStep.recommendations)}
        </StepShell>
      )}

      {step === 4 && (
        <StepShell
          title={storageStep.title}
          description={storageStep.description}
          stepNumber={4} totalSteps={TOTAL_STEPS}
          canNext onNext={next} onPrev={prev}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {storageStep.options.map((opt) => (
              <ChoiceCard key={opt.id} selected onSelect={() => {}} option={opt} />
            ))}
          </div>
          {renderComparisonTable(storageStep.options.map((o) => o.name), storageStep.comparison)}
        </StepShell>
      )}

      {step === 5 && (
        <StepShell
          title={databaseStep.title}
          description={databaseStep.description}
          stepNumber={5} totalSteps={TOTAL_STEPS}
          canNext onNext={next} onPrev={prev}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {databaseStep.options.map((opt) => (
              <ChoiceCard key={opt.id} selected onSelect={() => {}} option={opt} />
            ))}
          </div>
          {renderComparisonTable(databaseStep.options.map((o) => o.name), databaseStep.comparison)}
        </StepShell>
      )}

      {step === 6 && (
        <StepShell
          title={aiServiceStep.title}
          description={aiServiceStep.description}
          stepNumber={6} totalSteps={TOTAL_STEPS}
          canNext onNext={next} onPrev={prev}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              onClick={() => setSelection((p) => ({ ...p, aiService: false }))}
              className={`cursor-pointer border-2 p-5 ${
                !selection.aiService ? "border-accent bg-accent-soft" : "border-border"
              }`}
            >
              <VStack gap="inline" alignItems="start">
                <Typography.Heading level={4}>불필요</Typography.Heading>
                <Typography.Paragraph size="sm" color="muted">AI 기능 없이 일반 웹서비스만 구축</Typography.Paragraph>
              </VStack>
            </Card>
            <Card
              onClick={() => setSelection((p) => ({ ...p, aiService: true }))}
              className={`cursor-pointer border-2 p-5 ${
                selection.aiService ? "border-accent bg-accent-soft" : "border-border"
              }`}
            >
              <VStack gap="inline" alignItems="start">
                <Typography.Heading level={4}>필요</Typography.Heading>
                <Typography.Paragraph size="sm" color="muted">챗봇·추천·문서검색 등 AI 기능 포함</Typography.Paragraph>
              </VStack>
            </Card>
          </div>
          {selection.aiService && (
            <Card className="w-full p-4">
              <VStack gap="dense" alignItems="start">
                <Typography.Paragraph size="sm" className="font-semibold">AI 스택 구성</Typography.Paragraph>
                {aiStack.map((tech) => (
                  <HStack key={tech.id} gap="inline" alignItems="center">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <Typography.Paragraph size="sm" className="font-medium">{tech.name}</Typography.Paragraph>
                    <Typography.Paragraph size="sm" color="muted">— {tech.tagline}</Typography.Paragraph>
                  </HStack>
                ))}
              </VStack>
            </Card>
          )}
        </StepShell>
      )}

      {step === TOTAL_STEPS + 1 && (
        <SummaryView selection={selection} onReset={reset} />
      )}
    </main>
  );
}
