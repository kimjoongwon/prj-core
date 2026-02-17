# 04. UI 상세 (L7-L8)

## 이전 레이어 요약

- **L0 Context**: RBAC 권한 체계에서 Role의 그룹핑(Group)과 분류(Category) 기준 데이터를 독립적으로 관리하는 UI
- **L1 Actor**: 최고 관리자(FULL_ACCESS) - 전체 CRUD, 일반 관리자(MANAGE) - 조회 전용
- **L3 Feature 12개**: Group(6), Category(6)
- **L4 Screen 8개**: Group(4: 목록/상세/등록/수정), Category(4: 목록/상세/등록/수정)

---

## L7: 데이터 모델 (Entity)

### 엔티티 개요

기존 Prisma 스키마의 Group, Category 모델을 그대로 활용합니다. 이 기능은 **신규 모델 추가 없이** 기존 범용 모델(Group, Category)에 `type=Role` 필터를 적용하여 역할 전용 그룹/카테고리를 관리합니다.

| 엔티티 | DB 테이블 | 설명 | DTO | 신규 여부 |
|--------|-----------|------|-----|:---------:|
| Group | groups | 그룹 (범용, type=Role 필터) | `GroupDto` | 기존 |
| Category | categories | 카테고리 (범용, type=Role 필터) | `CategoryDto` | 기존 |
| RoleAssociation | role_associations | 역할-그룹 연결 | `RoleAssociationDto` | 기존 |
| RoleClassification | role_classifications | 역할-카테고리 연결 | `RoleClassificationDto` | 기존 |
| Role | roles | 역할 (참조용) | `RoleDto` | 기존 |

### 엔티티 필드 매트릭스

#### Group (역할 그룹)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required, default(uuid()) | 고유 식별자 |
| name | String | required | 그룹 이름 (예: TRUSTED, STANDARD) |
| type | GroupTypes (Enum) | required, default(User) | 유형 (이 기능에서는 Role 고정) |
| label | String | optional, nullable | 한글 표시명 (예: 신뢰, 일반) |
| spaceId | UUID | FK -> Space, required, index | 소속 Space |
| creatorId | UUID | FK -> User, optional, nullable | 생성자 |
| createdAt | DateTime | required, default(now()) | 생성 일시 |
| updatedAt | DateTime | optional | 수정 일시 |
| removedAt | DateTime | optional | 소프트 삭제 일시 |

**중첩 관계:**
- `space?: SpaceDto` - N:1 Space 정보
- `creator?: UserDto` - N:1 생성자 정보
- `roleAssociations?: RoleAssociationDto[]` - 1:N 역할 연결 (상세 조회 시)
- `_count.roleAssociations?: number` - 연결된 역할 수 (목록 조회 시)

#### Category (역할 카테고리)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required, default(uuid()) | 고유 식별자 |
| name | String | unique, required | 카테고리 이름 (예: PLATFORM, SHARED) |
| type | CategoryTypes (Enum) | required, default(User) | 유형 (이 기능에서는 Role 고정) |
| parentId | UUID | FK -> Category (self), optional, nullable | 부모 카테고리 ID |
| spaceId | UUID | FK -> Space, required, index | 소속 Space |
| creatorId | UUID | FK -> User, optional, nullable | 생성자 |
| createdAt | DateTime | required, default(now()) | 생성 일시 |
| updatedAt | DateTime | optional | 수정 일시 |
| removedAt | DateTime | optional | 소프트 삭제 일시 |

**중첩 관계:**
- `parent?: CategoryDto` - N:1 부모 카테고리
- `children?: CategoryDto[]` - 1:N 하위 카테고리 (상세 조회 시)
- `space?: SpaceDto` - N:1 Space 정보
- `creator?: UserDto` - N:1 생성자 정보
- `roleClassifications?: RoleClassificationDto[]` - 1:N 역할 연결 (상세 조회 시)
- `_count.roleClassifications?: number` - 분류된 역할 수 (목록 조회 시)
- `_count.children?: number` - 하위 카테고리 수 (목록 조회 시)

#### RoleAssociation (역할-그룹 연결)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| roleId | UUID | FK -> Role, unique, required | 역할 ID (1:1 제약) |
| groupId | UUID | FK -> Group, required | 그룹 ID |
| createdAt | DateTime | required | 생성 일시 |

**중첩 관계 (상세 조회 시):**
- `role?: RoleDto` - N:1 역할 정보 (name, displayName, isSystem)

#### RoleClassification (역할-카테고리 연결)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| roleId | UUID | FK -> Role, unique, required | 역할 ID (1:1 제약) |
| categoryId | UUID | FK -> Category, required | 카테고리 ID |
| createdAt | DateTime | required | 생성 일시 |

**중첩 관계 (상세 조회 시):**
- `role?: RoleDto` - N:1 역할 정보 (name, displayName, isSystem)

### 엔티티 관계 다이어그램

```
Group (1) ──── (0..*) RoleAssociation ──── (1) Role
  (type=Role 필터)      (roleId unique)

Category (1) ──── (0..*) RoleClassification ──── (1) Role
  (type=Role 필터)        (roleId unique)

Category (1) ──── (0..*) Category (parent/children, self-reference)
```

### API 응답 타입 매핑

| API | 응답 DTO | 관련 화면 | 비고 |
|-----|----------|----------|------|
| GET /api/v1/groups?type=Role | `GroupDto[]` | 그룹 목록 (SCR-001) | _count.roleAssociations 포함 |
| GET /api/v1/groups/:id | `GroupDto` | 그룹 상세 (SCR-002) | roleAssociations.role include |
| POST /api/v1/groups | `GroupDto` | 그룹 등록 (SCR-003) | type=Role 자동 설정 |
| PATCH /api/v1/groups/:id | `GroupDto` | 그룹 수정 (SCR-004) | - |
| DELETE /api/v1/groups/:id | void (204) | 그룹 상세 (SCR-002) | 소프트 삭제 |
| GET /api/v1/categories?type=Role | `CategoryDto[]` | 카테고리 목록 (SCR-005) | _count.roleClassifications, _count.children, parent 포함 |
| GET /api/v1/categories/:id | `CategoryDto` | 카테고리 상세 (SCR-006) | roleClassifications.role, children include |
| POST /api/v1/categories | `CategoryDto` | 카테고리 등록 (SCR-007) | type=Role 자동 설정 |
| PATCH /api/v1/categories/:id | `CategoryDto` | 카테고리 수정 (SCR-008) | - |
| DELETE /api/v1/categories/:id | void (204) | 카테고리 상세 (SCR-006) | 소프트 삭제 |

