# L3-L4: 기능, 화면

## 이전 레이어 요약 (L0-L2)

- **L0 Context**: CASL 기반 RBAC+ABAC 권한 관리 시스템의 관리 UI. Role, Ability, Grant, Action, Subject 도메인을 통합 관리
- **L1 Actor**: 시스템 관리자 (FULL_ACCESS) - 전체 권한 관리 접근 가능
- **L2 Goals**:
  - GOL-001: 역할(Role) 조회 및 관리
  - GOL-002: 역할 생성/수정/삭제
  - GOL-003: 권한 정의(Ability) 조회 및 관리
  - GOL-004: 권한 정의 생성/수정/삭제
  - GOL-005: 권한 배치 할당(Grant) 관리
  - GOL-006: 행위(Action) 조회 및 관리
  - GOL-007: 행위 생성/수정/삭제
  - GOL-008: 대상(Subject) 조회

---

## 도메인 관계 구조

```
Role (역할)
  ├── Grant (다형성 BRIDGE) ← Ability (권한 정의)
  │                              ├── Subject (대상)
  │                              └── Action (행위)
  ├── RoleAssociation → Group (그룹핑)
  ├── RoleClassification → Category (분류, 1:1)
  └── Tenant (User + Space + Role)
```

---

## L3: 기능 (Feature)

### 기능 목록

| ID | 기능명 | 목표 연결 | 우선순위 | 도메인 | 설명 |
|----|--------|----------|----------|--------|------|
| ROL-L3-FEA-001 | 역할 목록 표시 | GOL-001 | 높음 | Role | 등록된 역할 목록 조회 (Group/Category 포함) |
| ROL-L3-FEA-002 | 역할 검색/필터 | GOL-001 | 높음 | Role | 이름, Group, Category별 검색/필터링 |
| ROL-L3-FEA-003 | 역할 상세 정보 | GOL-001 | 높음 | Role | 역할 상세 + 할당된 Ability 목록 표시 |
| ROL-L3-FEA-004 | 역할 등록 폼 | GOL-002 | 높음 | Role | 역할 생성 (name, displayName, description, Group, Category) |
| ROL-L3-FEA-005 | 역할 수정 폼 | GOL-002 | 높음 | Role | 역할 정보 수정 (시스템 역할 보호) |
| ROL-L3-FEA-006 | 역할 삭제 | GOL-002 | 중간 | Role | 역할 삭제 (시스템 역할/연결된 사용자 보호) |
| ROL-L3-FEA-007 | Grant 배치 할당 | GOL-005 | 높음 | Grant | Role에 Ability 배치 할당/해제 (체크박스 매트릭스) |
| ROL-L3-FEA-008 | 권한 정의 목록 표시 | GOL-003 | 높음 | Ability | Ability 목록 (Subject, Action 포함) |
| ROL-L3-FEA-009 | 권한 정의 검색/필터 | GOL-003 | 중간 | Ability | Subject, Action, inverted 기준 필터링 |
| ROL-L3-FEA-010 | 권한 정의 상세 | GOL-003 | 높음 | Ability | fields, conditions, inverted, reason 상세 표시 |
| ROL-L3-FEA-011 | 권한 정의 등록 폼 | GOL-004 | 높음 | Ability | Subject/Action 선택 + ABAC 조건 설정 |
| ROL-L3-FEA-012 | 권한 정의 수정 폼 | GOL-004 | 높음 | Ability | 기존 권한 정의 수정 |
| ROL-L3-FEA-013 | 권한 정의 삭제 | GOL-004 | 중간 | Ability | 권한 정의 소프트 삭제 |
| ROL-L3-FEA-014 | 행위 목록 표시 | GOL-006 | 높음 | Action | Action 목록 (그룹별 필터 포함) |
| ROL-L3-FEA-015 | 행위 검색/필터 | GOL-006 | 중간 | Action | name, group, isSystem 기준 필터링 |
| ROL-L3-FEA-016 | 행위 상세 | GOL-006 | 높음 | Action | config(마스킹 설정) 포함 상세 정보 |
| ROL-L3-FEA-017 | 행위 등록 폼 | GOL-007 | 높음 | Action | Action 생성 (name, group, config) |
| ROL-L3-FEA-018 | 행위 수정 폼 | GOL-007 | 높음 | Action | Action 수정 (시스템 Action 보호) |
| ROL-L3-FEA-019 | 행위 삭제 | GOL-007 | 중간 | Action | Action 삭제 (시스템 Action 보호) |
| ROL-L3-FEA-020 | 대상 목록 표시 | GOL-008 | 높음 | Subject | Subject 목록 (그룹별 필터 포함) |
| ROL-L3-FEA-021 | 대상 상세 + 필드 | GOL-008 | 높음 | Subject | Subject 상세 + DMMF 필드 목록 |

### 기능 상세

#### ROL-L3-FEA-001: 역할 목록 표시

**설명**: 등록된 역할을 목록으로 표시합니다. Group/Category 정보를 함께 표시합니다.

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 정렬 | 설명 |
|------|------|------|------|------|
| 역할 식별자 | name | 180px | 지원 | 영문 대문자+언더스코어 |
| 표시명 | displayName | 180px | 지원 | 한글 표시명 |
| 설명 | description | flex | - | 설명 (말줄임) |
| 카테고리 | classification.category.name | 120px | - | RoleClassification 경유 |
| 그룹 | associations[0].group.name | 120px | - | RoleAssociation 경유 |
| 시스템 | isSystem | 80px | - | Badge 표시 |
| 생성일 | createdAt | 120px | 지원 | - |

**페이지네이션**: 없음 (전체 목록, 일반적으로 역할 수가 적으므로)

