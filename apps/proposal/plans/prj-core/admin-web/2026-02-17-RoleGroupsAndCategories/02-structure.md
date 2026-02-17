# L3-L4: 기능 및 화면 구조 (RoleGroupsAndCategories)

## 이전 레이어 요약 (L0-L2)

- **L0 Context**: RBAC 권한 체계에서 Role의 그룹핑(Group)과 분류(Category) 체계를 관리하는 UI. Group은 역할을 그룹핑하고, Category는 트리 구조로 역할을 분류
- **L1 Actor**: 시스템 관리자 (FULL_ACCESS) - 전체 권한 관리 접근 가능
- **L2 Goals**:
  - GOL-001: 역할 그룹(Role Group) 조회 및 관리
  - GOL-002: 역할 그룹 생성/수정/삭제
  - GOL-003: 역할 카테고리(Role Category) 조회 및 관리
  - GOL-004: 역할 카테고리 생성/수정/삭제

---

## 도메인 관계 구조

```
Group (그룹, type=Role 필터)
  └── RoleAssociation (1:N) ── Role (역할, roleId unique)

Category (카테고리, type=Role 필터, 트리 구조)
  ├── parent/children (self-reference)
  └── RoleClassification (1:N) ── Role (역할, roleId unique)
```

**핵심 포인트**:
- Group/Category는 범용 모델(type으로 Role/Space/File/User 구분)
- 이 기획에서는 `type = 'Role'`인 데이터만 다룸
- RoleAssociation: 1개의 Role은 1개의 Group에만 소속 가능 (roleId unique)
- RoleClassification: 1개의 Role은 1개의 Category에만 분류 가능 (roleId unique)
- Category는 parentId로 트리 구조 지원

**시드 데이터 (RoleGroupNames)**:

| 코드 | 표시명 |
|------|--------|
| TRUSTED | 신뢰 |
| STANDARD | 일반 |
| PREMIUM | 프리미엄 |

**시드 데이터 (RoleCategoryNames)**:

| 코드 | 표시명 |
|------|--------|
| PLATFORM | 플랫폼 |
| SHARED | 공유 |
| WORKSPACE | 워크스페이스 |
| PUBLIC | 공개 |
| PROJECT | 프로젝트 |
| TECHNICAL | 기술 |
| RESTRICTED | 제한 |

---

## L3: 기능 (Feature)

### 기능 목록

| ID | 기능명 | 목표 연결 | 우선순위 | 도메인 | 설명 |
|----|--------|----------|----------|--------|------|
| RGC-L3-FEA-001 | 역할 그룹 목록 표시 | GOL-001 | 높음 | Group | type=Role인 Group 목록 조회 (소속 Role 수 포함) |
| RGC-L3-FEA-002 | 역할 그룹 검색/필터 | GOL-001 | 중간 | Group | 이름, 라벨 기준 검색 |
| RGC-L3-FEA-003 | 역할 그룹 상세 정보 | GOL-001 | 높음 | Group | 그룹 상세 + 소속 Role 목록 표시 |
| RGC-L3-FEA-004 | 역할 그룹 등록 폼 | GOL-002 | 높음 | Group | 새 그룹 생성 (name, label) |
| RGC-L3-FEA-005 | 역할 그룹 수정 폼 | GOL-002 | 높음 | Group | 그룹 정보 수정 |
| RGC-L3-FEA-006 | 역할 그룹 삭제 | GOL-002 | 중간 | Group | 그룹 삭제 (소속 Role 있으면 경고) |
| RGC-L3-FEA-007 | 역할 카테고리 목록 표시 | GOL-003 | 높음 | Category | type=Role인 Category 목록 조회 (트리 구조, 분류된 Role 수 포함) |
| RGC-L3-FEA-008 | 역할 카테고리 검색/필터 | GOL-003 | 중간 | Category | 이름, 상위 카테고리 기준 검색 |
| RGC-L3-FEA-009 | 역할 카테고리 상세 정보 | GOL-003 | 높음 | Category | 카테고리 상세 + 분류된 Role 목록 + 하위 카테고리 표시 |
| RGC-L3-FEA-010 | 역할 카테고리 등록 폼 | GOL-004 | 높음 | Category | 새 카테고리 생성 (name, parentId) |
| RGC-L3-FEA-011 | 역할 카테고리 수정 폼 | GOL-004 | 높음 | Category | 카테고리 정보 수정 |
| RGC-L3-FEA-012 | 역할 카테고리 삭제 | GOL-004 | 중간 | Category | 카테고리 삭제 (분류된 Role/하위 카테고리 있으면 경고) |