---

## L8: UI 컴포넌트

### 반응형 대응

#### 브레이크포인트

| 크기 | 범위 | 대응 방식 | 비고 |
|------|------|----------|------|
| Desktop | >=1280px | 전체 UI 표시 | 기본 레이아웃 |
| Tablet | 768-1279px | 일부 컬럼 숨김 | 생성일 컬럼 등 |
| Mobile | <768px | 카드 뷰 전환 | 테이블 -> 카드 |

---

### 테이블 컬럼 정의

#### 역할 그룹 목록 (SCR-001) DataGrid

| 컬럼명 | 필드 | 필수 | Desktop | Tablet | Mobile | 정렬 | 비고 |
|--------|------|:----:|:-------:|:------:|:------:|:----:|------|
| 이름 | name | O | - | - | - | O | 클릭 시 상세 이동, LinkCell |
| 라벨 | label | O | - | - | - | O | 한글 표시명, DefaultCell |
| 소속 역할 수 | _count.roleAssociations | O | - | - | - | O | NumberCell |
| 생성일 | createdAt | X | O | X | X | O | Desktop만, DateTimeCell |

> `-` = 필수 컬럼 (항상 표시), `O` = 해당 뷰에서 표시, `X` = 숨김

**페이지네이션**: 없음 (역할 그룹 수가 적으므로 전체 목록)

#### 역할 카테고리 목록 (SCR-005) DataGrid

| 컬럼명 | 필드 | 필수 | Desktop | Tablet | Mobile | 정렬 | 비고 |
|--------|------|:----:|:-------:|:------:|:------:|:----:|------|
| 이름 | name | O | - | - | - | O | 클릭 시 상세 이동, LinkCell |
| 상위 카테고리 | parent.name | O | - | - | - | X | 최상위면 '-' 표시, ParentCategoryCell (신규) |
| 분류된 역할 수 | _count.roleClassifications | O | - | - | - | O | NumberCell |
| 하위 카테고리 수 | _count.children | X | O | O | X | O | NumberCell |
| 생성일 | createdAt | X | O | X | X | O | Desktop만, DateTimeCell |

**페이지네이션**: 없음 (역할 카테고리 수가 적으므로 전체 목록)

#### 소속 역할 테이블 (SCR-002, SCR-006 상세 화면 내 인라인)

| 컬럼명 | 필드 | 필수 | 설명 |
|--------|------|:----:|------|
| 역할 식별자 | role.name | O | 클릭 시 /roles/[roleId]로 이동, LinkCell |
| 표시명 | role.displayName | O | DefaultCell |
| 시스템 역할 | role.isSystem | O | BooleanCell |

---

### 상태별 UI

#### 로딩 상태

```
+----------------------------------------+
|  ========================  (스켈레톤)   |
|  ============  ====================     |
|  ==================  ========           |
+----------------------------------------+
```

- **목록 화면**: DataGrid 스켈레톤 행 3-5개
- **상세 화면**: SectionSurface 내 스켈레톤 라인 4-6개
- **폼 화면**: Input 스켈레톤 + 버튼 비활성화

#### 빈 상태 (Empty State)

```
+----------------------------------------+
|                                         |
|         [빈 상자 아이콘]                |
|                                         |
|   "등록된 역할 그룹이 없습니다."       |
|   "새로운 그룹을 등록해보세요."        |
|                                         |
|         [그룹 등록 버튼]                |
|                                         |
+----------------------------------------+
```

- **역할 그룹 목록**: "등록된 역할 그룹이 없습니다."
- **역할 카테고리 목록**: "등록된 역할 카테고리가 없습니다."
- **소속 역할 영역 (상세)**: "이 그룹에 소속된 역할이 없습니다." / "이 카테고리에 분류된 역할이 없습니다."
- **하위 카테고리 영역 (상세)**: "하위 카테고리가 없습니다."

#### 에러 상태

```
+----------------------------------------+
|                                         |
|         [에러 아이콘]                   |
|                                         |
|   "데이터를 불러오지 못했습니다."       |
|   "잠시 후 다시 시도해주세요."          |
|                                         |
|         [재시도 버튼]                   |
|                                         |
+----------------------------------------+
```

#### 삭제 확인 모달

**그룹 삭제 - 소속 역할 있는 경우:**
```
+------------------------------------------+
|  [경고 아이콘]                            |
|                                           |
|  "TRUSTED 그룹을 삭제하시겠습니까?"       |
|  "이 그룹에 2개의 역할이 소속되어         |
|   있습니다. 삭제하면 연결이 해제됩니다."  |
|                                           |
|             [취소]  [삭제]                |
+------------------------------------------+
```

**카테고리 삭제 - 하위 카테고리 있는 경우 (삭제 차단):**
```
+--------------------------------------------+
|  [경고 아이콘]                              |
|                                             |
|  "WORKSPACE 카테고리를 삭제할 수 없습니다." |
|  "하위 카테고리를 먼저 삭제하거나            |
|   이동해주세요."                            |
|                                             |
|              [확인]                         |
+--------------------------------------------+
```

