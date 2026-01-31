# 02. 구조 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.

## 기능 (Feature) - L3

| ID | 기능명 | 설명 | 관련 API 그룹 |
|----|--------|------|--------------|
| L3-FEA-001 | 역할 관리 | 시스템 역할 CRUD | `/api/v1/roles` |
| L3-FEA-002 | 권한 관리 | Ability CRUD 및 조회 | `/api/v1/abilities` |
| L3-FEA-003 | Role 권한 설정 | Role별 기본 권한 일괄 설정 | `/api/v1/abilities/roles/:roleId` |
| L3-FEA-004 | User 예외 권한 설정 | User별 예외 권한 설정 | `/api/v1/abilities/users/:userId` |
| L3-FEA-005 | 본인 권한 조회 | 로그인 사용자 권한 확인 | `/api/v1/abilities/my` |

---

## 화면 (Screen) - L4

### 예상 화면 구조 (프론트엔드 미구현 - 역추론)

| ID | 화면명 | 경로 | 설명 | 필요 권한 |
|----|--------|------|------|----------|
| L4-SCR-001 | 역할 목록 | `/roles` | 전체 역할 목록 표시 | ADMIN |
| L4-SCR-002 | 역할 상세 | `/roles/:id` | 역할 상세 정보 및 권한 목록 | ADMIN |
| L4-SCR-003 | 역할 등록 | `/roles/new` | 새 역할 생성 폼 | SUPER_ADMIN |
| L4-SCR-004 | 역할 수정 | `/roles/:id/edit` | 역할 정보 수정 폼 | SUPER_ADMIN |
| L4-SCR-005 | 권한 관리 | `/roles/:id/abilities` | Role별 권한 설정 화면 | SUPER_ADMIN |
| L4-SCR-006 | 사용자 권한 설정 | `/users/:id/abilities` | User 예외 권한 설정 화면 | SUPER_ADMIN |

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
│  │ /roles/:id   │  │  /roles/new  │  │/roles/:id/edit││          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│           │
│         │                 │                  │       │           │
│         │                 └──────────────────┴───────┘           │
│         ▼                                                        │
│  ┌──────────────┐                                                │
│  │   권한 설정   │                                                │
│  │/roles/:id/   │                                                │
│  │ abilities    │                                                │
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
     │────────────────────────>│                            │
     │                         │  RolesGuard 검사           │
     │                         │  (ADMIN/SUPER_ADMIN)       │
     │                         │                            │
     │                         │  SELECT * FROM roles       │
     │                         │───────────────────────────>│
     │                         │<───────────────────────────│
     │                         │                            │
     │  RoleDto[]              │                            │
     │<────────────────────────│                            │
```

### 권한 생성 흐름

```
[프론트엔드]                [백엔드]                    [데이터베이스]
     │                         │                            │
     │ POST /api/v1/abilities  │                            │
     │ { subjectId, actionId,  │                            │
     │   roleId, conditions }  │                            │
     │────────────────────────>│                            │
     │                         │                            │
     │                         │  CreateAbilityDto 검증     │
     │                         │                            │
     │                         │  AbilitiesFacade.create    │
     │                         │───────────────────────────>│
     │                         │<───────────────────────────│
     │                         │                            │
     │  AbilityResponseDto     │                            │
     │<────────────────────────│                            │
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
    └── abilities.controller.ts

packages/
├── service/
│   └── src/roles.service.ts
│
├── facade/
│   └── src/abilities.facade.ts
│
├── repository/
│   ├── src/roles.repository.ts
│   └── src/abilities.repository.ts
│
├── entity/
│   ├── src/role.entity.ts
│   └── src/ability.entity.ts
│
├── dto/
│   ├── src/role.dto.ts
│   ├── src/ability.dto.ts
│   ├── src/create/create-role.dto.ts
│   ├── src/create/create-ability.dto.ts
│   ├── src/update/update-role.dto.ts
│   └── src/update/update-ability.dto.ts
│
├── be-common/
│   ├── src/casl/casl-ability.factory.ts
│   └── src/guard/roles.guard.ts
│
└── decorator/
    └── src/roles.decorator.ts
```
