# 02. 구조 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.
> 최종 수정일: 2026-02-07 (Role 이름 변경, Ability/Grant 분리, Guard 체계 업데이트)

## 기능 (Feature) - L3

| ID | 기능명 | 설명 | 관련 API 그룹 |
|----|--------|------|--------------|
| L3-FEA-001 | 역할 관리 | 시스템 역할 CRUD | `/api/v1/roles` |
| L3-FEA-002 | Ability 관리 | 재사용 가능한 권한 정의 CRUD | `/api/v1/abilities` |
| L3-FEA-003 | Grant 관리 | Role/User에 Ability를 부여 | `/api/v1/abilities/roles/:roleId`, `/api/v1/abilities/users/:userId` |
| L3-FEA-004 | 본인 권한 조회 | 로그인 사용자에게 부여된 Grant 확인 | `/api/v1/abilities/my` |

---

## 화면 (Screen) - L4

### 예상 화면 구조 (프론트엔드 미구현 - 역추론)

| ID | 화면명 | 경로 | 설명 | 필요 권한 |
|----|--------|------|------|----------|
| L4-SCR-001 | 역할 목록 | `/roles` | 전체 역할 목록 표시 | MANAGE |
| L4-SCR-002 | 역할 상세 | `/roles/:roleId` | 역할 상세 정보 및 부여된 Ability 목록 | MANAGE |
| L4-SCR-003 | 역할 등록 | `/roles/new` | 새 역할 생성 폼 | FULL_ACCESS |
| L4-SCR-004 | 역할 수정 | `/roles/:roleId/edit` | 역할 정보 수정 폼 | FULL_ACCESS |
| L4-SCR-005 | Role 권한 설정 | `/roles/:roleId/abilities` | Role에 Ability 부여 (Grant 관리) | FULL_ACCESS |
| L4-SCR-006 | User 예외 권한 설정 | `/users/:userId/abilities` | User에 예외 Ability 부여 (Grant 관리) | FULL_ACCESS |

### 화면 흐름도

```
┌─────────────────────────────────────────────────────────────────┐
│                         역할 관리 흐름                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                                │
│  │   역할 목록   │◄──────────────────────────────────┐           │
│  │  /roles      │                                    │           │
│  └──────┬───────┘                                    │           │
│         │                                            │           │
│         ├─────────────────┬──────────────────┐       │           │
│         ▼                 ▼                  ▼       │           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│           │
│  │   역할 상세   │  │   역할 등록   │  │   역할 수정   ││           │
│  │/roles/:roleId│  │  /roles/new  │  │/roles/:roleId││           │
│  │              │  │              │  │     /edit    ││           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│           │
│         │                 │                  │       │           │
│         │                 └──────────────────┴───────┘           │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │  권한 부여    │  Role에 Ability를 Grant로 연결                  │
│  │/roles/:roleId│  (Grant CRUD)                                  │
│  │  /abilities  │                                                │
│  └──────────────┘                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 데이터 흐름

### 역할 조회 흐름

```
[프론트엔드]                [백엔드]                    [데이터베이스]
     │                         │                            │
     │  GET /api/v1/roles      │                            │
     │  X-Space-ID: space-001  │                            │
     │────────────────────────>│                            │
     │                         │  SpaceAccessGuard 검사     │
     │                         │  RolesGuard 검사            │
     │                         │  (MANAGE/FULL_ACCESS)       │
     │                         │                            │
     │                         │  SELECT * FROM roles       │
     │                         │───────────────────────────>│
     │                         │<───────────────────────────│
     │                         │                            │
     │  RoleDto[]              │                            │
     │<────────────────────────│                            │
```

### Grant 생성 흐름 (Role에 Ability 부여)

```
[프론트엔드]                          [백엔드]                    [데이터베이스]
     │                                    │                            │
     │ PUT /api/v1/abilities/roles/:roleId│                            │
     │ { abilities: [                     │                            │
     │   { abilityId, priority }          │                            │
     │ ]}                                 │                            │
     │───────────────────────────────────>│                            │
     │                                    │                            │
     │                                    │  기존 RolePolicy 삭제      │
     │                                    │  새 RolePolicy 동기화      │
     │                                    │  (policyId + roleId)       │
     │                                    │───────────────────────────>│
     │                                    │<───────────────────────────│
     │                                    │                            │
     │  PolicyAssignmentResponseDto[]     │                            │
     │<───────────────────────────────────│                            │
```

---

## 모듈 구조

```
apps/server/src/module/
├── role/
│   ├── roles.module.ts
│   └── roles.controller.ts
│
└── ability/
    ├── abilities.module.ts
    └── abilities.controller.ts       # Ability CRUD

packages/
├── service/
│   ├── src/roles.service.ts
│   ├── src/abilities.service.ts      # Ability 비즈니스 로직
│   └── src/policy.service.ts         # Policy 비즈니스 로직
│
├── app/
│   └── src/abilities.application-service.ts  # Ability + Policy 유즈케이스 조합
│
├── repository/
│   ├── src/roles.repository.ts
│   ├── src/abilities.repository.ts   # Ability CRUD
│   └── src/policies.repository.ts    # Policy 조회 (Space 기반)
│
├── entity/
│   ├── src/role.entity.ts
│   ├── src/ability.entity.ts         # 권한 정의 엔티티
│   └── src/policy.entity.ts          # 정책 엔티티
│
├── dto/
│   ├── src/role.dto.ts
│   ├── src/ability.dto.ts            # AbilityDto, AbilitySummaryDto
│   ├── src/abilities/
│   │   ├── create-ability.dto.ts
│   │   └── ability-response.dto.ts
│   ├── src/policies/
│   │   ├── create-policy.dto.ts
│   │   ├── update-policy.dto.ts
│   │   └── policy-response.dto.ts
│   ├── src/create/create-role.dto.ts
│   └── src/update/update-role.dto.ts
│
├── be-common/
│   ├── src/casl/casl-ability.factory.ts  # Policy assignment → Ability 추출
│   └── src/guard/
│       ├── roles.guard.ts
│       ├── role-category.guard.ts
│       ├── role-group.guard.ts
│       └── space-access.guard.ts
│
└── decorator/
    ├── src/roles.decorator.ts
    ├── src/role-categories.decorator.ts
    ├── src/role-groups.decorator.ts
    └── src/skip-space-check.decorator.ts
```
