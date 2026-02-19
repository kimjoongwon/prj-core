# 04. UI 상세 (L7-L8)

## 이전 레이어 요약

- **L0 Context**: CASL 기반 RBAC+ABAC 권한 관리 시스템의 관리 UI
- **L1 Actor**: 최고 관리자(FULL_ACCESS), 일반 관리자(MANAGE), 조회 사용자(VIEW)
- **L3 Feature 21개**: Role(7), Ability(6), Action(6), Subject(2)
- **L4 Screen 14개**: Role(4), Ability(4), Action(4), Subject(2)

---

## L7: 데이터 모델 (Entity)

### 엔티티 개요

기존 Prisma 스키마 기반으로 프론트엔드에서 사용하는 데이터 모델을 정의합니다.

| 엔티티 | DB 테이블 | 설명 | DTO |
|--------|-----------|------|-----|
| Role | roles | 역할 | `RoleDto` |
| RoleAssociation | role_associations | 역할-그룹 연결 | `RoleAssociationDto` |
| RoleClassification | role_classifications | 역할-카테고리 연결 | `RoleClassificationDto` |
| Ability | abilities | 권한 정의 (Subject + Action) | `AbilityDto` |
| Grant | grants | 권한 부여 (다형성 BRIDGE) | `GrantResponseDto` |
| Action | actions | 행위 정의 | `ActionDto` |
| Subject | subjects | 권한 대상 | `SubjectDto` |
| Category | categories | 분류 체계 | `CategoryDto` |
| Group | groups | 그룹핑 체계 | `GroupDto` |

### 엔티티 필드 매트릭스

#### Role

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| name | String | unique, required | 역할 식별자 (영문 대문자+언더스코어) |
| displayName | String | optional | 한글 표시명 |
| description | String | optional | 역할 설명 |
| isSystem | Boolean | required, default(false) | 시스템 역할 여부 (수정/삭제 불가) |
| createdAt | DateTime | required, default(now()) | 생성 일시 |
| updatedAt | DateTime | optional | 수정 일시 |
| removedAt | DateTime | optional | 소프트 삭제 일시 |

**중첩 관계:**
- `classification?: RoleClassificationDto` - 1:1 카테고리 연결
- `associations?: RoleAssociationDto[]` - 1:N 그룹 연결

#### RoleAssociation

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| roleId | UUID | FK -> Role, unique, required | 역할 ID |
| groupId | UUID | FK -> Group, required | 그룹 ID |
| createdAt | DateTime | required | 생성 일시 |

**중첩 관계:**
- `group?: GroupDto` - N:1 그룹 정보

#### RoleClassification

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| roleId | UUID | FK -> Role, unique, required | 역할 ID |
| categoryId | UUID | FK -> Category, required | 카테고리 ID |
| createdAt | DateTime | required | 생성 일시 |

**중첩 관계:**
- `category?: CategoryDto` - N:1 카테고리 정보

#### Ability

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| name | String | unique, required | 권한 이름 (예: "Read User Email Masked") |
| description | String | optional | 권한 설명 |
| subjectId | UUID | FK -> Subject, required, index | Subject FK |
| actionId | UUID | FK -> Action, required, index | Action FK |
| fields | String[] | required, default([]) | 대상 필드 목록 (빈 배열 = 전체) |
| conditions | Json | optional | ABAC 조건 JSON |
| inverted | Boolean | required, default(false) | 거부 여부 (true = cannot) |
| reason | String | optional | 거부 사유 (inverted 시) |
| createdAt | DateTime | required | 생성 일시 |
| updatedAt | DateTime | optional | 수정 일시 |
| removedAt | DateTime | optional | 소프트 삭제 일시 |

**중첩 관계:**
- `subject?: SubjectSummaryDto` - N:1 Subject 정보
- `action?: ActionDto` - N:1 Action 정보
- `priority?: number` - Grant 경유 시 우선순위

#### Grant

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| granteeType | String | required | "Role" 또는 "User" |
| granteeId | UUID | required | Role ID 또는 User ID |
| abilityId | UUID | FK -> Ability, required, index | 권한 ID |
| isActive | Boolean | required, default(true) | 활성화 여부 |
| priority | Int | required, default(0) | 우선순위 (Role: 0-9, User: 10+) |
| createdAt | DateTime | required | 생성 일시 |
| updatedAt | DateTime | optional | 수정 일시 |
| removedAt | DateTime | optional | 소프트 삭제 일시 |

**중첩 관계:**
- `ability?: AbilityResponseDto` - N:1 Ability 상세

#### Action

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| name | String | unique, required | 행위 식별자 (예: "read:masked:email") |
| displayName | String | optional | 한글 표시명 |
| description | String | optional | 행위 설명 |
| group | String | optional, index | 분류 (crud/visibility/workflow/bulk) |
| order | Int | required, default(0) | UI 정렬 순서 |
| isSystem | Boolean | required, default(true) | 시스템 Action 여부 |
| config | Json | optional | 마스킹/변환 설정 JSON |
| createdAt | DateTime | required | 생성 일시 |
| updatedAt | DateTime | optional | 수정 일시 |
| removedAt | DateTime | optional | 소프트 삭제 일시 |

#### Subject

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, required | 고유 식별자 |
| name | String | unique, required | 대상 식별자 (예: "entity:User") |
| displayName | String | optional | 한글 표시명 |
| icon | String | optional | 아이콘 식별자 |
| group | String | optional, index | 분류 (entity/menu/feature/ui) |
| order | Int | required, default(0) | UI 정렬 순서 |
| isSystem | Boolean | required, default(true) | Prisma 모델 기반 여부 |
| createdAt | DateTime | required | 생성 일시 |
| updatedAt | DateTime | optional | 수정 일시 |
| removedAt | DateTime | optional | 소프트 삭제 일시 |

#### SubjectField (DMMF 기반, 별도 테이블 없음)

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| name | String | required | Prisma 모델 필드명 |
| displayName | String | optional | 한글 표시명 |
| type | String | required | 필드 타입 (String, Int, DateTime 등) |
| isRequired | Boolean | required | 필수 필드 여부 |
| isRelation | Boolean | required | 관계 필드 여부 |

### 엔티티 관계 다이어그램

```
Role (1) ──── (0..1) RoleClassification ──── (1) Category
Role (1) ──── (0..*) RoleAssociation ──── (1) Group
Role (1) ──── (0..*) Grant ──── (1) Ability
Ability (N) ──── (1) Subject
Ability (N) ──── (1) Action
Grant (다형성) ──── Role | User
```

### API 응답 타입 매핑

| API | 응답 DTO | 관련 화면 |
|-----|----------|----------|
| GET /api/v1/roles | `RoleDto[]` | 역할 목록 (SCR-001) |
| GET /api/v1/roles/:id | `RoleDto` | 역할 상세 (SCR-002) |
| POST /api/v1/roles | `RoleDto` | 역할 등록 (SCR-003) |
| PATCH /api/v1/roles/:id | `RoleDto` | 역할 수정 (SCR-004) |
| DELETE /api/v1/roles/:id | void (204) | 역할 상세 (SCR-002) |
| GET /api/v1/abilities | `AbilityDto[]` + meta | 권한 정의 목록 (SCR-005) |
| GET /api/v1/abilities/:id | `AbilityDto` | 권한 정의 상세 (SCR-006) |
| POST /api/v1/abilities | `AbilityDto` | 권한 정의 등록 (SCR-007) |
| PATCH /api/v1/abilities/:id | `AbilityDto` | 권한 정의 수정 (SCR-008) |
| DELETE /api/v1/abilities/:id | void (204) | 권한 정의 상세 (SCR-006) |
| GET /api/v1/abilities/roles/:roleId | `AbilityDto[]` | 역할 상세 (SCR-002, Grant 영역) |
| PUT /api/v1/grants/roles/:roleId | `GrantResponseDto[]` | 역할 상세 (SCR-002, Grant 배치 저장) |
| GET /api/v1/actions | `ActionDto[]` | 행위 목록 (SCR-009) |
| GET /api/v1/actions/:id | `ActionDto` | 행위 상세 (SCR-010) |
| POST /api/v1/actions | `ActionDto` | 행위 등록 (SCR-011) |
| PATCH /api/v1/actions/:id | `ActionDto` | 행위 수정 (SCR-012) |
| DELETE /api/v1/actions/:id | void (204) | 행위 상세 (SCR-010) |
| GET /api/v1/subjects | `SubjectDto[]` | 대상 목록 (SCR-013) |
| GET /api/v1/subjects/:id | `SubjectDto` | 대상 상세 (SCR-014) |
| GET /api/v1/subjects/:id/fields | `SubjectFieldDto[]` | 대상 상세 (SCR-014), 권한 정의 등록 (SCR-007) |

---

## L8: UI 컴포넌트

### 반응형 대응

#### 브레이크포인트