### 기능 상세

#### RGC-L3-FEA-001: 역할 그룹 목록 표시

**설명**: type=Role인 Group을 목록으로 표시합니다. 각 그룹에 소속된 Role 수를 함께 표시합니다.

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 정렬 | 설명 |
|------|------|------|------|------|
| 이름 | name | 200px | 지원 | 그룹 이름 (예: TRUSTED) |
| 라벨 | label | 180px | 지원 | 한글 표시명 (예: 신뢰) |
| 소속 역할 수 | _count.roleAssociations | 120px | 지원 | RoleAssociation 수 |
| 생성일 | createdAt | 150px | 지원 | - |

**페이지네이션**: 없음 (역할 그룹 수가 적으므로 전체 목록)

#### RGC-L3-FEA-003: 역할 그룹 상세 정보

**설명**: 그룹의 상세 정보와 함께 해당 그룹에 소속된 Role 목록을 표시합니다.

**표시 섹션**:
1. **기본 정보**: name, label, createdAt, updatedAt
2. **소속 역할 목록**: RoleAssociation을 통해 연결된 Role 목록 (name, displayName, isSystem)

#### RGC-L3-FEA-004: 역할 그룹 등록 폼

**필드**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | Text Input | O | 그룹 이름 (영문 대문자+언더스코어, 예: TRUSTED) |
| label | Text Input | X | 한글 표시명 (예: 신뢰) |

**자동 설정**: type은 'Role'로 고정, spaceId는 현재 Space

#### RGC-L3-FEA-006: 역할 그룹 삭제

**삭제 조건**:
- 소속 Role이 0개인 경우: 즉시 삭제 가능
- 소속 Role이 있는 경우: 경고 모달 표시 ("이 그룹에 N개의 역할이 소속되어 있습니다. 삭제하면 연결이 해제됩니다.")
- 확인 후 소프트 삭제 (removedAt 설정)

#### RGC-L3-FEA-007: 역할 카테고리 목록 표시

**설명**: type=Role인 Category를 목록으로 표시합니다. 트리 구조를 반영하여 들여쓰기 또는 부모 카테고리 정보를 표시합니다.

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 정렬 | 설명 |
|------|------|------|------|------|
| 이름 | name | 200px | 지원 | 카테고리 이름 (예: PLATFORM) |
| 상위 카테고리 | parent.name | 180px | - | 부모 카테고리명 (최상위면 '-') |
| 분류된 역할 수 | _count.roleClassifications | 120px | 지원 | RoleClassification 수 |
| 하위 카테고리 수 | _count.children | 120px | 지원 | 자식 카테고리 수 |
| 생성일 | createdAt | 150px | 지원 | - |

**페이지네이션**: 없음 (역할 카테고리 수가 적으므로 전체 목록)

#### RGC-L3-FEA-009: 역할 카테고리 상세 정보

**설명**: 카테고리의 상세 정보와 함께 분류된 Role 목록 및 하위 카테고리를 표시합니다.

**표시 섹션**:
1. **기본 정보**: name, parentId(부모 카테고리명), createdAt, updatedAt
2. **분류된 역할 목록**: RoleClassification을 통해 연결된 Role 목록 (name, displayName, isSystem)
3. **하위 카테고리**: 직접 하위 카테고리 목록 (name, 분류된 역할 수)

#### RGC-L3-FEA-010: 역할 카테고리 등록 폼

**필드**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | Text Input | O | 카테고리 이름 (영문 대문자+언더스코어, 예: PLATFORM) |
| parentId | Select | X | 상위 카테고리 선택 (최상위면 미선택) |

