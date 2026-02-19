# Groups Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/groups.repository.ts

## 역할

Group(사용자/역할 그룹) 엔티티의 데이터 접근을 담당합니다. 사용자와 역할을 그룹으로 묶어 관리하는 RoleGroup 시스템의 데이터 레이어입니다. 그룹에 연결된 역할 수 조회로 삭제 가능 여부를 확인할 수 있습니다.

## 엔티티

- **대상 Entity**: Group (`@cocrepo/entity`)
- **Prisma 모델**: `group`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id, include?)` | string, Prisma.GroupInclude | `Promise<Group \| null>` | ID로 조회 (옵셔널 include) |
| `findMany(params)` | where?, orderBy?, include? | `Promise<Group[]>` | 조건별 목록 조회 |
| `create(data)` | Prisma.GroupUncheckedCreateInput | `Promise<Group>` | 그룹 생성 |
| `updateById(id, data)` | string, Prisma.GroupUncheckedUpdateInput | `Promise<Group>` | ID로 수정 |
| `deleteById(id)` | string | `Promise<Group>` | 물리 삭제 |
| `countRoleAssociationsByGroupId(groupId)` | string | `Promise<number>` | 그룹에 연결된 RoleAssociation 수 조회 |

## 쿼리 최적화

- `findMany()` 기본 정렬: `{ createdAt: "asc" }`
- `include` 파라미터로 동적 연관 로딩 지원
- `countRoleAssociationsByGroupId()`: 삭제 전 참조 무결성 확인에 사용

## 삭제 정책

- **물리 삭제**: `deleteById()` → `group.delete()`
- 소프트 삭제 없음
- 삭제 전 `countRoleAssociationsByGroupId()`로 연결된 역할 수 확인 권장

## 구현 체크리스트

- [x] groups.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