| 크기 | 범위 | 대응 방식 | 비고 |
|------|------|----------|------|
| Desktop | >=1280px | 전체 UI 표시 | 기본 레이아웃 |
| Tablet | 768-1279px | 일부 컬럼 숨김 | 설명 컬럼 등 |
| Mobile | <768px | 카드 뷰 전환 | 테이블 -> 카드 |

---

### 테이블 컬럼 정의

#### 역할 목록 (SCR-001) DataGrid

| 컬럼명 | 필드 | 필수 | Desktop | Tablet | Mobile | 정렬 | 비고 |
|--------|------|:----:|:-------:|:------:|:------:|:----:|------|
| 역할 식별자 | name | O | - | - | - | O | 항상 표시, 클릭 시 상세 이동 |
| 표시명 | displayName | O | - | - | - | O | 항상 표시 |
| 설명 | description | X | O | X | X | X | Desktop만, 말줄임 |
| 카테고리 | classification.category.name | X | O | O | X | X | RoleClassification 경유 |
| 그룹 | associations[0].group.name | X | O | O | X | X | RoleAssociation 경유 |
| 시스템 | isSystem | O | - | - | - | X | Badge 표시 |
| 생성일 | createdAt | X | O | X | X | O | Desktop만 |

> `-` = 필수 컬럼 (항상 표시), `O` = 해당 뷰에서 표시, `X` = 숨김

#### 권한 정의 목록 (SCR-005) DataGrid

| 컬럼명 | 필드 | 필수 | Desktop | Tablet | Mobile | 정렬 | 비고 |
|--------|------|:----:|:-------:|:------:|:------:|:----:|------|
| 이름 | name | O | - | - | - | O | 클릭 시 상세 이동 |
| Subject | subject.displayName | O | - | - | - | X | Subject 표시명 |
| Action | action.displayName | O | - | - | - | X | Action 표시명 |
| 거부 | inverted | O | - | - | - | X | can/cannot Badge |
| 조건 | conditions | X | O | O | X | X | 조건 유무 Badge |
| 필드 제한 | fields | X | O | O | X | X | 필드 수 Badge |
| 생성일 | createdAt | X | O | X | X | O | Desktop만 |

#### 행위 목록 (SCR-009) DataGrid

| 컬럼명 | 필드 | 필수 | Desktop | Tablet | Mobile | 정렬 | 비고 |
|--------|------|:----:|:-------:|:------:|:------:|:----:|------|
| 이름 | name | O | - | - | - | O | 클릭 시 상세 이동 |
| 표시명 | displayName | O | - | - | - | O | 항상 표시 |
| 그룹 | group | O | - | - | - | X | crud/visibility/workflow Chip |
| 설정 | config | X | O | O | X | X | 설정 유무 Badge |
| 시스템 | isSystem | O | - | - | - | X | Badge 표시 |
| 정렬 순서 | order | X | O | X | X | O | Desktop만 |

#### 대상 목록 (SCR-013) DataGrid

| 컬럼명 | 필드 | 필수 | Desktop | Tablet | Mobile | 정렬 | 비고 |
|--------|------|:----:|:-------:|:------:|:------:|:----:|------|
| 이름 | name | O | - | - | - | O | 클릭 시 상세 이동 |
| 표시명 | displayName | O | - | - | - | O | 항상 표시 |
| 그룹 | group | O | - | - | - | X | entity/menu/feature/ui Chip |
| 아이콘 | icon | X | O | O | X | X | 아이콘 표시 |
| 시스템 | isSystem | O | - | - | - | X | Badge |
| 정렬 순서 | order | X | O | X | X | O | Desktop만 |

#### Grant 배치 할당 테이블 (SCR-002 내 인라인)

| 컬럼명 | 필드 | 필수 | 설명 |
|--------|------|:----:|------|
| Ability 이름 | ability.name | O | 권한 정의명 |
| Subject | ability.subject.displayName | O | 대상 표시명 |
| Action | ability.action.displayName | O | 행위 표시명 |
| 활성화 | isActive | O | Switch 토글 |
| 우선순위 | priority | O | NumberInput (0-9) |
| 할당 | (체크박스) | O | Checkbox |

#### Subject 필드 목록 테이블 (SCR-014 내 인라인)

| 컬럼명 | 필드 | 필수 | 설명 |
|--------|------|:----:|------|
| 필드명 | name | O | Prisma 모델 필드명 |
| 표시명 | displayName | X | 한글 표시명 (@displayName) |
| 타입 | type | O | String, Int, DateTime 등 |
| 필수 | isRequired | O | Badge |
| 관계 | isRelation | O | Badge |

---

### 상태별 UI

#### 로딩 상태

```
+----------------------------------------+
|  ========================  (스켈레톤)   |
|  ============  ====================     |
|  ==================  ========           |
|  ==========  ================           |
|  =====================  ====            |
+----------------------------------------+
```

- **목록 화면**: DataGrid 스켈레톤 행 5개
- **상세 화면**: SectionSurface 내 스켈레톤 라인 5~8개
- **폼 화면**: Input 스켈레톤 + 버튼 비활성화

#### 빈 상태 (Empty State)

```
+----------------------------------------+
|                                         |
|         [빈 상자 아이콘]                |
|                                         |
|     "등록된 역할이 없습니다."           |
|     "새로운 역할을 등록해보세요."       |
|                                         |
|         [역할 등록 버튼]                |
|                                         |
+----------------------------------------+
```

- **역할 목록**: "등록된 역할이 없습니다."
- **권한 정의 목록**: "정의된 권한이 없습니다."
- **행위 목록**: "등록된 행위가 없습니다."
- **대상 목록**: "등록된 대상이 없습니다."
- **Grant 영역**: "할당된 권한이 없습니다. 권한을 할당해보세요."

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

```
+----------------------------------------+
|  [경고 아이콘]                          |
|                                         |
|  "CUSTOM_ROLE 역할을 삭제하시겠습니까?" |
|  "삭제된 역할은 복구할 수 없습니다."    |
|                                         |
|           [취소]  [삭제]                |
+----------------------------------------+
```

- **시스템 역할 삭제 시도**: "시스템 역할은 삭제할 수 없습니다." (삭제 버튼 비활성화)
- **연결된 사용자 있는 경우**: "이 역할을 사용 중인 사용자가 N명 있습니다. 먼저 역할을 변경해주세요." (삭제 불가)
- **Ability 삭제 시 Grant 존재**: "이 권한을 사용하는 Grant가 N개 있습니다. 삭제하면 함께 제거됩니다." (경고 후 삭제 가능)

#### Grant 배치 저장 확인 모달

```
+----------------------------------------+
|  [확인 아이콘]                          |
|                                         |
|  "권한 변경사항을 저장하시겠습니까?"    |
|                                         |
|  변경 요약:                             |
|  - 추가: 3건                            |
|  - 해제: 1건                            |
|  - 수정: 2건 (우선순위/활성화)          |
|                                         |
|           [취소]  [저장]                |
+----------------------------------------+
```

---

### 폼 필드 상세

#### 역할 등록/수정 폼 (SCR-003, SCR-004)

| 필드 | 타입 | 필수 | 유효성 검사 | 플레이스홀더 | 비고 |
|------|------|:----:|------------|-------------|------|
| name | TextInput | O | `^[A-Z][A-Z0-9_]*$`, unique | "ROLE_NAME" | 수정 시 readonly |
| displayName | TextInput | X | 최대 50자 | "표시명을 입력하세요" | - |
| description | Textarea | X | 최대 200자 | "역할 설명을 입력하세요" | - |
| categoryId | Select | X | 유효한 카테고리 ID | "카테고리 선택" | Category 목록 드롭다운 |
| groupId | Select | X | 유효한 그룹 ID | "그룹 선택" | Group 목록 드롭다운 |

#### 권한 정의 등록/수정 폼 (SCR-007, SCR-008)

| 필드 | 타입 | 필수 | 유효성 검사 | 플레이스홀더 | 비고 |
|------|------|:----:|------------|-------------|------|
| name | TextInput | O | unique | "권한 이름을 입력하세요" | 예: "Read User Email Masked" |
| description | Textarea | X | 최대 500자 | "권한 설명을 입력하세요" | - |
| subjectId | Select (검색) | O | 유효한 Subject ID | "Subject 검색/선택" | 그룹별 정렬 |
| actionId | Select (검색) | O | 유효한 Action ID | "Action 검색/선택" | 그룹별 정렬 |
| fields | TagInput | X | Subject 필드 목록 중 선택 | "필드 추가..." | DMMF 기반 자동완성 (entity만) |
| conditions | JsonEditor | X | 유효한 JSON | (기본 템플릿 제공) | ConditionEditor 위젯 사용 |
| inverted | Switch | X | - | - | false=허용, true=거부 |
| reason | TextInput | X | inverted=true 시 필수 | "거부 사유를 입력하세요" | inverted=true 시만 활성화 |

