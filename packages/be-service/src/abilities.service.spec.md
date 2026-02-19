# Abilities Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/abilities.service.ts

## 역할

CASL ABAC(Attribute-Based Access Control) 기반의 권한 정의(Ability)와 할당(Grant)을 관리합니다.
Ability는 재사용 가능한 권한 정의이며, Grant를 통해 Role 또는 User에게 할당됩니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `AbilitiesRepository` | Ability CRUD |
| `GrantsRepository` | Grant 조회 (Role/User 권한 조회) |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getAbilityById` | `id: string` | `Promise<Ability \| null>` | ID로 Ability 조회 |
| `getAllAbilities` | - | `Promise<Ability[]>` | 전체 Ability 목록 조회 |
| `getRoleAbilities` | `roleId: string` | `Promise<Ability[]>` | Role별 권한 조회 (Grant → Ability) |
| `getUserAbilities` | `userId: string` | `Promise<Ability[]>` | User별 예외 권한 조회 |
| `getMergedAbilities` | `roleIds: string[], userId?: string` | `Promise<Ability[]>` | Role + User 권한 병합 조회 |
| `createAbility` | `data: Prisma.AbilityUncheckedCreateInput` | `Promise<Ability>` | 권한 정의 생성 |
| `updateAbility` | `id: string, data: Prisma.AbilityUncheckedUpdateInput` | `Promise<Ability>` | 권한 정의 수정 |
| `deleteAbility` | `id: string` | `Promise<Ability>` | 권한 삭제 (소프트 삭제 + 연결된 Grant 삭제) |

## 비즈니스 규칙

- Ability는 권한 정의만 담당하며, Role/User에 할당하려면 별도로 Grant를 생성해야 함
- `getMergedAbilities`: User 권한이 Role 권한보다 우선순위가 높으며, priority → createdAt 기준으로 내림차순 정렬
- `deleteAbility`: 트랜잭션(`@Transactional`) 처리 - Ability 소프트 삭제 시 연결된 모든 Grant도 소프트 삭제
- Ability 생성 시 `actionId`, `subjectId`, `name`은 필수 필드

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| actionId/subjectId/name 누락 | `BadRequestException` | `ABILITY_ERRORS.INVALID_DATA` |

## 권한 요구사항

- 권한 정의(Ability) 자체는 특정 Role 제한 없이 접근 가능
- 실제 접근 제어는 Controller 레이어의 Guard에서 처리

## 구현 체크리스트

- [x] abilities.service.ts
- [x] `@Injectable()` 데코레이터
- [x] `@Transactional()` (deleteAbility)
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
