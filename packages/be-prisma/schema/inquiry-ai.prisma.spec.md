# inquiry-ai.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/inquiry-ai.prisma

## 역할

문의 AI 작업 로그(AIAgentLog)와 작업 유형 enum(AIAgentAction)을 정의합니다.

## 운영 규칙

- `inquiry-ai.prisma` 변경 시 `inquiry-ai.prisma.spec.md`를 함께 갱신합니다.
- AI 로그의 문의/메시지 참조 무결성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 inquiry.prisma에서 AI 도메인 분리 | codex |
| 2026-03-09 | SentimentAnalysis/SentimentType을 inquiry.prisma로 이동하고 inquiry-ai는 AIAgentLog 중심으로 정렬 | codex |
