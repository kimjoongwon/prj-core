# L0-L2: 컨텍스트, 사용자, 목표

## L0: 시스템 컨텍스트

### 도메인 정의

| 항목 | 내용 |
|------|------|
| **도메인명** | Role (권한 관리) |
| **범위** | CASL 기반 RBAC+ABAC 권한 체계의 관리 UI (Role/Ability/Grant/Action/Subject 전체) |
| **설명** | 시스템의 접근 권한 체계를 정의하고 관리하는 기능. 역할(Role)을 생성하고, 권한 정의(Ability)를 만들어 역할이나 사용자에게 부여(Grant)하며, 권한 대상(Subject)과 행위(Action)를 관리한다 |

### 핵심 비즈니스 개념

- **Role (역할)**: 권한 체계의 핵심 단위. 시스템 역할(FULL_ACCESS, MANAGE, VIEW)과 커스텀 역할로 구분. Group(그룹핑)과 Category(분류)로 체계화
- **Ability (권한 정의)**: Subject + Action 조합으로 구성된 재사용 가능한 권한 정의. CASL ABAC 기반으로 fields, conditions, inverted, reason 지원
- **Grant (권한 부여)**: Role 또는 User에 Ability를 부여하는 다형성(Polymorphic) BRIDGE 테이블. isActive, priority 메타데이터 포함
- **Action (행위)**: CASL Action 정의. crud(create/read/update/delete), visibility(read:masked:email 등), workflow 그룹으로 분류. config에 마스킹 설정 포함
- **Subject (권한 대상)**: CASL Subject 정의. entity(Prisma 모델), menu, feature, ui 그룹으로 분류. DMMF에서 필드 정보 자동 동기화
- **RoleAssociation (역할-그룹 연결)**: Role과 Group을 연결하여 역할을 그룹핑 (TRUSTED, STANDARD, PREMIUM)
- **RoleClassification (역할-카테고리 연결)**: Role에 Category를 연결하여 분류 체계 부여 (PLATFORM, SHARED, WORKSPACE 등)
- **Assignment (역할 할당)**: Tenant(User+Space)에 Role을 할당하는 관계

### 시스템 경계

```
+---------------------------------------------------------------+
|                    Admin Web Application                       |
+---------------------------------------------------------------+
|  [Role 관리 화면]                                              |
|   - 역할 목록/상세/등록/수정/삭제                               |
|   - Group/Category 연결 관리                                   |
|   - Role별 Ability(Grant) 배치 할당/해제                        |
|                                                                |
|  [Ability 관리 화면]                                           |
|   - 권한 정의 목록/상세/등록/수정/삭제                           |
|   - Subject + Action 조합 설정                                 |
|   - fields, conditions, inverted, reason 설정                  |
|                                                                |
|  [Action 관리 화면]                                            |
|   - 행위 정의 목록/상세 조회                                    |
|   - 커스텀 Action 등록/수정/삭제                                |
|   - 마스킹 config 설정                                         |
|                                                                |
|  [Subject 관리 화면]                                           |
|   - 권한 대상 목록/상세 조회                                    |
|   - DMMF 기반 필드 목록 조회                                    |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                  Backend API (기존 + 신규)                      |
|  [기존]                                                        |
|  - CRUD /api/v1/roles                                          |
|  - CRUD /api/v1/abilities + /my, /roles/:roleId, /users/:userId|
|  - CRUD /api/v1/actions                                        |
|  - 조회  /api/v1/subjects + /:id/fields                        |
|                                                                |
|  [신규]                                                        |
|  - PUT /api/v1/grants/roles/:roleId    (Role Grant 배치 할당)   |
|  - PUT /api/v1/grants/users/:userId    (User Grant 배치 할당)   |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|  PostgreSQL                                                    |
|   - roles, role_associations, role_classifications             |
|   - abilities, grants, actions, subjects                       |
|   - assignments, tenants                                       |
|                                                                |
|  외부 시스템                                                    |
|   - Prisma DMMF (Subject 필드 정보 자동 동기화)                 |
|   - Redis (CASL 권한 캐시)                                     |
+---------------------------------------------------------------+
```

### 외부 시스템 연동

| 시스템 | 연동 방식 | 설명 |
|--------|----------|------|
| Prisma DMMF | 서버 내부 | Subject의 entity 그룹에 대해 모델 필드 정보를 DMMF에서 자동 추출 |
| Redis | 캐시 | CASL 권한 캐시 저장 (TTL 기반) |
| CASL 런타임 | 프론트엔드 | 프론트엔드에서 Ability 기반 UI 접근 제어 실행 |