**자동 설정**: type은 'Role'로 고정, spaceId는 현재 Space

#### RGC-L3-FEA-012: 역할 카테고리 삭제

**삭제 조건**:
- 분류된 Role이 0개이고 하위 카테고리가 0개인 경우: 즉시 삭제 가능
- 분류된 Role이 있는 경우: 경고 ("이 카테고리에 N개의 역할이 분류되어 있습니다. 삭제하면 분류가 해제됩니다.")
- 하위 카테고리가 있는 경우: 삭제 차단 ("하위 카테고리를 먼저 삭제하거나 이동해주세요.")
- 확인 후 소프트 삭제 (removedAt 설정)

---

## L4: 화면 (Screen)

### 화면 목록

| ID | 화면명 | 경로 | 기능 연결 | 설명 |
|----|--------|------|----------|------|
| RGC-L4-SCR-001 | 역할 그룹 목록 | /roles/groups | FEA-001, FEA-002 | 그룹 목록 조회 + 검색 |
| RGC-L4-SCR-002 | 역할 그룹 상세 | /roles/groups/[groupId] | FEA-003, FEA-006 | 그룹 상세 + 삭제 |
| RGC-L4-SCR-003 | 역할 그룹 등록 | /roles/groups/new | FEA-004 | 그룹 생성 폼 |
| RGC-L4-SCR-004 | 역할 그룹 수정 | /roles/groups/[groupId]/edit | FEA-005 | 그룹 수정 폼 |
| RGC-L4-SCR-005 | 역할 카테고리 목록 | /roles/categories | FEA-007, FEA-008 | 카테고리 목록 조회 + 검색 |
| RGC-L4-SCR-006 | 역할 카테고리 상세 | /roles/categories/[categoryId] | FEA-009, FEA-012 | 카테고리 상세 + 삭제 |
| RGC-L4-SCR-007 | 역할 카테고리 등록 | /roles/categories/new | FEA-010 | 카테고리 생성 폼 |
| RGC-L4-SCR-008 | 역할 카테고리 수정 | /roles/categories/[categoryId]/edit | FEA-011 | 카테고리 수정 폼 |

### 화면 상세

---

#### RGC-L4-SCR-001: 역할 그룹 목록 화면

**경로**: `/roles/groups`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 역할 그룹                                        │ │
│ │ Description: 역할의 그룹을 관리합니다                    │ │
│ │ Actions: [+ 그룹 등록]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 검색/필터 영역                                          │ │
│ │ [검색어 입력...]                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                │ │
│ │ ┌──────────┬──────────┬──────────┬───────────────────┐  │ │
│ │ │ 이름     │ 라벨     │소속 역할 │ 생성일            │  │ │
│ │ ├──────────┼──────────┼──────────┼───────────────────┤  │ │
│ │ │ TRUSTED  │ 신뢰     │  2       │ 2026-01-15 10:30  │  │ │
│ │ │ STANDARD │ 일반     │  1       │ 2026-01-15 10:30  │  │ │
│ │ │ PREMIUM  │ 프리미엄 │  0       │ 2026-01-15 10:30  │  │ │
│ │ └──────────┴──────────┴──────────┴───────────────────┘  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**UI 상태**:

| 상태 | 조건 | 표시 |
|------|------|------|
| 로딩 | API 호출 중 | DataGrid 스켈레톤 |
| 빈 상태 | 결과 0건 | "등록된 역할 그룹이 없습니다" |
| 에러 | API 실패 | 에러 메시지 + 재시도 버튼 |
| 정상 | 데이터 있음 | 목록 표시 |

**권한 체크**: `can('read', 'group')` - MANAGE, FULL_ACCESS

---

#### RGC-L4-SCR-002: 역할 그룹 상세 화면