#### ROL-L3-FEA-003: 역할 상세 정보

**설명**: 역할의 상세 정보와 함께 해당 역할에 할당된 Ability 목록을 표시합니다.

**표시 섹션**:
1. **기본 정보**: name, displayName, description, isSystem
2. **분류 정보**: Category (RoleClassification 경유), Group (RoleAssociation 경유)
3. **할당된 권한 (Grant)**: 해당 Role에 연결된 Ability 목록 + isActive/priority 상태
4. **연결된 사용자**: Tenant를 통해 이 역할을 가진 사용자 수 표시

#### ROL-L3-FEA-004: 역할 등록 폼

**필드**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | Text Input | O | 역할 식별자 (영문 대문자+언더스코어, unique) |
| displayName | Text Input | X | 한글 표시명 |
| description | Textarea | X | 역할 설명 |
| groupId | Select | X | 소속 Group 선택 (RoleAssociation 생성) |
| categoryId | Select | X | 분류 Category 선택 (RoleClassification 생성) |

#### ROL-L3-FEA-007: Grant 배치 할당

**설명**: 역할 상세 화면 내에서 Ability를 배치로 할당/해제합니다.

**동작**:
- Subject x Action 매트릭스 형태로 Ability 표시
- 체크/해제로 Grant 생성/삭제
- isActive 토글, priority 조정 가능
- 변경사항을 모아서 일괄 저장 (PUT /api/v1/grants/roles/:roleId)

#### ROL-L3-FEA-008: 권한 정의 목록 표시

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 정렬 | 설명 |
|------|------|------|------|------|
| 이름 | name | 200px | 지원 | 고유 권한 이름 |
| Subject | subject.displayName | 150px | - | 권한 대상 |
| Action | action.displayName | 150px | - | 행위 |
| 거부 | inverted | 80px | - | can/cannot Badge |
| 조건 | conditions | 100px | - | 조건 유무 Badge |
| 필드 제한 | fields | 100px | - | 필드 수 Badge |
| 생성일 | createdAt | 120px | 지원 | - |

**페이지네이션**: 페이지당 20건, 크기 변경 10/20/50

#### ROL-L3-FEA-011: 권한 정의 등록 폼

**필드**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | Text Input | O | 권한 정의 이름 (unique) |
| description | Textarea | X | 설명 |
| subjectId | Select (검색 가능) | O | Subject 선택 |
| actionId | Select (검색 가능) | O | Action 선택 |
| fields | Tag Input | X | 제한할 필드 목록 (Subject 선택 시 DMMF 필드에서 자동 완성) |
| conditions | JSON Editor | X | ABAC 조건 (JSON) |
| inverted | Switch | X | 거부 규칙 여부 (기본: false) |
| reason | Text Input | X | 거부 사유 (inverted=true일 때만 활성화) |

#### ROL-L3-FEA-014: 행위 목록 표시

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 정렬 | 설명 |
|------|------|------|------|------|
| 이름 | name | 200px | 지원 | action 식별자 |
| 표시명 | displayName | 180px | 지원 | 한글 표시명 |
| 그룹 | group | 120px | - | crud/visibility/workflow 등 |
| 설정 | config | 100px | - | 마스킹 설정 유무 Badge |
| 시스템 | isSystem | 80px | - | Badge |
| 정렬 순서 | order | 80px | 지원 | - |

**페이지네이션**: 없음 (전체 목록)

#### ROL-L3-FEA-017: 행위 등록 폼

**필드**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | Text Input | O | Action 식별자 (unique, 예: read:masked:email) |
| displayName | Text Input | X | 한글 표시명 |
| description | Textarea | X | 설명 |
| group | Select | X | 그룹 (crud/visibility/workflow/bulk) |
| order | Number Input | X | 정렬 순서 (기본: 0) |
| isSystem | Switch | X | 시스템 여부 (기본: false) |
| config | JSON Editor | X | 마스킹/변환 설정 (예: `{ "type": "masking", "preset": "PRESET_EMAIL" }`) |

#### ROL-L3-FEA-020: 대상 목록 표시

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 정렬 | 설명 |
|------|------|------|------|------|
| 이름 | name | 200px | 지원 | Subject 식별자 |
| 표시명 | displayName | 180px | 지원 | 한글 표시명 |
| 그룹 | group | 120px | - | entity/menu/feature/ui |
| 아이콘 | icon | 60px | - | 아이콘 표시 |
| 시스템 | isSystem | 80px | - | Prisma 모델 기반 여부 |
| 정렬 순서 | order | 80px | 지원 | - |

**페이지네이션**: 없음 (전체 목록)

#### ROL-L3-FEA-021: 대상 상세 + 필드

**설명**: Subject 상세 정보와 DMMF에서 가져온 필드 목록을 표시합니다.

**필드 목록 표시 컬럼**:

| 컬럼 | 필드 | 설명 |
|------|------|------|
| 필드명 | name | Prisma 모델 필드명 |
| 타입 | type | String, Int, DateTime 등 |
| 필수 여부 | isRequired | 필수 필드 Badge |
| 관계 | isRelation | 관계 필드 여부 |

---

## L4: 화면 (Screen)

### 화면 목록

