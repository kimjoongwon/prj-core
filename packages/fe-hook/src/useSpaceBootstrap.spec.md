# useSpaceBootstrap hook 기획서

> 생성일: 2026-04-16
> 타입: hook
> 위치: packages/fe-hook/src/useSpaceBootstrap.ts

## 역할

공통 `PersistStore`와 IDP auth shell API를 연결해 현재 선택 Space와 접근 가능한 Space 목록을 앱 shell 기준으로 동기화합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `resolveCurrentSpaceGroundName` | current-space 응답에 ground 이름이 없을 때 my-spaces 목록으로 보강합니다. |
| `useSpaceBootstrap` | `my-spaces`, `current-space`, `PersistStore`를 연결해 선택 Space bootstrap을 수행합니다. |

## 동작 메모

- `PersistStore` hydration 완료 전에는 `my-spaces` / `current-space` query를 시작하지 않습니다.
- `current-space`가 확인되면 `persistStore.spaceId`, `groundName`, `isSpaceSelectionResolved`를 함께 갱신합니다.
- current-space 응답에 ground 이름이 빠져도 `my-spaces`의 동일 id 항목으로 보강합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | admin/idp 공용 current-space bootstrap 훅을 신규 추가 | codex |