**경로**: `/roles/groups/[groupId]`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: TRUSTED (신뢰)                                   │ │
│ │ Description: 역할 그룹 상세 정보                         │ │
│ │ Actions: [수정] [삭제]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:          TRUSTED                                  │ │
│ │ 라벨:          신뢰                                     │ │
│ │ 유형:          Role                                     │ │
│ │ 생성일:        2026-01-15 10:30                          │ │
│ │ 수정일:        2026-02-01 09:00                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 소속 역할 (읽기 전용)                   │ │
│ │ ┌──────────────┬──────────┬──────────┐                  │ │
│ │ │ 역할 식별자  │ 표시명   │ 시스템   │                  │ │
│ │ ├──────────────┼──────────┼──────────┤                  │ │
│ │ │ FULL_ACCESS  │ 전체 접근│   ✅     │                  │ │
│ │ │ MANAGE       │ 관리     │   ✅     │                  │ │
│ │ └──────────────┴──────────┴──────────┘                  │ │
│ │ (역할명 클릭 시 /roles/[roleId]로 이동)                 │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**삭제 동작**:
- 소속 역할이 있으면 경고 모달 후 확인 시 삭제
- 소속 역할이 없으면 확인 모달 후 삭제
- 삭제 완료 시 목록 화면으로 이동

**권한 체크**: `can('read', 'group')` (조회), `can('delete', 'group')` (삭제)

---

#### RGC-L4-SCR-003: 역할 그룹 등록 화면

**경로**: `/roles/groups/new`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 역할 그룹 등록                                   │ │
│ │ Description: 새로운 역할 그룹을 등록합니다               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:          [________________] (영문 대문자+_)       │ │
│ │ 라벨:          [________________] (한글 표시명)         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [취소] [등록]                                                │
└─────────────────────────────────────────────────────────────┘
```

**유효성 검증**:
- name: 필수, 영문 대문자+언더스코어만 허용
- label: 선택

**저장 후 동작**: 목록 화면으로 이동

**권한 체크**: `can('create', 'group')` - FULL_ACCESS 전용

---

#### RGC-L4-SCR-004: 역할 그룹 수정 화면

**경로**: `/roles/groups/[groupId]/edit`

**레이아웃**: 등록 화면(SCR-003)과 동일한 구조이나 기존 데이터를 prefill

**제약사항**:
- name 필드는 수정 불가 (readonly) - 식별자 변경 방지
- label만 수정 가능

**저장 후 동작**: 상세 화면으로 이동

**권한 체크**: `can('update', 'group')` - FULL_ACCESS 전용

---

#### RGC-L4-SCR-005: 역할 카테고리 목록 화면

**경로**: `/roles/categories`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 역할 카테고리                                    │ │
│ │ Description: 역할의 분류 체계를 관리합니다               │ │
│ │ Actions: [+ 카테고리 등록]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 검색/필터 영역                                          │ │
│ │ [검색어 입력...]  [상위 카테고리 ▼]                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                │ │
│ │ ┌──────────┬──────────┬──────────┬──────────┬─────────┐ │ │
│ │ │ 이름     │상위 분류 │분류 역할 │하위 분류 │ 생성일  │ │ │
│ │ ├──────────┼──────────┼──────────┼──────────┼─────────┤ │ │
│ │ │ PLATFORM │  -       │  1       │  0       │ ...     │ │ │
│ │ │ SHARED   │  -       │  0       │  0       │ ...     │ │ │
│ │ │ WORKSPACE│  -       │  1       │  2       │ ...     │ │ │
│ │ │ PUBLIC   │ WORKSPACE│  1       │  0       │ ...     │ │ │
│ │ │ PROJECT  │ WORKSPACE│  0       │  0       │ ...     │ │ │
│ │ │ TECHNICAL│  -       │  0       │  0       │ ...     │ │ │
│ │ │ RESTRICTED│ -       │  0       │  0       │ ...     │ │ │
│ │ └──────────┴──────────┴──────────┴──────────┴─────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**UI 상태**:

| 상태 | 조건 | 표시 |
|------|------|------|
| 로딩 | API 호출 중 | DataGrid 스켈레톤 |
| 빈 상태 | 결과 0건 | "등록된 역할 카테고리가 없습니다" |
| 에러 | API 실패 | 에러 메시지 + 재시도 버튼 |
| 정상 | 데이터 있음 | 목록 표시 |

**권한 체크**: `can('read', 'category')` - MANAGE, FULL_ACCESS

---

#### RGC-L4-SCR-006: 역할 카테고리 상세 화면

**경로**: `/roles/categories/[categoryId]`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: PLATFORM (플랫폼)                                │ │
│ │ Description: 역할 카테고리 상세 정보                     │ │
│ │ Actions: [수정] [삭제]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:           PLATFORM                                │ │
│ │ 유형:           Role                                    │ │
│ │ 상위 카테고리:  - (최상위)                              │ │
│ │ 생성일:         2026-01-15 10:30                         │ │
│ │ 수정일:         2026-02-01 09:00                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 분류된 역할 (읽기 전용)                 │ │
│ │ ┌──────────────┬──────────┬──────────┐                  │ │
│ │ │ 역할 식별자  │ 표시명   │ 시스템   │                  │ │
│ │ ├──────────────┼──────────┼──────────┤                  │ │
│ │ │ FULL_ACCESS  │ 전체 접근│   ✅     │                  │ │
│ │ └──────────────┴──────────┴──────────┘                  │ │
│ │ (역할명 클릭 시 /roles/[roleId]로 이동)                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 하위 카테고리 (읽기 전용)               │ │
│ │ ┌──────────────┬──────────┐                              │ │
│ │ │ 이름         │분류 역할 │                              │ │
│ │ ├──────────────┼──────────┤                              │ │
│ │ │ (없음)       │          │                              │ │
│ │ └──────────────┴──────────┘                              │ │
│ │ (카테고리명 클릭 시 해당 카테고리 상세로 이동)           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**삭제 동작**:
- 하위 카테고리가 있으면: 삭제 차단 ("하위 카테고리를 먼저 삭제하거나 이동해주세요.")
- 분류된 Role이 있으면: 경고 모달 후 확인 시 삭제
- 둘 다 없으면: 확인 모달 후 삭제
- 삭제 완료 시 목록 화면으로 이동

**권한 체크**: `can('read', 'category')` (조회), `can('delete', 'category')` (삭제)

---

#### RGC-L4-SCR-007: 역할 카테고리 등록 화면

**경로**: `/roles/categories/new`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 역할 카테고리 등록                               │ │
│ │ Description: 새로운 역할 카테고리를 등록합니다           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:           [________________] (영문 대문자+_)      │ │
│ │ 상위 카테고리:  [카테고리 선택 ▼] (선택 안 하면 최상위) │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [취소] [등록]                                                │
└─────────────────────────────────────────────────────────────┘
```