| ID | 화면명 | 경로 | 기능 연결 | 설명 |
|----|--------|------|----------|------|
| ROL-L4-SCR-001 | 역할 목록 | /roles | FEA-001, FEA-002 | 역할 목록 조회 + 검색/필터 |
| ROL-L4-SCR-002 | 역할 상세 | /roles/[roleId] | FEA-003, FEA-006, FEA-007 | 역할 상세 + Grant 배치 할당 |
| ROL-L4-SCR-003 | 역할 등록 | /roles/new | FEA-004 | 역할 생성 폼 |
| ROL-L4-SCR-004 | 역할 수정 | /roles/[roleId]/edit | FEA-005 | 역할 수정 폼 |
| ROL-L4-SCR-005 | 권한 정의 목록 | /abilities | FEA-008, FEA-009 | Ability 목록 조회 |
| ROL-L4-SCR-006 | 권한 정의 상세 | /abilities/[abilityId] | FEA-010, FEA-013 | Ability 상세 + 삭제 |
| ROL-L4-SCR-007 | 권한 정의 등록 | /abilities/new | FEA-011 | Ability 생성 폼 |
| ROL-L4-SCR-008 | 권한 정의 수정 | /abilities/[abilityId]/edit | FEA-012 | Ability 수정 폼 |
| ROL-L4-SCR-009 | 행위 목록 | /actions | FEA-014, FEA-015 | Action 목록 조회 |
| ROL-L4-SCR-010 | 행위 상세 | /actions/[actionId] | FEA-016, FEA-019 | Action 상세 + 삭제 |
| ROL-L4-SCR-011 | 행위 등록 | /actions/new | FEA-017 | Action 생성 폼 |
| ROL-L4-SCR-012 | 행위 수정 | /actions/[actionId]/edit | FEA-018 | Action 수정 폼 |
| ROL-L4-SCR-013 | 대상 목록 | /subjects | FEA-020 | Subject 목록 조회 |
| ROL-L4-SCR-014 | 대상 상세 | /subjects/[subjectId] | FEA-021 | Subject 상세 + 필드 목록 |

### 화면 상세

---

#### ROL-L4-SCR-001: 역할 목록 화면

**경로**: `/roles`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 역할 관리                                        │ │
│ │ Description: 시스템의 역할을 관리합니다                  │ │
│ │ Actions: [+ 역할 등록]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 검색/필터 영역                                          │ │
│ │ [검색어 입력...]  [카테고리 ▼]  [그룹 ▼]  [시스템 ▼]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                │ │
│ │ ┌────────┬───────┬────────┬────────┬──────┬─────┬─────┐│ │
│ │ │식별자  │표시명 │설명    │카테고리│그룹  │시스템│생성일││ │
│ │ ├────────┼───────┼────────┼────────┼──────┼─────┼─────┤│ │
│ │ │FULL_AC.│전체   │시스템..│PLATFORM│TRUST.│ ✅  │...  ││ │
│ │ │MANAGE  │관리   │관리자..│WORKSPA.│STAND.│ ✅  │...  ││ │
│ │ │VIEW    │조회   │조회..  │PUBLIC  │STAND.│ ✅  │...  ││ │
│ │ │CUSTOM_1│커스텀 │사용자..│ -      │ -    │ ❌  │...  ││ │
│ │ └────────┴───────┴────────┴────────┴──────┴─────┴─────┘│ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**UI 상태**:

| 상태 | 조건 | 표시 |
|------|------|------|
| 로딩 | API 호출 중 | DataGrid 스켈레톤 |
| 빈 상태 | 결과 0건 | "등록된 역할이 없습니다" |
| 에러 | API 실패 | 에러 메시지 + 재시도 버튼 |
| 정상 | 데이터 있음 | 목록 표시 |

**권한 체크**: `can('read', 'role')` - MANAGE, FULL_ACCESS

---

#### ROL-L4-SCR-002: 역할 상세 화면

**경로**: `/roles/[roleId]`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: FULL_ACCESS (전체 접근)                           │ │
│ │ Description: 시스템의 모든 기능에 접근 가능합니다         │ │
│ │ Actions: [수정] [삭제]                                  │ │
│ │          (시스템 역할이면 수정/삭제 버튼 disabled)       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 역할 식별자:   FULL_ACCESS                              │ │
│ │ 표시명:        전체 접근                                 │ │
│ │ 설명:          시스템의 모든 기능에 접근 가능합니다       │ │
│ │ 시스템 역할:   ✅ 예                                     │ │
│ │ 생성일:        2026-01-15 10:30                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 분류 정보                               │ │
│ │ 카테고리:      PLATFORM                                 │ │
│ │ 그룹:          TRUSTED                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 할당된 권한 (Grant 배치 할당)           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ [Subject 필터 ▼]  [Action 필터 ▼]     [일괄 저장]  │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ ┌──────────┬──────┬──────┬──────┬────────┬──────────┐  │ │
│ │ │ Ability  │ Sub. │ Act. │활성화│우선순위│ 할당     │  │ │
│ │ ├──────────┼──────┼──────┼──────┼────────┼──────────┤  │ │
│ │ │Read User │ user │ read │ ✅   │   0    │ ☑        │  │ │
│ │ │Create Us.│ user │create│ ✅   │   0    │ ☑        │  │ │
│ │ │Read Email│ user │r:mas.│ ❌   │   5    │ ☑        │  │ │
│ │ │Read Role │ role │ read │ ✅   │   0    │ ☐        │  │ │
│ │ └──────────┴──────┴──────┴──────┴────────┴──────────┘  │ │
│ │ 변경사항: 2건 (할당 추가 1, 해제 1)    [일괄 저장]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 연결된 사용자 (읽기 전용)               │ │
│ │ 이 역할을 보유한 사용자: 15명                            │ │
│ │ (상세 조회는 이용자 목록에서 역할 필터로 확인)           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Grant 배치 할당 동작**:
1. 전체 Ability 목록과 현재 Role의 Grant 목록을 조합하여 표시
2. 체크박스로 할당/해제 변경
3. isActive 토글, priority 직접 입력 가능
4. 변경사항 카운트 표시 후 "일괄 저장" 클릭 시 PUT /api/v1/grants/roles/:roleId 호출
5. 저장 완료 후 Grant 목록 재조회

