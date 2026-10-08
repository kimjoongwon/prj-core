"use client";

import { useState, useCallback } from "react";
import { Button, Container, VStack, HStack, Typography, Chip } from "@cocrepo/ui";
import { Card } from "@heroui/react";
import { Rocket, CheckCircle2, Pencil } from "lucide-react";
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
import { TOTAL_STEPS, RESULT_STEP } from "../data/types";

const STEP_LABELS = ["시작", "프론트엔드", "백엔드", "인프라", "저장소", "DB", "AI", "검토", "결과"];

const INITIAL: SelectionState = {
  frontend: null,
  backend: null,
  infrastructure: null,
  aiService: false,
};

export default function Page() {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<SelectionState>(INITIAL);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, RESULT_STEP)), []);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => {
    setStep(0);
    setSelection(INITIAL);
  }, []);
  const goTo = useCallback((target: number) => setStep(target), []);

  const canNext = () => {
    if (step === 1) return selection.frontend !== null;
    if (step === 2) return selection.backend !== null;
    if (step === 3) return selection.infrastructure !== null;
    return true;
  };

  const select = (field: keyof SelectionState, value: string) => {
    setSelection((prev) => ({ ...prev, [field]: value }));
  };

  const fe = frontendStep.options.find((o) => o.id === selection.frontend);
  const be = backendStep.options.find((o) => o.id === selection.backend);
  const infra = infrastructureStep.options.find((o) => o.id === selection.infrastructure);

  const reviewItems = [
    { step: 1, label: "📱 프론트엔드", value: fe?.name, note: fe?.tagline },
    { step: 2, label: "⚙️ 백엔드", value: be?.name, note: be?.tagline },
    { step: 3, label: "☁️ 인프라", value: infra?.name, note: infra?.costRange },
    { step: 4, label: "📦 저장소", value: "Cloudflare R2", note: "10GB 무료 · 송신 무료" },
    { step: 5, label: "🗄️ 데이터베이스", value: "PostgreSQL", note: "ACID 준수 · JSONB · 무료" },
    {
      step: 6,
      label: "🤖 AI 서비스",
      value: selection.aiService ? "필요 (FastAPI + LangChain)" : "불필요",
      note: selection.aiService ? "Python 서버 별도 운영" : undefined,
    },
  ];

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
              모든 선택이 끝나면 검토 후 최종 구성을 확인할 수 있습니다.
            </Typography.Paragraph>
            <HStack gap="inline" className="flex-wrap justify-center">
              {["프론트엔드", "백엔드", "인프라", "저장소", "DB", "AI", "검토"].map((label) => (
                <Chip key={label} size="sm">{label}</Chip>
              ))}
            </HStack>
            <Button variant="primary" size="lg" onClick={next} className="mt-4">
              시작하기 →
            </Button>
          </VStack>
        </Container>
      )}

      {step >= 1 && step <= 6 && (
        <StepShell
          title={
            step === 1 ? frontendStep.title
            : step === 2 ? backendStep.title
            : step === 3 ? infrastructureStep.title
            : step === 4 ? storageStep.title
            : step === 5 ? databaseStep.title
            : aiServiceStep.title
          }
          description={
            step === 1 ? frontendStep.description
            : step === 2 ? backendStep.description
            : step === 3 ? infrastructureStep.description
            : step === 4 ? storageStep.description
            : step === 5 ? databaseStep.description
            : aiServiceStep.description
          }
          stepNumber={step} totalSteps={TOTAL_STEPS}
          canNext={canNext()} onNext={next} onPrev={step > 0 ? prev : undefined}
          isLastStep={step === TOTAL_STEPS}
        >
          {(step === 1 || step === 2 || step === 3) && (() => {
            const stepData = step === 1 ? frontendStep : step === 2 ? backendStep : infrastructureStep;
            const field = step === 1 ? "frontend" : step === 2 ? "backend" : "infrastructure";
            const selected = step === 1 ? selection.frontend : step === 2 ? selection.backend : selection.infrastructure;
            return (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {stepData.options.map((opt) => (
                    <ChoiceCard
                      key={opt.id}
                      selected={selected === opt.id}
                      onSelect={() => select(field, opt.id)}
                      option={opt}
                    />
                  ))}
                </div>
                {renderComparisonTable(stepData.options.map((o) => o.name), stepData.comparison)}
                {renderRecommendations(stepData.recommendations)}
              </>
            );
          })()}

          {(step === 4 || step === 5) && (() => {
            const stepData = step === 4 ? storageStep : databaseStep;
            return (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {stepData.options.map((opt) => (
                    <ChoiceCard key={opt.id} selected onSelect={() => {}} option={opt} />
                  ))}
                </div>
                {renderComparisonTable(stepData.options.map((o) => o.name), stepData.comparison)}
              </>
            );
          })()}

          {step === 6 && (
            <>
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
            </>
          )}
        </StepShell>
      )}

      {step === 7 && (
        <Container width="content" className="py-8">
          <VStack gap="page" alignItems="center">
            <Typography.Heading level={2} align="center">선택 검토</Typography.Heading>
            <Typography.Paragraph size="sm" color="muted" align="center">
              모든 선택을 확인해주세요. 수정하려면 각 항목의 ✏️ 버튼을 누르면 해당 단계로 돌아갑니다.
            </Typography.Paragraph>

            <Card className="w-full p-6">
              <VStack gap="section">
                {reviewItems.map((item) => (
                  <HStack
                    key={item.step}
                    justifyContent="between"
                    fullWidth
                    className="border-b border-separator pb-3 last:border-0 last:pb-0"
                  >
                    <VStack gap="flush" alignItems="start">
                      <Typography.Paragraph size="sm" color="muted" className="font-semibold">
                        {item.label}
                      </Typography.Paragraph>
                      <VStack gap="flush" alignItems="start">
                        <Typography.Paragraph size="base" className="font-bold">
                          {item.value ?? "미선택"}
                        </Typography.Paragraph>
                        {item.note && (
                          <Typography.Paragraph size="xs" color="muted">{item.note}</Typography.Paragraph>
                        )}
                      </VStack>
                    </VStack>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => goTo(item.step)}
                      isIconOnly
                      aria-label="수정"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </HStack>
                ))}
              </VStack>
            </Card>

            <HStack gap="inline" className="pb-8">
              <Button variant="outline" size="md" onClick={prev}>
                ← 이전
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={next}
                isDisabled={!selection.frontend || !selection.backend || !selection.infrastructure}
              >
                최종 결과 보기 ✓
              </Button>
            </HStack>
          </VStack>
        </Container>
      )}

      {step === RESULT_STEP && (
        <SummaryView selection={selection} onReset={reset} />
      )}
    </main>
  );
}
