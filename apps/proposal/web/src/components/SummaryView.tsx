"use client";

import { Button, Chip, VStack, HStack, Typography, Container } from "@cocrepo/ui";
import { Card } from "@heroui/react";
import { RotateCcw, Printer, FolderGit2, Bot } from "lucide-react";
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
  const isMonorepo = selection.frontend === "react-native" && selection.backend === "nestjs";

  return (
    <Container width="content" className="py-8">
      <VStack gap="page" alignItems="center">
        <Typography.Heading level={2} align="center">최종 기술 스택</Typography.Heading>
        <Typography.Paragraph size="sm" color="muted" align="center">
          선택하신 구성입니다. 인쇄하여 계약서에 첨부할 수 있습니다.
        </Typography.Paragraph>

        {/* 모노레포 배너 */}
        {isMonorepo && (
          <Card className="w-full border-2 border-accent bg-accent-soft p-5">
            <HStack gap="block" alignItems="start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                <FolderGit2 className="h-5 w-5 text-accent-foreground" />
              </span>
              <VStack gap="dense" alignItems="start">
                <Typography.Heading level={4}>모노레포 통합 개발</Typography.Heading>
                <Typography.Paragraph size="sm">
                  프론트엔드(React Native)와 백엔드(NestJS)가 <strong>하나의 TypeScript 저장소</strong>에서 관리됩니다.
                  AI 에이전트가 전체 코드베이스를 하나의 컨텍스트로 이해하고 작업하므로:
                </Typography.Paragraph>
                <VStack gap="dense" alignItems="start">
                  <HStack gap="inline" alignItems="center">
                    <Bot className="h-4 w-4 text-accent" />
                    <Typography.Paragraph size="sm">API 변경 시 프론트·백엔드 동시 수정 — 불일치 버그 원천 차단</Typography.Paragraph>
                  </HStack>
                  <HStack gap="inline" alignItems="center">
                    <Bot className="h-4 w-4 text-accent" />
                    <Typography.Paragraph size="sm">타입 정의 공유 — 웹·앱·서버가 같은 인터페이스 사용</Typography.Paragraph>
                  </HStack>
                  <HStack gap="inline" alignItems="center">
                    <Bot className="h-4 w-4 text-accent" />
                    <Typography.Paragraph size="sm">빌드·테스트·배포 파이프라인 하나로 통합 — 운영 단순</Typography.Paragraph>
                  </HStack>
                </VStack>
              </VStack>
            </HStack>
          </Card>
        )}

        {/* 기술 스택 요약 */}
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
            {isMonorepo && (
              <SummaryRow
                label="📁 저장소 구조"
                value="모노레포 (Monorepo)"
                note="프론트+백엔드+공통 타입 = 하나의 TypeScript 저장소"
              />
            )}
            {!isMonorepo && selection.frontend === "flutter" && (
              <SummaryRow
                label="📁 저장소 구조"
                value="분리 저장소 (Multi-repo)"
                note="Flutter(Dart)와 백엔드는 언어가 달라 별도 저장소 필수"
              />
            )}
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

        {/* 아키텍처 다이어그램 */}
        <Card className="w-full p-6">
          <VStack gap="block">
            <Typography.Heading level={4}>아키텍처 요약</Typography.Heading>
            <div className="overflow-x-auto rounded-lg bg-surface-secondary p-4">
              <pre className="text-xs leading-relaxed text-foreground/80">
{isMonorepo
  ? `┌─────────────── 모노레포 (TypeScript) ──────────────┐
│                                                     │
│  ┌─────────────────┐    ┌─────────────────────┐   │
│  │  apps/web       │    │  apps/mobile         │   │
│  │  (React/Next)   │    │  (React Native)      │   │
│  └────────┬────────┘    └──────────┬──────────┘   │
│           │                        │               │
│           └──────────┬─────────────┘               │
│                      │                             │
│  ┌───────────────────▼─────────────────────┐      │
│  │  apps/api (NestJS)                       │      │
│  └──────┬──────────────────────┬───────────┘      │
│         │                      │                   │
│  ┌──────▼──────┐    ┌─────────▼─────────────┐    │
│  │ packages/   │    │ PostgreSQL             │    │
│  │ shared-types│    │ (외부 관리형)           │    │
│  └─────────────┘    └───────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘${selection.aiService ? `

┌─────────── 별도 AI 서버 (Python) ──────────────┐
│  FastAPI + LangChain + pgvector                 │
│  백엔드와 별도 프로세스 · API로 통신             │
└──────────────────────────────────────────────────┘` : ""}`
  : `┌───────── 저장소 A: Flutter (Dart) ─────────┐
│  apps/mobile (Flutter)                       │
└──────────────────┬───────────────────────────┘
                   │ REST API
┌───────── 저장소 B: 백엔드 ──────────────────┐
│  ${be?.name ?? "Backend"}                                    │
│  인프라: ${infra?.name ?? "—"}                              │
└──────┬──────────────────────┬───────────────┘
       │                      │
┌──────▼──────┐    ┌─────────▼─────────────┐
│ PostgreSQL  │    │ Cloudflare R2         │
└─────────────┘    └───────────────────────┘${selection.aiService ? `

┌─────────── 별도 AI 서버 (Python) ──────────┐
│  FastAPI + LangChain + pgvector             │
└──────────────────────────────────────────────┘` : ""}`}
              </pre>
            </div>
          </VStack>
        </Card>

        {/* 개발 방식 요약 */}
        <Card className="w-full p-6">
          <VStack gap="block">
            <Typography.Heading level={4}>개발 방식</Typography.Heading>
            <VStack gap="dense" alignItems="start">
              {isMonorepo ? (
                <>
                  <HStack gap="inline" alignItems="center">
                    <Chip size="sm" variant="soft" color="accent">AI 통합</Chip>
                    <Typography.Paragraph size="sm">AI 에이전트가 하나의 저장소에서 프론트+백엔드 동시 작업</Typography.Paragraph>
                  </HStack>
                  <HStack gap="inline" alignItems="center">
                    <Chip size="sm" variant="soft" color="accent">타입 공유</Chip>
                    <Typography.Paragraph size="sm">TypeScript 인터페이스를 웹·앱·서버가 공유 — API 불일치 방지</Typography.Paragraph>
                  </HStack>
                  <HStack gap="inline" alignItems="center">
                    <Chip size="sm" variant="soft" color="accent">통합 CI/CD</Chip>
                    <Typography.Paragraph size="sm">빌드·테스트·배포가 하나의 파이프라인에서 관리</Typography.Paragraph>
                  </HStack>
                </>
              ) : (
                <>
                  <HStack gap="inline" alignItems="center">
                    <Chip size="sm" variant="soft">분리 개발</Chip>
                    <Typography.Paragraph size="sm">프론트(Dart)와 백엔드가 별도 저장소·별도 프로세스로 관리</Typography.Paragraph>
                  </HStack>
                  <HStack gap="inline" alignItems="center">
                    <Chip size="sm" variant="soft">API 계약 필요</Chip>
                    <Typography.Paragraph size="sm">프론트·백엔드 간 인터페이스를 문서로 정의·유지 필요</Typography.Paragraph>
                  </HStack>
                </>
              )}
            </VStack>
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