**권한 체크**: `can('read', 'role')` (조회), `can('update', 'role')` (수정/삭제/Grant 관리)

---

#### ROL-L4-SCR-003: 역할 등록 화면

**경로**: `/roles/new`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 역할 등록                                        │ │
│ │ Description: 새로운 역할을 등록합니다                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 역할 식별자:   [________________] (영문 대문자+_)       │ │
│ │ 표시명:        [________________]                       │ │
│ │ 설명:          [________________]                       │ │
│ │                [________________]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 분류 설정                               │ │
│ │ 카테고리:      [카테고리 선택 ▼]                         │ │
│ │ 그룹:          [그룹 선택 ▼]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [취소] [등록]                                                │
└─────────────────────────────────────────────────────────────┘
```

**유효성 검증**:
- name: 필수, 영문 대문자+언더스코어만 허용, 중복 불가
- displayName, description: 선택

**권한 체크**: `can('create', 'role')` - FULL_ACCESS 전용

---

#### ROL-L4-SCR-004: 역할 수정 화면

**경로**: `/roles/[roleId]/edit`

**레이아웃**: 등록 화면(SCR-003)과 동일한 구조이나 기존 데이터를 prefill

**제약사항**:
- 시스템 역할(isSystem=true)은 접근 차단 (목록으로 리다이렉트)
- name은 수정 불가 (readonly)
- displayName, description만 수정 가능

**권한 체크**: `can('update', 'role')` - FULL_ACCESS 전용

---

#### ROL-L4-SCR-005: 권한 정의 목록 화면

**경로**: `/abilities`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 권한 정의                                        │ │
│ │ Description: 시스템의 권한 정의(Ability)를 관리합니다    │ │
│ │ Actions: [+ 권한 정의 등록]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 검색/필터 영역                                          │ │
│ │ [이름 검색...]  [Subject ▼]  [Action ▼]  [유형 ▼]      │ │
│ │                              허용/거부 필터              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                │ │
│ │ ┌──────────┬────────┬────────┬─────┬─────┬──────┬─────┐│ │
│ │ │이름      │Subject │Action  │거부 │조건 │필드  │생성일││ │
│ │ ├──────────┼────────┼────────┼─────┼─────┼──────┼─────┤│ │
│ │ │Read User │ user   │ read   │     │     │      │...  ││ │
│ │ │Create Us.│ user   │ create │     │     │      │...  ││ │
│ │ │Deny Dele.│ role   │ delete │ ⛔  │ ✅  │      │...  ││ │
│ │ │Read Mask.│ user   │ r:mask │     │     │ 3    │...  ││ │
│ │ └──────────┴────────┴────────┴─────┴─────┴──────┴─────┘│ │
│ │ [Pagination: < 1 2 3 ... >]  [페이지 크기: 20 ▼]      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**권한 체크**: `can('read', 'ability')` - MANAGE, FULL_ACCESS

---

#### ROL-L4-SCR-006: 권한 정의 상세 화면

**경로**: `/abilities/[abilityId]`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: Read User Email Masked                           │ │
│ │ Description: 사용자 이메일 마스킹 읽기 권한              │ │
│ │ Actions: [수정] [삭제]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:          Read User Email Masked                   │ │
│ │ 설명:          사용자 이메일을 마스킹하여 조회            │ │
│ │ 생성일:        2026-01-20 14:30                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: CASL 설정                               │ │
│ │ Subject:       user (이용자)                            │ │
│ │ Action:        read:masked:email (이메일 마스킹 읽기)   │ │
│ │ 유형:          ✅ 허용 (can)                             │ │
│ │ 제한 필드:     email, phone, name                       │ │
│ │ 조건:          { "departmentId": "${user.dept}" }       │ │
│ │ 거부 사유:     -                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 할당 현황 (읽기 전용)                   │ │
│ │ 이 권한이 할당된 Role: 3개                               │ │
│ │ • FULL_ACCESS (우선순위: 0, 활성)                        │ │
│ │ • MANAGE (우선순위: 0, 활성)                             │ │
│ │ • CUSTOM_VIEWER (우선순위: 5, 비활성)                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**권한 체크**: `can('read', 'ability')` (조회), `can('delete', 'ability')` (삭제)

---

#### ROL-L4-SCR-007: 권한 정의 등록 화면

**경로**: `/abilities/new`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 권한 정의 등록                                   │ │
│ │ Description: 새로운 권한 정의를 등록합니다               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:          [________________]                       │ │
│ │ 설명:          [________________]                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: CASL 설정                               │ │
│ │ Subject:       [Subject 검색/선택 ▼]                    │ │
│ │ Action:        [Action 검색/선택 ▼]                     │ │
│ │ 유형:          ○ 허용 (can)  ○ 거부 (cannot)            │ │
│ │ 거부 사유:     [________________] (거부 시만 활성화)     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 상세 설정 (선택)                        │ │
│ │ 제한 필드:     [필드 선택 ▼] (Subject의 DMMF 필드)     │ │
│ │                [email ✕] [phone ✕] [+ 추가]             │ │
│ │ 조건 (JSON):   ┌──────────────────────────────────────┐ │ │
│ │                │ {                                      │ │ │
│ │                │   "departmentId": "${user.dept}"       │ │ │
│ │                │ }                                      │ │ │
│ │                └──────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [취소] [등록]                                                │
└─────────────────────────────────────────────────────────────┘
```

**동적 동작**:
- Subject 선택 시 → 해당 Subject의 DMMF 필드를 자동 조회 → 필드 선택 자동완성 활성화
- 거부(inverted) 선택 시 → 거부 사유 입력 필드 활성화

