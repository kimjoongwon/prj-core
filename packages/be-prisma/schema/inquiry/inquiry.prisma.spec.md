# inquiry.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/inquiry/inquiry.prisma

## 역할

문의 도메인의 상태/우선순위 코어 모델과 감정 분석(Materialization) 모델을 정의합니다.
문의 처리 흐름에서 필요한 관계/상태 전이를 추적 가능한 형태로 유지합니다.

## 운영 규칙

- `inquiry.prisma` 변경 시 `inquiry.prisma.spec.md`를 함께 갱신합니다.
- 상태 전이/참여자 규칙 변경 시 서비스 및 DTO 영향 범위를 함께 기록합니다.
- 주석 메타데이터(`@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`, `/// @displayName`)를 유지합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용: 대화/AI 모델을 inquiry-thread.prisma, inquiry-ai.prisma로 분리하고 inquiry.prisma는 코어 모델 유지 | codex |
| 2026-03-09 | SentimentAnalysis/SentimentType을 inquiry-ai.prisma에서 inquiry.prisma로 이동하여 Inquiry Aggregate 소유권으로 정렬 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