**카테고리 삭제 - 분류된 역할 있는 경우:**
```
+--------------------------------------------+
|  [경고 아이콘]                              |
|                                             |
|  "PLATFORM 카테고리를 삭제하시겠습니까?"    |
|  "이 카테고리에 1개의 역할이 분류되어        |
|   있습니다. 삭제하면 분류가 해제됩니다."    |
|                                             |
|              [취소]  [삭제]                 |
+--------------------------------------------+
```

---

### 폼 필드 상세

#### 역할 그룹 등록/수정 폼 (SCR-003, SCR-004)

| 필드 | 타입 | 필수 | 유효성 검사 | 플레이스홀더 | 비고 |
|------|------|:----:|------------|-------------|------|
| name | TextInput | O | `^[A-Z][A-Z0-9_]*$`, 2-50자 | "ROLE_GROUP_NAME" | 수정 시 readonly |
| label | TextInput | X | 최대 50자 | "한글 표시명을 입력하세요" | - |

**자동 설정 필드**: type은 `Role`로 고정, spaceId는 현재 Space (System Space)

#### 역할 카테고리 등록/수정 폼 (SCR-007, SCR-008)

| 필드 | 타입 | 필수 | 유효성 검사 | 플레이스홀더 | 비고 |
|------|------|:----:|------------|-------------|------|
| name | TextInput | O | `^[A-Z][A-Z0-9_]*$`, 2-50자, unique | "CATEGORY_NAME" | 수정 시 readonly |
| parentId | Select | X | type=Role 카테고리 중 선택, 순환 참조 방지 | "상위 카테고리 선택" | 자기 자신 및 하위 카테고리 제외 |

**자동 설정 필드**: type은 `Role`로 고정, spaceId는 현재 Space (System Space)

**parentId Select 옵션 필터링:**
- 수정 시: 자기 자신 ID와 자신의 모든 하위 카테고리 ID를 제외
- 등록 시: type=Role인 전체 카테고리 목록

---

### 컴포넌트 목록

#### 기존 컴포넌트 재사용

**확인 경로:**
```bash
# UI 컴포넌트
ls packages/fe-ui/src/components/ui/

# Input 컴포넌트
ls packages/fe-ui/src/components/inputs/

# Widget 컴포넌트
ls packages/fe-ui/src/components/widget/

# Feature 컴포넌트
ls packages/fe-ui/src/components/feature/
```

| 컴포넌트 | 유형 | 경로 | 용도 | 사용 화면 |
|----------|------|------|------|----------|
| PageSurface | ui/layouts | `ui/layouts/PageSurface` | 페이지 래퍼 (title, description, actions) | 전체 8개 |
| SectionSurface | ui/layouts | `ui/layouts/SectionSurface` | 섹션 래퍼 (collapsible) | 전체 8개 |
| DataGrid | ui/data-display | `ui/data-display/DataGrid` | 테이블 목록 | SCR-001,005 |
| EmptyState | ui/feedback | `ui/feedback/EmptyState` | 빈 상태 표시 | 목록 화면, 상세 하위 영역 |
| Skeleton | ui/feedback | `ui/feedback/Skeleton` | 로딩 스켈레톤 | 전체 |
| Text | ui/data-display | `ui/data-display/Text` | 텍스트 표시 | 전체 |
| Input | inputs | `inputs/Input` | 텍스트 입력 | 폼 화면 (name, label) |
| Select | inputs | `inputs/Select` | 드롭다운 선택 | 카테고리 폼 (parentId) |
| Button | inputs | `inputs/Button` | 액션 버튼 | 전체 |
| SearchFilterBar | widget | `widget/SearchFilterBar` | 검색/필터 바 | 목록 화면 |
| DetailPanel | widget | `widget/DetailPanel` | 상세 정보 패널 | 상세 화면 |
| MetaDataGrid | feature | `feature/MetaDataGrid` | 메타데이터 그리드 (액션바 포함) | 목록 화면 |
| LinkCell | ui/data-display/cells | `ui/data-display/cells/LinkCell` | 링크 셀 | name (클릭 이동) |
| DefaultCell | ui/data-display/cells | `ui/data-display/cells/DefaultCell` | 기본 텍스트 셀 | label, displayName |
| NumberCell | ui/data-display/cells | `ui/data-display/cells/NumberCell` | 숫자 셀 | _count 필드 |
| DateTimeCell | ui/data-display/cells | `ui/data-display/cells/DateTimeCell` | 날짜/시간 셀 | createdAt |
| BooleanCell | ui/data-display/cells | `ui/data-display/cells/BooleanCell` | Boolean 뱃지 셀 | isSystem |
| Can | ui/permission | `ui/permission/Can` | CASL 권한 체크 래퍼 | 등록/수정/삭제 버튼 |
| DeleteConfirmModal | widget/common | `widget/common/DeleteConfirmModal` | 삭제 확인 모달 (범용) | 상세 화면 삭제 시 |

> **참고**: `DeleteConfirmModal`은 Role 기획(2026-02-14-Role)에서 신규로 정의되었으며, 이 기능에서 재사용합니다.

#### 신규 컴포넌트 필요

##### Cell 컴포넌트 (packages/fe-ui/src/components/ui/data-display/cells/)

| 컴포넌트명 | 경로 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| ParentCategoryCell | `ui/data-display/cells/ParentCategoryCell` | 부모 카테고리명 표시 셀 (없으면 '-') | `fe-cell-builder` |

##### Widget 컴포넌트 (packages/fe-ui/src/components/widget/)

| 컴포넌트명 | 경로 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| GroupInfoSection | `widget/group/GroupInfoSection` | 그룹 기본 정보 섹션 (상세 화면) | `fe-widget-builder` |
| GroupFormSection | `widget/group/GroupFormSection` | 그룹 등록/수정 폼 섹션 | `fe-widget-builder` |
| GroupRoleListSection | `widget/group/GroupRoleListSection` | 그룹 소속 역할 목록 섹션 (읽기 전용) | `fe-widget-builder` |
| CategoryInfoSection | `widget/category/CategoryInfoSection` | 카테고리 기본 정보 섹션 (상세 화면) | `fe-widget-builder` |
| CategoryFormSection | `widget/category/CategoryFormSection` | 카테고리 등록/수정 폼 섹션 | `fe-widget-builder` |
| CategoryRoleListSection | `widget/category/CategoryRoleListSection` | 카테고리 분류 역할 목록 섹션 (읽기 전용) | `fe-widget-builder` |
| CategoryChildrenSection | `widget/category/CategoryChildrenSection` | 하위 카테고리 목록 섹션 (읽기 전용) | `fe-widget-builder` |

