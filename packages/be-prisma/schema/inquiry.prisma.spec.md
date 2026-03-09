# inquiry.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/inquiry.prisma

## 역할

문의 도메인의 상태/우선순위 코어 모델과 감정 분석(Materialization) 모델을 정의합니다.
문의 처리 흐름에서 필요한 관계/상태 전이를 추적 가능한 형태로 유지합니다.

## 운영 규칙

- `inquiry.prisma` 변경 시 `inquiry.prisma.spec.md`를 함께 갱신합니다.
- 상태 전이/참여자 규칙 변경 시 서비스 및 DTO 영향 범위를 함께 기록합니다.
- 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용: 대화/AI 모델을 inquiry-thread.prisma, inquiry-ai.prisma로 분리하고 inquiry.prisma는 코어 모델 유지 | codex |
| 2026-03-09 | SentimentAnalysis/SentimentType을 inquiry-ai.prisma에서 inquiry.prisma로 이동하여 Inquiry Aggregate 소유권으로 정렬 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
