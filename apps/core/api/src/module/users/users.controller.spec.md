# Users Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/users/users.controller.ts`

## 역할

User CRUD API를 노출하며, Space/Auth 컨텍스트 해석과 목록 meta/stats 계산은 `UsersApplicationService`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| usersApplicationService | UsersApplicationService | User 목록/상세/생성/수정/삭제 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getUsers` | 사용자 목록 조회 (`data + meta + stats`) |
| GET | `/:id` | `getUserById` | 현재 Space 기준 사용자 상세 조회 |
| POST | `/` | `createUser` | 현재 Space 기준 사용자 등록 |
| PATCH | `/:id` | `updateUser` | 현재 Space 기준 사용자 수정 |
| DELETE | `/:id` | `deleteUser` | 현재 Space 기준 사용자 삭제 |

## 비즈니스 메모

- controller는 더 이상 `ClsService`와 `getSpaceId`/`getCurrentUser` helper를 갖지 않습니다.
- 자기 자신 삭제 방지와 Space 미선택 검증은 ApplicationService가 Service 호출 전에 수행합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 UsersApplicationService로 전환하고 CLS helper를 제거 | codex |