---

### 컴포넌트 계층 구조

#### 역할 그룹 목록 (SCR-001: RoleGroupList)

```
Page: RoleGroupListPage
  +-- PageSurface (title="역할 그룹", description="역할의 그룹을 관리합니다", actions=[+ 그룹 등록])
      +-- MetaDataGrid (기존, 검색/필터/DataGrid 통합)
          +-- SearchFilterBar (기존, 검색어 입력)
          +-- SectionSurface (padding="none")
              +-- DataGrid (기존)
                  +-- LinkCell (name, 클릭 시 /roles/groups/[groupId])
                  +-- DefaultCell (label)
                  +-- NumberCell (_count.roleAssociations)
                  +-- DateTimeCell (createdAt)
```

**에이전트**: `fe-page-builder` + `fe-menu-builder` (자동, 목록 페이지)

#### 역할 그룹 상세 (SCR-002: RoleGroupDetail)

```
Page: RoleGroupDetailPage
  +-- PageSurface (title="{name} ({label})", description="역할 그룹 상세 정보", actions=[수정, 삭제])
      +-- SectionSurface "기본 정보"
          +-- GroupInfoSection [신규 Widget]
              +-- DetailPanel (기존)
                  +-- 이름(name), 라벨(label), 유형(type), 생성일, 수정일
      +-- SectionSurface "소속 역할"
          +-- GroupRoleListSection [신규 Widget]
              +-- DataGrid (인라인, 읽기 전용)
                  +-- LinkCell (role.name, 클릭 시 /roles/[roleId])
                  +-- DefaultCell (role.displayName)
                  +-- BooleanCell (role.isSystem)
              +-- EmptyState ("이 그룹에 소속된 역할이 없습니다.")
  +-- DeleteConfirmModal (기존 Widget, 삭제 시)
```

**에이전트**: `fe-page-builder`

#### 역할 그룹 등록 (SCR-003: RoleGroupNew)

```
Page: RoleGroupNewPage
  +-- PageSurface (title="역할 그룹 등록", description="새로운 역할 그룹을 등록합니다")
      +-- SectionSurface "기본 정보"
          +-- GroupFormSection [신규 Widget]
              +-- Input (name, 영문 대문자+_ 필수)
              +-- Input (label, 선택)
      +-- HStack (justify="end")
          +-- Button (취소, variant="flat")
          +-- Button (등록, color="primary")
```

**에이전트**: `fe-page-builder`

#### 역할 그룹 수정 (SCR-004: RoleGroupEdit)

```
Page: RoleGroupEditPage
  +-- 구조 동일 (SCR-003), name readonly, 기존 데이터 prefill
  +-- PageSurface (title="역할 그룹 수정", description="역할 그룹 정보를 수정합니다")
      +-- SectionSurface "기본 정보"
          +-- GroupFormSection [신규 Widget]
              +-- Input (name, readonly)
              +-- Input (label, 수정 가능)
      +-- HStack (justify="end")
          +-- Button (취소, variant="flat")
          +-- Button (저장, color="primary")
```

**에이전트**: `fe-page-builder`

#### 역할 카테고리 목록 (SCR-005: RoleCategoryList)

```
Page: RoleCategoryListPage
  +-- PageSurface (title="역할 카테고리", description="역할의 분류 체계를 관리합니다", actions=[+ 카테고리 등록])
      +-- MetaDataGrid (기존, 검색/필터/DataGrid 통합)
          +-- SearchFilterBar (기존, 검색어 입력)
          +-- SectionSurface (padding="none")
              +-- DataGrid (기존)
                  +-- LinkCell (name, 클릭 시 /roles/categories/[categoryId])
                  +-- ParentCategoryCell (parent.name, '-' 또는 부모명) [신규]
                  +-- NumberCell (_count.roleClassifications)
                  +-- NumberCell (_count.children)
                  +-- DateTimeCell (createdAt)
```

**에이전트**: `fe-page-builder` + `fe-menu-builder` (자동, 목록 페이지)

#### 역할 카테고리 상세 (SCR-006: RoleCategoryDetail)

```
Page: RoleCategoryDetailPage
  +-- PageSurface (title="{name}", description="역할 카테고리 상세 정보", actions=[수정, 삭제])
      +-- SectionSurface "기본 정보"
          +-- CategoryInfoSection [신규 Widget]
              +-- DetailPanel (기존)
                  +-- 이름(name), 유형(type), 상위 카테고리(parent.name, 링크), 생성일, 수정일
      +-- SectionSurface "분류된 역할"
          +-- CategoryRoleListSection [신규 Widget]
              +-- DataGrid (인라인, 읽기 전용)
                  +-- LinkCell (role.name, 클릭 시 /roles/[roleId])
                  +-- DefaultCell (role.displayName)
                  +-- BooleanCell (role.isSystem)
              +-- EmptyState ("이 카테고리에 분류된 역할이 없습니다.")
      +-- SectionSurface "하위 카테고리"
          +-- CategoryChildrenSection [신규 Widget]
              +-- DataGrid (인라인, 읽기 전용)
                  +-- LinkCell (child.name, 클릭 시 /roles/categories/[categoryId])
                  +-- NumberCell (child._count.roleClassifications)
              +-- EmptyState ("하위 카테고리가 없습니다.")
  +-- DeleteConfirmModal (기존 Widget, 삭제 시)
```

**에이전트**: `fe-page-builder`

#### 역할 카테고리 등록 (SCR-007: RoleCategoryNew)

