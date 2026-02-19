# Users Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/users.repository.ts

## 역할

User(사용자) 엔티티의 데이터 접근을 담당합니다. 인증(이메일/비밀번호 조회), 권한(Tenant/Role 포함 조회), 보안(비밀번호 히스토리, 계정 잠금), 다중 Space 기반 조회 등 사용자 관리 전반에 필요한 데이터 작업을 수행합니다.

## 엔티티

- **대상 Entity**: User (`@cocrepo/entity`)
- **Prisma 모델**: `user`

## 메서드

### 조회 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<User \| null>` | ID로 기본 정보만 조회 |
| `findByIdWithTenantsAndProfiles(id)` | string | `Promise<User \| null>` | ID로 전체 관계 포함 조회 |
| `findByEmail(email)` | string | `Promise<User \| null>` | 이메일로 기본 정보 조회 |
| `findByEmailWithTenantsAndProfiles(email)` | string | `Promise<User \| null>` | 이메일로 전체 관계 포함 조회 |
| `findByEmailSelectCredentials(email)` | string | `Promise<{ id, email, password } \| null>` | 인증용 이메일 조회 (최소 필드만) |
| `findManyBySpaceIds(params)` | where, orderBy, skip, take, spaceIds | `Promise<{ users: User[], totalCount: number }>` | Space ID 목록 내 사용자 목록 + 페이지네이션 |
| `findByIdAndSpaceIdWithRelations(userId, spaceId)` | string, string | `Promise<User \| null>` | ID + Space ID로 관계 포함 조회 |
| `findSecurityInfoById(id)` | string | `Promise<보안정보 \| null>` | 보안 정보만 select 조회 |
| `findPasswordById(id)` | string | `Promise<{ password } \| null>` | 비밀번호 해시만 조회 |

### 중복 확인 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `existsByEmail(email)` | string | `Promise<boolean>` | 이메일 중복 확인 |
| `existsByPhone(phone)` | string | `Promise<boolean>` | 전화번호 중복 확인 |
| `existsByName(name)` | string | `Promise<boolean>` | 이름 중복 확인 |

### 통계 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `countStatsBySpaceIds(spaceIds)` | string[] | `Promise<UserStats>` | Space 내 회원 통계 (전체, 활성, 비활성, 이번달 신규) |

### 생성/수정/삭제 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `create(data)` | Prisma.UserUncheckedCreateInput | `Promise<User>` | 기본 생성 |
| `createWithRelations(data)` | Prisma.UserCreateInput | `Promise<User>` | 관계 포함 생성 |
| `updateById(id, data)` | string, Prisma.UserUncheckedUpdateInput | `Promise<User>` | 기본 수정 |
| `updateByIdWithRelations(userId, data, options?)` | string, data, { categoryId?, groupIds? } | `Promise<User>` | 분류/그룹 관계 포함 수정 |
| `updatePassword(id, hashedPassword)` | string, string | `Promise<void>` | 비밀번호 + 보안 필드 업데이트 |
| `unlockAccount(id)` | string | `Promise<void>` | 계정 잠금 해제 |
| `removeById(id)` | string | `Promise<User>` | 소프트 삭제 |
| `deleteById(id)` | string | `Promise<User>` | 물리 삭제 |

### 비밀번호 히스토리 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getPasswordHistory(userId, limit)` | string, number | `Promise<{ id, passwordHash }[]>` | 최신순 비밀번호 히스토리 조회 |
| `addPasswordHistory(userId, passwordHash)` | string, string | `Promise<void>` | 비밀번호 히스토리 추가 |
| `prunePasswordHistory(userId, maxCount)` | string, number | `Promise<void>` | 오래된 히스토리 정리 (maxCount개 유지) |

## 관계 include 구조 (WithTenantsAndProfiles)

```
User {
  tenants: Tenant[] {
    role: Role {
      classification: RoleClassification {
        category: Category {
          parent: Category { parent: Category { parent: Category } }  // 3단계
        }
      }
      associations: RoleAssociation[] { group: Group }
    }
    space: Space {
      ground: Ground
      classification: SpaceClassification {
        category: Category { parent: Category, children: Category[] }
      }
    }
  }
  profiles: Profile[]
  classification: UserClassification { category: Category }
  associations: UserAssociation[] { group: Group }
}
```

## 쿼리 최적화

- `findByEmailSelectCredentials()`: 인증 시 최소 필드(id, email, password)만 조회하여 보안 강화
- `findManyBySpaceIds()`: `Promise.all()`로 데이터와 totalCount 동시 조회
- `existsBy*()`: `select: { id: true }`만 조회하여 성능 최적화
- `countStatsBySpaceIds()`: `Promise.all()`로 통계 동시 계산

## 비밀번호 업데이트 정책 (updatePassword)

비밀번호 변경 시 관련 보안 필드를 함께 초기화합니다.

```
- password: 새 해시값
- passwordChangedAt: new Date()
- mustChangePassword: false
- failedLoginAttempts: 0
- lockedUntil: null
- isPermanentlyLocked: false
```

## 관계 수정 전략 (updateByIdWithRelations)

- **분류 카테고리**: 기존 UserClassification 삭제 → 새 카테고리로 재생성 (교체)
- **그룹**: 기존 UserAssociation 모두 삭제 → 새 groupIds로 재생성 (교체)

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date()` 설정
- **물리 삭제**: `deleteById()` → `user.delete()`
- 두 방식 모두 지원

## 구현 체크리스트

- [x] users.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환
- [x] UserStats 타입 활용 (`@cocrepo/type`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