**권한 체크**: `can('create', 'ability')` - FULL_ACCESS 전용

---

#### ROL-L4-SCR-008: 권한 정의 수정 화면

**경로**: `/abilities/[abilityId]/edit`

**레이아웃**: 등록 화면(SCR-007)과 동일한 구조이나 기존 데이터를 prefill

**권한 체크**: `can('update', 'ability')` - FULL_ACCESS 전용

---

#### ROL-L4-SCR-009: 행위 목록 화면

**경로**: `/actions`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 행위 관리                                        │ │
│ │ Description: 권한 행위(Action)를 관리합니다              │ │
│ │ Actions: [+ 행위 등록]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 필터 영역                                               │ │
│ │ [검색어 입력...]  [그룹 ▼]  [시스템 여부 ▼]             │ │
│ │                    crud/visibility/workflow/bulk         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                │ │
│ │ ┌────────────┬────────┬──────┬──────┬──────┬───────┐   │ │
│ │ │이름        │표시명  │그룹  │설정  │시스템│정렬   │   │ │
│ │ ├────────────┼────────┼──────┼──────┼──────┼───────┤   │ │
│ │ │create      │생성    │crud  │      │ ✅   │  0    │   │ │
│ │ │read        │읽기    │crud  │      │ ✅   │  1    │   │ │
│ │ │read:masked:│이메일..│visi..│ ✅   │ ❌   │ 10    │   │ │
│ │ │update      │수정    │crud  │      │ ✅   │  2    │   │ │
│ │ │delete      │삭제    │crud  │      │ ✅   │  3    │   │ │
│ │ └────────────┴────────┴──────┴──────┴──────┴───────┘   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**권한 체크**: Public (인증 불필요, 조회만)

---

#### ROL-L4-SCR-010: 행위 상세 화면

**경로**: `/actions/[actionId]`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: read:masked:email                                │ │
│ │ Description: 이메일 마스킹 읽기                          │ │
│ │ Actions: [수정] [삭제]                                  │ │
│ │          (시스템 Action이면 disabled)                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:          read:masked:email                        │ │
│ │ 표시명:        이메일 마스킹 읽기                        │ │
│ │ 설명:          이메일 필드를 마스킹하여 표시              │ │
│ │ 그룹:          visibility                               │ │
│ │ 정렬 순서:     10                                       │ │
│ │ 시스템 여부:   ❌ 아니오                                 │ │
│ │ 생성일:        2026-01-20 14:30                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 설정 (Config)                           │ │
│ │ ┌──────────────────────────────────────────────────────┐│ │
│ │ │ {                                                     ││ │
│ │ │   "type": "masking",                                  ││ │
│ │ │   "preset": "PRESET_EMAIL"                            ││ │
│ │ │ }                                                     ││ │
│ │ └──────────────────────────────────────────────────────┘│ │
│ │ (config가 없으면 "설정 없음" 표시)                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 사용 현황 (읽기 전용)                   │ │
│ │ 이 Action을 사용하는 Ability: 5개                        │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**권한 체크**: 조회는 Public, 수정/삭제는 RoleCategoryGuard(WORKSPACE)

---

#### ROL-L4-SCR-011: 행위 등록 화면