#### 행위 등록/수정 폼 (SCR-011, SCR-012)

| 필드 | 타입 | 필수 | 유효성 검사 | 플레이스홀더 | 비고 |
|------|------|:----:|------------|-------------|------|
| name | TextInput | O | unique, `^[a-z][a-z0-9:_]*$` | "read:masked:phone" | 수정 시 readonly |
| displayName | TextInput | X | 최대 50자 | "표시명을 입력하세요" | - |
| description | Textarea | X | 최대 200자 | "행위 설명을 입력하세요" | - |
| group | Select | X | crud/visibility/workflow/bulk | "그룹 선택" | - |
| order | NumberInput | X | 정수, >=0 | "0" | 기본값 0 |
| isSystem | Switch | X | - | - | 기본값 false |
| config | JsonEditor | X | 유효한 JSON | (기본 템플릿 제공) | JSON 에디터 |

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
| PageSurface | ui/surfaces | `ui/surfaces/PageSurface` | 페이지 래퍼 (title, description, actions) | 전체 14개 |
| SectionSurface | ui/surfaces | `ui/surfaces/SectionSurface` | 섹션 래퍼 (collapsible) | 전체 14개 |
| DataGrid | ui/data-display | `ui/data-display/DataGrid` | 테이블 목록 | SCR-001,005,009,013 |
| EmptyState | ui/feedback | `ui/feedback/EmptyState` | 빈 상태 표시 | 목록 화면 |
| Skeleton | ui/feedback | `ui/feedback/Skeleton` | 로딩 스켈레톤 | 전체 |
| Chip | ui/data-display | `ui/data-display/Chip` | 상태/그룹 칩 | 목록/상세 전체 |
| Text | ui/data-display | `ui/data-display/Text` | 텍스트 표시 | 전체 |
| Input | inputs | `inputs/Input` | 텍스트 입력 | 폼 화면 전체 |
| Textarea | inputs | `inputs/Textarea` | 다중줄 입력 | 폼 화면 |
| Select | inputs | `inputs/Select` | 드롭다운 선택 | 폼/필터 |
| AutoComplete | inputs | `inputs/AutoComplete` | 검색 가능 선택 | Subject/Action 선택 |
| Switch | inputs | `inputs/Switch` | 토글 스위치 | inverted, isActive, isSystem |
| Checkbox | inputs | `inputs/Checkbox` | 체크박스 | Grant 할당 |
| Pagination | inputs | `inputs/Pagination` | 페이지네이션 | Ability 목록 |
| Button | inputs (HeroUI) | `inputs/Button` | 액션 버튼 | 전체 |
| SearchFilterBar | widget | `widget/SearchFilterBar` | 검색/필터 바 | 목록 화면 |
| FilterPanel | widget | `widget/FilterPanel` | 필터 패널 | 목록 화면 |
| DetailPanel | widget | `widget/DetailPanel` | 상세 정보 패널 | 상세 화면 |
| MetaDataGrid | feature | `feature/MetaDataGrid` | 메타데이터 그리드 (액션바 포함) | 목록 화면 |
| BooleanCell | ui/data-display/cells | `ui/data-display/cells/BooleanCell` | Boolean Badge | isSystem |
| DateTimeCell | ui/data-display/cells | `ui/data-display/cells/DateTimeCell` | 날짜/시간 표시 | createdAt |
| StatusChipCell | ui/data-display/cells | `ui/data-display/cells/StatusChipCell` | 상태 칩 셀 | group, inverted |
| LinkCell | ui/data-display/cells | `ui/data-display/cells/LinkCell` | 링크 셀 | name (클릭 이동) |
| Can | ui/permission | `ui/permission/Can` | CASL 권한 체크 래퍼 | 등록/수정/삭제 버튼 |
| AbilityRuleList | widget/ability | `widget/ability/AbilityRuleList` | Ability 규칙 목록 | SCR-002 (Grant 영역) |
| AbilityFormModal | widget/ability | `widget/ability/AbilityFormModal` | Ability 생성/수정 모달 | SCR-007,008 (참고용) |
| ConditionEditor | widget/ability | `widget/ability/ConditionEditor` | ABAC 조건 JSON 에디터 | SCR-007,008 |
| RoleAbilityManager | feature/ability | `feature/ability/RoleAbilityManager` | Role별 Ability 관리 Feature | SCR-002 (Grant 배치 할당) |

#### 신규 컴포넌트 필요

##### Pure UI 컴포넌트 (packages/fe-ui/src/components/ui/)

| 컴포넌트명 | 경로 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| SystemBadge | `ui/data-display/cells/SystemBadgeCell` | 시스템 여부 뱃지 셀 (O/X + 색상) | `fe-cell-builder` |
| InvertedBadgeCell | `ui/data-display/cells/InvertedBadgeCell` | 허용/거부 뱃지 셀 (can/cannot) | `fe-cell-builder` |
| ConditionBadgeCell | `ui/data-display/cells/ConditionBadgeCell` | 조건 유무 뱃지 셀 | `fe-cell-builder` |
| FieldCountBadgeCell | `ui/data-display/cells/FieldCountBadgeCell` | 필드 제한 수 뱃지 셀 | `fe-cell-builder` |
| GroupChipCell | `ui/data-display/cells/GroupChipCell` | 그룹명 칩 셀 (crud/visibility/entity 등) | `fe-cell-builder` |
| ConfigBadgeCell | `ui/data-display/cells/ConfigBadgeCell` | 설정 유무 뱃지 셀 | `fe-cell-builder` |
| JsonViewer | `ui/data-display/JsonViewer` | JSON 데이터 포맷팅 뷰어 (읽기 전용) | `fe-ui-component-builder` |

##### Input 컴포넌트 (packages/fe-ui/src/components/inputs/)

| 컴포넌트명 | 경로 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| JsonEditor | `inputs/JsonEditor` | JSON 편집기 (구문 강조, 유효성 검사) | `fe-input-component-builder` |
| TagInput | `inputs/TagInput` | 태그 입력 (자동완성, 다중 선택, 삭제) | `fe-input-component-builder` |
| NumberInput | `inputs/NumberInput` | 숫자 입력 (min/max, step) | `fe-input-component-builder` |

##### Widget 컴포넌트 (packages/fe-ui/src/components/widget/)

| 컴포넌트명 | 경로 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| RoleInfoSection | `widget/role/RoleInfoSection` | 역할 기본 정보 섹션 (상세 화면) | `fe-widget-builder` |
| RoleClassificationSection | `widget/role/RoleClassificationSection` | 역할 분류 정보 섹션 (카테고리+그룹) | `fe-widget-builder` |
| RoleFormSection | `widget/role/RoleFormSection` | 역할 등록/수정 폼 섹션 | `fe-widget-builder` |
| GrantBatchTable | `widget/grant/GrantBatchTable` | Grant 배치 할당 테이블 (체크박스+토글+우선순위) | `fe-widget-builder` |
| GrantChangeSummary | `widget/grant/GrantChangeSummary` | Grant 변경사항 요약 (추가/해제/수정 건수) | `fe-widget-builder` |
| AbilityInfoSection | `widget/ability/AbilityInfoSection` | Ability 기본 정보 섹션 | `fe-widget-builder` |
| AbilityCaslSection | `widget/ability/AbilityCaslSection` | Ability CASL 설정 섹션 (Subject/Action/fields/conditions) | `fe-widget-builder` |
| AbilityGrantStatusSection | `widget/ability/AbilityGrantStatusSection` | Ability 할당 현황 섹션 (읽기 전용) | `fe-widget-builder` |
| AbilityFormSection | `widget/ability/AbilityFormSection` | Ability 등록/수정 폼 섹션 (기본 정보) | `fe-widget-builder` |
| AbilityCaslFormSection | `widget/ability/AbilityCaslFormSection` | Ability CASL 설정 폼 섹션 (Subject/Action/fields/conditions/inverted) | `fe-widget-builder` |
| ActionInfoSection | `widget/action/ActionInfoSection` | Action 기본 정보 섹션 | `fe-widget-builder` |
| ActionConfigSection | `widget/action/ActionConfigSection` | Action 설정(Config) 섹션 (JSON 뷰어) | `fe-widget-builder` |
| ActionUsageSection | `widget/action/ActionUsageSection` | Action 사용 현황 섹션 | `fe-widget-builder` |
| ActionFormSection | `widget/action/ActionFormSection` | Action 등록/수정 폼 섹션 | `fe-widget-builder` |
| SubjectInfoSection | `widget/subject/SubjectInfoSection` | Subject 기본 정보 섹션 | `fe-widget-builder` |
| SubjectFieldTable | `widget/subject/SubjectFieldTable` | Subject DMMF 필드 목록 테이블 | `fe-widget-builder` |
| SubjectUsageSection | `widget/subject/SubjectUsageSection` | Subject 사용 현황 섹션 | `fe-widget-builder` |
| DeleteConfirmModal | `widget/common/DeleteConfirmModal` | 삭제 확인 모달 (범용) | `fe-widget-builder` |
| GrantSaveConfirmModal | `widget/grant/GrantSaveConfirmModal` | Grant 배치 저장 확인 모달 | `fe-widget-builder` |

