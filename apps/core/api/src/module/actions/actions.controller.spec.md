# Actions Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/actions/actions.controller.ts`

## 역할

Action CRUD API를 노출하며, 컨트롤러 경계의 요청 해석과 응답 조립은 `ActionFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| actionFacade | ActionFacade | Action 목록/상세/생성/수정/삭제 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getActions` | group 필터를 포함한 Action 목록 조회 |
| GET | `/:id` | `getActionById` | Action 상세 조회 |
| POST | `/` | `createAction` | Action 생성 |
| PATCH | `/:id` | `updateAction` | Action 수정 |
| DELETE | `/:id` | `deleteAction` | Action 삭제 |

## 비즈니스 메모

- 시스템 Action 보호 규칙과 실제 변경 로직은 Facade 내부 `ActionService`가 담당합니다.
- controller는 DTO를 Facade로 전달하고 별도 입력 매핑을 두지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 ActionService로 전환 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `ActionFacade` 기준으로 갱신 | codex |
