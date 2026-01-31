# 01. 개요 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.
> 생성일: 2026-01-31
> 생성기: req-reverse-engineer

## 시스템 컨텍스트 (L0)

| 항목 | 내용 |
|------|------|
| 시스템명 | CASL 기반 권한 관리 시스템 |
| 설명 | RBAC(Role-Based Access Control)와 ABAC(Attribute-Based Access Control)를 결합한 권한 관리 시스템 |
| 분석 도메인 | Role, Ability, Subject, Action |

### 핵심 개념

```
                    ┌─────────────────────────────────────────────┐
                    │           CASL Ability Factory              │
                    │  (런타임 권한 생성 및 조건 기반 검사)          │
                    └─────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
              ┌──────────┐       ┌──────────┐       ┌──────────┐
              │   Role   │       │  Subject │       │  Action  │
              │ (역할)    │       │ (대상)    │       │ (행위)   │
              └──────────┘       └──────────┘       └──────────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │     Ability      │
                              │ (구체적 권한 정의) │
                              └──────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                                       ▼
            Role 기반 권한                            User 예외 권한
         (기본 권한, priority=0)                   (예외 권한, priority>0)
```

---

## 사용자 (Actor) - L1

| ID | 이름 | 설명 | 권한 | 소스 |
|----|------|------|------|------|
| L1-ACT-001 | 슈퍼 관리자 | 시스템 전체 관리 권한 보유 | SUPER_ADMIN | `@Roles([SYSTEM_ROLES.SUPER_ADMIN])` |
| L1-ACT-002 | 관리자 | 일반 관리 권한 보유 | ADMIN | `@Roles([SYSTEM_ROLES.ADMIN])` |
| L1-ACT-003 | 일반 사용자 | 기본 서비스 이용 권한 | USER | `SYSTEM_ROLES.USER` |

### 권한 계층

```
SUPER_ADMIN (최고 관리자)
    ├── 역할 생성/수정/삭제
    ├── 권한(Ability) 생성/수정/삭제
    ├── Role별 권한 일괄 설정
    └── User별 예외 권한 설정

ADMIN (관리자)
    ├── 역할 목록 조회
    ├── 권한 조회
    └── (SUPER_ADMIN 하위 권한)

USER (일반 사용자)
    └── 본인 권한 조회만 가능
```

---

## 사용자 목표 (Goal) - L2

| ID | Actor | 목표 | 설명 |
|----|-------|------|------|
| L2-GOL-001 | 슈퍼 관리자 | 역할 관리 | 시스템 역할을 생성, 수정, 삭제하여 권한 체계를 정의 |
| L2-GOL-002 | 슈퍼 관리자 | 권한 설정 | 역할별 기본 권한 및 사용자별 예외 권한을 설정 |
| L2-GOL-003 | 관리자 | 권한 현황 파악 | 역할 및 권한 목록을 조회하여 현재 권한 체계 파악 |
| L2-GOL-004 | 일반 사용자 | 본인 권한 확인 | 본인에게 부여된 권한 목록을 확인 |

---

## 소스 파일

| 레이어 | 파일 | 설명 |
|--------|------|------|
| Prisma | `packages/prisma/schema/role.prisma` | Role, RoleAssociation, RoleClassification |
| Prisma | `packages/prisma/schema/core.prisma` | Ability, Subject, Action |
| Entity | `packages/entity/src/role.entity.ts` | Role 도메인 엔티티 |
| Entity | `packages/entity/src/ability.entity.ts` | Ability 도메인 엔티티 |
| CASL | `packages/be-common/src/casl/casl-ability.factory.ts` | CASL Ability 생성 팩토리 |
| Guard | `packages/be-common/src/guard/roles.guard.ts` | @Roles 데코레이터 Guard |
| Decorator | `packages/decorator/src/roles.decorator.ts` | @Roles 데코레이터 |
| Controller | `apps/server/src/module/role/roles.controller.ts` | 역할 CRUD API |
| Controller | `apps/server/src/module/ability/abilities.controller.ts` | 권한 CRUD API |
| Service | `packages/service/src/roles.service.ts` | 역할 비즈니스 로직 |
| Store | `packages/store/src/stores/abilityStore.ts` | 프론트엔드 Ability 상태 관리 |

---

## 핵심 비즈니스 규칙

### 1. 역할(Role) 관련
- 시스템 역할(SUPER_ADMIN, ADMIN, USER)은 수정/삭제 불가
- 역할 이름(name)은 고유해야 함
- 연결된 테넌트가 있는 역할은 삭제 불가

### 2. 권한(Ability) 관련
- Role 기반 권한: `roleId`만 설정 (기본 권한)
- User 예외 권한: `userId` 설정 (예외 권한)
- `priority` 값이 높을수록 우선 적용 (User 권한이 Role 권한 덮어씀)
- `inverted=false`면 허용(can), `true`면 거부(cannot)

### 3. 조건(Conditions) 기반 ABAC
- 템플릿 변수 지원: `${user.id}`, `${user.currentSpaceId}` 등
- 보안을 위해 허용된 변수만 치환
- 예시: `{ "departmentId": "${user.departmentId}" }`
