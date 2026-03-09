# task.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/scheduling/task.prisma

## 역할

Task 기반 모델과 Exercise 상세 모델을 정의합니다.
실제 부모 row를 가지는 기반 모델(Task)과 1:1 상세 모델(Exercise)의 주석 메타데이터 규칙을 관리합니다.

## 분류 기준

- `Task`: `BASE`
- `Exercise`: `DETAIL`

## 주석 표준

- 모델 상단에 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`, `@relation-pattern`, `@ownership`, `@scope`, `@join-role`, `@description`을 유지합니다.
- 관계 의도가 있는 모델은 `@extends`, `@extended-by`, `@connects`, `@materializes`, `@materialized-by`를 사용합니다.
- 모델명은 `/// @displayName`으로 노출명을 명시합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용: timeline/routine을 별도 파일로 분리하고 task.prisma는 Task/Exercise만 유지 | codex |
| 2026-03-09 | 도메인 응집도 강화를 위해 Session 관련 enum(SessionTypes, RepeatCycleTypes, RecurringDayOfWeek)을 core.prisma에서 task.prisma로 이관 | codex |
| 2026-03-06 | 모델 주석을 `@schema-type` 표준으로 정규화하고 역할 기준 분류를 명시 | codex |