##### Feature 컴포넌트 (packages/fe-ui/src/components/feature/)

| 컴포넌트명 | 경로 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| GrantBatchManager | `feature/grant/GrantBatchManager` | Grant 배치 할당 매니저 (Store 연동, API 호출) | `fe-feature-builder` |

##### Store

| Store명 | 설명 | 담당 에이전트 |
|---------|------|--------------|
| GrantBatchStore | Grant 배치 할당 상태 관리 (변경 추적, 저장 로직) | `fe-store-builder` |

---

### 컴포넌트 계층 구조

#### 역할 목록 (SCR-001: RoleList)

```
Page: RoleListPage
  +-- PageSurface (title="역할 관리", actions=[역할 등록 버튼])
      +-- MetaDataGrid (기존, 검색/필터/DataGrid 통합)
          +-- SearchFilterBar (기존, 검색어 입력)
          +-- FilterPanel (기존, 카테고리/그룹/시스템 필터)
          +-- SectionSurface (padding="none")
              +-- DataGrid (기존)
                  +-- LinkCell (name)
                  +-- DefaultCell (displayName, description)
                  +-- GroupChipCell (classification.category.name) [신규]
                  +-- GroupChipCell (associations[0].group.name) [신규]
                  +-- BooleanCell (isSystem, 기존)
                  +-- DateTimeCell (createdAt, 기존)
```

**에이전트**: `fe-page-builder`

#### 역할 상세 (SCR-002: RoleDetail)

```
Page: RoleDetailPage
  +-- PageSurface (title="{name} ({displayName})", actions=[수정, 삭제])
      +-- SectionSurface "기본 정보"
          +-- RoleInfoSection [신규 Widget]
      +-- SectionSurface "분류 정보"
          +-- RoleClassificationSection [신규 Widget]
      +-- SectionSurface "할당된 권한 (Grant 배치 할당)"
          +-- GrantBatchManager [신규 Feature]
              +-- GrantBatchTable [신규 Widget]
                  +-- Checkbox (할당)
                  +-- Switch (isActive)
                  +-- NumberInput (priority) [신규]
              +-- GrantChangeSummary [신규 Widget]
              +-- GrantSaveConfirmModal [신규 Widget]
      +-- SectionSurface "연결된 사용자"
          +-- Text (사용자 수 표시)
  +-- DeleteConfirmModal [신규 Widget] (삭제 시)
```

**에이전트**: `fe-page-builder`

#### 역할 등록 (SCR-003: RoleNew)

```
Page: RoleNewPage
  +-- PageSurface (title="역할 등록")
      +-- SectionSurface "기본 정보"
          +-- RoleFormSection [신규 Widget]
              +-- Input (name)
              +-- Input (displayName)
              +-- Textarea (description)
      +-- SectionSurface "분류 설정"
          +-- Select (categoryId)
          +-- Select (groupId)
      +-- Button (취소), Button (등록)
```

**에이전트**: `fe-page-builder`

#### 역할 수정 (SCR-004: RoleEdit)

```
Page: RoleEditPage
  +-- 구조 동일 (SCR-003), name readonly, 기존 데이터 prefill
```

**에이전트**: `fe-page-builder`

#### 권한 정의 목록 (SCR-005: AbilityList)

```
Page: AbilityListPage
  +-- PageSurface (title="권한 정의", actions=[권한 정의 등록 버튼])
      +-- MetaDataGrid
          +-- SearchFilterBar (이름 검색)
          +-- FilterPanel (Subject, Action, 허용/거부 필터)
          +-- SectionSurface (padding="none")
              +-- DataGrid
                  +-- LinkCell (name)
                  +-- DefaultCell (subject.displayName)
                  +-- DefaultCell (action.displayName)
                  +-- InvertedBadgeCell (inverted) [신규]
                  +-- ConditionBadgeCell (conditions) [신규]
                  +-- FieldCountBadgeCell (fields) [신규]
                  +-- DateTimeCell (createdAt)
              +-- Pagination (페이지당 20건)
```

**에이전트**: `fe-page-builder`

#### 권한 정의 상세 (SCR-006: AbilityDetail)

```
Page: AbilityDetailPage
  +-- PageSurface (title="{name}", actions=[수정, 삭제])
      +-- SectionSurface "기본 정보"
          +-- AbilityInfoSection [신규 Widget]
      +-- SectionSurface "CASL 설정"
          +-- AbilityCaslSection [신규 Widget]
              +-- Text (Subject, Action 정보)
              +-- Chip (inverted: can/cannot)
              +-- Chip[] (fields 태그)
              +-- JsonViewer (conditions) [신규 UI]
              +-- Text (reason)
      +-- SectionSurface "할당 현황"
          +-- AbilityGrantStatusSection [신규 Widget]
  +-- DeleteConfirmModal [신규 Widget] (삭제 시)
```

**에이전트**: `fe-page-builder`

#### 권한 정의 등록 (SCR-007: AbilityNew)

```
Page: AbilityNewPage
  +-- PageSurface (title="권한 정의 등록")
      +-- SectionSurface "기본 정보"
          +-- AbilityFormSection [신규 Widget]
              +-- Input (name)
              +-- Textarea (description)
      +-- SectionSurface "CASL 설정"
          +-- AbilityCaslFormSection [신규 Widget]
              +-- AutoComplete (subjectId, Subject 검색/선택)
              +-- AutoComplete (actionId, Action 검색/선택)
              +-- Switch (inverted)
              +-- Input (reason, inverted=true 시만 활성화)
      +-- SectionSurface "상세 설정"
          +-- TagInput (fields, DMMF 기반 자동완성) [신규 Input]
          +-- ConditionEditor (conditions, 기존 Widget)
      +-- Button (취소), Button (등록)
```

**에이전트**: `fe-page-builder`

#### 권한 정의 수정 (SCR-008: AbilityEdit)

```
Page: AbilityEditPage
  +-- 구조 동일 (SCR-007), 기존 데이터 prefill
```

**에이전트**: `fe-page-builder`

#### 행위 목록 (SCR-009: ActionList)

```
Page: ActionListPage
  +-- PageSurface (title="행위 관리", actions=[행위 등록 버튼])
      +-- MetaDataGrid
          +-- SearchFilterBar (이름 검색)
          +-- FilterPanel (그룹, 시스템 여부 필터)
          +-- SectionSurface (padding="none")
              +-- DataGrid
                  +-- LinkCell (name)
                  +-- DefaultCell (displayName)
                  +-- GroupChipCell (group) [신규]
                  +-- ConfigBadgeCell (config) [신규]
                  +-- BooleanCell (isSystem)
                  +-- NumberCell (order)
```

**에이전트**: `fe-page-builder`

#### 행위 상세 (SCR-010: ActionDetail)

```
Page: ActionDetailPage
  +-- PageSurface (title="{name} ({displayName})", actions=[수정, 삭제])
      +-- SectionSurface "기본 정보"
          +-- ActionInfoSection [신규 Widget]
      +-- SectionSurface "설정 (Config)"
          +-- ActionConfigSection [신규 Widget]
              +-- JsonViewer (config) [신규 UI] / "설정 없음"
      +-- SectionSurface "사용 현황"
          +-- ActionUsageSection [신규 Widget]
  +-- DeleteConfirmModal [신규 Widget] (삭제 시)
```

**에이전트**: `fe-page-builder`

#### 행위 등록 (SCR-011: ActionNew)

```
Page: ActionNewPage
  +-- PageSurface (title="행위 등록")
      +-- SectionSurface "기본 정보"
          +-- ActionFormSection [신규 Widget]
              +-- Input (name)
              +-- Input (displayName)
              +-- Textarea (description)
              +-- Select (group)
              +-- NumberInput (order) [신규 Input]
              +-- Switch (isSystem)
      +-- SectionSurface "설정 (Config)"
          +-- JsonEditor (config) [신규 Input]
      +-- Button (취소), Button (등록)
```

**에이전트**: `fe-page-builder`

#### 행위 수정 (SCR-012: ActionEdit)

```
Page: ActionEditPage
  +-- 구조 동일 (SCR-011), name readonly, 기존 데이터 prefill
  +-- 시스템 Action은 접근 차단 (목록으로 리다이렉트)
```

**에이전트**: `fe-page-builder`

#### 대상 목록 (SCR-013: SubjectList)

