# Actions Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/actions/actions.controller.ts`

## 역할

Action CRUD API를 노출하며, 실제 유즈케이스 실행과 시스템 Action 보호 규칙은 `ActionsService`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| actionsService | ActionsService | Action 목록/상세/생성/수정/삭제 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getActions` | group 필터를 포함한 Action 목록 조회 |
| GET | `/:id` | `getActionById` | Action 상세 조회 |
| POST | `/` | `createAction` | Action 생성 |
| PATCH | `/:id` | `updateAction` | Action 수정 |
| DELETE | `/:id` | `deleteAction` | Action 삭제 |

## 비즈니스 메모

- 시스템 Action 수정/삭제 금지 검증은 Service가 담당합니다.
- `CreateActionDto`/`UpdateActionDto`의 Service 입력 매핑은 컨트롤러에서 제거했습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 ActionsService로 전환 | codex |
