# Actions Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/action/actions.controller.ts`

## 역할

CASL Action(행위)의 CRUD API를 제공하는 컨트롤러. ActionsService를 통해 비즈니스 로직을 실행한다. 시스템 Action(isSystem=true)은 수정/삭제가 불가하며, 목록/상세 조회는 공개 API(@Public)로 인증 없이 접근 가능하다.

## 베이스 경로

`/api/v1/actions`

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| actionsService | ActionsService | Action 비즈니스 로직 |

## 엔드포인트

| Method | 경로 | Operation ID | DTO | 반환값 | 설명 |
|--------|------|-------------|-----|--------|------|
| GET | `/` | getActions | Query: `group?` | `ActionDto[]` (LIST exclude) | Action 목록 조회 (group 필터링) |
| GET | `/:id` | getActionById | - | `ActionDto` | Action 상세 조회 (config 포함) |
| POST | `/` | createAction | `CreateActionDto` | `ActionDto` (201) | Action 생성 |
| PATCH | `/:id` | updateAction | `UpdateActionDto` | `ActionDto` | Action 수정 (시스템 Action 불가) |
| DELETE | `/:id` | deleteAction | - | `ActionDto` | Action 삭제 (시스템 Action 불가, 소프트 삭제) |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 | 비고 |
|------------|:--------:|------|------|
| GET `/` | X | @Public | 공개 API |
| GET `/:id` | X | @Public | 공개 API |
| POST `/` | O | @RoleCategories([WORKSPACE]) + RoleCategoryGuard | 관리자 전용 |
| PATCH `/:id` | O | @RoleCategories([WORKSPACE]) + RoleCategoryGuard | 관리자 전용 + 시스템 Action 체크 |
| DELETE `/:id` | O | @RoleCategories([WORKSPACE]) + RoleCategoryGuard | 관리자 전용 + 시스템 Action 체크 |

## 에러 정의

| 엔드포인트 | 상태 코드 | 에러 메시지 |
|------------|----------|------------|
| GET `/:id` | 404 | (Not Found) |
| POST `/` | 400 | (유효성 오류) |
| PATCH `/:id` | 400 | ACTION_ERRORS.SYSTEM_ACTION_MODIFY_NOT_ALLOWED |
| PATCH `/:id` | 404 | ACTION_ERRORS.NOT_FOUND |
| DELETE `/:id` | 400 | ACTION_ERRORS.SYSTEM_ACTION_DELETE_NOT_ALLOWED |
| DELETE `/:id` | 404 | ACTION_ERRORS.NOT_FOUND |

## 시스템 Action 보호 로직

수정/삭제 시 먼저 기존 Action을 조회하고 `isSystem` 플래그를 확인한다:

```typescript
const existingAction = await this.actionsService.getActionById(id);
if (existingAction.isSystem) {
  throw new BadRequestException(ACTION_ERRORS.SYSTEM_ACTION_MODIFY_NOT_ALLOWED);
}
```

## 목록 조회 응답 필드 제외

`ActionExcludePresets.LIST`를 사용하여 목록 조회 시 불필요한 필드(config, description, order, isSystem 등)를 응답에서 제외한다.

## CreateActionDto 매핑

```typescript
{
  name: dto.name,
  displayName: dto.displayName,
  description: dto.description,
  group: dto.group,
  order: dto.order,
  isSystem: dto.isSystem,
  config: dto.config,
}
```

## UpdateActionDto 매핑

undefined가 아닌 필드만 선택적으로 포함하는 스프레드 패턴 사용:

```typescript
{
  ...(dto.name !== undefined && { name: dto.name }),
  ...(dto.displayName !== undefined && { displayName: dto.displayName }),
  // ... 나머지 동일 패턴
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
