# 04. UI 상세 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.
> 최종 수정일: 2026-02-07 (seq 제거, Ability/Grant 분리, Grant 다형성 구조 반영)

## 엔티티 (L7)

### Role 엔티티

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-001 | id | UUID | PK | 고유 식별자 |
| L7-FLD-002 | name | String | unique, required | 역할 식별자 (영문 대문자) |
| L7-FLD-003 | displayName | String | optional | 표시명 (한글) |
| L7-FLD-004 | description | String | optional | 역할 설명 |
| L7-FLD-005 | isSystem | Boolean | default: false | 시스템 역할 여부 |
| L7-FLD-006 | createdAt | DateTime | default: now | 생성일 |
| L7-FLD-007 | updatedAt | DateTime | auto | 수정일 |
| L7-FLD-008 | removedAt | DateTime | optional | 삭제일 (소프트 삭제) |

### Ability 엔티티 (권한 정의 - REFERENCE)

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-010 | id | UUID | PK | 고유 식별자 |
| L7-FLD-011 | name | String | unique, required | 권한 이름 (재사용 가능한 고유 이름) |
| L7-FLD-012 | description | String | optional | 권한 설명 |
| L7-FLD-013 | subjectId | UUID | FK, required | Subject 참조 |
| L7-FLD-014 | actionId | UUID | FK, required | Action 참조 |
| L7-FLD-015 | fields | String[] | default: [] | 대상 필드 목록 |
| L7-FLD-016 | conditions | JSON | optional | ABAC 조건 |
| L7-FLD-017 | inverted | Boolean | default: false | can/cannot 구분 |
| L7-FLD-018 | reason | String | optional | 거부 사유 |

### Grant 엔티티 (권한 부여 - BRIDGE, 다형성)

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-020 | id | UUID | PK | 고유 식별자 |
| L7-FLD-021 | granteeType | String | required | 부여 대상 유형 ("Role" \| "User") |
| L7-FLD-022 | granteeId | String | required | 부여 대상 ID (roleId 또는 userId) |
| L7-FLD-023 | abilityId | UUID | FK, required | 부여할 Ability |
| L7-FLD-024 | isActive | Boolean | default: true | 활성화 여부 |
| L7-FLD-025 | priority | Int | default: 0 | 우선순위 (User: 10+, Role: 0-9) |
| L7-FLD-026 | createdAt | DateTime | default: now | 생성일 |
| L7-FLD-027 | updatedAt | DateTime | auto | 수정일 |
| L7-FLD-028 | removedAt | DateTime | optional | 삭제일 (소프트 삭제) |

**고유 제약조건**: `@@unique([granteeType, granteeId, abilityId])` - 동일 대상에 같은 Ability 중복 부여 방지

### Subject 엔티티

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-030 | id | UUID | PK | 고유 식별자 |
| L7-FLD-031 | name | String | unique, required | Subject 이름 |
| L7-FLD-032 | displayName | String | optional | 표시명 |
| L7-FLD-033 | icon | String | optional | 아이콘 |
| L7-FLD-034 | order | Int | default: 0 | 정렬 순서 |
| L7-FLD-035 | isSystem | Boolean | default: true | 시스템 여부 |
| L7-FLD-036 | group | String | optional | 그룹 (entity, menu, feature) |

### Action 엔티티

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-040 | id | UUID | PK | 고유 식별자 |
| L7-FLD-041 | name | String | unique, required | Action 이름 |
| L7-FLD-042 | displayName | String | optional | 표시명 |
| L7-FLD-043 | description | String | optional | 설명 |
| L7-FLD-044 | group | String | optional | 그룹 (crud, visibility, bulk) |
| L7-FLD-045 | order | Int | default: 0 | 정렬 순서 |
| L7-FLD-046 | isSystem | Boolean | default: true | 시스템 여부 |
| L7-FLD-047 | config | JSON | optional | Action 설정 (마스킹 등) |

---

## ERD

```
┌──────────────────┐
│      Role        │
├──────────────────┤
│ id (PK)          │
│ name             │
│ displayName      │
│ isSystem         │
└────────┬─────────┘
         │
         │ granteeType="Role"
         │ granteeId=role.id
         │
         ▼
┌──────────────────────────────────────────────────────┐
│                      Grant (BRIDGE)                   │
├──────────────────────────────────────────────────────┤
│ id (PK)                                               │
│ granteeType ("Role" | "User")  ← 다형성 FK            │
│ granteeId (roleId 또는 userId)                        │
│ abilityId (FK) ──────────────────────────────────┐    │
│ isActive, priority                               │    │
│ @@unique([granteeType, granteeId, abilityId])    │    │
└──────────────────────────────────────────────────┘    │
         ▲                                              │
         │ granteeType="User"                           │
         │ granteeId=user.id                            │
         │                                              │
┌────────┴─────────┐                                    │
│      User        │                                    │
├──────────────────┤                                    │
│ id (PK)          │                                    │
│ ...              │                                    │
└──────────────────┘                                    │
                                                        │
         ┌──────────────────────────────────────────────┘
         ▼
┌──────────────────────────────────────────────────────┐
│                   Ability (REFERENCE)                  │
├──────────────────────────────────────────────────────┤
│ id (PK)                                               │
│ name (unique)                                         │
│ subjectId (FK) ──────────────────────────────────┐    │
│ actionId (FK) ───────────────────────────────────┼──┐ │
│ fields[], conditions, inverted                   │  │ │
└──────────────────────────────────────────────────┘  │ │
                                                      │ │
         ┌────────────────────────────────────────────┘ │
         ▼                                              │
┌──────────────────┐                                    │
│     Subject      │                                    │
├──────────────────┤       ┌────────────────────────────┘
│ id (PK)          │       ▼
│ name             │  ┌──────────────────┐
│ displayName      │  │      Action      │
│ group            │  ├──────────────────┤
└──────────────────┘  │ id (PK)          │
                      │ name             │
                      │ displayName      │
                      │ config           │
                      └──────────────────┘
```

