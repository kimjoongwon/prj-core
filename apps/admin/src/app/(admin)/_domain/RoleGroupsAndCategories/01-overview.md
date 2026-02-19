# L0-L2: 개요 (RoleGroupsAndCategories)

## L0: 시스템 컨텍스트

### 도메인 정의

| 항목 | 내용 |
|------|------|
| **도메인명** | RoleGroupsAndCategories (역할 그룹 및 카테고리 관리) |
| **범위** | Role Group(역할 그룹)과 Role Category(역할 카테고리)의 독립적인 CRUD 관리 화면 |
| **설명** | 기존 역할(Role) 관리 화면의 하위 경로로, 역할을 분류(Category)하고 그룹핑(Group)하는 기준 데이터를 독립적으로 관리하는 기능. 기존에는 역할 등록/수정 화면에서 Group/Category를 선택만 할 수 있었으나, 이 기능을 통해 Group/Category 자체를 생성, 조회, 수정할 수 있다 |

### 핵심 비즈니스 개념

- **Group (그룹)**: 역할을 그룹핑하는 범용 엔티티. `GroupTypes.Role` 타입으로 필터링하여 역할 그룹만 관리. RoleAssociation을 통해 Role과 연결. 시드 데이터로 TRUSTED(신뢰), STANDARD(일반), PREMIUM(프리미엄) 3개 기본 그룹 존재
- **Category (카테고리)**: 역할을 분류하는 범용 엔티티. `CategoryTypes.Role` 타입으로 필터링하여 역할 카테고리만 관리. RoleClassification을 통해 Role과 연결. 시드 데이터로 PLATFORM(플랫폼), SHARED(공유), WORKSPACE(워크스페이스), PUBLIC(공개), PROJECT(프로젝트), TECHNICAL(기술), RESTRICTED(제한) 7개 기본 카테고리 존재
- **RoleAssociation (역할-그룹 연결)**: Role과 Group을 연결하는 ASSOCIATION 테이블. Role 1개당 1개 Group 연결 (`roleId @unique`)
- **RoleClassification (역할-카테고리 연결)**: Role과 Category를 연결하는 CLASSIFICATION 테이블. Role 1개당 1개 Category 연결 (`roleId @unique`)

### 기존 시스템과의 관계

이 기능은 기존 Role 관리(`/roles`) 도메인의 확장입니다.

```
기존 Role 관리 (2026-02-14-Role)
├── /roles              ← 역할 목록 (기존)
├── /roles/new          ← 역할 등록 (기존, Group/Category 선택)
├── /roles/[roleId]     ← 역할 상세 (기존)
├── /roles/[roleId]/edit ← 역할 수정 (기존)
│
├── /roles/groups              ← 역할 그룹 목록 (신규)
├── /roles/groups/new          ← 역할 그룹 등록 (신규)
├── /roles/groups/[groupId]    ← 역할 그룹 상세 (신규)
├── /roles/groups/[groupId]/edit ← 역할 그룹 수정 (신규)
│
├── /roles/categories              ← 역할 카테고리 목록 (신규)
├── /roles/categories/new          ← 역할 카테고리 등록 (신규)
├── /roles/categories/[categoryId] ← 역할 카테고리 상세 (신규)
└── /roles/categories/[categoryId]/edit ← 역할 카테고리 수정 (신규)
```

### 시스템 경계

```
+---------------------------------------------------------------+
|                    Admin Web Application                       |
+---------------------------------------------------------------+
|  [역할 그룹 관리 화면] /roles/groups                            |
|   - 역할 그룹 목록 조회 (type=Role 필터)                        |
|   - 역할 그룹 상세 (연결된 Role 목록 포함)                       |
|   - 역할 그룹 등록/수정                                         |
|                                                                |
|  [역할 카테고리 관리 화면] /roles/categories                     |
|   - 역할 카테고리 목록 조회 (type=Role 필터)                     |
|   - 역할 카테고리 상세 (연결된 Role 목록 포함)                    |
|   - 역할 카테고리 등록/수정                                      |
|   - 카테고리 계층 구조 표시 (parentId 지원)                      |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                  Backend API (신규)                             |
|  [역할 그룹]                                                   |
|  - GET    /api/v1/groups?type=Role       (목록 조회)           |
|  - GET    /api/v1/groups/:id             (상세 조회)           |
|  - POST   /api/v1/groups                 (등록)               |
|  - PATCH  /api/v1/groups/:id             (수정)               |
|                                                                |
|  [역할 카테고리]                                                |
|  - GET    /api/v1/categories?type=Role   (목록 조회)           |
|  - GET    /api/v1/categories/:id         (상세 조회)           |
|  - POST   /api/v1/categories             (등록)               |
|  - PATCH  /api/v1/categories/:id         (수정)               |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|  PostgreSQL                                                    |
|   - groups (type=Role 필터)                                    |
|   - categories (type=Role 필터)                                |
|   - role_associations (Group-Role 연결)                        |
|   - role_classifications (Category-Role 연결)                  |
+---------------------------------------------------------------+
```