```
Page: RoleCategoryNewPage
  +-- PageSurface (title="역할 카테고리 등록", description="새로운 역할 카테고리를 등록합니다")
      +-- SectionSurface "기본 정보"
          +-- CategoryFormSection [신규 Widget]
              +-- Input (name, 영문 대문자+_ 필수)
              +-- Select (parentId, type=Role 카테고리 목록)
      +-- HStack (justify="end")
          +-- Button (취소, variant="flat")
          +-- Button (등록, color="primary")
```

**에이전트**: `fe-page-builder`

#### 역할 카테고리 수정 (SCR-008: RoleCategoryEdit)

```
Page: RoleCategoryEditPage
  +-- 구조 동일 (SCR-007), name readonly, 기존 데이터 prefill
  +-- PageSurface (title="역할 카테고리 수정", description="역할 카테고리 정보를 수정합니다")
      +-- SectionSurface "기본 정보"
          +-- CategoryFormSection [신규 Widget]
              +-- Input (name, readonly)
              +-- Select (parentId, 자기 자신 및 하위 카테고리 제외)
      +-- HStack (justify="end")
          +-- Button (취소, variant="flat")
          +-- Button (저장, color="primary")
```

**에이전트**: `fe-page-builder`

---

### 컴포넌트 유형 분류 기준

```
신규 컴포넌트가 필요할 때:
  |
Store 연동이 필요한가?
  +-- Yes -> feature (해당 없음 - 이 기능은 단순 CRUD)
  +-- No
       |
     입력을 받는가? (value/onChange)
       +-- Yes -> inputs (해당 없음 - 기존 Input/Select 재사용)
       +-- No
            |
          특정 도메인 데이터 구조에 맞춤?
            +-- Yes -> widget (GroupInfoSection, CategoryFormSection 등)
            +-- No
                 |
               DataGrid 셀 렌더링?
                 +-- Yes -> cell (ParentCategoryCell)
                 +-- No -> ui (해당 없음)
```

---

### 에이전트별 작업 매핑

#### Stage 4: 컴포넌트 구현 순서

| 순서 | 에이전트 | 대상 컴포넌트 | 설명 |
|------|----------|-------------|------|
| 1 | `fe-cell-builder` | ParentCategoryCell | DataGrid 셀 컴포넌트 1개 |
| 2 | `fe-widget-builder` | GroupInfoSection, GroupFormSection, GroupRoleListSection, CategoryInfoSection, CategoryFormSection, CategoryRoleListSection, CategoryChildrenSection | Widget 컴포넌트 7개 |

> **참고**: 이 기능은 Store 연동 Feature가 불필요합니다. 단순 CRUD 패턴이므로 Page에서 직접 Orval 훅을 사용합니다.

#### Stage 5: 페이지 통합 순서

| 순서 | 페이지 | 경로 | 에이전트 |
|------|--------|------|----------|
| 1 | RoleGroupList | /roles/groups | `fe-page-builder` + `fe-menu-builder` (자동) |
| 2 | RoleGroupDetail | /roles/groups/[groupId] | `fe-page-builder` |
| 3 | RoleGroupNew | /roles/groups/new | `fe-page-builder` |
| 4 | RoleGroupEdit | /roles/groups/[groupId]/edit | `fe-page-builder` |
| 5 | RoleCategoryList | /roles/categories | `fe-page-builder` + `fe-menu-builder` (자동) |
| 6 | RoleCategoryDetail | /roles/categories/[categoryId] | `fe-page-builder` |
| 7 | RoleCategoryNew | /roles/categories/new | `fe-page-builder` |
| 8 | RoleCategoryEdit | /roles/categories/[categoryId]/edit | `fe-page-builder` |

---

### 동적 동작 상세

#### 그룹 삭제 플로우 (SCR-002)

```
1. 삭제 버튼 클릭
   |
2. 소속 역할 수 확인 (_count.roleAssociations)
   +-- 0개: 단순 확인 모달 ("삭제하시겠습니까?")
   +-- N개: 경고 모달 ("N개의 역할이 소속되어 있습니다. 삭제하면 연결이 해제됩니다.")
   |
3. 확인 클릭
   -> DELETE /api/v1/groups/:id 호출
   -> 성공 시 /roles/groups 목록으로 이동
   -> 실패 시 에러 토스트 표시
```

#### 카테고리 삭제 플로우 (SCR-006)

```
1. 삭제 버튼 클릭
   |
2. 하위 카테고리 수 확인 (_count.children)
   +-- 1개 이상: 삭제 차단 모달 ("하위 카테고리를 먼저 삭제해주세요.") -> 종료
   +-- 0개: 다음 단계로
   |
3. 분류된 역할 수 확인 (_count.roleClassifications)
   +-- 0개: 단순 확인 모달 ("삭제하시겠습니까?")
   +-- N개: 경고 모달 ("N개의 역할이 분류되어 있습니다. 삭제하면 분류가 해제됩니다.")
   |
4. 확인 클릭
   -> DELETE /api/v1/categories/:id 호출
   -> 성공 시 /roles/categories 목록으로 이동
   -> 실패 시 에러 토스트 표시
```

#### 카테고리 수정 시 parentId 순환 참조 방지 (SCR-008)

```
1. 카테고리 수정 화면 진입
   |
2. 전체 type=Role 카테고리 목록 조회
   -> GET /api/v1/categories?type=Role
   |
3. parentId Select 옵션 필터링
   - 자기 자신 ID 제외
   - 자신의 모든 하위 카테고리 ID 제외 (재귀적으로 children 탐색)
   |
4. 필터링된 카테고리만 Select 옵션으로 표시
   + "선택 안 함" 옵션 (최상위로 이동)
```

---

## Requirement Graph (L7-L8)