**유효성 검증**:
- name: 필수, 영문 대문자+언더스코어만 허용, unique
- parentId: 선택 (type=Role인 카테고리만 표시)

**저장 후 동작**: 목록 화면으로 이동

**권한 체크**: `can('create', 'category')` - FULL_ACCESS 전용

---

#### RGC-L4-SCR-008: 역할 카테고리 수정 화면

**경로**: `/roles/categories/[categoryId]/edit`

**레이아웃**: 등록 화면(SCR-007)과 동일한 구조이나 기존 데이터를 prefill

**제약사항**:
- name 필드는 수정 불가 (readonly) - 식별자 변경 방지
- parentId만 수정 가능 (자기 자신 및 하위 카테고리는 선택 불가 - 순환 참조 방지)

**저장 후 동작**: 상세 화면으로 이동

**권한 체크**: `can('update', 'category')` - FULL_ACCESS 전용

---

## 라우팅 구조 요약

```
/roles/groups                              → 역할 그룹 목록 (RGC-L4-SCR-001)
/roles/groups/new                          → 역할 그룹 등록 (RGC-L4-SCR-003)
/roles/groups/[groupId]                    → 역할 그룹 상세 (RGC-L4-SCR-002)
/roles/groups/[groupId]/edit               → 역할 그룹 수정 (RGC-L4-SCR-004)

/roles/categories                          → 역할 카테고리 목록 (RGC-L4-SCR-005)
/roles/categories/new                      → 역할 카테고리 등록 (RGC-L4-SCR-007)
/roles/categories/[categoryId]             → 역할 카테고리 상세 (RGC-L4-SCR-006)
/roles/categories/[categoryId]/edit        → 역할 카테고리 수정 (RGC-L4-SCR-008)
```