**경로**: `/actions/new`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 행위 등록                                        │ │
│ │ Description: 새로운 행위(Action)를 등록합니다            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:          [________________] (예: read:masked:phone)│ │
│ │ 표시명:        [________________]                       │ │
│ │ 설명:          [________________]                       │ │
│ │ 그룹:          [그룹 선택 ▼] crud/visibility/workflow   │ │
│ │ 정렬 순서:     [0__]                                    │ │
│ │ 시스템 여부:   ☐                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 설정 (Config) - 선택                    │ │
│ │ ┌──────────────────────────────────────────────────────┐│ │
│ │ │ JSON 에디터                                           ││ │
│ │ │ {                                                     ││ │
│ │ │   "type": "masking",                                  ││ │
│ │ │   "preset": ""                                        ││ │
│ │ │ }                                                     ││ │
│ │ └──────────────────────────────────────────────────────┘│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [취소] [등록]                                                │
└─────────────────────────────────────────────────────────────┘
```

**유효성 검증**:
- name: 필수, unique, 영소문자+콜론+언더스코어
- config: JSON 형식 유효성 검사

**권한 체크**: RoleCategoryGuard(WORKSPACE)

---

#### ROL-L4-SCR-012: 행위 수정 화면

**경로**: `/actions/[actionId]/edit`

**레이아웃**: 등록 화면(SCR-011)과 동일한 구조이나 기존 데이터를 prefill

**제약사항**:
- 시스템 Action(isSystem=true)은 접근 차단 (목록으로 리다이렉트)

**권한 체크**: RoleCategoryGuard(WORKSPACE)

---

#### ROL-L4-SCR-013: 대상 목록 화면

**경로**: `/subjects`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: 대상 관리                                        │ │
│ │ Description: 권한 대상(Subject)을 조회합니다             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 필터 영역                                               │ │
│ │ [검색어 입력...]  [그룹 ▼]  [시스템 여부 ▼]             │ │
│ │                    entity/menu/feature/ui                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                │ │
│ │ ┌──────────────┬────────┬────────┬─────┬──────┬──────┐ │ │
│ │ │이름          │표시명  │그룹    │아이콘│시스템│정렬  │ │ │
│ │ ├──────────────┼────────┼────────┼─────┼──────┼──────┤ │ │
│ │ │entity:User   │이용자  │entity  │ 👤  │ ✅   │  0   │ │ │
│ │ │entity:Role   │역할    │entity  │ 🔑  │ ✅   │  1   │ │ │
│ │ │menu:dashboard│대시보드│menu    │ 📊  │ ✅   │  0   │ │ │
│ │ │feature:export│내보내기│feature │ 📁  │ ❌   │  0   │ │ │
│ │ └──────────────┴────────┴────────┴─────┴──────┴──────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**특이사항**: Subject는 조회 전용 (DMMF 동기화로 자동 생성, CRUD 없음)

**권한 체크**: Public (인증 불필요, 조회만)

---

#### ROL-L4-SCR-014: 대상 상세 화면

**경로**: `/subjects/[subjectId]`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: entity:User (이용자)                             │ │
│ │ Description: Prisma 모델 기반 Subject                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                               │ │
│ │ 이름:          entity:User                              │ │
│ │ 표시명:        이용자                                    │ │
│ │ 그룹:          entity                                   │ │
│ │ 아이콘:        👤                                        │ │
│ │ 시스템 여부:   ✅ 예                                     │ │
│ │ 정렬 순서:     0                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 필드 목록 (DMMF)                        │ │
│ │ ┌──────────────┬───────────┬──────┬──────┐              │ │
│ │ │필드명        │타입       │필수  │관계  │              │ │
│ │ ├──────────────┼───────────┼──────┼──────┤              │ │
│ │ │id            │String     │ ✅   │      │              │ │
│ │ │name          │String     │ ✅   │      │              │ │
│ │ │email         │String     │ ✅   │      │              │ │
│ │ │phone         │String     │      │      │              │ │
│ │ │tenants       │Tenant[]   │      │ ✅   │              │ │
│ │ │createdAt     │DateTime   │ ✅   │      │              │ │
│ │ └──────────────┴───────────┴──────┴──────┘              │ │
│ │ (entity:xxx Subject만 필드 목록 표시)                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 사용 현황 (읽기 전용)                   │ │
│ │ 이 Subject를 사용하는 Ability: 8개                       │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**권한 체크**: Public (인증 불필요, 조회만)

---

## 라우팅 구조 요약

```
/roles                                → 역할 목록 (ROL-L4-SCR-001)
/roles/new                            → 역할 등록 (ROL-L4-SCR-003)
/roles/[roleId]                       → 역할 상세 + Grant 할당 (ROL-L4-SCR-002)
/roles/[roleId]/edit                  → 역할 수정 (ROL-L4-SCR-004)

/abilities                            → 권한 정의 목록 (ROL-L4-SCR-005)
/abilities/new                        → 권한 정의 등록 (ROL-L4-SCR-007)
/abilities/[abilityId]                → 권한 정의 상세 (ROL-L4-SCR-006)
/abilities/[abilityId]/edit           → 권한 정의 수정 (ROL-L4-SCR-008)

/actions                              → 행위 목록 (ROL-L4-SCR-009)
/actions/new                          → 행위 등록 (ROL-L4-SCR-011)
/actions/[actionId]                   → 행위 상세 (ROL-L4-SCR-010)
/actions/[actionId]/edit              → 행위 수정 (ROL-L4-SCR-012)

/subjects                             → 대상 목록 (ROL-L4-SCR-013)
/subjects/[subjectId]                 → 대상 상세 (ROL-L4-SCR-014)
```

---

## 컴포넌트 구성 (공통)

| 영역 | 컴포넌트 | 유형 | 설명 |
|------|----------|------|------|
| Header | PageSurface | layout | 페이지 래퍼 (title, description, actions) |
| Content | SectionSurface | layout | 섹션 래퍼 (collapsible) |
| Content | DataGrid | ui | 테이블 목록 |
| Filter | SearchInput | inputs | 검색어 입력 |
| Filter | Select | inputs | 필터 셀렉트 |
| Action | Button | ui | 액션 버튼 (등록, 수정, 삭제, 저장) |
| Action | Switch | inputs | 토글 스위치 (isActive, inverted) |
| Detail | JsonViewer | widget | JSON 데이터 표시 (config, conditions) |
| Detail | JsonEditor | widget | JSON 편집기 (config, conditions) |
| Detail | TagInput | inputs | 태그 입력 (fields) |
| Detail | Badge | ui | 상태 표시 (시스템, 허용/거부, 그룹) |
| Grant | Checkbox | inputs | Grant 할당 체크박스 |
| Grant | NumberInput | inputs | priority 입력 |

---

## 화면 간 네비게이션

```
역할 목록 ────→ 역할 등록
    │               ↓ (저장 후)
    ↓               역할 목록
역할 상세 ────→ 역할 수정
    │               ↓ (저장 후)
    │               역할 상세
    │
    └──── Grant 배치 할당 (인라인, 역할 상세 내 섹션)
              │
              └──→ Ability 상세 (클릭 시)

권한 정의 목록 ──→ 권한 정의 등록
    │                  ↓ (저장 후)
    ↓                  권한 정의 목록
권한 정의 상세 ──→ 권한 정의 수정
                       ↓ (저장 후)
                       권한 정의 상세

행위 목록 ────→ 행위 등록
    │               ↓ (저장 후)
    ↓               행위 목록
행위 상세 ────→ 행위 수정