```json
{
  "level_range": "L7-L8",
  "nodes": [
    { "id": "RGC-L7-ENT-001", "level": 7, "subLevel": "1", "type": "entity", "name": "Group", "description": "그룹 엔티티 (범용, type=Role 필터)", "metadata": { "tableName": "groups" } },
    { "id": "RGC-L7-ENT-002", "level": 7, "subLevel": "1", "type": "entity", "name": "Category", "description": "카테고리 엔티티 (범용, type=Role 필터, 트리 구조)", "metadata": { "tableName": "categories" } },
    { "id": "RGC-L7-ENT-003", "level": 7, "subLevel": "1", "type": "entity", "name": "RoleAssociation", "description": "역할-그룹 연결 테이블", "metadata": { "tableName": "role_associations" } },
    { "id": "RGC-L7-ENT-004", "level": 7, "subLevel": "1", "type": "entity", "name": "RoleClassification", "description": "역할-카테고리 연결 테이블", "metadata": { "tableName": "role_classifications" } },
    { "id": "RGC-L7-ENT-005", "level": 7, "subLevel": "1", "type": "entity", "name": "Role", "description": "역할 엔티티 (참조용)", "metadata": { "tableName": "roles" } },

    { "id": "RGC-L7-FLD-001", "level": 7, "subLevel": "2", "type": "entity", "name": "Group.id", "description": "그룹 고유 식별자", "metadata": { "fieldType": "UUID", "constraints": ["pk", "required"], "defaultValue": "uuid()" } },
    { "id": "RGC-L7-FLD-002", "level": 7, "subLevel": "2", "type": "entity", "name": "Group.name", "description": "그룹 이름 (예: TRUSTED)", "metadata": { "fieldType": "String", "constraints": ["required"] } },
    { "id": "RGC-L7-FLD-003", "level": 7, "subLevel": "2", "type": "entity", "name": "Group.type", "description": "그룹 유형 (Role 고정)", "metadata": { "fieldType": "Enum", "constraints": ["required"], "defaultValue": "User", "enumValues": ["Role", "Space", "File", "User"] } },
    { "id": "RGC-L7-FLD-004", "level": 7, "subLevel": "2", "type": "entity", "name": "Group.label", "description": "한글 표시명", "metadata": { "fieldType": "String", "constraints": ["optional"] } },
    { "id": "RGC-L7-FLD-005", "level": 7, "subLevel": "2", "type": "entity", "name": "Group.spaceId", "description": "소속 Space ID", "metadata": { "fieldType": "UUID", "constraints": ["fk", "required", "index"], "references": "Space.id" } },
    { "id": "RGC-L7-FLD-006", "level": 7, "subLevel": "2", "type": "entity", "name": "Group.creatorId", "description": "생성자 ID", "metadata": { "fieldType": "UUID", "constraints": ["fk", "optional"], "references": "User.id" } },

    { "id": "RGC-L7-FLD-010", "level": 7, "subLevel": "2", "type": "entity", "name": "Category.id", "description": "카테고리 고유 식별자", "metadata": { "fieldType": "UUID", "constraints": ["pk", "required"], "defaultValue": "uuid()" } },
    { "id": "RGC-L7-FLD-011", "level": 7, "subLevel": "2", "type": "entity", "name": "Category.name", "description": "카테고리 이름 (예: PLATFORM)", "metadata": { "fieldType": "String", "constraints": ["unique", "required"] } },
    { "id": "RGC-L7-FLD-012", "level": 7, "subLevel": "2", "type": "entity", "name": "Category.type", "description": "카테고리 유형 (Role 고정)", "metadata": { "fieldType": "Enum", "constraints": ["required"], "defaultValue": "User", "enumValues": ["Role", "Space", "File", "User"] } },
    { "id": "RGC-L7-FLD-013", "level": 7, "subLevel": "2", "type": "entity", "name": "Category.parentId", "description": "부모 카테고리 ID (self-reference)", "metadata": { "fieldType": "UUID", "constraints": ["fk", "optional"], "references": "Category.id" } },
    { "id": "RGC-L7-FLD-014", "level": 7, "subLevel": "2", "type": "entity", "name": "Category.spaceId", "description": "소속 Space ID", "metadata": { "fieldType": "UUID", "constraints": ["fk", "required", "index"], "references": "Space.id" } },
    { "id": "RGC-L7-FLD-015", "level": 7, "subLevel": "2", "type": "entity", "name": "Category.creatorId", "description": "생성자 ID", "metadata": { "fieldType": "UUID", "constraints": ["fk", "optional"], "references": "User.id" } },

    { "id": "RGC-L7-FLD-020", "level": 7, "subLevel": "2", "type": "entity", "name": "RoleAssociation.id", "description": "연결 고유 식별자", "metadata": { "fieldType": "UUID", "constraints": ["pk", "required"], "defaultValue": "uuid()" } },
    { "id": "RGC-L7-FLD-021", "level": 7, "subLevel": "2", "type": "entity", "name": "RoleAssociation.roleId", "description": "역할 ID (1:1 제약)", "metadata": { "fieldType": "UUID", "constraints": ["fk", "unique", "required"], "references": "Role.id" } },
    { "id": "RGC-L7-FLD-022", "level": 7, "subLevel": "2", "type": "entity", "name": "RoleAssociation.groupId", "description": "그룹 ID", "metadata": { "fieldType": "UUID", "constraints": ["fk", "required"], "references": "Group.id" } },

    { "id": "RGC-L7-FLD-030", "level": 7, "subLevel": "2", "type": "entity", "name": "RoleClassification.id", "description": "분류 고유 식별자", "metadata": { "fieldType": "UUID", "constraints": ["pk", "required"], "defaultValue": "uuid()" } },
    { "id": "RGC-L7-FLD-031", "level": 7, "subLevel": "2", "type": "entity", "name": "RoleClassification.roleId", "description": "역할 ID (1:1 제약)", "metadata": { "fieldType": "UUID", "constraints": ["fk", "unique", "required"], "references": "Role.id" } },
    { "id": "RGC-L7-FLD-032", "level": 7, "subLevel": "2", "type": "entity", "name": "RoleClassification.categoryId", "description": "카테고리 ID", "metadata": { "fieldType": "UUID", "constraints": ["fk", "required"], "references": "Category.id" } },

    { "id": "RGC-L8-CMP-001", "level": 8, "subLevel": "2", "type": "component", "name": "ParentCategoryCell", "description": "부모 카테고리명 표시 셀 (없으면 '-')", "metadata": { "componentType": "ui", "props": { "parentName": "string | null" }, "existing": false, "path": "packages/fe-ui/src/components/ui/data-display/cells/ParentCategoryCell" } },
    { "id": "RGC-L8-CMP-002", "level": 8, "subLevel": "2", "type": "component", "name": "GroupInfoSection", "description": "그룹 기본 정보 섹션 (상세 화면)", "metadata": { "componentType": "widgets", "props": { "group": "GroupDto" }, "existing": false, "path": "packages/fe-ui/src/components/widget/group/GroupInfoSection" } },
    { "id": "RGC-L8-CMP-003", "level": 8, "subLevel": "2", "type": "component", "name": "GroupFormSection", "description": "그룹 등록/수정 폼 섹션", "metadata": { "componentType": "widgets", "props": { "mode": "'create' | 'edit'", "defaultValues": "Partial<GroupDto>", "onSubmit": "(data: CreateGroupDto) => void", "isLoading": "boolean" }, "existing": false, "path": "packages/fe-ui/src/components/widget/group/GroupFormSection" } },
    { "id": "RGC-L8-CMP-004", "level": 8, "subLevel": "2", "type": "component", "name": "GroupRoleListSection", "description": "그룹 소속 역할 목록 섹션 (읽기 전용)", "metadata": { "componentType": "widgets", "props": { "roleAssociations": "RoleAssociationDto[]", "isLoading": "boolean" }, "existing": false, "path": "packages/fe-ui/src/components/widget/group/GroupRoleListSection" } },
    { "id": "RGC-L8-CMP-005", "level": 8, "subLevel": "2", "type": "component", "name": "CategoryInfoSection", "description": "카테고리 기본 정보 섹션 (상세 화면)", "metadata": { "componentType": "widgets", "props": { "category": "CategoryDto" }, "existing": false, "path": "packages/fe-ui/src/components/widget/category/CategoryInfoSection" } },
    { "id": "RGC-L8-CMP-006", "level": 8, "subLevel": "2", "type": "component", "name": "CategoryFormSection", "description": "카테고리 등록/수정 폼 섹션", "metadata": { "componentType": "widgets", "props": { "mode": "'create' | 'edit'", "defaultValues": "Partial<CategoryDto>", "categories": "CategoryDto[]", "excludeIds": "string[]", "onSubmit": "(data: CreateCategoryDto) => void", "isLoading": "boolean" }, "existing": false, "path": "packages/fe-ui/src/components/widget/category/CategoryFormSection" } },
    { "id": "RGC-L8-CMP-007", "level": 8, "subLevel": "2", "type": "component", "name": "CategoryRoleListSection", "description": "카테고리 분류 역할 목록 섹션 (읽기 전용)", "metadata": { "componentType": "widgets", "props": { "roleClassifications": "RoleClassificationDto[]", "isLoading": "boolean" }, "existing": false, "path": "packages/fe-ui/src/components/widget/category/CategoryRoleListSection" } },
    { "id": "RGC-L8-CMP-008", "level": 8, "subLevel": "2", "type": "component", "name": "CategoryChildrenSection", "description": "하위 카테고리 목록 섹션 (읽기 전용)", "metadata": { "componentType": "widgets", "props": { "children": "CategoryDto[]", "isLoading": "boolean" }, "existing": false, "path": "packages/fe-ui/src/components/widget/category/CategoryChildrenSection" } }
  ],
  "edges": [
    { "id": "e-701", "source": "RGC-L7-ENT-001", "target": "RGC-L7-FLD-001", "type": "parent" },
    { "id": "e-702", "source": "RGC-L7-ENT-001", "target": "RGC-L7-FLD-002", "type": "parent" },
    { "id": "e-703", "source": "RGC-L7-ENT-001", "target": "RGC-L7-FLD-003", "type": "parent" },
    { "id": "e-704", "source": "RGC-L7-ENT-001", "target": "RGC-L7-FLD-004", "type": "parent" },
    { "id": "e-705", "source": "RGC-L7-ENT-001", "target": "RGC-L7-FLD-005", "type": "parent" },
    { "id": "e-706", "source": "RGC-L7-ENT-001", "target": "RGC-L7-FLD-006", "type": "parent" },

    { "id": "e-710", "source": "RGC-L7-ENT-002", "target": "RGC-L7-FLD-010", "type": "parent" },
    { "id": "e-711", "source": "RGC-L7-ENT-002", "target": "RGC-L7-FLD-011", "type": "parent" },
    { "id": "e-712", "source": "RGC-L7-ENT-002", "target": "RGC-L7-FLD-012", "type": "parent" },
    { "id": "e-713", "source": "RGC-L7-ENT-002", "target": "RGC-L7-FLD-013", "type": "parent" },
    { "id": "e-714", "source": "RGC-L7-ENT-002", "target": "RGC-L7-FLD-014", "type": "parent" },
    { "id": "e-715", "source": "RGC-L7-ENT-002", "target": "RGC-L7-FLD-015", "type": "parent" },

    { "id": "e-720", "source": "RGC-L7-ENT-003", "target": "RGC-L7-FLD-020", "type": "parent" },
    { "id": "e-721", "source": "RGC-L7-ENT-003", "target": "RGC-L7-FLD-021", "type": "parent" },
    { "id": "e-722", "source": "RGC-L7-ENT-003", "target": "RGC-L7-FLD-022", "type": "parent" },

    { "id": "e-730", "source": "RGC-L7-ENT-004", "target": "RGC-L7-FLD-030", "type": "parent" },
    { "id": "e-731", "source": "RGC-L7-ENT-004", "target": "RGC-L7-FLD-031", "type": "parent" },
    { "id": "e-732", "source": "RGC-L7-ENT-004", "target": "RGC-L7-FLD-032", "type": "parent" },

    { "id": "e-740", "source": "RGC-L7-ENT-003", "target": "RGC-L7-ENT-001", "type": "depends", "label": "Group 참조 (FK)" },
    { "id": "e-741", "source": "RGC-L7-ENT-003", "target": "RGC-L7-ENT-005", "type": "depends", "label": "Role 참조 (FK)" },
    { "id": "e-742", "source": "RGC-L7-ENT-004", "target": "RGC-L7-ENT-002", "type": "depends", "label": "Category 참조 (FK)" },
    { "id": "e-743", "source": "RGC-L7-ENT-004", "target": "RGC-L7-ENT-005", "type": "depends", "label": "Role 참조 (FK)" },
    { "id": "e-744", "source": "RGC-L7-ENT-002", "target": "RGC-L7-ENT-002", "type": "depends", "label": "자기 참조 (parent/children)" },

    { "id": "e-801", "source": "RGC-L4-SCR-001", "target": "RGC-L8-CMP-002", "type": "uses", "label": "GroupInfoSection 참조 (기반 데이터)" },
    { "id": "e-802", "source": "RGC-L4-SCR-002", "target": "RGC-L8-CMP-002", "type": "uses", "label": "GroupInfoSection 사용" },
    { "id": "e-803", "source": "RGC-L4-SCR-002", "target": "RGC-L8-CMP-004", "type": "uses", "label": "GroupRoleListSection 사용" },
    { "id": "e-804", "source": "RGC-L4-SCR-003", "target": "RGC-L8-CMP-003", "type": "uses", "label": "GroupFormSection 사용" },
    { "id": "e-805", "source": "RGC-L4-SCR-004", "target": "RGC-L8-CMP-003", "type": "uses", "label": "GroupFormSection 사용" },
    { "id": "e-806", "source": "RGC-L4-SCR-005", "target": "RGC-L8-CMP-001", "type": "uses", "label": "ParentCategoryCell 사용" },
    { "id": "e-807", "source": "RGC-L4-SCR-006", "target": "RGC-L8-CMP-005", "type": "uses", "label": "CategoryInfoSection 사용" },
    { "id": "e-808", "source": "RGC-L4-SCR-006", "target": "RGC-L8-CMP-007", "type": "uses", "label": "CategoryRoleListSection 사용" },
    { "id": "e-809", "source": "RGC-L4-SCR-006", "target": "RGC-L8-CMP-008", "type": "uses", "label": "CategoryChildrenSection 사용" },
    { "id": "e-810", "source": "RGC-L4-SCR-007", "target": "RGC-L8-CMP-006", "type": "uses", "label": "CategoryFormSection 사용" },
    { "id": "e-811", "source": "RGC-L4-SCR-008", "target": "RGC-L8-CMP-006", "type": "uses", "label": "CategoryFormSection 사용" }
  ]
}
```

