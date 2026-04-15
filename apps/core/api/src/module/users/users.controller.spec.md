# Users Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/users/users.controller.ts`

## 역할

User CRUD API를 노출하며, Space/Auth 컨텍스트 해석과 응답 조립은 `UserFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| userFacade | UserFacade | User 목록/상세/생성/수정/삭제 boundary 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getUsers` | 사용자 목록 조회 (`ROOT FULL_ACCESS => 전체`, 그 외 현재 Space / `data + meta + stats`) |
| GET | `/:id` | `getUserById` | 현재 Space 기준 사용자 상세 조회 |
| DELETE | `/:id` | `deleteUser` | 현재 Space 기준 사용자 삭제 |

## 비즈니스 메모

- controller는 `ClsService`와 `getSpaceId`/`getCurrentUser` helper 없이 Facade만 호출합니다.
- Space/Auth 컨텍스트 해석과 목록 `meta`/`stats` 조립은 Facade가 담당하고, 자기 자신 삭제 방지와 Space 검증은 내부 `UserService`가 담당합니다.
- 사용자 목록은 현재 `x-space-id`로 해석된 Tenant가 `ROOT(System)` Space의 `FULL_ACCESS`면 전체 조회합니다.
- 그 외에는 현재 Tenant의 `spaceId` 1개만 조회하며, 기본 목록에서는 현재 Space에 미러된 `FULL_ACCESS` tenant를 제외합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-15 | 회원 목록 설명을 `ROOT FULL_ACCESS => 전체`, 그 외 현재 Space + branch 기본 목록의 FULL_ACCESS 제외 규칙으로 갱신 | codex |
| 2026-04-15 | 사용자 목록 엔드포인트 설명을 `FULL_ACCESS => 전체`, 그 외 현재 header tenant space 기준으로 갱신 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 UserService로 전환하고 CLS helper를 제거 | codex |
| 2026-03-12 | UsersController에서 Space/Auth 컨텍스트를 주입해 Space 스코프 조회/수정/삭제 API로 정비 | codex |
| 2026-03-13 | 컨트롤러 경계 의존성을 `UserFacade` 기준으로 갱신 | codex |
| 2026-03-13 | UsersController 삭제 흐름을 UserFacade 시그니처와 일치하도록 정리 | codex |
| 2026-03-13 | admin/idp/web 및 fe-ui 런타임 미사용 `createUser`/`updateUser` endpoint를 제거 | codex |
