# Groups Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/groups/groups.controller.ts`

## 역할

Group CRUD API를 노출하며, 현재 Space 기준 생성 흐름과 경계 응답 조립은 `GroupFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| groupFacade | GroupFacade | Group 목록/상세/생성/수정/삭제 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getGroups` | QueryGroupDto 기반 목록 조회 |
| GET | `/:id` | `getGroupById` | Group 상세 조회 |
| POST | `/` | `createGroup` | 현재 Space 기준 Group 생성 |
| PATCH | `/:id` | `updateGroup` | Group 수정 |
| DELETE | `/:id` | `deleteGroup` | Group 삭제 |

## 비즈니스 메모

- controller는 `SpaceContext`를 직접 주입하지 않고 Facade 경계만 호출합니다.
- 연결된 Role 연관 관계 처리 규칙은 Facade 내부 `GroupService`가 담당합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 GroupService로 전환 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `GroupFacade` 기준으로 갱신 | codex |
| 2026-03-13 | GroupController가 SpaceContext 확인 후 GroupFacade 단일 시그니처로 위임하도록 정리 | codex |