**Next.js App Router 폴더 구조**:

```
apps/admin/app/(admin)/roles/
├── groups/
│   ├── page.tsx                          → 그룹 목록
│   ├── _client.tsx
│   ├── _prefetch.ts
│   ├── new/
│   │   ├── page.tsx                      → 그룹 등록
│   │   ├── _client.tsx
│   │   └── _prefetch.ts
│   └── [groupId]/
│       ├── page.tsx                      → 그룹 상세
│       ├── _client.tsx
│       ├── _prefetch.ts
│       └── edit/
│           ├── page.tsx                  → 그룹 수정
│           ├── _client.tsx
│           └── _prefetch.ts
└── categories/
    ├── page.tsx                          → 카테고리 목록
    ├── _client.tsx
    ├── _prefetch.ts
    ├── new/
    │   ├── page.tsx                      → 카테고리 등록
    │   ├── _client.tsx
    │   └── _prefetch.ts
    └── [categoryId]/
        ├── page.tsx                      → 카테고리 상세
        ├── _client.tsx
        ├── _prefetch.ts
        └── edit/
            ├── page.tsx                  → 카테고리 수정
            ├── _client.tsx
            └── _prefetch.ts
```

---

## 메뉴 구조 변경

기존 "권한 관리" 메뉴에 "역할 그룹"과 "역할 카테고리" 항목을 추가합니다.

```
권한 관리 (Shield)
├── 역할          → /roles
├── 역할 그룹     → /roles/groups          ← 신규
├── 역할 카테고리 → /roles/categories      ← 신규
├── 권한 정의     → /abilities
├── 액션          → /actions
└── 대상          → /subjects
```

**ADMIN_PATHS 추가**:

```typescript
// 역할 그룹 (Group, type=Role)
ROLE_GROUPS: "/roles/groups",
ROLE_GROUPS_NEW: "/roles/groups/new",
ROLE_GROUPS_DETAIL: "/roles/groups/[groupId]",
ROLE_GROUPS_EDIT: "/roles/groups/[groupId]/edit",

// 역할 카테고리 (Category, type=Role)
ROLE_CATEGORIES: "/roles/categories",
ROLE_CATEGORIES_NEW: "/roles/categories/new",
ROLE_CATEGORIES_DETAIL: "/roles/categories/[categoryId]",
ROLE_CATEGORIES_EDIT: "/roles/categories/[categoryId]/edit",
```

**ADMIN_SUBJECTS 추가**:

```typescript
MENU_ROLE_GROUPS: "menu:role-groups",
MENU_ROLE_GROUPS_LIST: "menu:role-groups:list",
MENU_ROLE_CATEGORIES: "menu:role-categories",
MENU_ROLE_CATEGORIES_LIST: "menu:role-categories:list",
```

---

## 컴포넌트 구성 (공통)

| 영역 | 컴포넌트 | 유형 | 설명 |
|------|----------|------|------|
| Header | PageSurface | layout | 페이지 래퍼 (title, description, actions) |
| Content | SectionSurface | layout | 섹션 래퍼 (collapsible) |
| Content | DataGrid | ui | 테이블 목록 |
| Filter | SearchInput | inputs | 검색어 입력 |
| Filter | Select | inputs | 필터 셀렉트 (상위 카테고리) |
| Action | Button | ui | 액션 버튼 (등록, 수정, 삭제) |
| Detail | Badge | ui | 상태 표시 (시스템 역할 등) |
| Form | TextInput | inputs | 텍스트 입력 (name, label) |
| Form | Select | inputs | 선택 입력 (parentId) |
| Modal | ConfirmModal | widget | 삭제 확인 모달 |

---

## 화면 간 네비게이션

