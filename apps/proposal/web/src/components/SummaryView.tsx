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
    <HStack justifyContent="between" fullWidth className="border-b border-separator py-3 last:border-0">
      <Typography.Paragraph size="sm" color="muted" className="shrink-0 font-semibold">
        {label}
      </Typography.Paragraph>
      <VStack gap="flush" alignItems="end">
        <Typography.Paragraph size="sm" className="font-bold">{value}</Typography.Paragraph>
        {note && <Typography.Paragraph size="xs" color="muted">{note}</Typography.Paragraph>}
      </VStack>
    </HStack>
  );
}

export function SummaryView({ selection, onReset }: SummaryViewProps) {
  const fe = frontendStep.options.find((o) => o.id === selection.frontend);
  const be = backendStep.options.find((o) => o.id === selection.backend);
  const infra = infrastructureStep.options.find((o) => o.id === selection.infrastructure);
  const aiMonthly = selection.aiService ? aiStack[0].monthlyCost : 0;
  const totalMonthly = (infra?.monthlyCost ?? 0) + aiMonthly;

  return (
    <Container width="content" className="py-8">
      <VStack gap="page" alignItems="center">
        <Typography.Heading level={2} align="center">최종 기술 스택</Typography.Heading>
        <Typography.Paragraph size="sm" color="muted" align="center">
          선택하신 구성입니다. 인쇄하여 계약서에 첨부할 수 있습니다.
        </Typography.Paragraph>

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
            <div className="mt-2 rounded-lg bg-accent-soft p-4">
              <HStack justifyContent="between" fullWidth>
                <Typography.Paragraph size="sm" className="font-bold">예상 월 비용</Typography.Paragraph>
                <Typography.Heading level={3} className="text-accent">
                  ~{totalMonthly.toLocaleString()}원
                </Typography.Heading>
              </HStack>
            </div>
          </VStack>
        </Card>

        <Card className="w-full p-6">
          <VStack gap="block">
            <Typography.Heading level={4}>아키텍처 요약</Typography.Heading>
            <div className="overflow-x-auto rounded-lg bg-surface-secondary p-4">
              <pre className="text-xs leading-relaxed text-foreground/80">
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
└─────────────┘    └─────────────────────────┘${selection.aiService ? `
┌─────────────────────────────────────────────┐
│  AI 서버: FastAPI (Python) + LangChain      │
│  백엔드와 별도 프로세스로 운영               │
└─────────────────────────────────────────────┘` : ""}`}
              </pre>
            </div>
          </VStack>
        </Card>

        <HStack gap="inline" className="pb-8">
          <Button variant="outline" size="md" onClick={onReset}>
            <RotateCcw className="h-4 w-4" /> 다시 선택
          </Button>
          <Button variant="primary" size="md" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> 인쇄 / PDF 저장
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}