---

## 품질 체크리스트

### L7 체크리스트

- [x] 모든 API가 참조하는 엔티티가 정의되었는가? (Group, Category, RoleAssociation, RoleClassification, Role)
- [x] 필수 필드(id, createdAt, updatedAt)가 포함되었는가?
- [x] 필드 타입이 명시되었는가? (UUID, String, Enum, DateTime)
- [x] 제약조건(unique, required, FK 등)이 정의되었는가?
- [x] 엔티티 간 관계가 정의되었는가? (Group-RoleAssociation-Role, Category-RoleClassification-Role, Category self-reference)
- [x] 기존 Prisma 스키마와 DTO 구조가 일치하는가? (신규 모델 없음, 기존 모델 활용)

### L8 체크리스트

- [x] 모든 8개 화면에 필요한 컴포넌트가 식별되었는가?
- [x] 재사용 가능한 기존 컴포넌트가 확인되었는가? (19개 기존 컴포넌트)
- [x] 컴포넌트 유형(ui/inputs/widgets/features)이 분류되었는가?
- [x] 필수 Props가 정의되었는가?
- [x] 각 컴포넌트의 담당 에이전트가 매핑되었는가?
- [x] 컴포넌트 계층 구조(Pure UI -> Widget -> Feature -> Page)가 준수되었는가?
- [x] 상태별 UI(로딩/빈/에러)가 정의되었는가?
- [x] 동적 동작(삭제 플로우, 순환 참조 방지)이 상세히 기술되었는가?