---

## L1: 사용자 (Actor)

### 사용자 정의

| ID | 사용자 | 역할 | 주요 행동 |
|----|--------|------|----------|
| ROLE-L1-ACT-001 | 최고 관리자 | FULL_ACCESS | Role/Ability/Action/Subject 전체 CRUD, Grant 배치 할당/해제 |
| ROLE-L1-ACT-002 | 일반 관리자 | MANAGE | Role/Ability/Action/Subject 조회, Role별 권한 현황 확인 |
| ROLE-L1-ACT-003 | 조회 사용자 | VIEW | 본인 권한 조회 (getMyAbilities) |

### 사용자 특성

#### 최고 관리자 (FULL_ACCESS)

- **목표**: 시스템 전체 권한 체계를 설계하고 관리. 새로운 역할을 정의하고 적절한 권한을 부여하며, 사용자별 예외 권한을 설정
- **기술 수준**: CASL 권한 모델(Subject, Action, fields, conditions) 이해. RBAC와 ABAC의 차이 인지
- **접근 권한**: System Space (ROOT Category) 전용
  - CASL: `can('manage', 'role')`, `can('manage', 'ability')`, `can('manage', 'action')`, `can('manage', 'subject')`, `can('manage', 'grant')`
- **주요 시나리오**:
  - 프로젝트 초기 권한 체계 설계 (Role 생성, Ability 정의, Grant 할당)
  - 새 기능 추가 시 Subject/Action 확장 및 Ability 생성
  - 사용자별 예외 권한 부여 (특정 사용자에게 추가 권한/제한)
  - 권한 문제 발생 시 진단 및 해결

#### 일반 관리자 (MANAGE)

- **목표**: 권한 현황을 파악하고, 특정 역할에 어떤 권한이 부여되어 있는지 확인
- **기술 수준**: 권한의 기본 개념(누가 무엇을 할 수 있는지) 이해
- **접근 권한**: MANAGE 이상 역할
  - CASL: `can('read', 'role')`, `can('read', 'ability')`, `can('read', 'action')`, `can('read', 'subject')`
- **주요 시나리오**:
  - 특정 역할에 부여된 권한 목록 확인
  - Action/Subject 현황 조회
  - 권한 관련 이슈 보고 시 현황 파악

#### 조회 사용자 (VIEW)

- **목표**: 본인에게 부여된 권한을 확인
- **기술 수준**: 기본적인 시스템 사용 가능
- **접근 권한**: VIEW 이상 역할
  - CASL: `can('read', 'ability')` (본인 권한만)
- **주요 시나리오**:
  - "내 권한" 메뉴에서 본인 보유 권한 확인
  - 특정 기능 접근 불가 시 본인 권한 확인

---

## L2: 사용자 목표 (Goal)

### 목표 정의

