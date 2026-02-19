# Grants Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/grants.repository.ts

## 역할

Grant(권한 부여) 엔티티의 데이터 접근을 담당합니다. Role 또는 User에 Ability를 부여하는 다형성(Polymorphic) BRIDGE 테이블로, `granteeType`(Role | User)와 `granteeId`의 조합으로 권한 부여 대상을 식별합니다.

## 엔티티

- **대상 Entity**: Grant (`@cocrepo/entity`)
- **Prisma 모델**: `grant`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findByGranteeTypeAndIds(granteeType, granteeIds, options?)` | GranteeType, string[], { includeAbility? } | `Promise<Grant[]>` | Grantee 유형과 ID 목록으로 조회 |
| `findByAbilityId(abilityId)` | string | `Promise<Grant[]>` | Ability ID로 연결된 Grant 조회 |
| `findActiveByRoleIds(roleIds)` | string[] | `Promise<Grant[]>` | 여러 Role ID로 활성 Grant 조회 (Ability 포함) |
| `findActiveByUserId(userId)` | string | `Promise<Grant[]>` | User ID로 예외 권한 조회 (Ability 포함) |
| `create(data)` | Prisma.GrantUncheckedCreateInput | `Promise<Grant>` | 단건 생성 (Ability 포함 반환) |
| `createMany(data)` | Prisma.GrantCreateManyInput[] | `Promise<number>` | 다중 생성 (중복 스킵) |
| `updateById(id, data)` | string, Prisma.GrantUncheckedUpdateInput | `Promise<Grant>` | 수정 (활성화 여부, 우선순위 등) |
| `removeById(id)` | string | `Promise<Grant>` | 소프트 삭제 |
| `removeByAbilityId(abilityId)` | string | `Promise<number>` | Ability ID로 연결된 모든 Grant 소프트 삭제 |

## 다형성 구조

```
Grant {
  granteeType: "Role" | "User"   // 권한 부여 대상 유형
  granteeId:   string             // Role ID 또는 User ID
  abilityId:   string             // 부여할 Ability ID
  isActive:    boolean            // 활성화 여부
  priority:    number             // 우선순위 (높을수록 우선)
}
```

## 쿼리 최적화

- `findByGranteeTypeAndIds()`: `{ priority: "desc" }, { createdAt: "desc" }` 우선순위 정렬
- `findActiveByRoleIds()`: `findByGranteeTypeAndIds(Role, roleIds, { includeAbility: true })` 위임
- `findActiveByUserId()`: `findByGranteeTypeAndIds(User, [userId], { includeAbility: true })` 위임
- include 옵션: `ability → subject + action` 3단계 eager loading
- `isActive: true, removedAt: null` 조건으로 활성 Grant만 조회

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date()` 설정
- **일괄 소프트 삭제**: `removeByAbilityId()` → `updateMany`로 일괄 처리

## 구현 체크리스트

- [x] grants.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환
- [x] GranteeType enum 활용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
