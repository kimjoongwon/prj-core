# Tasks Service 기획서

> 생성일: 2026-03-11
> 타입: service
> 위치: packages/be-service/src/task.service/index.ts

## 역할

Task aggregate root 기준 비즈니스 로직을 처리합니다. Exercise detail은 Task root 내부에서만 생성/수정/삭제합니다.

## Space Scope 규칙

- 조회 계열은 `SpaceContext.spaceIds`를 기준으로 repository에 접근 가능 Space 목록을 전달합니다.
- `tenant.role`이 `FULL_ACCESS`라서 `spaceIds`가 `undefined`이면 Space 필터를 전달하지 않아 전체 Task를 조회합니다.
- 일반 권한에서는 `INCLUDE_ANCESTORS`가 요청자의 접근 가능 Space 목록을, `CURRENT`가 현재 `x-space-id`만 조회 범위로 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-26 | Task 조회가 FULL_ACCESS에서는 전체, 일반 권한에서는 접근 가능 Space 목록으로 제한되는 규칙을 반영 | codex |
| 2026-03-11 | Task root service 신규 생성 | codex |
| 2026-03-13 | `task.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