| ID | 목표 | 사용자 | 우선순위 | 설명 |
|----|------|--------|----------|------|
| ROLE-L2-GOL-001 | 역할 목록 조회 | 최고 관리자, 일반 관리자 | 높음 | 전체 역할 목록을 조회하고 Group/Category별 필터링 |
| ROLE-L2-GOL-002 | 역할 상세 확인 | 최고 관리자, 일반 관리자 | 높음 | 특정 역할의 상세 정보와 부여된 권한(Grant) 목록 확인 |
| ROLE-L2-GOL-003 | 역할 등록 | 최고 관리자 | 높음 | 새로운 커스텀 역할 생성 (Group/Category 설정 포함) |
| ROLE-L2-GOL-004 | 역할 수정 | 최고 관리자 | 높음 | 역할 정보(displayName, description) 및 Group/Category 수정 |
| ROLE-L2-GOL-005 | 역할 삭제 | 최고 관리자 | 중간 | 커스텀 역할 삭제 (시스템 역할 보호, 연결된 사용자 확인) |
| ROLE-L2-GOL-006 | 역할별 권한 할당 | 최고 관리자 | 높음 | 특정 Role에 Ability를 배치 할당/해제 (Grant 관리) |
| ROLE-L2-GOL-007 | 권한 정의 목록 조회 | 최고 관리자, 일반 관리자 | 높음 | 전체 Ability 목록을 Subject/Action별로 조회 |
| ROLE-L2-GOL-008 | 권한 정의 상세 확인 | 최고 관리자, 일반 관리자 | 높음 | Ability의 Subject, Action, fields, conditions 등 상세 확인 |
| ROLE-L2-GOL-009 | 권한 정의 등록 | 최고 관리자 | 높음 | Subject + Action 조합으로 새 Ability 생성 |
| ROLE-L2-GOL-010 | 권한 정의 수정 | 최고 관리자 | 높음 | Ability의 fields, conditions, inverted, reason 수정 |
| ROLE-L2-GOL-011 | 권한 정의 삭제 | 최고 관리자 | 중간 | 불필요한 Ability 삭제 (연결된 Grant 확인) |
| ROLE-L2-GOL-012 | Action 목록 조회 | 최고 관리자, 일반 관리자 | 높음 | 전체 Action 목록을 그룹(crud/visibility/workflow)별 조회 |
| ROLE-L2-GOL-013 | Action 관리 | 최고 관리자 | 중간 | 커스텀 Action 등록/수정/삭제 (시스템 Action 보호) |
| ROLE-L2-GOL-014 | Subject 목록 조회 | 최고 관리자, 일반 관리자 | 높음 | 전체 Subject 목록을 그룹(entity/menu/feature/ui)별 조회 |
| ROLE-L2-GOL-015 | Subject 필드 조회 | 최고 관리자 | 높음 | entity Subject의 DMMF 기반 필드 목록 확인 (Ability fields 설정용) |
| ROLE-L2-GOL-016 | 내 권한 조회 | 조회 사용자 | 높음 | 본인에게 부여된 전체 권한 목록 확인 |

### 목표 상세

#### ROLE-L2-GOL-001: 역할 목록 조회

**동기**: 시스템에 존재하는 역할 현황을 한눈에 파악하고, 역할 간 관계(Group/Category)를 이해

**성공 기준**:
- 전체 역할 목록이 테이블 형태로 표시
- 시스템 역할(FULL_ACCESS, MANAGE, VIEW)과 커스텀 역할이 시각적으로 구분
- 역할명, 표시명, Group, Category, 시스템 여부, 생성일 확인 가능
- 이름/표시명으로 검색 가능

#### ROLE-L2-GOL-002: 역할 상세 확인

**동기**: 특정 역할에 부여된 권한(Grant)을 확인하여 권한 체계가 올바르게 설정되었는지 검증

**성공 기준**:
- 역할 기본 정보 (name, displayName, description, isSystem) 표시
- 연결된 Group/Category 정보 표시
- 해당 역할에 부여된 Ability 목록 표시 (Grant를 통해)
- 각 Ability의 Subject, Action, fields, inverted 상태 확인
- Grant 메타데이터 (isActive, priority) 확인

#### ROLE-L2-GOL-003: 역할 등록

**동기**: 새 프로젝트나 조직 구조에 맞는 커스텀 역할 생성

**성공 기준**:
- 역할 식별자(name)는 영문 대문자 + 숫자 + 언더스코어만 허용 (정규식: `^[A-Z][A-Z0-9_]*$`)
- 표시명(displayName), 설명(description) 입력
- Group, Category 선택 (선택사항)
- 생성 후 해당 역할 상세 페이지로 이동

#### ROLE-L2-GOL-004: 역할 수정

**동기**: 역할의 표시명, 설명 또는 Group/Category 연결을 변경

**성공 기준**:
- displayName, description 수정 가능
- name(식별자)은 수정 불가 (읽기 전용)
- 시스템 역할은 수정 불가 안내
- Group, Category 변경 가능

#### ROLE-L2-GOL-005: 역할 삭제

**동기**: 더 이상 사용하지 않는 커스텀 역할 정리

**성공 기준**:
- 시스템 역할(isSystem=true)은 삭제 불가
- 연결된 Tenant(Assignment)가 있으면 삭제 불가 (사용 중인 역할 보호)
- 삭제 확인 모달 표시
- 소프트 삭제(removedAt 설정)

#### ROLE-L2-GOL-006: 역할별 권한 할당

**동기**: 역할에 적절한 권한(Ability)을 부여하여 RBAC 체계 구성

**성공 기준**:
- 전체 Ability 목록에서 선택하여 Role에 할당 (체크박스 기반)
- 이미 할당된 Ability는 체크 상태로 표시
- Grant 메타데이터(isActive, priority) 설정 가능
- 배치 할당/해제 (PUT 방식으로 전체 목록 동기화)
- 변경 사항 저장 시 확인 모달

