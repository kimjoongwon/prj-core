# Grants Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/grant.service/index.ts

## 역할

Role 또는 User에게 Ability를 부여(Grant)하는 비즈니스 로직을 담당합니다.
Grantee(Role/User) 존재 확인, Ability 검증, 기본 우선순위 설정을 처리합니다.
배치 할당(batchAssignToRole)을 통해 Role의 Ability 목록을 전체 동기화할 수 있습니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `GrantsRepository` | Grant CRUD |
| `RolesRepository` | Role 존재 확인 |
| `UsersRepository` | User 존재 확인 |
| `AbilitiesRepository` | Ability 존재 확인 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `create` | `dto: CreateGrantDto` | `Promise<Grant>` | Grant 생성 (트랜잭션) |
| `createMany` | `dtos: CreateGrantDto[]` | `Promise<Grant[]>` | Grant 다중 생성 (트랜잭션) |
| `update` | `id: string, dto: UpdateGrantDto` | `Promise<Grant>` | Grant 수정 |
| `delete` | `id: string` | `Promise<void>` | Grant 삭제 (소프트 삭제) |
| `findByRoleIds` | `roleIds: string[]` | `Promise<Grant[]>` | Role ID 목록으로 Grant 조회 |
| `findByUserId` | `userId: string` | `Promise<Grant[]>` | User ID로 Grant 조회 |
| `findByAbilityId` | `abilityId: string` | `Promise<Grant[]>` | Ability ID로 Grant 조회 |
| `batchAssignToRole` | `roleId: string, items: {...}[]` | `Promise<Grant[]>` | Role에 Ability 배치 할당 (전체 동기화) |

## 비즈니스 규칙

- **기본 우선순위**: Role에 할당 시 0, User에 할당 시 10
- **배치 동기화**: 기존 Grant와 새 목록을 비교하여 추가/삭제/업데이트 수행
- Grantee 타입별 검증: `GranteeTypeEnum.Role` → RolesRepository, `GranteeTypeEnum.User` → UsersRepository

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| Role이 존재하지 않음 | `NotFoundException` | `GRANT_ERRORS.ROLE_NOT_FOUND` |
| User가 존재하지 않음 | `NotFoundException` | `GRANT_ERRORS.USER_NOT_FOUND` |
| Ability가 존재하지 않음 | `NotFoundException` | `GRANT_ERRORS.ABILITY_NOT_FOUND` |
| Grant 중복 생성 | `BadRequestException` | `GRANT_ERRORS.DUPLICATE_GRANT` |
| Grant가 존재하지 않음 | `NotFoundException` | `GRANT_ERRORS.NOT_FOUND` |

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] grant.service.ts
- [x] `@Injectable()` 데코레이터
- [x] `@Transactional()` (create, createMany, batchAssignToRole)
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `grant.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
