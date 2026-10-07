"use client";

import { Button, Chip, VStack, HStack, Typography, Container } from "@cocrepo/ui";
import { Card } from "@heroui/react";
import { RotateCcw, Printer } from "lucide-react";
import type { SelectionState } from "../data/types";
import { frontendStep } from "../data/frontend";
import { backendStep } from "../data/backend";
import { infrastructureStep } from "../data/infrastructure";
import { aiStack } from "../data/ai-service";

interface SummaryViewProps {
  selection: SelectionState;
  onReset: () => void;
}

function SummaryRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-separator py-3 last:border-0">
      <span className="shrink-0 text-sm font-semibold text-foreground/50">{label}</span>
      <div className="text-right">
        <p className="text-sm font-bold">{value}</p>
        {note && <p className="text-xs text-foreground/50">{note}</p>}
      </div>
    </div>
  );
}

export function SummaryView({ selection, onReset }: SummaryViewProps) {
  const fe = frontendStep.options.find((o) => o.id === selection.frontend);
  const be = backendStep.options.find((o) => o.id === selection.backend);
  const infra = infrastructureStep.options.find((o) => o.id === selection.infrastructure);
  const aiMonthly = selection.aiService ? aiStack[0].monthlyCost : 0;
  const totalMonthly = (infra?.monthlyCost ?? 0) + aiMonthly;

  return (
    <Container width="content">
      <VStack gap="page" alignItems="center">
        <Typography.Heading level={2}>최종 기술 스택</Typography.Heading>
        <p className="text-foreground/60">선택하신 구성입니다. 인쇄하여 계약서에 첨부할 수 있습니다.</p>

        <Card className="w-full p-6">
          <VStack gap="section">
            <SummaryRow label="📱 프론트엔드" value={fe?.name ?? "—"} note={fe?.tagline} />
            <SummaryRow label="⚙️ 백엔드" value={be?.name ?? "—"} note={be?.tagline} />
            <SummaryRow label="☁️ 인프라" value={infra?.name ?? "—"} note={infra?.costRange} />
            <SummaryRow label="📦 저장소" value="Cloudflare R2" note="10GB 무료 · 송신 무료" />
            <SummaryRow label="🗄️ 데이터베이스" value="PostgreSQL" note="ACID 준수 · JSONB · 무료" />
            <SummaryRow
              label="🤖 AI 서비스"
              value={selection.aiService ? "FastAPI + LangChain + pgvector" : "불필요"}
              note={selection.aiService ? "Python 서버 별도 운영" : undefined}
            />
            <div className="mt-2 rounded-xl bg-accent-soft p-4">
              <HStack justifyContent="between" fullWidth>
                <span className="font-bold">예상 월 비용</span>
                <span className="text-xl font-bold text-accent">
                  ~{totalMonthly.toLocaleString()}원
                </span>
              </HStack>
            </div>
          </VStack>
        </Card>

        <Card className="w-full p-6">
          <Typography.Heading level={4} className="mb-3">
            아키텍처 요약
          </Typography.Heading>
          <pre className="overflow-x-auto rounded-lg bg-surface-secondary p-4 text-xs leading-relaxed">
{`┌─────────────────────────────────────────────┐
│                사용자                        │
│           (iOS / Android / Web)              │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         프론트엔드: ${fe?.name ?? "—"}${" ".repeat(Math.max(0, 14 - (fe?.name.length ?? 0)))}│
└─────────────────┬───────────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────────┐
│         백엔드: ${be?.name ?? "—"}${" ".repeat(Math.max(0, 16 - (be?.name.length ?? 0)))}│
│         인프라: ${infra?.name ?? "—"}${" ".repeat(Math.max(0, 16 - (infra?.name.length ?? 0)))}│
└──────┬──────────────────────┬───────────────┘
       │                      │
┌──────▼──────┐    ┌─────────▼───────────────┐
│ PostgreSQL  │    │ Cloudflare R2           │
│   (DB)      │    │   (파일 저장 + CDN)      │
└─────────────┘    └─────────────────────────┘
${selection.aiService ? `
┌─────────────────────────────────────────────┐
│  AI 서버: FastAPI (Python) + LangChain      │
│  백엔드와 별도 프로세스로 운영               │
└─────────────────────────────────────────────┘` : ""}`}
          </pre>
        </Card>

        <HStack gap="block" className="pb-8">
          <Button variant="outline" size="md" onPress={onReset} startContent={<RotateCcw className="h-4 w-4" />}>
            다시 선택
          </Button>
          <Button variant="primary" size="md" onPress={() => window.print()} startContent={<Printer className="h-4 w-4" />}>
            인쇄 / PDF 저장
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}