#### ROLE-L2-GOL-007: 권한 정의 목록 조회

**동기**: 시스템에 정의된 권한(Ability) 현황을 파악

**성공 기준**:
- 전체 Ability 목록이 테이블 형태로 표시
- Subject별, Action별 필터링 가능
- 각 Ability의 Subject명, Action명, inverted 여부, fields 개수 확인
- 이름/설명으로 검색 가능

#### ROLE-L2-GOL-008: 권한 정의 상세 확인

**동기**: 특정 Ability의 세부 설정(fields, conditions, inverted, reason)을 확인

**성공 기준**:
- Ability 기본 정보 (name, description) 표시
- 연결된 Subject 정보 (name, displayName, group) 표시
- 연결된 Action 정보 (name, displayName, group, config) 표시
- fields 배열 표시
- conditions JSON 표시 (포맷팅된 형태)
- inverted 상태 (허용/거부) 표시
- reason 표시 (inverted=true인 경우)
- 이 Ability를 사용하는 Role/User 목록 (Grant 역참조)

#### ROLE-L2-GOL-009: 권한 정의 등록

**동기**: 새로운 권한 규칙(Subject + Action 조합)을 정의

**성공 기준**:
- Subject 드롭다운 선택 (그룹별 정렬)
- Action 드롭다운 선택 (그룹별 정렬)
- 선택한 Subject의 fields 목록 표시 (DMMF 기반, entity 그룹만)
- fields 다중 선택 (빈 배열 = 전체 필드)
- conditions JSON 에디터
- inverted 토글
- reason 입력 (inverted 시 필수)
- name, description 입력

#### ROLE-L2-GOL-010: 권한 정의 수정

**동기**: 기존 Ability의 세부 설정 변경

**성공 기준**:
- Subject, Action, fields, conditions, inverted, reason, name, description 수정 가능
- 변경 시 연결된 Grant에는 영향 없음 (Grant 메타데이터는 별도 관리)

#### ROLE-L2-GOL-011: 권한 정의 삭제

**동기**: 불필요한 Ability 정리

**성공 기준**:
- 연결된 Grant가 있으면 경고 표시 (Grant도 함께 삭제됨)
- 삭제 확인 모달 표시
- 소프트 삭제

#### ROLE-L2-GOL-012: Action 목록 조회

**동기**: 시스템에 정의된 행위(Action) 현황 파악

**성공 기준**:
- 전체 Action 목록이 그룹별(crud, visibility, workflow)로 분류되어 표시
- 각 Action의 name, displayName, group, 시스템 여부 확인
- 그룹별 필터링

#### ROLE-L2-GOL-013: Action 관리

**동기**: 마스킹 등 커스텀 Action 추가/수정/삭제

**성공 기준**:
- 커스텀 Action 등록 (name, displayName, description, group, config)
- config JSON 에디터 (마스킹 preset 설정)
- 시스템 Action(isSystem=true)은 수정/삭제 불가
- 그룹 선택 (crud, visibility, workflow)

#### ROLE-L2-GOL-014: Subject 목록 조회

**동기**: 권한 대상(Subject) 현황 파악

**성공 기준**:
- 전체 Subject 목록이 그룹별(entity, menu, feature, ui)로 분류되어 표시
- 각 Subject의 name, displayName, group, 시스템 여부, 아이콘 확인
- 그룹별 필터링

#### ROLE-L2-GOL-015: Subject 필드 조회

**동기**: Ability 생성 시 fields 설정을 위해 대상 모델의 필드 구조 파악

**성공 기준**:
- entity 그룹 Subject 선택 시 DMMF 기반 필드 목록 표시
- 각 필드의 name, displayName, type, isRequired, isRelation 확인
- 필드 목록에서 선택하여 Ability fields에 적용 가능

#### ROLE-L2-GOL-016: 내 권한 조회

**동기**: 본인에게 부여된 권한을 확인하여 접근 가능한 기능 파악

**성공 기준**:
- Role 기반 기본 권한 + User 예외 권한 병합 표시
- Subject별로 그룹핑하여 어떤 대상에 어떤 행위가 가능한지 표시
- inverted(거부) 권한은 별도 색상으로 구분

---

## 데이터 필드

