"use client";

import { useState, useCallback } from "react";
import { Button, Container, VStack, Typography, Chip } from "@cocrepo/ui";
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
import { Rocket, CheckCircle2 } from "lucide-react";
import { Card } from "@heroui/react";

const STEP_LABELS = ["시작", "프론트엔드", "백엔드", "인프라", "저장소", "DB", "AI", "결과"];

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
    switch (step) {
      case 0: return true;
      case 1: return selection.frontend !== null;
      case 2: return selection.backend !== null;
      case 3: return selection.infrastructure !== null;
      case 4: case 5: return true;
      case 6: return true;
      default: return true;
    }
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
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-separator bg-surface-secondary">
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground/50">비교</th>
              {headers.map((h) => (
                <th key={h} className="px-4 py-2 text-left text-xs font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-separator last:border-0">
                <td className="px-4 py-2 text-xs font-medium text-foreground/60">{row.label}</td>
                {headers.map((h) => {
                  const key = h.toLowerCase().replace(/\s+/g, "-");
                  return (
                    <td key={h} className="px-4 py-2 text-xs">{row.values[key] ?? row.values[h] ?? "—"}</td>
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
    <div className="flex flex-wrap gap-2">
      {recs.map((r) => (
        <Chip key={r.scenario} size="sm" variant="soft" color="accent">
          {r.scenario} → {r.pick}
        </Chip>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen">
      {step > 0 && step <= TOTAL_STEPS && (
        <Stepper currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />
      )}

      {step === 0 && (
        <Container width="content" className="flex min-h-screen flex-col items-center justify-center">
          <VStack gap="roomy" alignItems="center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
              <Rocket className="h-8 w-8 text-accent-foreground" />
            </span>
            <Typography.Heading level={1} className="text-center">
              기술 스택 선택
            </Typography.Heading>
            <p className="max-w-md text-center text-foreground/60">
              프로젝트에 사용할 기술을 단계별로 선택해주세요.
              각 단계에서 비교 자료를 보여드리고, 모든 선택이 끝나면 최종 구성과 예상 비용을 확인할 수 있습니다.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {STEP_LABELS.slice(1, -1).map((label) => (
                <Chip key={label} size="sm" variant="soft">{label}</Chip>
              ))}
            </div>
            <Button variant="primary" size="lg" onPress={next} className="mt-4">
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
                {...opt}
              />
            ))}
          </div>
          {renderComparisonTable(
            frontendStep.options.map((o) => o.name),
            frontendStep.comparison
          )}
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
                {...opt}
              />
            ))}
          </div>
          {renderComparisonTable(
            backendStep.options.map((o) => o.name),
            backendStep.comparison
          )}
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
                {...opt}
              />
            ))}
          </div>
          {renderComparisonTable(
            infrastructureStep.options.map((o) => o.name),
            infrastructureStep.comparison
          )}
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
              <ChoiceCard key={opt.id} selected onSelect={() => {}} {...opt} />
            ))}
          </div>
          {renderComparisonTable(
            storageStep.options.map((o) => o.name),
            storageStep.comparison
          )}
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
              <ChoiceCard key={opt.id} selected onSelect={() => {}} {...opt} />
            ))}
          </div>
          {renderComparisonTable(
            databaseStep.options.map((o) => o.name),
            databaseStep.comparison
          )}
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
                <p className="text-sm text-foreground/60">AI 기능 없이 일반 웹서비스만 구축</p>
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
                <p className="text-sm text-foreground/60">챗봇·추천·문서검색 등 AI 기능 포함</p>
              </VStack>
            </Card>
          </div>
          {selection.aiService && (
            <Card className="w-full p-4">
              <VStack gap="dense" alignItems="start">
                <p className="text-sm font-semibold">AI 스택 구성</p>
                {aiStack.map((tech) => (
                  <div key={tech.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <span className="font-medium">{tech.name}</span>
                    <span className="text-foreground/50">— {tech.tagline}</span>
                  </div>
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