```
Page: SubjectListPage
  +-- PageSurface (title="대상 관리", description="권한 대상(Subject)을 조회합니다")
      +-- MetaDataGrid
          +-- SearchFilterBar (이름 검색)
          +-- FilterPanel (그룹, 시스템 여부 필터)
          +-- SectionSurface (padding="none")
              +-- DataGrid
                  +-- LinkCell (name)
                  +-- DefaultCell (displayName)
                  +-- GroupChipCell (group) [신규]
                  +-- DefaultCell (icon)
                  +-- BooleanCell (isSystem)
                  +-- NumberCell (order)
```

**에이전트**: `fe-page-builder`

#### 대상 상세 (SCR-014: SubjectDetail)

```
Page: SubjectDetailPage
  +-- PageSurface (title="{name} ({displayName})")
      +-- SectionSurface "기본 정보"
          +-- SubjectInfoSection [신규 Widget]
      +-- SectionSurface "필드 목록 (DMMF)"
          +-- SubjectFieldTable [신규 Widget]
              +-- DataGrid (필드 목록, entity Subject만 표시)
                  +-- DefaultCell (name, type)
                  +-- BooleanCell (isRequired, isRelation)
      +-- SectionSurface "사용 현황"
          +-- SubjectUsageSection [신규 Widget]
```

**에이전트**: `fe-page-builder`

---

### 컴포넌트 유형 분류 기준

```
신규 컴포넌트가 필요할 때:
  |
Store 연동이 필요한가?
  +-- Yes -> feature (GrantBatchManager)
  +-- No
       |
     입력을 받는가? (value/onChange)
       +-- Yes -> inputs (JsonEditor, TagInput, NumberInput)
       +-- No
            |
          특정 도메인 데이터 구조에 맞춤?
            +-- Yes -> widget (RoleInfoSection, GrantBatchTable 등)
            +-- No
                 |
               DataGrid 셀 렌더링?
                 +-- Yes -> cell (InvertedBadgeCell, GroupChipCell 등)
                 +-- No -> ui (JsonViewer)
```

---

### 에이전트별 작업 매핑

#### Stage 4: 컴포넌트 구현 순서

| 순서 | 에이전트 | 대상 컴포넌트 | 설명 |
|------|----------|-------------|------|
| 1 | `fe-ui-component-builder` | JsonViewer | Pure UI - JSON 데이터 포맷팅 뷰어 |
| 2 | `fe-cell-builder` | SystemBadgeCell, InvertedBadgeCell, ConditionBadgeCell, FieldCountBadgeCell, GroupChipCell, ConfigBadgeCell | DataGrid 셀 컴포넌트 6개 |
| 3 | `fe-input-component-builder` | JsonEditor, TagInput, NumberInput | Input 컴포넌트 3개 |
| 4 | `fe-widget-builder` | RoleInfoSection, RoleClassificationSection, RoleFormSection, GrantBatchTable, GrantChangeSummary, AbilityInfoSection, AbilityCaslSection, AbilityGrantStatusSection, AbilityFormSection, AbilityCaslFormSection, ActionInfoSection, ActionConfigSection, ActionUsageSection, ActionFormSection, SubjectInfoSection, SubjectFieldTable, SubjectUsageSection, DeleteConfirmModal, GrantSaveConfirmModal | Widget 컴포넌트 19개 |
| 5 | `fe-feature-builder` | GrantBatchManager | Feature 컴포넌트 1개 |
| 6 | `fe-store-builder` | GrantBatchStore | Store 1개 |

#### Stage 5: 페이지 통합 순서

| 순서 | 페이지 | 경로 | 에이전트 |
|------|--------|------|----------|
| 1 | RoleList | /roles | `fe-page-builder` + `fe-menu-builder` (자동) |
| 2 | RoleDetail | /roles/[roleId] | `fe-page-builder` |
| 3 | RoleNew | /roles/new | `fe-page-builder` |
| 4 | RoleEdit | /roles/[roleId]/edit | `fe-page-builder` |
| 5 | AbilityList | /abilities | `fe-page-builder` + `fe-menu-builder` (자동) |
| 6 | AbilityDetail | /abilities/[abilityId] | `fe-page-builder` |
| 7 | AbilityNew | /abilities/new | `fe-page-builder` |
| 8 | AbilityEdit | /abilities/[abilityId]/edit | `fe-page-builder` |
| 9 | ActionList | /actions | `fe-page-builder` + `fe-menu-builder` (자동) |
| 10 | ActionDetail | /actions/[actionId] | `fe-page-builder` |
| 11 | ActionNew | /actions/new | `fe-page-builder` |
| 12 | ActionEdit | /actions/[actionId]/edit | `fe-page-builder` |
| 13 | SubjectList | /subjects | `fe-page-builder` + `fe-menu-builder` (자동) |
| 14 | SubjectDetail | /subjects/[subjectId] | `fe-page-builder` |

---

### 동적 동작 상세

#### Subject 선택 시 필드 자동완성 (SCR-007, SCR-008)

```
1. Subject Select에서 Subject 선택
   |
2. Subject의 group이 "entity"인가?
   +-- Yes -> GET /api/v1/subjects/{subjectId}/fields 호출
   |          -> SubjectFieldDto[] 응답
   |          -> TagInput의 자동완성 후보 목록 업데이트
   +-- No -> TagInput 자유 입력 모드 (자동완성 없음)
```

#### Grant 배치 할당 플로우 (SCR-002)

```
1. 역할 상세 화면 진입
   |
2. 전체 Ability 목록 조회 (GET /api/v1/abilities?take=all)
   + 현재 Role의 Grant 목록 조회 (GET /api/v1/abilities/roles/{roleId})
   |
3. GrantBatchStore 초기화
   - 전체 Ability와 현재 Grant를 비교하여 체크 상태 계산
   - 초기 스냅샷 저장 (변경 감지용)
   |
4. 사용자 조작
   - Checkbox 토글 -> 할당/해제
   - Switch 토글 -> isActive 변경
   - NumberInput 변경 -> priority 변경
   |
5. GrantChangeSummary에서 변경사항 실시간 표시
   - 추가: N건, 해제: N건, 수정: N건
   |
6. "일괄 저장" 클릭
   -> GrantSaveConfirmModal 표시
   -> 확인 시 PUT /api/v1/grants/roles/{roleId} 호출
   -> 성공 시 Grant 목록 재조회
```

#### inverted 토글 연동 (SCR-007, SCR-008)

```
inverted Switch = false (기본)
  -> reason Input 비활성화 (disabled)
  -> 허용(can) 모드

inverted Switch = true
  -> reason Input 활성화 (필수)
  -> 거부(cannot) 모드
  -> reason 미입력 시 폼 제출 불가
```

---

## Requirement Graph (L7-L8)