### Role 목록 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| id | ID | string (UUID) | O | 고유 식별자 |
| name | 역할 식별자 | string | O | 영문 대문자 식별자 (예: FULL_ACCESS) |
| displayName | 표시명 | string | - | 한글 표시명 |
| description | 설명 | string | - | 역할 설명 |
| isSystem | 시스템 역할 | boolean | O | 시스템 역할 여부 (true: 수정/삭제 불가) |
| classification | 분류 | object | - | 연결된 Category 정보 |
| associations | 그룹 | object[] | - | 연결된 Group 정보 |
| createdAt | 생성일 | datetime | O | 생성 일시 |

### Ability 목록 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| id | ID | string (UUID) | O | 고유 식별자 |
| name | 권한명 | string | O | 고유 이름 (예: "Read User Email Masked") |
| description | 설명 | string | - | 권한 설명 |
| subjectId | Subject ID | string (UUID) | O | 권한 대상 FK |
| subject | Subject | object | - | Subject 중첩 정보 (name, displayName, group) |
| actionId | Action ID | string (UUID) | O | 행위 FK |
| action | Action | object | - | Action 중첩 정보 (name, displayName, group) |
| fields | 대상 필드 | string[] | O | 대상 필드 목록 (빈 배열 = 전체) |
| conditions | 조건 | JSON | - | ABAC 조건 (예: `{ "departmentId": "${user.departmentId}" }`) |
| inverted | 거부 여부 | boolean | O | true: cannot (거부), false: can (허용) |
| reason | 거부 사유 | string | - | inverted=true 시 사용자 안내 메시지 |
| createdAt | 생성일 | datetime | O | 생성 일시 |

### Action 목록 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| id | ID | string (UUID) | O | 고유 식별자 |
| name | 이름 | string | O | 행위 식별자 (예: "read", "read:masked:email") |
| displayName | 표시명 | string | - | 한글 표시명 |
| description | 설명 | string | - | 행위 설명 |
| group | 그룹 | string | - | 분류 (crud, visibility, workflow) |
| order | 정렬 순서 | number | O | UI 정렬 순서 |
| isSystem | 시스템 여부 | boolean | O | 시스템 Action 여부 |
| config | 설정 | JSON | - | 마스킹 등 설정 (예: `{ type: "masking", preset: "PRESET_EMAIL" }`) |
| createdAt | 생성일 | datetime | O | 생성 일시 |

### Subject 목록 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| id | ID | string (UUID) | O | 고유 식별자 |
| name | 이름 | string | O | 대상 식별자 (예: "entity:User", "menu:settings") |
| displayName | 표시명 | string | - | 한글 표시명 |
| icon | 아이콘 | string | - | 아이콘 식별자 |
| group | 그룹 | string | - | 분류 (entity, menu, feature, ui) |
| order | 정렬 순서 | number | O | UI 정렬 순서 |
| isSystem | 시스템 여부 | boolean | O | Prisma 모델 기반 여부 |
| createdAt | 생성일 | datetime | O | 생성 일시 |

### Grant 데이터

| 필드 | 한글명 | 타입 | 필수 | 설명 |
|------|--------|------|:----:|------|
| id | ID | string (UUID) | O | 고유 식별자 |
| granteeType | 대상 유형 | string | O | "Role" 또는 "User" |
| granteeId | 대상 ID | string (UUID) | O | Role ID 또는 User ID |
| abilityId | 권한 ID | string (UUID) | O | 부여된 Ability FK |
| isActive | 활성화 | boolean | O | 활성화 여부 |
| priority | 우선순위 | number | O | Role: 0-9, User: 10+ |
| ability | 권한 상세 | object | - | Ability 중첩 정보 |
| createdAt | 생성일 | datetime | O | 생성 일시 |

---

## 사용자 스토리

