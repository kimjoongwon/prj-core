# nuqs bridge 기획서

> 생성일: 2026-03-23
> 타입: util
> 위치: packages/fe-hook/src/nuqs.ts

## 역할

nuqs 관련 훅/어댑터를 단일 모듈로 래핑하여 workspace 전체가 동일한 nuqs 인스턴스를 사용하도록 강제합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `parseAsString`, `parseAsInteger`, `parseAsArrayOf`, `parseAsIsoDateTime` | URL 파서 재노출 |
| `useQueryState`, `useQueryStates`, `UseQueryStatesKeysMap` | nuqs 상태 훅 재노출 |
| `NuqsNextAdapter`, `NuqsReactAdapter` | Next App Router / React 환경용 Adapter 재노출 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `nuqs` | 파서/URL 상태 훅 재노출 |
| `nuqs/adapters/next/app` | Next App Router Adapter 재노출 |
| `nuqs/adapters/react` | React Adapter 재노출 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | nuqs 싱글톤 브리지 생성 | codex |