---

## 컴포넌트 수량 요약

| 유형 | 기존 재사용 | 신규 개발 | 합계 |
|------|:---------:|:--------:|:----:|
| Pure UI (ui) | 5 (PageSurface, SectionSurface, DataGrid, EmptyState, Skeleton, Text) | 0 | 5 |
| Cell (ui/cells) | 5 (LinkCell, DefaultCell, NumberCell, DateTimeCell, BooleanCell) | 1 (ParentCategoryCell) | 6 |
| Input (inputs) | 3 (Input, Select, Button) | 0 | 3 |
| Widget (widget) | 4 (SearchFilterBar, DetailPanel, DeleteConfirmModal, HStack) | 7 (GroupInfoSection, GroupFormSection, GroupRoleListSection, CategoryInfoSection, CategoryFormSection, CategoryRoleListSection, CategoryChildrenSection) | 11 |
| Feature (feature) | 1 (MetaDataGrid) | 0 | 1 |
| Permission (ui/permission) | 1 (Can) | 0 | 1 |
| Store | 0 | 0 | 0 |
| **합계** | **19** | **8** | **27** |

> 이 기능은 단순 CRUD 패턴으로, 기존 컴포넌트를 최대한 재사용하며 도메인 특화 Widget만 신규 개발합니다. Store 연동 Feature나 신규 Input 컴포넌트는 불필요합니다.