| Actor | Goal | Story |
|-------|------|-------|
| 최고 관리자 | 역할 목록 조회 | 최고 관리자는 시스템에 등록된 전체 역할 목록을 조회하고 Group/Category별로 분류하여 권한 체계 현황을 파악하고 싶다 |
| 최고 관리자 | 역할 상세 확인 | 최고 관리자는 특정 역할의 상세 정보와 해당 역할에 부여된 권한(Grant) 목록을 확인하여 권한 설정이 올바른지 검증하고 싶다 |
| 최고 관리자 | 역할 등록 | 최고 관리자는 프로젝트/조직에 맞는 새로운 커스텀 역할을 생성하고 Group/Category를 설정하고 싶다 |
| 최고 관리자 | 역할 수정 | 최고 관리자는 역할의 표시명, 설명, Group/Category 연결을 변경하고 싶다 |
| 최고 관리자 | 역할 삭제 | 최고 관리자는 더 이상 사용하지 않는 커스텀 역할을 삭제하고 싶다 |
| 최고 관리자 | 역할별 권한 할당 | 최고 관리자는 특정 역할에 Ability를 배치로 할당/해제하여 RBAC 체계를 구성하고 싶다 |
| 최고 관리자 | 권한 정의 목록 조회 | 최고 관리자는 전체 Ability 목록을 Subject/Action별로 조회하여 권한 정의 현황을 파악하고 싶다 |
| 최고 관리자 | 권한 정의 상세 확인 | 최고 관리자는 특정 Ability의 Subject, Action, fields, conditions 등 세부 설정을 확인하고 싶다 |
| 최고 관리자 | 권한 정의 등록 | 최고 관리자는 Subject + Action 조합으로 새로운 Ability를 정의하고 fields와 conditions를 설정하고 싶다 |
| 최고 관리자 | 권한 정의 수정 | 최고 관리자는 기존 Ability의 fields, conditions, inverted, reason 등을 수정하고 싶다 |
| 최고 관리자 | 권한 정의 삭제 | 최고 관리자는 불필요한 Ability를 삭제하고 싶다 |
| 최고 관리자 | Action 목록 조회 | 최고 관리자는 전체 Action 목록을 그룹별로 조회하여 사용 가능한 행위를 파악하고 싶다 |
| 최고 관리자 | Action 관리 | 최고 관리자는 마스킹 등 커스텀 Action을 등록/수정/삭제하고 config를 설정하고 싶다 |
| 최고 관리자 | Subject 목록 조회 | 최고 관리자는 전체 Subject 목록을 그룹별로 조회하여 권한 대상 현황을 파악하고 싶다 |
| 최고 관리자 | Subject 필드 조회 | 최고 관리자는 entity Subject의 필드 구조를 확인하여 Ability의 fields를 적절히 설정하고 싶다 |
| 일반 관리자 | 역할 목록 조회 | 일반 관리자는 역할 목록을 조회하여 조직의 권한 체계를 파악하고 싶다 |
| 일반 관리자 | 역할 상세 확인 | 일반 관리자는 특정 역할의 권한 목록을 확인하여 권한 관련 이슈를 파악하고 싶다 |
| 일반 관리자 | 권한 정의 목록 조회 | 일반 관리자는 전체 Ability 목록을 조회하여 현재 정의된 권한 규칙을 확인하고 싶다 |
| 일반 관리자 | Action/Subject 조회 | 일반 관리자는 Action과 Subject 목록을 조회하여 권한 체계의 구성요소를 파악하고 싶다 |
| 조회 사용자 | 내 권한 조회 | 조회 사용자는 본인에게 부여된 Role 기본 권한과 예외 권한을 확인하여 접근 가능한 기능을 파악하고 싶다 |

---

## 진입 조건

| 조건 | 설명 |
|------|------|
| 인증 | JWT 토큰 필요 (X-Space-ID 헤더 포함) |
| 권한 (CRUD) | FULL_ACCESS 역할 (Role/Ability/Action CUD) |
| 권한 (조회) | MANAGE 이상 역할 (전체 조회), VIEW 이상 (본인 권한 조회) |
| Space | System Space (ROOT Category) 접속 상태 |

---

## 이탈 조건

| 이벤트 | 이동 경로 | 조건 |
|--------|----------|------|
| 역할 클릭 | /admin/roles/[roleId] | 목록에서 역할 선택 |
| 역할 등록 | /admin/roles/new | FULL_ACCESS 권한 |
| 역할 수정 | /admin/roles/[roleId]/edit | FULL_ACCESS 권한, 시스템 역할 아닌 경우 |
| 권한 클릭 | /admin/abilities/[abilityId] | 목록에서 Ability 선택 |
| 권한 등록 | /admin/abilities/new | FULL_ACCESS 권한 |
| Action 클릭 | /admin/actions/[actionId] | 목록에서 Action 선택 |
| Subject 클릭 | /admin/subjects/[subjectId] | 목록에서 Subject 선택 |
| 로그아웃 | /login | - |

---

## Requirement Graph (L0-L2)

