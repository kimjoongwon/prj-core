# task.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/task.prisma

## 역할

일정/루틴/태스크 도메인의 핵심 스키마를 정의합니다.
`Timeline`, `Session`, `Program`, `Routine`, `Activity`, `Task`, `Exercise` 모델을 통해 시간 단위 실행 구조와 도메인 구체화(1:1)를 관리합니다.

## 분류 기준

- `Timeline`, `Session`, `Routine`: `CONCRETE ENTITY`
- `Program`, `Activity`: `BRIDGE`
- `Task`: `ABSTRACT ENTITY`
- `Exercise`: `MATERIALIZATION`

## 주석 표준

- 모델 상단에 `@schema-type`, `@description`을 유지합니다.
- 관계 의도가 있는 모델은 `@extends`, `@extended-by`, `@connects`, `@materializes`, `@materialized-by`를 사용합니다.
- 모델명은 `/// @displayName`으로 노출명을 명시합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 모델 주석을 `@schema-type` 표준으로 정규화하고 역할 기준 분류를 명시 | codex |
