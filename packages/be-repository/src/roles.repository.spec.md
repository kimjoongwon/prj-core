# Roles Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/roles.repository.ts

## 역할

Role(역할) 엔티티의 데이터 접근을 담당합니다. 사용자에게 부여되는 역할을 CRUD하며, 시스템 역할명(SystemRoleName: FULL_ACCESS, MANAGE, VIEW) 기반 조회를 지원합니다. 역할에 연결된 테넌트 수 조회로 삭제 가능 여부를 확인할 수 있습니다.

## 엔티티

- **대상 Entity**: Role (`@cocrepo/entity`)
- **Prisma 모델**: `role`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Role \| null>` | ID로 단건 조회 |
| `findByName(name)` | SystemRoleName \| string | `Promise<Role \| null>` | 역할 이름으로 조회 |
| `findAll()` | - | `Promise<Role[]>` | 전체 역할 목록 조회 |
| `create(data)` | Prisma.RoleUncheckedCreateInput | `Promise<Role>` | 역할 생성 |
| `updateById(id, data)` | string, Prisma.RoleUncheckedUpdateInput | `Promise<Role>` | ID로 수정 |
| `deleteById(id)` | string | `Promise<Role>` | 물리 삭제 |
| `countTenantsByRoleId(roleId)` | string | `Promise<number>` | 역할에 연결된 테넌트 수 조회 |

## 쿼리 최적화

- `findAll()`: `{ createdAt: "asc" }` 오름차순 정렬 (생성 순서 유지)
- `findByName()`: `findFirst` 사용 (name이 unique가 아닐 수 있음)
- `countTenantsByRoleId()`: 삭제 전 참조 무결성 확인에 사용

## 시스템 역할

| 역할명 | 설명 |
|--------|------|
| FULL_ACCESS | 최고 권한 (이전: SUPER_ADMIN) |
| MANAGE | 관리 권한 (이전: ADMIN) |
| VIEW | 조회 권한 (이전: USER) |

## 삭제 정책

- **물리 삭제**: `deleteById()` → `role.delete()`
- 소프트 삭제 없음
- 삭제 전 `countTenantsByRoleId()`로 연결된 테넌트 수 확인 권장

## 구현 체크리스트

- [x] roles.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환
- [x] SystemRoleName 타입 활용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