```json
{
  "nodes": [
    {
      "id": "ROLE-L0-CTX-001",
      "level": 0,
      "type": "context",
      "label": "권한 관리 시스템",
      "description": "CASL 기반 RBAC+ABAC 권한 체계의 Role/Ability/Grant/Action/Subject 관리"
    },
    {
      "id": "ROLE-L1-ACT-001",
      "level": 1,
      "type": "actor",
      "label": "최고 관리자",
      "description": "FULL_ACCESS 역할의 시스템 최고 관리자. 전체 권한 체계 CRUD 및 Grant 배치 할당"
    },
    {
      "id": "ROLE-L1-ACT-002",
      "level": 1,
      "type": "actor",
      "label": "일반 관리자",
      "description": "MANAGE 역할의 관리자. 권한 현황 조회 전용"
    },
    {
      "id": "ROLE-L1-ACT-003",
      "level": 1,
      "type": "actor",
      "label": "조회 사용자",
      "description": "VIEW 역할의 일반 사용자. 본인 권한 조회만 가능"
    },
    { "id": "ROLE-L2-GOL-001", "level": 2, "type": "goal", "label": "역할 목록 조회" },
    { "id": "ROLE-L2-GOL-002", "level": 2, "type": "goal", "label": "역할 상세 확인" },
    { "id": "ROLE-L2-GOL-003", "level": 2, "type": "goal", "label": "역할 등록" },
    { "id": "ROLE-L2-GOL-004", "level": 2, "type": "goal", "label": "역할 수정" },
    { "id": "ROLE-L2-GOL-005", "level": 2, "type": "goal", "label": "역할 삭제" },
    { "id": "ROLE-L2-GOL-006", "level": 2, "type": "goal", "label": "역할별 권한 할당" },
    { "id": "ROLE-L2-GOL-007", "level": 2, "type": "goal", "label": "권한 정의 목록 조회" },
    { "id": "ROLE-L2-GOL-008", "level": 2, "type": "goal", "label": "권한 정의 상세 확인" },
    { "id": "ROLE-L2-GOL-009", "level": 2, "type": "goal", "label": "권한 정의 등록" },
    { "id": "ROLE-L2-GOL-010", "level": 2, "type": "goal", "label": "권한 정의 수정" },
    { "id": "ROLE-L2-GOL-011", "level": 2, "type": "goal", "label": "권한 정의 삭제" },
    { "id": "ROLE-L2-GOL-012", "level": 2, "type": "goal", "label": "Action 목록 조회" },
    { "id": "ROLE-L2-GOL-013", "level": 2, "type": "goal", "label": "Action 관리" },
    { "id": "ROLE-L2-GOL-014", "level": 2, "type": "goal", "label": "Subject 목록 조회" },
    { "id": "ROLE-L2-GOL-015", "level": 2, "type": "goal", "label": "Subject 필드 조회" },
    { "id": "ROLE-L2-GOL-016", "level": 2, "type": "goal", "label": "내 권한 조회" }
  ],
  "edges": [
    { "from": "ROLE-L0-CTX-001", "to": "ROLE-L1-ACT-001", "type": "has_actor" },
    { "from": "ROLE-L0-CTX-001", "to": "ROLE-L1-ACT-002", "type": "has_actor" },
    { "from": "ROLE-L0-CTX-001", "to": "ROLE-L1-ACT-003", "type": "has_actor" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-001", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-002", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-003", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-004", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-005", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-006", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-007", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-008", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-009", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-010", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-011", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-012", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-013", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-014", "type": "wants" },
    { "from": "ROLE-L1-ACT-001", "to": "ROLE-L2-GOL-015", "type": "wants" },
    { "from": "ROLE-L1-ACT-002", "to": "ROLE-L2-GOL-001", "type": "wants" },
    { "from": "ROLE-L1-ACT-002", "to": "ROLE-L2-GOL-002", "type": "wants" },
    { "from": "ROLE-L1-ACT-002", "to": "ROLE-L2-GOL-007", "type": "wants" },
    { "from": "ROLE-L1-ACT-002", "to": "ROLE-L2-GOL-008", "type": "wants" },
    { "from": "ROLE-L1-ACT-002", "to": "ROLE-L2-GOL-012", "type": "wants" },
    { "from": "ROLE-L1-ACT-002", "to": "ROLE-L2-GOL-014", "type": "wants" },
    { "from": "ROLE-L1-ACT-003", "to": "ROLE-L2-GOL-016", "type": "wants" }
  ]
}
```
