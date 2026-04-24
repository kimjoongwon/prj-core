# useSpaceBootstrap hook 기획서

> 생성일: 2026-04-24
> 타입: hook
> 위치: apps/admin/web/src/hooks/useSpaceBootstrap.ts

## 역할

admin 앱에서 Space bootstrap에 필요한 Orval query와 PersistStore를 조립하고, 공용 Space bootstrap hook에 결과를 주입합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| `useSpaceBootstrap` | `my-spaces`, `current-space`, admin PersistStore를 연결하는 앱 전용 hook |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@cocrepo/api/idp/auth` | Orval 생성 Space query hook |
| `@cocrepo/hook` | 주입된 Space query 결과와 Store-like sink를 동기화하는 `useSpaceBootstrap` |
| `../stores/AppStoreProvider` | admin PersistStore selector |

## 동작 메모

- PersistStore hydration 완료 전에는 Space query를 비활성화합니다.
- shared hook은 API/Store를 직접 import하지 않고 이 hook이 결과와 PersistStore를 주입합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | admin Space bootstrap hook을 앱 소유로 신규 추가 | codex |