```
역할 그룹 목록 ────→ 역할 그룹 등록
    │                     ↓ (저장 후)
    │                     역할 그룹 목록
    ↓
역할 그룹 상세 ────→ 역할 그룹 수정
    │                     ↓ (저장 후)
    │                     역할 그룹 상세
    │
    └──→ 역할 상세 (/roles/[roleId], 소속 역할 클릭)

역할 카테고리 목록 ────→ 역할 카테고리 등록
    │                         ↓ (저장 후)
    │                         역할 카테고리 목록
    ↓
역할 카테고리 상세 ────→ 역할 카테고리 수정
    │                         ↓ (저장 후)
    │                         역할 카테고리 상세
    │
    ├──→ 역할 상세 (/roles/[roleId], 분류 역할 클릭)
    └──→ 역할 카테고리 상세 (하위 카테고리 클릭)
```

---

## API 연결 요약

| 화면 | 메서드 | 엔드포인트 | 설명 |
|------|--------|-----------|------|
| 역할 그룹 목록 | GET | /api/v1/groups?type=Role | type=Role 필터로 그룹 목록 조회 |
| 역할 그룹 상세 | GET | /api/v1/groups/:id | 그룹 상세 (roleAssociations include) |
| 역할 그룹 등록 | POST | /api/v1/groups | 그룹 생성 (type=Role 고정) |
| 역할 그룹 수정 | PATCH | /api/v1/groups/:id | 그룹 수정 |
| 역할 그룹 삭제 | DELETE | /api/v1/groups/:id | 그룹 삭제 |
| 역할 카테고리 목록 | GET | /api/v1/categories?type=Role | type=Role 필터로 카테고리 목록 조회 |
| 역할 카테고리 상세 | GET | /api/v1/categories/:id | 카테고리 상세 (roleClassifications, children include) |
| 역할 카테고리 등록 | POST | /api/v1/categories | 카테고리 생성 (type=Role 고정) |
| 역할 카테고리 수정 | PATCH | /api/v1/categories/:id | 카테고리 수정 |
| 역할 카테고리 삭제 | DELETE | /api/v1/categories/:id | 카테고리 삭제 |

---

## Requirement Graph (L3-L4)