### 외부 시스템 연동

| 시스템 | 연동 방식 | 설명 |
|--------|----------|------|
| Role 관리 화면 | 내부 링크 | Group/Category 상세에서 연결된 Role 클릭 시 Role 상세로 이동 |
| 시드 데이터 | 초기 데이터 | RoleGroupNames, RoleCategoryNames enum 기반으로 시드 데이터 생성 |

---

## L1: 사용자 (Actor)

### 사용자 정의

| ID | 사용자 | 역할 | 주요 행동 |
|----|--------|------|----------|
| RGC-L1-ACT-001 | 최고 관리자 | FULL_ACCESS | Group/Category 전체 CRUD, 연결된 Role 현황 확인 |
| RGC-L1-ACT-002 | 일반 관리자 | MANAGE | Group/Category 목록/상세 조회, 연결된 Role 현황 확인 |

### 사용자 특성

#### 최고 관리자 (FULL_ACCESS)

- **목표**: 역할 분류 체계(Group/Category)를 설계하고 관리. 새로운 그룹이나 카테고리를 추가하여 역할을 체계적으로 분류
- **기술 수준**: 권한 체계의 Group(신뢰도 기반 그룹핑)과 Category(기능 영역 기반 분류)의 차이를 이해
- **접근 권한**: System Space (ROOT Category) 전용
  - CASL: `can('manage', 'role')` (Group/Category는 Role 도메인의 하위로 동일 Subject 사용)
- **주요 시나리오**:
  - 새 프로젝트/조직 유형에 맞는 역할 그룹 추가 (예: VIP 고객 전용 그룹)
  - 새 기능 영역에 맞는 역할 카테고리 추가 (예: ANALYTICS 카테고리)
  - 기존 Group/Category의 라벨(표시명) 수정
  - 특정 Group/Category에 어떤 Role이 연결되어 있는지 확인

#### 일반 관리자 (MANAGE)

- **목표**: 역할 분류 체계 현황을 파악하여 권한 구조를 이해
- **기술 수준**: 기본적인 그룹/카테고리 분류 개념 이해
- **접근 권한**: MANAGE 이상 역할
  - CASL: `can('read', 'role')`
- **주요 시나리오**:
  - 어떤 역할 그룹이 존재하는지 확인
  - 특정 카테고리에 속한 역할 목록 확인
  - 권한 체계 관련 이슈 보고 시 현황 파악

---

## L2: 사용자 목표 (Goal)

### 목표 정의

| ID | 목표 | 사용자 | 우선순위 | 설명 |
|----|------|--------|----------|------|
| RGC-L2-GOL-001 | 역할 그룹 목록 조회 | 최고 관리자, 일반 관리자 | 높음 | Role 타입의 전체 Group 목록을 조회 |
| RGC-L2-GOL-002 | 역할 그룹 상세 확인 | 최고 관리자, 일반 관리자 | 높음 | 특정 Group의 상세 정보와 연결된 Role 목록 확인 |
| RGC-L2-GOL-003 | 역할 그룹 등록 | 최고 관리자 | 중간 | 새로운 역할 그룹 생성 |
| RGC-L2-GOL-004 | 역할 그룹 수정 | 최고 관리자 | 중간 | 기존 역할 그룹의 이름/라벨 수정 |
| RGC-L2-GOL-005 | 역할 카테고리 목록 조회 | 최고 관리자, 일반 관리자 | 높음 | Role 타입의 전체 Category 목록을 조회 |
| RGC-L2-GOL-006 | 역할 카테고리 상세 확인 | 최고 관리자, 일반 관리자 | 높음 | 특정 Category의 상세 정보와 연결된 Role 목록 확인 |
| RGC-L2-GOL-007 | 역할 카테고리 등록 | 최고 관리자 | 중간 | 새로운 역할 카테고리 생성 |
| RGC-L2-GOL-008 | 역할 카테고리 수정 | 최고 관리자 | 중간 | 기존 역할 카테고리의 이름 수정 |

