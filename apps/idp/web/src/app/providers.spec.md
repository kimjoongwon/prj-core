# providers.tsx

## 목적

IDP 웹 앱의 전역 Provider 계층을 구성하고, 인증 플로우 화면과 콘솔 화면의 Ability bootstrap 범위를 분리한다.

## 주요 계약

- 인증 플로우 경로는 `/auth`, `/interaction`, `/forgot-password`, `/reset-password`, `/error` 및 하위 경로만 포함한다.
- `/auth-audit-logs`처럼 이름이 비슷한 콘솔 경로는 인증 플로우로 취급하지 않고 Ability bootstrap 대상에 포함한다.
- 콘솔 경로에서는 현재 Space 선택이 완료된 뒤 `verify-token` 결과를 기준으로 메뉴/화면 접근 권한을 Store에 반영한다.

## 변경 이력

| 날짜 | 변경 |
| --- | --- |
| 2026-04-29 | 인증 플로우 prefix 판정을 경로 세그먼트 기준으로 보정해 `/auth-audit-logs` 콘솔 페이지가 Ability bootstrap에서 제외되지 않게 했다. |
