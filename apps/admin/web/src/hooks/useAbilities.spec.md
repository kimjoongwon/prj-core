# useAbilities hook 기획서

> 생성일: 2026-04-24
> 타입: hook
> 위치: apps/admin/web/src/hooks/useAbilities.ts

## 역할

admin 앱에서 현재 로그인 사용자의 권한 query를 실행하고, 공용 ability 상태 정규화 hook에 결과를 주입합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| `useAbilities` | admin pathname skip 정책과 Orval `useGetMyAbilities` query를 소유하는 앱 전용 hook |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@cocrepo/api/core/abilities` | Orval 생성 `useGetMyAbilities` query hook |
| `@cocrepo/hook` | 주입된 권한 query 결과를 정규화하는 `useAbilities` |
| `next/navigation` | `/auth` 등 인증 화면에서 권한 API 호출을 비활성화하기 위한 pathname 조회 |

## 동작 메모

- 기본 `skipPathPrefix`는 `/auth`입니다.
- 권한 query 캐시 정책은 기존 bootstrap 동작과 동일하게 `staleTime` 5분, `gcTime` 10분을 사용합니다.
- shared hook은 API/React Query/Next를 직접 import하지 않고 이 hook이 결과를 주입합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | admin 권한 bootstrap hook을 앱 소유로 신규 추가 | codex |