```json
{
  "level_range": "L7-L8",
  "nodes": [
    { "id": "ROL-L7-ENT-001", "level": 7, "subLevel": "1", "type": "entity", "name": "Role", "description": "역할 엔티티", "metadata": { "tableName": "roles" } },
    { "id": "ROL-L7-ENT-002", "level": 7, "subLevel": "1", "type": "entity", "name": "Ability", "description": "권한 정의 엔티티", "metadata": { "tableName": "abilities" } },
    { "id": "ROL-L7-ENT-003", "level": 7, "subLevel": "1", "type": "entity", "name": "Grant", "description": "권한 부여 엔티티 (다형성 BRIDGE)", "metadata": { "tableName": "grants" } },
    { "id": "ROL-L7-ENT-004", "level": 7, "subLevel": "1", "type": "entity", "name": "Action", "description": "행위 정의 엔티티", "metadata": { "tableName": "actions" } },
    { "id": "ROL-L7-ENT-005", "level": 7, "subLevel": "1", "type": "entity", "name": "Subject", "description": "권한 대상 엔티티", "metadata": { "tableName": "subjects" } },
    { "id": "ROL-L7-ENT-006", "level": 7, "subLevel": "1", "type": "entity", "name": "RoleAssociation", "description": "역할-그룹 연결", "metadata": { "tableName": "role_associations" } },
    { "id": "ROL-L7-ENT-007", "level": 7, "subLevel": "1", "type": "entity", "name": "RoleClassification", "description": "역할-카테고리 연결", "metadata": { "tableName": "role_classifications" } },

    { "id": "ROL-L7-FLD-001", "level": 7, "subLevel": "2", "type": "entity", "name": "Role.id", "description": "역할 고유 식별자", "metadata": { "fieldType": "UUID", "constraints": ["pk", "required"], "defaultValue": "uuid()" } },
    { "id": "ROL-L7-FLD-002", "level": 7, "subLevel": "2", "type": "entity", "name": "Role.name", "description": "역할 식별자 (영문 대문자)", "metadata": { "fieldType": "String", "constraints": ["unique", "required"] } },
    { "id": "ROL-L7-FLD-003", "level": 7, "subLevel": "2", "type": "entity", "name": "Role.displayName", "description": "표시명", "metadata": { "fieldType": "String", "constraints": ["optional"] } },
    { "id": "ROL-L7-FLD-004", "level": 7, "subLevel": "2", "type": "entity", "name": "Role.isSystem", "description": "시스템 역할 여부", "metadata": { "fieldType": "Boolean", "constraints": ["required"], "defaultValue": "false" } },
    { "id": "ROL-L7-FLD-005", "level": 7, "subLevel": "2", "type": "entity", "name": "Ability.id", "description": "권한 고유 식별자", "metadata": { "fieldType": "UUID", "constraints": ["pk", "required"], "defaultValue": "uuid()" } },
    { "id": "ROL-L7-FLD-006", "level": 7, "subLevel": "2", "type": "entity", "name": "Ability.name", "description": "권한 이름", "metadata": { "fieldType": "String", "constraints": ["unique", "required"] } },
    { "id": "ROL-L7-FLD-007", "level": 7, "subLevel": "2", "type": "entity", "name": "Ability.subjectId", "description": "Subject FK", "metadata": { "fieldType": "UUID", "constraints": ["fk", "required", "index"], "references": "Subject.id" } },
    { "id": "ROL-L7-FLD-008", "level": 7, "subLevel": "2", "type": "entity", "name": "Ability.actionId", "description": "Action FK", "metadata": { "fieldType": "UUID", "constraints": ["fk", "required", "index"], "references": "Action.id" } },
    { "id": "ROL-L7-FLD-009", "level": 7, "subLevel": "2", "type": "entity", "name": "Ability.fields", "description": "대상 필드 목록", "metadata": { "fieldType": "String", "constraints": ["required"], "defaultValue": "[]" } },
    { "id": "ROL-L7-FLD-010", "level": 7, "subLevel": "2", "type": "entity", "name": "Ability.conditions", "description": "ABAC 조건 JSON", "metadata": { "fieldType": "Json", "constraints": ["optional"] } },
    { "id": "ROL-L7-FLD-011", "level": 7, "subLevel": "2", "type": "entity", "name": "Ability.inverted", "description": "거부 여부", "metadata": { "fieldType": "Boolean", "constraints": ["required"], "defaultValue": "false" } },
    { "id": "ROL-L7-FLD-012", "level": 7, "subLevel": "2", "type": "entity", "name": "Grant.granteeType", "description": "권한 대상 유형", "metadata": { "fieldType": "String", "constraints": ["required"], "enumValues": ["Role", "User"] } },
    { "id": "ROL-L7-FLD-013", "level": 7, "subLevel": "2", "type": "entity", "name": "Grant.granteeId", "description": "권한 대상 ID", "metadata": { "fieldType": "UUID", "constraints": ["required", "index"] } },
    { "id": "ROL-L7-FLD-014", "level": 7, "subLevel": "2", "type": "entity", "name": "Grant.abilityId", "description": "권한 ID", "metadata": { "fieldType": "UUID", "constraints": ["fk", "required", "index"], "references": "Ability.id" } },
    { "id": "ROL-L7-FLD-015", "level": 7, "subLevel": "2", "type": "entity", "name": "Grant.isActive", "description": "활성화 여부", "metadata": { "fieldType": "Boolean", "constraints": ["required"], "defaultValue": "true" } },
    { "id": "ROL-L7-FLD-016", "level": 7, "subLevel": "2", "type": "entity", "name": "Grant.priority", "description": "우선순위", "metadata": { "fieldType": "Int", "constraints": ["required"], "defaultValue": "0" } },
    { "id": "ROL-L7-FLD-017", "level": 7, "subLevel": "2", "type": "entity", "name": "Action.name", "description": "행위 식별자", "metadata": { "fieldType": "String", "constraints": ["unique", "required"] } },
    { "id": "ROL-L7-FLD-018", "level": 7, "subLevel": "2", "type": "entity", "name": "Action.group", "description": "행위 그룹", "metadata": { "fieldType": "String", "constraints": ["optional", "index"], "enumValues": ["crud", "visibility", "workflow", "bulk"] } },
    { "id": "ROL-L7-FLD-019", "level": 7, "subLevel": "2", "type": "entity", "name": "Action.config", "description": "마스킹/변환 설정", "metadata": { "fieldType": "Json", "constraints": ["optional"] } },
    { "id": "ROL-L7-FLD-020", "level": 7, "subLevel": "2", "type": "entity", "name": "Subject.name", "description": "대상 식별자", "metadata": { "fieldType": "String", "constraints": ["unique", "required"] } },
    { "id": "ROL-L7-FLD-021", "level": 7, "subLevel": "2", "type": "entity", "name": "Subject.group", "description": "대상 그룹", "metadata": { "fieldType": "String", "constraints": ["optional", "index"], "enumValues": ["entity", "menu", "feature", "ui"] } },

    { "id": "ROL-L8-CMP-001", "level": 8, "subLevel": "1", "type": "component", "name": "JsonViewer", "description": "JSON 데이터 포맷팅 뷰어 (읽기 전용)", "metadata": { "componentType": "ui", "props": { "data": "Record<string, unknown> | null", "maxHeight": "string" }, "existing": false } },
    { "id": "ROL-L8-CMP-002", "level": 8, "subLevel": "2", "type": "component", "name": "SystemBadgeCell", "description": "시스템 여부 뱃지 셀", "metadata": { "componentType": "ui", "existing": false } },
    { "id": "ROL-L8-CMP-003", "level": 8, "subLevel": "2", "type": "component", "name": "InvertedBadgeCell", "description": "허용/거부 뱃지 셀 (can/cannot)", "metadata": { "componentType": "ui", "existing": false } },
    { "id": "ROL-L8-CMP-004", "level": 8, "subLevel": "2", "type": "component", "name": "ConditionBadgeCell", "description": "조건 유무 뱃지 셀", "metadata": { "componentType": "ui", "existing": false } },
    { "id": "ROL-L8-CMP-005", "level": 8, "subLevel": "2", "type": "component", "name": "FieldCountBadgeCell", "description": "필드 제한 수 뱃지 셀", "metadata": { "componentType": "ui", "existing": false } },
    { "id": "ROL-L8-CMP-006", "level": 8, "subLevel": "2", "type": "component", "name": "GroupChipCell", "description": "그룹명 칩 셀", "metadata": { "componentType": "ui", "existing": false } },
    { "id": "ROL-L8-CMP-007", "level": 8, "subLevel": "2", "type": "component", "name": "ConfigBadgeCell", "description": "설정 유무 뱃지 셀", "metadata": { "componentType": "ui", "existing": false } },
    { "id": "ROL-L8-CMP-008", "level": 8, "subLevel": "2", "type": "component", "name": "JsonEditor", "description": "JSON 편집기 (구문 강조, 유효성 검사)", "metadata": { "componentType": "inputs", "props": { "value": "string", "onChange": "(value: string) => void", "isInvalid": "boolean" }, "existing": false } },
    { "id": "ROL-L8-CMP-009", "level": 8, "subLevel": "2", "type": "component", "name": "TagInput", "description": "태그 입력 (자동완성, 다중 선택)", "metadata": { "componentType": "inputs", "props": { "value": "string[]", "onChange": "(tags: string[]) => void", "suggestions": "string[]" }, "existing": false } },
    { "id": "ROL-L8-CMP-010", "level": 8, "subLevel": "2", "type": "component", "name": "NumberInput", "description": "숫자 입력 (min/max/step)", "metadata": { "componentType": "inputs", "props": { "value": "number", "onChange": "(value: number) => void", "min": "number", "max": "number" }, "existing": false } },
    { "id": "ROL-L8-CMP-011", "level": 8, "subLevel": "2", "type": "component", "name": "RoleInfoSection", "description": "역할 기본 정보 섹션", "metadata": { "componentType": "widgets", "props": { "role": "RoleDto" }, "existing": false } },
    { "id": "ROL-L8-CMP-012", "level": 8, "subLevel": "2", "type": "component", "name": "RoleClassificationSection", "description": "역할 분류 정보 섹션", "metadata": { "componentType": "widgets", "props": { "classification": "RoleClassificationDto | null", "associations": "RoleAssociationDto[]" }, "existing": false } },
    { "id": "ROL-L8-CMP-013", "level": 8, "subLevel": "2", "type": "component", "name": "RoleFormSection", "description": "역할 등록/수정 폼 섹션", "metadata": { "componentType": "widgets", "props": { "mode": "'create' | 'edit'", "defaultValues": "Partial<RoleDto>", "onSubmit": "(data: CreateRoleDto) => void" }, "existing": false } },
    { "id": "ROL-L8-CMP-014", "level": 8, "subLevel": "2", "type": "component", "name": "GrantBatchTable", "description": "Grant 배치 할당 테이블", "metadata": { "componentType": "widgets", "props": { "abilities": "AbilityDto[]", "grants": "GrantResponseDto[]", "onToggleAssign": "(abilityId: string) => void", "onToggleActive": "(abilityId: string) => void", "onPriorityChange": "(abilityId: string, priority: number) => void" }, "existing": false } },
    { "id": "ROL-L8-CMP-015", "level": 8, "subLevel": "2", "type": "component", "name": "GrantChangeSummary", "description": "Grant 변경사항 요약", "metadata": { "componentType": "widgets", "props": { "added": "number", "removed": "number", "modified": "number", "onSave": "() => void" }, "existing": false } },
    { "id": "ROL-L8-CMP-016", "level": 8, "subLevel": "2", "type": "component", "name": "AbilityInfoSection", "description": "Ability 기본 정보 섹션", "metadata": { "componentType": "widgets", "props": { "ability": "AbilityDto" }, "existing": false } },
    { "id": "ROL-L8-CMP-017", "level": 8, "subLevel": "2", "type": "component", "name": "AbilityCaslSection", "description": "Ability CASL 설정 표시 섹션", "metadata": { "componentType": "widgets", "props": { "ability": "AbilityDto" }, "existing": false } },
    { "id": "ROL-L8-CMP-018", "level": 8, "subLevel": "2", "type": "component", "name": "AbilityGrantStatusSection", "description": "Ability 할당 현황 섹션", "metadata": { "componentType": "widgets", "props": { "grants": "GrantResponseDto[]" }, "existing": false } },
    { "id": "ROL-L8-CMP-019", "level": 8, "subLevel": "2", "type": "component", "name": "AbilityFormSection", "description": "Ability 기본 정보 폼 섹션", "metadata": { "componentType": "widgets", "props": { "mode": "'create' | 'edit'", "defaultValues": "Partial<AbilityDto>" }, "existing": false } },
    { "id": "ROL-L8-CMP-020", "level": 8, "subLevel": "2", "type": "component", "name": "AbilityCaslFormSection", "description": "Ability CASL 설정 폼 섹션", "metadata": { "componentType": "widgets", "props": { "subjects": "SubjectDto[]", "actions": "ActionDto[]", "subjectFields": "SubjectFieldDto[]", "onSubjectChange": "(subjectId: string) => void" }, "existing": false } },
    { "id": "ROL-L8-CMP-021", "level": 8, "subLevel": "2", "type": "component", "name": "ActionInfoSection", "description": "Action 기본 정보 섹션", "metadata": { "componentType": "widgets", "props": { "action": "ActionDto" }, "existing": false } },
    { "id": "ROL-L8-CMP-022", "level": 8, "subLevel": "2", "type": "component", "name": "ActionConfigSection", "description": "Action Config 표시 섹션", "metadata": { "componentType": "widgets", "props": { "config": "JsonValue | null" }, "existing": false } },
    { "id": "ROL-L8-CMP-023", "level": 8, "subLevel": "2", "type": "component", "name": "ActionUsageSection", "description": "Action 사용 현황 섹션", "metadata": { "componentType": "widgets", "props": { "abilityCount": "number" }, "existing": false } },
    { "id": "ROL-L8-CMP-024", "level": 8, "subLevel": "2", "type": "component", "name": "ActionFormSection", "description": "Action 등록/수정 폼 섹션", "metadata": { "componentType": "widgets", "props": { "mode": "'create' | 'edit'", "defaultValues": "Partial<ActionDto>" }, "existing": false } },
    { "id": "ROL-L8-CMP-025", "level": 8, "subLevel": "2", "type": "component", "name": "SubjectInfoSection", "description": "Subject 기본 정보 섹션", "metadata": { "componentType": "widgets", "props": { "subject": "SubjectDto" }, "existing": false } },
    { "id": "ROL-L8-CMP-026", "level": 8, "subLevel": "2", "type": "component", "name": "SubjectFieldTable", "description": "Subject DMMF 필드 목록 테이블", "metadata": { "componentType": "widgets", "props": { "fields": "SubjectFieldDto[]", "isLoading": "boolean" }, "existing": false } },
    { "id": "ROL-L8-CMP-027", "level": 8, "subLevel": "2", "type": "component", "name": "SubjectUsageSection", "description": "Subject 사용 현황 섹션", "metadata": { "componentType": "widgets", "props": { "abilityCount": "number" }, "existing": false } },
    { "id": "ROL-L8-CMP-028", "level": 8, "subLevel": "2", "type": "component", "name": "DeleteConfirmModal", "description": "삭제 확인 모달 (범용)", "metadata": { "componentType": "widgets", "props": { "isOpen": "boolean", "title": "string", "message": "string", "warningMessage": "string", "onConfirm": "() => void", "onCancel": "() => void", "isLoading": "boolean" }, "existing": false } },
    { "id": "ROL-L8-CMP-029", "level": 8, "subLevel": "2", "type": "component", "name": "GrantSaveConfirmModal", "description": "Grant 배치 저장 확인 모달", "metadata": { "componentType": "widgets", "props": { "isOpen": "boolean", "added": "number", "removed": "number", "modified": "number", "onConfirm": "() => void", "onCancel": "() => void" }, "existing": false } },
    { "id": "ROL-L8-CMP-030", "level": 8, "subLevel": "3", "type": "component", "name": "GrantBatchManager", "description": "Grant 배치 할당 매니저 (Store 연동)", "metadata": { "componentType": "features", "props": { "roleId": "string" }, "existing": false } }
  ],
  "edges": [
    { "id": "e-701", "source": "ROL-L7-ENT-001", "target": "ROL-L7-FLD-001", "type": "parent" },
    { "id": "e-702", "source": "ROL-L7-ENT-001", "target": "ROL-L7-FLD-002", "type": "parent" },
    { "id": "e-703", "source": "ROL-L7-ENT-001", "target": "ROL-L7-FLD-003", "type": "parent" },
    { "id": "e-704", "source": "ROL-L7-ENT-001", "target": "ROL-L7-FLD-004", "type": "parent" },
    { "id": "e-705", "source": "ROL-L7-ENT-002", "target": "ROL-L7-FLD-005", "type": "parent" },
    { "id": "e-706", "source": "ROL-L7-ENT-002", "target": "ROL-L7-FLD-006", "type": "parent" },
    { "id": "e-707", "source": "ROL-L7-ENT-002", "target": "ROL-L7-FLD-007", "type": "parent" },
    { "id": "e-708", "source": "ROL-L7-ENT-002", "target": "ROL-L7-FLD-008", "type": "parent" },
    { "id": "e-709", "source": "ROL-L7-ENT-002", "target": "ROL-L7-FLD-009", "type": "parent" },
    { "id": "e-710", "source": "ROL-L7-ENT-002", "target": "ROL-L7-FLD-010", "type": "parent" },
    { "id": "e-711", "source": "ROL-L7-ENT-002", "target": "ROL-L7-FLD-011", "type": "parent" },
    { "id": "e-712", "source": "ROL-L7-ENT-003", "target": "ROL-L7-FLD-012", "type": "parent" },
    { "id": "e-713", "source": "ROL-L7-ENT-003", "target": "ROL-L7-FLD-013", "type": "parent" },
    { "id": "e-714", "source": "ROL-L7-ENT-003", "target": "ROL-L7-FLD-014", "type": "parent" },
    { "id": "e-715", "source": "ROL-L7-ENT-003", "target": "ROL-L7-FLD-015", "type": "parent" },
    { "id": "e-716", "source": "ROL-L7-ENT-003", "target": "ROL-L7-FLD-016", "type": "parent" },
    { "id": "e-717", "source": "ROL-L7-ENT-004", "target": "ROL-L7-FLD-017", "type": "parent" },
    { "id": "e-718", "source": "ROL-L7-ENT-004", "target": "ROL-L7-FLD-018", "type": "parent" },
    { "id": "e-719", "source": "ROL-L7-ENT-004", "target": "ROL-L7-FLD-019", "type": "parent" },
    { "id": "e-720", "source": "ROL-L7-ENT-005", "target": "ROL-L7-FLD-020", "type": "parent" },
    { "id": "e-721", "source": "ROL-L7-ENT-005", "target": "ROL-L7-FLD-021", "type": "parent" },

    { "id": "e-730", "source": "ROL-L7-ENT-003", "target": "ROL-L7-ENT-002", "type": "depends", "label": "Ability 참조 (FK)" },
    { "id": "e-731", "source": "ROL-L7-ENT-002", "target": "ROL-L7-ENT-005", "type": "depends", "label": "Subject 참조 (FK)" },
    { "id": "e-732", "source": "ROL-L7-ENT-002", "target": "ROL-L7-ENT-004", "type": "depends", "label": "Action 참조 (FK)" },
    { "id": "e-733", "source": "ROL-L7-ENT-006", "target": "ROL-L7-ENT-001", "type": "depends", "label": "Role 참조 (FK)" },
    { "id": "e-734", "source": "ROL-L7-ENT-007", "target": "ROL-L7-ENT-001", "type": "depends", "label": "Role 참조 (FK)" },

    { "id": "e-801", "source": "ROL-L4-SCR-001", "target": "ROL-L8-CMP-006", "type": "uses", "label": "GroupChipCell 사용" },
    { "id": "e-802", "source": "ROL-L4-SCR-002", "target": "ROL-L8-CMP-011", "type": "uses", "label": "RoleInfoSection 사용" },
    { "id": "e-803", "source": "ROL-L4-SCR-002", "target": "ROL-L8-CMP-012", "type": "uses", "label": "RoleClassificationSection 사용" },
    { "id": "e-804", "source": "ROL-L4-SCR-002", "target": "ROL-L8-CMP-030", "type": "uses", "label": "GrantBatchManager 사용" },
    { "id": "e-805", "source": "ROL-L4-SCR-002", "target": "ROL-L8-CMP-028", "type": "uses", "label": "DeleteConfirmModal 사용" },
    { "id": "e-806", "source": "ROL-L4-SCR-003", "target": "ROL-L8-CMP-013", "type": "uses", "label": "RoleFormSection 사용" },
    { "id": "e-807", "source": "ROL-L4-SCR-004", "target": "ROL-L8-CMP-013", "type": "uses", "label": "RoleFormSection 사용" },
    { "id": "e-808", "source": "ROL-L4-SCR-005", "target": "ROL-L8-CMP-003", "type": "uses", "label": "InvertedBadgeCell 사용" },
    { "id": "e-809", "source": "ROL-L4-SCR-005", "target": "ROL-L8-CMP-004", "type": "uses", "label": "ConditionBadgeCell 사용" },
    { "id": "e-810", "source": "ROL-L4-SCR-005", "target": "ROL-L8-CMP-005", "type": "uses", "label": "FieldCountBadgeCell 사용" },
    { "id": "e-811", "source": "ROL-L4-SCR-006", "target": "ROL-L8-CMP-016", "type": "uses", "label": "AbilityInfoSection 사용" },
    { "id": "e-812", "source": "ROL-L4-SCR-006", "target": "ROL-L8-CMP-017", "type": "uses", "label": "AbilityCaslSection 사용" },
    { "id": "e-813", "source": "ROL-L4-SCR-006", "target": "ROL-L8-CMP-018", "type": "uses", "label": "AbilityGrantStatusSection 사용" },
    { "id": "e-814", "source": "ROL-L4-SCR-006", "target": "ROL-L8-CMP-001", "type": "uses", "label": "JsonViewer 사용" },
    { "id": "e-815", "source": "ROL-L4-SCR-006", "target": "ROL-L8-CMP-028", "type": "uses", "label": "DeleteConfirmModal 사용" },
    { "id": "e-816", "source": "ROL-L4-SCR-007", "target": "ROL-L8-CMP-019", "type": "uses", "label": "AbilityFormSection 사용" },
    { "id": "e-817", "source": "ROL-L4-SCR-007", "target": "ROL-L8-CMP-020", "type": "uses", "label": "AbilityCaslFormSection 사용" },
    { "id": "e-818", "source": "ROL-L4-SCR-007", "target": "ROL-L8-CMP-009", "type": "uses", "label": "TagInput 사용" },
    { "id": "e-819", "source": "ROL-L4-SCR-008", "target": "ROL-L8-CMP-019", "type": "uses", "label": "AbilityFormSection 사용" },
    { "id": "e-820", "source": "ROL-L4-SCR-008", "target": "ROL-L8-CMP-020", "type": "uses", "label": "AbilityCaslFormSection 사용" },
    { "id": "e-821", "source": "ROL-L4-SCR-009", "target": "ROL-L8-CMP-006", "type": "uses", "label": "GroupChipCell 사용" },
    { "id": "e-822", "source": "ROL-L4-SCR-009", "target": "ROL-L8-CMP-007", "type": "uses", "label": "ConfigBadgeCell 사용" },
    { "id": "e-823", "source": "ROL-L4-SCR-010", "target": "ROL-L8-CMP-021", "type": "uses", "label": "ActionInfoSection 사용" },
    { "id": "e-824", "source": "ROL-L4-SCR-010", "target": "ROL-L8-CMP-022", "type": "uses", "label": "ActionConfigSection 사용" },
    { "id": "e-825", "source": "ROL-L4-SCR-010", "target": "ROL-L8-CMP-023", "type": "uses", "label": "ActionUsageSection 사용" },
    { "id": "e-826", "source": "ROL-L4-SCR-010", "target": "ROL-L8-CMP-028", "type": "uses", "label": "DeleteConfirmModal 사용" },
    { "id": "e-827", "source": "ROL-L4-SCR-011", "target": "ROL-L8-CMP-024", "type": "uses", "label": "ActionFormSection 사용" },
    { "id": "e-828", "source": "ROL-L4-SCR-011", "target": "ROL-L8-CMP-008", "type": "uses", "label": "JsonEditor 사용" },
    { "id": "e-829", "source": "ROL-L4-SCR-012", "target": "ROL-L8-CMP-024", "type": "uses", "label": "ActionFormSection 사용" },
    { "id": "e-830", "source": "ROL-L4-SCR-013", "target": "ROL-L8-CMP-006", "type": "uses", "label": "GroupChipCell 사용" },
    { "id": "e-831", "source": "ROL-L4-SCR-014", "target": "ROL-L8-CMP-025", "type": "uses", "label": "SubjectInfoSection 사용" },
    { "id": "e-832", "source": "ROL-L4-SCR-014", "target": "ROL-L8-CMP-026", "type": "uses", "label": "SubjectFieldTable 사용" },
    { "id": "e-833", "source": "ROL-L4-SCR-014", "target": "ROL-L8-CMP-027", "type": "uses", "label": "SubjectUsageSection 사용" },
    { "id": "e-834", "source": "ROL-L8-CMP-030", "target": "ROL-L8-CMP-014", "type": "uses", "label": "GrantBatchTable 사용" },
    { "id": "e-835", "source": "ROL-L8-CMP-030", "target": "ROL-L8-CMP-015", "type": "uses", "label": "GrantChangeSummary 사용" },
    { "id": "e-836", "source": "ROL-L8-CMP-030", "target": "ROL-L8-CMP-029", "type": "uses", "label": "GrantSaveConfirmModal 사용" },
    { "id": "e-837", "source": "ROL-L8-CMP-014", "target": "ROL-L8-CMP-010", "type": "uses", "label": "NumberInput 사용" },
    { "id": "e-838", "source": "ROL-L8-CMP-017", "target": "ROL-L8-CMP-001", "type": "uses", "label": "JsonViewer 사용" }
  ]
}
```

