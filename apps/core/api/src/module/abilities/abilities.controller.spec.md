# Abilities Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/abilities/abilities.controller.ts`

## 역할

CASL 기반 권한 정의(Ability)의 CRUD 및 조회 API를 제공하는 컨트롤러. AbilityService를 통해 비즈니스 로직을 실행하며, 현재 사용자 조회는 `AuthContext`를 통해 수행한다.

## 베이스 경로

`/api/v1/abilities`

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| abilitiesService | AbilityService | Ability 유즈케이스 조합 로직 |
| authContext | AuthContext | 현재 인증 사용자 컨텍스트 |

## 엔드포인트

| Method | 경로 | Operation ID | DTO | 반환값 | 설명 |
|--------|------|-------------|-----|--------|------|
| GET | `/` | getAbilities | - | `AbilityResponseDto[]` | 전체 권한 정의 목록 조회 |
| GET | `/my` | getMyAbilities | - | `AbilityResponseDto[]` | 내 권한 조회 (Role + 예외 권한 병합) |
| GET | `/roles/:roleId` | getAbilitiesByRoleId | - | `AbilityResponseDto[]` | Role별 기본 권한 조회 |
| GET | `/users/:userId` | getAbilitiesByUserId | - | `AbilityResponseDto[]` | User별 예외 권한 조회 |
| GET | `/:id` | getAbilityById | - | `AbilityResponseDto` | 권한 상세 조회 |
| POST | `/` | createAbility | `CreateAbilityDto` | `AbilityResponseDto` (201) | 권한 정의 생성 |
| PATCH | `/:id` | updateAbility | `UpdateAbilityDto` | `AbilityResponseDto` | 권한 정의 수정 |
| DELETE | `/:id` | deleteAbility | - | `AbilityResponseDto` | 권한 삭제 (소프트 삭제) |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 | 비고 |
|------------|:--------:|------|------|
| GET `/` | O | @ApiAuth | 인증된 사용자 |
| GET `/my` | O | @ApiAuth | `AuthContext.user`로 현재 사용자 조회 |
| GET `/roles/:roleId` | O | @ApiAuth | 인증된 사용자 |
| GET `/users/:userId` | O | @ApiAuth | 인증된 사용자 |
| GET `/:id` | O | @ApiAuth | 인증된 사용자 |
| POST `/` | O | @ApiAuth | Guard 미적용 (TODO) |
| PATCH `/:id` | O | @ApiAuth | Guard 미적용 (TODO) |
| DELETE `/:id` | O | @ApiAuth | Guard 미적용 (TODO) |

## 에러 정의

| 엔드포인트 | 상태 코드 | 에러 메시지 |
|------------|----------|------------|
| GET `/my` | 401 | ABILITY_ERRORS.USER_NOT_FOUND |
| GET `/my` | 400 | ABILITY_ERRORS.ROLE_NOT_FOUND |
| GET `/:id` | 404 | ABILITY_ERRORS.NOT_FOUND |
| POST `/` | 400 | ABILITY_ERRORS.CREATE_FAILED |
| PATCH `/:id` | 404 | ABILITY_ERRORS.NOT_FOUND |
| PATCH `/:id` | 400 | ABILITY_ERRORS.UPDATE_FAILED |
| DELETE `/:id` | 404 | ABILITY_ERRORS.NOT_FOUND |
| DELETE `/:id` | 400 | ABILITY_ERRORS.DELETE_FAILED |

## 라우팅 우선순위

`/my` 경로가 `/:id`보다 먼저 정의되어야 라우팅이 올바르게 동작한다.

## CreateAbilityDto 매핑

```typescript
{
  actionId: dto.actionId,
  subjectId: dto.subjectId,
  fields: dto.fields ?? [],
  conditions: dto.conditions ?? null,
  inverted: dto.inverted ?? false,
  reason: dto.reason ?? null,
  name: dto.name ?? "Unnamed Ability",
  description: dto.description ?? null,
}
```

## UpdateAbilityDto 매핑

undefined가 아닌 필드만 선택적으로 포함하는 스프레드 패턴 사용:

```typescript
{
  ...(dto.actionId !== undefined && { actionId: dto.actionId }),
  ...(dto.subjectId !== undefined && { subjectId: dto.subjectId }),
  // ... 나머지 동일 패턴
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 AbilityService로 전환 | codex |
| 2026-03-11 | 내 권한 조회 시 인증 사용자 소스를 AuthContext로 정리 | codex |