### 목표 상세

#### RGC-L2-GOL-001: 역할 그룹 목록 조회

**동기**: 시스템에 존재하는 역할 그룹 현황을 한눈에 파악하고, 각 그룹에 몇 개의 역할이 연결되어 있는지 확인

**성공 기준**:
- `type=Role`인 Group 목록이 테이블 형태로 표시
- 각 그룹의 이름(name), 라벨(label), 연결된 역할 수, 생성일 확인 가능
- 이름/라벨로 검색 가능

#### RGC-L2-GOL-002: 역할 그룹 상세 확인

**동기**: 특정 역할 그룹에 어떤 역할들이 연결되어 있는지 확인하여 그룹핑 현황을 파악

**성공 기준**:
- 그룹 기본 정보 (name, label, type, createdAt) 표시
- 해당 그룹에 연결된 Role 목록 표시 (RoleAssociation을 통해)
- 각 Role의 이름, 표시명, 시스템 역할 여부 확인
- Role 클릭 시 해당 Role 상세 페이지(`/roles/[roleId]`)로 이동

#### RGC-L2-GOL-003: 역할 그룹 등록

**동기**: 새로운 역할 그룹을 추가하여 역할을 체계적으로 그룹핑

**성공 기준**:
- 이름(name) 입력: 영문 대문자 + 숫자 + 언더스코어 (정규식: `^[A-Z][A-Z0-9_]*$`)
- 라벨(label) 입력: 한글 표시명
- type은 `Role`로 자동 설정 (사용자 선택 불가)
- spaceId는 현재 Space (System Space) 자동 설정
- 생성 후 해당 그룹 상세 페이지로 이동

#### RGC-L2-GOL-004: 역할 그룹 수정

**동기**: 기존 역할 그룹의 표시 정보를 변경

**성공 기준**:
- name, label 수정 가능
- 시드 데이터로 생성된 기본 그룹(TRUSTED, STANDARD, PREMIUM)의 name은 수정 불가 (label만 변경 가능)
- 수정 후 상세 페이지로 이동

#### RGC-L2-GOL-005: 역할 카테고리 목록 조회

**동기**: 시스템에 존재하는 역할 카테고리 현황을 파악하고, 각 카테고리에 몇 개의 역할이 연결되어 있는지 확인

**성공 기준**:
- `type=Role`인 Category 목록이 테이블 형태로 표시
- 각 카테고리의 이름(name), 부모 카테고리(parentId), 연결된 역할 수, 생성일 확인 가능
- 이름으로 검색 가능
- 계층 구조가 시각적으로 표현 (parent-child 관계)

#### RGC-L2-GOL-006: 역할 카테고리 상세 확인

**동기**: 특정 역할 카테고리에 어떤 역할들이 연결되어 있는지 확인하여 분류 현황을 파악

**성공 기준**:
- 카테고리 기본 정보 (name, type, parentId, createdAt) 표시
- 부모 카테고리 정보 표시 (있는 경우, 클릭하여 이동 가능)
- 하위 카테고리 목록 표시 (children)
- 해당 카테고리에 연결된 Role 목록 표시 (RoleClassification을 통해)
- 각 Role의 이름, 표시명, 시스템 역할 여부 확인
- Role 클릭 시 해당 Role 상세 페이지(`/roles/[roleId]`)로 이동

#### RGC-L2-GOL-007: 역할 카테고리 등록

**동기**: 새로운 역할 카테고리를 추가하여 역할을 체계적으로 분류

**성공 기준**:
- 이름(name) 입력: 영문 대문자 + 숫자 + 언더스코어 (정규식: `^[A-Z][A-Z0-9_]*$`)
- type은 `Role`로 자동 설정 (사용자 선택 불가)
- 부모 카테고리(parentId) 선택 (선택사항, Role 타입 카테고리 목록에서 선택)
- spaceId는 현재 Space (System Space) 자동 설정
- 생성 후 해당 카테고리 상세 페이지로 이동

#### RGC-L2-GOL-008: 역할 카테고리 수정

**동기**: 기존 역할 카테고리의 정보를 변경

**성공 기준**:
- name 수정 가능
- 부모 카테고리(parentId) 변경 가능 (순환 참조 방지)
- 시드 데이터로 생성된 기본 카테고리(PLATFORM, SHARED 등)의 name은 수정 불가
- 수정 후 상세 페이지로 이동