---

## 품질 체크리스트

### L7 체크리스트

- [x] 모든 API가 참조하는 엔티티가 정의되었는가? (Role, Ability, Grant, Action, Subject, RoleAssociation, RoleClassification)
- [x] 필수 필드(id, createdAt, updatedAt)가 포함되었는가?
- [x] 필드 타입이 명시되었는가? (UUID, String, Boolean, DateTime, Json, Int)
- [x] 제약조건(unique, required, FK 등)이 정의되었는가?
- [x] 엔티티 간 관계가 정의되었는가? (Grant -> Ability -> Subject/Action, Role -> Association/Classification)
- [x] 기존 Prisma 스키마와 DTO 구조가 일치하는가?

### L8 체크리스트

- [x] 모든 14개 화면에 필요한 컴포넌트가 식별되었는가?
- [x] 재사용 가능한 기존 컴포넌트가 확인되었는가? (24개 기존 컴포넌트)
- [x] 컴포넌트 유형(ui/inputs/widgets/features)이 분류되었는가?
- [x] 필수 Props가 정의되었는가?
- [x] 각 컴포넌트의 담당 에이전트가 매핑되었는가?
- [x] 컴포넌트 계층 구조(Pure UI -> Widget -> Feature -> Page)가 준수되었는가?
- [x] 상태별 UI(로딩/빈/에러)가 정의되었는가?
- [x] 동적 동작(Subject 선택 시 필드 자동완성, Grant 배치 플로우)이 상세히 기술되었는가?

---

## 컴포넌트 수량 요약

| 유형 | 기존 재사용 | 신규 개발 | 합계 |
|------|:---------:|:--------:|:----:|
| Pure UI (ui) | 12 | 1 (JsonViewer) | 13 |
| Cell (ui/cells) | 5 | 6 | 11 |
| Input (inputs) | 9 | 3 (JsonEditor, TagInput, NumberInput) | 12 |
| Widget (widget) | 5 | 19 | 24 |
| Feature (feature) | 1 (RoleAbilityManager) | 1 (GrantBatchManager) | 2 |
| Store | 0 | 1 (GrantBatchStore) | 1 |
| **합계** | **32** | **31** | **63** |