대상 목록 ────→ 대상 상세
```

---

## API 연결 요약

| 화면 | 메서드 | 엔드포인트 | 설명 |
|------|--------|-----------|------|
| 역할 목록 | GET | /api/v1/roles | 역할 전체 목록 |
| 역할 상세 | GET | /api/v1/roles/:id | 역할 상세 |
| 역할 상세 (Grant) | GET | /api/v1/abilities/roles/:roleId | Role별 Ability 목록 |
| 역할 상세 (Grant 저장) | PUT | /api/v1/grants/roles/:roleId | Grant 배치 할당 (신규) |
| 역할 등록 | POST | /api/v1/roles | 역할 생성 |
| 역할 수정 | PATCH | /api/v1/roles/:id | 역할 수정 |
| 역할 삭제 | DELETE | /api/v1/roles/:id | 역할 삭제 |
| 권한 정의 목록 | GET | /api/v1/abilities | Ability 전체 목록 (필터) |
| 권한 정의 상세 | GET | /api/v1/abilities/:id | Ability 상세 |
| 권한 정의 등록 | POST | /api/v1/abilities | Ability 생성 |
| 권한 정의 수정 | PATCH | /api/v1/abilities/:id | Ability 수정 |
| 권한 정의 삭제 | DELETE | /api/v1/abilities/:id | Ability 삭제 |
| 행위 목록 | GET | /api/v1/actions | Action 목록 (group 필터) |
| 행위 상세 | GET | /api/v1/actions/:id | Action 상세 |
| 행위 등록 | POST | /api/v1/actions | Action 생성 |
| 행위 수정 | PATCH | /api/v1/actions/:id | Action 수정 |
| 행위 삭제 | DELETE | /api/v1/actions/:id | Action 삭제 |
| 대상 목록 | GET | /api/v1/subjects | Subject 목록 (group 필터) |
| 대상 상세 | GET | /api/v1/subjects/:id | Subject 상세 |
| 대상 필드 | GET | /api/v1/subjects/:id/fields | DMMF 필드 목록 |

---

## Requirement Graph (L3-L4)

```json
{
  "nodes": [
    { "id": "ROL-L3-FEA-001", "level": 3, "type": "feature", "label": "역할 목록 표시", "description": "등록된 역할 목록 조회 (Group/Category 포함)" },
    { "id": "ROL-L3-FEA-002", "level": 3, "type": "feature", "label": "역할 검색/필터", "description": "이름, Group, Category별 검색/필터링" },
    { "id": "ROL-L3-FEA-003", "level": 3, "type": "feature", "label": "역할 상세 정보", "description": "역할 상세 + 할당된 Ability 목록 표시" },
    { "id": "ROL-L3-FEA-004", "level": 3, "type": "feature", "label": "역할 등록 폼", "description": "역할 생성 (name, displayName, description, Group, Category)" },
    { "id": "ROL-L3-FEA-005", "level": 3, "type": "feature", "label": "역할 수정 폼", "description": "역할 정보 수정 (시스템 역할 보호)" },
    { "id": "ROL-L3-FEA-006", "level": 3, "type": "feature", "label": "역할 삭제", "description": "역할 삭제 (시스템 역할/연결된 사용자 보호)" },
    { "id": "ROL-L3-FEA-007", "level": 3, "type": "feature", "label": "Grant 배치 할당", "description": "Role에 Ability 배치 할당/해제 (체크박스 매트릭스)" },
    { "id": "ROL-L3-FEA-008", "level": 3, "type": "feature", "label": "권한 정의 목록 표시", "description": "Ability 목록 (Subject, Action 포함)" },
    { "id": "ROL-L3-FEA-009", "level": 3, "type": "feature", "label": "권한 정의 검색/필터", "description": "Subject, Action, inverted 기준 필터링" },
    { "id": "ROL-L3-FEA-010", "level": 3, "type": "feature", "label": "권한 정의 상세", "description": "fields, conditions, inverted, reason 상세 표시" },
    { "id": "ROL-L3-FEA-011", "level": 3, "type": "feature", "label": "권한 정의 등록 폼", "description": "Subject/Action 선택 + ABAC 조건 설정" },
    { "id": "ROL-L3-FEA-012", "level": 3, "type": "feature", "label": "권한 정의 수정 폼", "description": "기존 권한 정의 수정" },
    { "id": "ROL-L3-FEA-013", "level": 3, "type": "feature", "label": "권한 정의 삭제", "description": "권한 정의 소프트 삭제" },
    { "id": "ROL-L3-FEA-014", "level": 3, "type": "feature", "label": "행위 목록 표시", "description": "Action 목록 (그룹별 필터 포함)" },
    { "id": "ROL-L3-FEA-015", "level": 3, "type": "feature", "label": "행위 검색/필터", "description": "name, group, isSystem 기준 필터링" },
    { "id": "ROL-L3-FEA-016", "level": 3, "type": "feature", "label": "행위 상세", "description": "config(마스킹 설정) 포함 상세 정보" },
    { "id": "ROL-L3-FEA-017", "level": 3, "type": "feature", "label": "행위 등록 폼", "description": "Action 생성 (name, group, config)" },
    { "id": "ROL-L3-FEA-018", "level": 3, "type": "feature", "label": "행위 수정 폼", "description": "Action 수정 (시스템 Action 보호)" },
    { "id": "ROL-L3-FEA-019", "level": 3, "type": "feature", "label": "행위 삭제", "description": "Action 삭제 (시스템 Action 보호)" },
    { "id": "ROL-L3-FEA-020", "level": 3, "type": "feature", "label": "대상 목록 표시", "description": "Subject 목록 (그룹별 필터 포함)" },
    { "id": "ROL-L3-FEA-021", "level": 3, "type": "feature", "label": "대상 상세 + 필드", "description": "Subject 상세 + DMMF 필드 목록" },
    { "id": "ROL-L4-SCR-001", "level": 4, "type": "screen", "label": "역할 목록", "metadata": { "path": "/roles" } },
    { "id": "ROL-L4-SCR-002", "level": 4, "type": "screen", "label": "역할 상세", "metadata": { "path": "/roles/[roleId]" } },
    { "id": "ROL-L4-SCR-003", "level": 4, "type": "screen", "label": "역할 등록", "metadata": { "path": "/roles/new" } },
    { "id": "ROL-L4-SCR-004", "level": 4, "type": "screen", "label": "역할 수정", "metadata": { "path": "/roles/[roleId]/edit" } },
    { "id": "ROL-L4-SCR-005", "level": 4, "type": "screen", "label": "권한 정의 목록", "metadata": { "path": "/abilities" } },
    { "id": "ROL-L4-SCR-006", "level": 4, "type": "screen", "label": "권한 정의 상세", "metadata": { "path": "/abilities/[abilityId]" } },
    { "id": "ROL-L4-SCR-007", "level": 4, "type": "screen", "label": "권한 정의 등록", "metadata": { "path": "/abilities/new" } },
    { "id": "ROL-L4-SCR-008", "level": 4, "type": "screen", "label": "권한 정의 수정", "metadata": { "path": "/abilities/[abilityId]/edit" } },
    { "id": "ROL-L4-SCR-009", "level": 4, "type": "screen", "label": "행위 목록", "metadata": { "path": "/actions" } },
    { "id": "ROL-L4-SCR-010", "level": 4, "type": "screen", "label": "행위 상세", "metadata": { "path": "/actions/[actionId]" } },
    { "id": "ROL-L4-SCR-011", "level": 4, "type": "screen", "label": "행위 등록", "metadata": { "path": "/actions/new" } },
    { "id": "ROL-L4-SCR-012", "level": 4, "type": "screen", "label": "행위 수정", "metadata": { "path": "/actions/[actionId]/edit" } },
    { "id": "ROL-L4-SCR-013", "level": 4, "type": "screen", "label": "대상 목록", "metadata": { "path": "/subjects" } },
    { "id": "ROL-L4-SCR-014", "level": 4, "type": "screen", "label": "대상 상세", "metadata": { "path": "/subjects/[subjectId]" } }
  ],
  "edges": [
    { "from": "ROL-L2-GOL-001", "to": "ROL-L3-FEA-001", "type": "achieves" },
    { "from": "ROL-L2-GOL-001", "to": "ROL-L3-FEA-002", "type": "achieves" },
    { "from": "ROL-L2-GOL-001", "to": "ROL-L3-FEA-003", "type": "achieves" },
    { "from": "ROL-L2-GOL-002", "to": "ROL-L3-FEA-004", "type": "achieves" },
    { "from": "ROL-L2-GOL-002", "to": "ROL-L3-FEA-005", "type": "achieves" },
    { "from": "ROL-L2-GOL-002", "to": "ROL-L3-FEA-006", "type": "achieves" },
    { "from": "ROL-L2-GOL-003", "to": "ROL-L3-FEA-008", "type": "achieves" },
    { "from": "ROL-L2-GOL-003", "to": "ROL-L3-FEA-009", "type": "achieves" },
    { "from": "ROL-L2-GOL-003", "to": "ROL-L3-FEA-010", "type": "achieves" },
    { "from": "ROL-L2-GOL-004", "to": "ROL-L3-FEA-011", "type": "achieves" },
    { "from": "ROL-L2-GOL-004", "to": "ROL-L3-FEA-012", "type": "achieves" },
    { "from": "ROL-L2-GOL-004", "to": "ROL-L3-FEA-013", "type": "achieves" },
    { "from": "ROL-L2-GOL-005", "to": "ROL-L3-FEA-007", "type": "achieves" },
    { "from": "ROL-L2-GOL-006", "to": "ROL-L3-FEA-014", "type": "achieves" },
    { "from": "ROL-L2-GOL-006", "to": "ROL-L3-FEA-015", "type": "achieves" },
    { "from": "ROL-L2-GOL-006", "to": "ROL-L3-FEA-016", "type": "achieves" },
    { "from": "ROL-L2-GOL-007", "to": "ROL-L3-FEA-017", "type": "achieves" },
    { "from": "ROL-L2-GOL-007", "to": "ROL-L3-FEA-018", "type": "achieves" },
    { "from": "ROL-L2-GOL-007", "to": "ROL-L3-FEA-019", "type": "achieves" },
    { "from": "ROL-L2-GOL-008", "to": "ROL-L3-FEA-020", "type": "achieves" },
    { "from": "ROL-L2-GOL-008", "to": "ROL-L3-FEA-021", "type": "achieves" },
    { "from": "ROL-L3-FEA-001", "to": "ROL-L4-SCR-001", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-002", "to": "ROL-L4-SCR-001", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-003", "to": "ROL-L4-SCR-002", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-006", "to": "ROL-L4-SCR-002", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-007", "to": "ROL-L4-SCR-002", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-004", "to": "ROL-L4-SCR-003", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-005", "to": "ROL-L4-SCR-004", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-008", "to": "ROL-L4-SCR-005", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-009", "to": "ROL-L4-SCR-005", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-010", "to": "ROL-L4-SCR-006", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-013", "to": "ROL-L4-SCR-006", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-011", "to": "ROL-L4-SCR-007", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-012", "to": "ROL-L4-SCR-008", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-014", "to": "ROL-L4-SCR-009", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-015", "to": "ROL-L4-SCR-009", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-016", "to": "ROL-L4-SCR-010", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-019", "to": "ROL-L4-SCR-010", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-017", "to": "ROL-L4-SCR-011", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-018", "to": "ROL-L4-SCR-012", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-020", "to": "ROL-L4-SCR-013", "type": "displayed_on" },
    { "from": "ROL-L3-FEA-021", "to": "ROL-L4-SCR-014", "type": "displayed_on" }
  ]
}
```