---

## 데이터 필드

### Group (역할 그룹) 목록 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| id | ID | string (UUID) | O | 고유 식별자 |
| name | 이름 | string | O | 그룹 식별자 (예: TRUSTED, STANDARD) |
| type | 유형 | GroupTypes | O | 그룹 유형 (Role 고정) |
| label | 라벨 | string | - | 한글 표시명 (예: 신뢰, 일반, 프리미엄) |
| _count.roleAssociations | 연결된 역할 수 | number | O | 이 그룹에 연결된 Role 개수 |
| createdAt | 생성일 | datetime | O | 생성 일시 |

### Group (역할 그룹) 상세 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| (목록 데이터 포함) | - | - | - | - |
| spaceId | Space ID | string (UUID) | O | 소속 Space |
| space | Space | object | - | Space 정보 |
| creator | 생성자 | object | - | 생성자 정보 |
| roleAssociations | 연결된 역할 | object[] | - | RoleAssociation + Role 중첩 정보 |

### Category (역할 카테고리) 목록 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| id | ID | string (UUID) | O | 고유 식별자 |
| name | 이름 | string | O | 카테고리 식별자 (예: PLATFORM, SHARED) |
| type | 유형 | CategoryTypes | O | 카테고리 유형 (Role 고정) |
| parentId | 부모 카테고리 ID | string (UUID) | - | 상위 카테고리 FK |
| parent | 부모 카테고리 | object | - | 부모 카테고리 이름 |
| _count.roleClassifications | 연결된 역할 수 | number | O | 이 카테고리에 연결된 Role 개수 |
| _count.children | 하위 카테고리 수 | number | O | 하위 카테고리 개수 |
| createdAt | 생성일 | datetime | O | 생성 일시 |

### Category (역할 카테고리) 상세 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| (목록 데이터 포함) | - | - | - | - |
| spaceId | Space ID | string (UUID) | O | 소속 Space |
| space | Space | object | - | Space 정보 |
| creator | 생성자 | object | - | 생성자 정보 |
| children | 하위 카테고리 | object[] | - | 하위 카테고리 목록 |
| roleClassifications | 연결된 역할 | object[] | - | RoleClassification + Role 중첩 정보 |

---

## 사용자 스토리

| Actor | Goal | Story |
|-------|------|-------|
| 최고 관리자 | 역할 그룹 목록 조회 | 최고 관리자는 시스템에 정의된 역할 그룹 목록을 조회하여 그룹핑 체계를 파악하고 싶다 |
| 최고 관리자 | 역할 그룹 상세 확인 | 최고 관리자는 특정 역할 그룹에 연결된 역할 목록을 확인하여 그룹핑 현황을 파악하고 싶다 |
| 최고 관리자 | 역할 그룹 등록 | 최고 관리자는 새로운 역할 그룹을 생성하여 역할을 체계적으로 그룹핑하고 싶다 |
| 최고 관리자 | 역할 그룹 수정 | 최고 관리자는 역할 그룹의 라벨(표시명)을 변경하고 싶다 |
| 최고 관리자 | 역할 카테고리 목록 조회 | 최고 관리자는 시스템에 정의된 역할 카테고리 목록을 조회하여 분류 체계를 파악하고 싶다 |
| 최고 관리자 | 역할 카테고리 상세 확인 | 최고 관리자는 특정 카테고리에 연결된 역할 목록과 계층 구조를 확인하여 분류 현황을 파악하고 싶다 |
| 최고 관리자 | 역할 카테고리 등록 | 최고 관리자는 새로운 역할 카테고리를 생성하여 역할을 체계적으로 분류하고 싶다 |
| 최고 관리자 | 역할 카테고리 수정 | 최고 관리자는 역할 카테고리의 이름이나 부모 카테고리를 변경하고 싶다 |
| 일반 관리자 | 역할 그룹 목록 조회 | 일반 관리자는 역할 그룹 목록을 조회하여 권한 구조를 파악하고 싶다 |
| 일반 관리자 | 역할 그룹 상세 확인 | 일반 관리자는 특정 역할 그룹에 연결된 역할을 확인하고 싶다 |
| 일반 관리자 | 역할 카테고리 목록 조회 | 일반 관리자는 역할 카테고리 목록을 조회하여 분류 체계를 파악하고 싶다 |
| 일반 관리자 | 역할 카테고리 상세 확인 | 일반 관리자는 특정 카테고리에 연결된 역할과 계층 구조를 확인하고 싶다 |