```json
{
  "nodes": [
    { "id": "RGC-L3-FEA-001", "level": 3, "type": "feature", "label": "역할 그룹 목록 표시", "description": "type=Role인 Group 목록 조회 (소속 Role 수 포함)" },
    { "id": "RGC-L3-FEA-002", "level": 3, "type": "feature", "label": "역할 그룹 검색/필터", "description": "이름, 라벨 기준 검색" },
    { "id": "RGC-L3-FEA-003", "level": 3, "type": "feature", "label": "역할 그룹 상세 정보", "description": "그룹 상세 + 소속 Role 목록 표시" },
    { "id": "RGC-L3-FEA-004", "level": 3, "type": "feature", "label": "역할 그룹 등록 폼", "description": "새 그룹 생성 (name, label)" },
    { "id": "RGC-L3-FEA-005", "level": 3, "type": "feature", "label": "역할 그룹 수정 폼", "description": "그룹 정보 수정" },
    { "id": "RGC-L3-FEA-006", "level": 3, "type": "feature", "label": "역할 그룹 삭제", "description": "그룹 삭제 (소속 Role 있으면 경고)" },
    { "id": "RGC-L3-FEA-007", "level": 3, "type": "feature", "label": "역할 카테고리 목록 표시", "description": "type=Role인 Category 목록 조회 (트리 구조, 분류 Role 수 포함)" },
    { "id": "RGC-L3-FEA-008", "level": 3, "type": "feature", "label": "역할 카테고리 검색/필터", "description": "이름, 상위 카테고리 기준 검색" },
    { "id": "RGC-L3-FEA-009", "level": 3, "type": "feature", "label": "역할 카테고리 상세 정보", "description": "카테고리 상세 + 분류 Role 목록 + 하위 카테고리 표시" },
    { "id": "RGC-L3-FEA-010", "level": 3, "type": "feature", "label": "역할 카테고리 등록 폼", "description": "새 카테고리 생성 (name, parentId)" },
    { "id": "RGC-L3-FEA-011", "level": 3, "type": "feature", "label": "역할 카테고리 수정 폼", "description": "카테고리 정보 수정" },
    { "id": "RGC-L3-FEA-012", "level": 3, "type": "feature", "label": "역할 카테고리 삭제", "description": "카테고리 삭제 (분류 Role/하위 카테고리 보호)" },
    { "id": "RGC-L4-SCR-001", "level": 4, "type": "screen", "label": "역할 그룹 목록", "metadata": { "path": "/roles/groups" } },
    { "id": "RGC-L4-SCR-002", "level": 4, "type": "screen", "label": "역할 그룹 상세", "metadata": { "path": "/roles/groups/[groupId]" } },
    { "id": "RGC-L4-SCR-003", "level": 4, "type": "screen", "label": "역할 그룹 등록", "metadata": { "path": "/roles/groups/new" } },
    { "id": "RGC-L4-SCR-004", "level": 4, "type": "screen", "label": "역할 그룹 수정", "metadata": { "path": "/roles/groups/[groupId]/edit" } },
    { "id": "RGC-L4-SCR-005", "level": 4, "type": "screen", "label": "역할 카테고리 목록", "metadata": { "path": "/roles/categories" } },
    { "id": "RGC-L4-SCR-006", "level": 4, "type": "screen", "label": "역할 카테고리 상세", "metadata": { "path": "/roles/categories/[categoryId]" } },
    { "id": "RGC-L4-SCR-007", "level": 4, "type": "screen", "label": "역할 카테고리 등록", "metadata": { "path": "/roles/categories/new" } },
    { "id": "RGC-L4-SCR-008", "level": 4, "type": "screen", "label": "역할 카테고리 수정", "metadata": { "path": "/roles/categories/[categoryId]/edit" } }
  ],
  "edges": [
    { "from": "RGC-L2-GOL-001", "to": "RGC-L3-FEA-001", "type": "achieves" },
    { "from": "RGC-L2-GOL-001", "to": "RGC-L3-FEA-002", "type": "achieves" },
    { "from": "RGC-L2-GOL-001", "to": "RGC-L3-FEA-003", "type": "achieves" },
    { "from": "RGC-L2-GOL-002", "to": "RGC-L3-FEA-004", "type": "achieves" },
    { "from": "RGC-L2-GOL-002", "to": "RGC-L3-FEA-005", "type": "achieves" },
    { "from": "RGC-L2-GOL-002", "to": "RGC-L3-FEA-006", "type": "achieves" },
    { "from": "RGC-L2-GOL-003", "to": "RGC-L3-FEA-007", "type": "achieves" },
    { "from": "RGC-L2-GOL-003", "to": "RGC-L3-FEA-008", "type": "achieves" },
    { "from": "RGC-L2-GOL-003", "to": "RGC-L3-FEA-009", "type": "achieves" },
    { "from": "RGC-L2-GOL-004", "to": "RGC-L3-FEA-010", "type": "achieves" },
    { "from": "RGC-L2-GOL-004", "to": "RGC-L3-FEA-011", "type": "achieves" },
    { "from": "RGC-L2-GOL-004", "to": "RGC-L3-FEA-012", "type": "achieves" },
    { "from": "RGC-L3-FEA-001", "to": "RGC-L4-SCR-001", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-002", "to": "RGC-L4-SCR-001", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-003", "to": "RGC-L4-SCR-002", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-006", "to": "RGC-L4-SCR-002", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-004", "to": "RGC-L4-SCR-003", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-005", "to": "RGC-L4-SCR-004", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-007", "to": "RGC-L4-SCR-005", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-008", "to": "RGC-L4-SCR-005", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-009", "to": "RGC-L4-SCR-006", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-012", "to": "RGC-L4-SCR-006", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-010", "to": "RGC-L4-SCR-007", "type": "displayed_on" },
    { "from": "RGC-L3-FEA-011", "to": "RGC-L4-SCR-008", "type": "displayed_on" }
  ]
}
```