---

## 컴포넌트 (L8)

### 예상 컴포넌트 목록

| ID | 컴포넌트 | 유형 | 설명 | 경로 |
|----|----------|------|------|------|
| L8-CMP-001 | RoleTable | widgets | 역할 목록 테이블 | 신규 필요 |
| L8-CMP-002 | RoleForm | widgets | 역할 등록/수정 폼 | 신규 필요 |
| L8-CMP-003 | AbilityMatrix | widgets | 권한 매트릭스 (Subject x Action) | 신규 필요 |
| L8-CMP-004 | GrantEditor | widgets | Grant 편집기 (Ability 선택 + priority) | 신규 필요 |
| L8-CMP-005 | ConditionEditor | inputs | JSON 조건 편집기 | 신규 필요 |
| L8-CMP-006 | SystemBadge | ui | 시스템 역할 뱃지 | 기존 Badge 활용 |

### 기존 컴포넌트 재사용

| 컴포넌트 | 유형 | 용도 |
|----------|------|------|
| DataGrid | ui | 역할/Ability/Grant 목록 표시 |
| Button | ui | 액션 버튼 |
| Modal | ui | 삭제 확인, Grant 편집 |
| Select | inputs | Subject, Action, Ability 선택 |
| TextInput | inputs | 이름, 설명 입력 |
| Checkbox | inputs | inverted, isActive 토글 |
| Badge | ui | 시스템 역할 표시 |
| 페이지 헤더 영역 | widget | 페이지 래퍼 |
| 섹션 영역 | widget | 섹션 래퍼 |

---

## 테이블 컬럼 정의

### 역할 목록 테이블

| 컬럼명 | 필드 | 필수 | 정렬 | 설명 |
|--------|------|:----:|:----:|------|
| 역할명 | name | ✅ | ✅ | 영문 식별자 |
| 표시명 | displayName | ❌ | ✅ | 한글 표시명 |
| 설명 | description | ❌ | ❌ | 역할 설명 |
| 시스템 | isSystem | ✅ | ✅ | Badge 표시 |
| 생성일 | createdAt | ❌ | ✅ | Desktop만 |
| 액션 | - | ✅ | ❌ | 수정/삭제 버튼 |

### Grant 목록 테이블 (Role/User별)

| 컬럼명 | 필드 | 필수 | 정렬 | 설명 |
|--------|------|:----:|:----:|------|
| Ability | ability.name | ✅ | ✅ | 권한 정의 이름 |
| Subject | ability.subject.displayName | ✅ | ✅ | 대상 |
| Action | ability.action.displayName | ✅ | ✅ | 행위 |
| 허용/거부 | ability.inverted | ✅ | ✅ | can/cannot |
| 우선순위 | priority | ❌ | ✅ | Grant의 priority |
| 활성 | isActive | ✅ | ✅ | Grant의 활성화 상태 |
| 액션 | - | ✅ | ❌ | 수정/삭제 |

---

## 상태별 UI

### 로딩 상태

```
┌────────────────────────────────────────┐
│  역할 관리                              │
├────────────────────────────────────────┤
│  ████████████████████  (스켈레톤)       │
│  ████████  ████████████████             │
│  ████████████  ██████                   │
│  ████████████████████                   │
└────────────────────────────────────────┘
```

### 빈 상태

```
┌────────────────────────────────────────┐
│                                         │
│            [빈 폴더 아이콘]              │
│                                         │
│        "등록된 역할이 없습니다."         │
│        "새 역할을 추가해보세요."         │
│                                         │
│            [역할 등록]                   │
│                                         │
└────────────────────────────────────────┘
```

### 에러 상태

```
┌────────────────────────────────────────┐
│                                         │
│            [에러 아이콘]                 │
│                                         │
│      "역할 목록을 불러오지 못했습니다."   │
│      "잠시 후 다시 시도해주세요."        │
│                                         │
│            [재시도]                      │
│                                         │
└────────────────────────────────────────┘
```

---

## 폼 필드 상세

### 역할 등록/수정 폼

| 필드 | 타입 | 필수 | 유효성 검사 | 플레이스홀더 | 비고 |
|------|------|:----:|------------|-------------|------|
| name | TextInput | ✅ | 영문대문자+언더스코어, 2-50자 | "ROLE_NAME" | 등록 시만 |
| displayName | TextInput | ❌ | 최대 100자 | "역할 표시명" | |
| description | Textarea | ❌ | 최대 500자 | "역할에 대한 설명을 입력하세요" | |

### Ability 등록 폼

| 필드 | 타입 | 필수 | 유효성 검사 | 비고 |
|------|------|:----:|------------|------|
| name | TextInput | ✅ | 고유, 최대 200자 | 재사용 가능한 권한 이름 |
| subjectId | Select | ✅ | - | Subject 목록 |
| actionId | Select | ✅ | - | Action 목록 |
| inverted | Checkbox | ❌ | - | "거부 권한" 체크 |
| conditions | JsonEditor | ❌ | JSON 형식 | ABAC 조건 입력 |
| reason | TextInput | ❌ | 최대 200자 | inverted=true 시 표시 |

### Grant 설정 폼 (Role/User에 Ability 부여)

| 필드 | 타입 | 필수 | 유효성 검사 | 비고 |
|------|------|:----:|------------|------|
| abilityId | Select | ✅ | - | Ability 목록에서 선택 |
| priority | NumberInput | ❌ | Role: 0-9, User: 10+ | 우선순위 |
| isActive | Checkbox | ❌ | - | 활성화 여부 |