---

## 진입 조건

| 조건 | 설명 |
|------|------|
| 인증 | JWT 토큰 필요 (X-Space-ID 헤더 포함) |
| 권한 (CRUD) | FULL_ACCESS 역할 (Group/Category CUD) |
| 권한 (조회) | MANAGE 이상 역할 (목록/상세 조회) |
| Space | System Space (ROOT Category) 접속 상태 |

---

## 이탈 조건

| 이벤트 | 이동 경로 | 조건 |
|--------|----------|------|
| 역할 그룹 클릭 | /roles/groups/[groupId] | 목록에서 그룹 선택 |
| 역할 그룹 등록 | /roles/groups/new | FULL_ACCESS 권한 |
| 역할 그룹 수정 | /roles/groups/[groupId]/edit | FULL_ACCESS 권한 |
| 역할 카테고리 클릭 | /roles/categories/[categoryId] | 목록에서 카테고리 선택 |
| 역할 카테고리 등록 | /roles/categories/new | FULL_ACCESS 권한 |
| 역할 카테고리 수정 | /roles/categories/[categoryId]/edit | FULL_ACCESS 권한 |
| 연결된 Role 클릭 | /roles/[roleId] | 상세에서 연결된 역할 선택 |
| 부모 카테고리 클릭 | /roles/categories/[categoryId] | 상세에서 부모 카테고리 선택 |
| 역할 목록으로 이동 | /roles | 사이드 메뉴 또는 뒤로가기 |
| 로그아웃 | /login | - |

---

## Requirement Graph (L0-L2)

```json
{
  "nodes": [
    {
      "id": "RGC-L0-CTX-001",
      "level": 0,
      "type": "context",
      "label": "역할 그룹 및 카테고리 관리",
      "description": "역할을 그룹핑(Group)하고 분류(Category)하는 기준 데이터의 독립적 CRUD 관리"
    },
    {
      "id": "RGC-L1-ACT-001",
      "level": 1,
      "type": "actor",
      "label": "최고 관리자",
      "description": "FULL_ACCESS 역할의 시스템 최고 관리자. Group/Category 전체 CRUD"
    },
    {
      "id": "RGC-L1-ACT-002",
      "level": 1,
      "type": "actor",
      "label": "일반 관리자",
      "description": "MANAGE 역할의 관리자. Group/Category 조회 전용"
    },
    { "id": "RGC-L2-GOL-001", "level": 2, "type": "goal", "label": "역할 그룹 목록 조회" },
    { "id": "RGC-L2-GOL-002", "level": 2, "type": "goal", "label": "역할 그룹 상세 확인" },
    { "id": "RGC-L2-GOL-003", "level": 2, "type": "goal", "label": "역할 그룹 등록" },
    { "id": "RGC-L2-GOL-004", "level": 2, "type": "goal", "label": "역할 그룹 수정" },
    { "id": "RGC-L2-GOL-005", "level": 2, "type": "goal", "label": "역할 카테고리 목록 조회" },
    { "id": "RGC-L2-GOL-006", "level": 2, "type": "goal", "label": "역할 카테고리 상세 확인" },
    { "id": "RGC-L2-GOL-007", "level": 2, "type": "goal", "label": "역할 카테고리 등록" },
    { "id": "RGC-L2-GOL-008", "level": 2, "type": "goal", "label": "역할 카테고리 수정" }
  ],
  "edges": [
    { "from": "RGC-L0-CTX-001", "to": "RGC-L1-ACT-001", "type": "has_actor" },
    { "from": "RGC-L0-CTX-001", "to": "RGC-L1-ACT-002", "type": "has_actor" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-001", "type": "wants" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-002", "type": "wants" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-003", "type": "wants" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-004", "type": "wants" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-005", "type": "wants" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-006", "type": "wants" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-007", "type": "wants" },
    { "from": "RGC-L1-ACT-001", "to": "RGC-L2-GOL-008", "type": "wants" },
    { "from": "RGC-L1-ACT-002", "to": "RGC-L2-GOL-001", "type": "wants" },
    { "from": "RGC-L1-ACT-002", "to": "RGC-L2-GOL-002", "type": "wants" },
    { "from": "RGC-L1-ACT-002", "to": "RGC-L2-GOL-005", "type": "wants" },
    { "from": "RGC-L1-ACT-002", "to": "RGC-L2-GOL-006", "type": "wants" }
  ]
}
```
