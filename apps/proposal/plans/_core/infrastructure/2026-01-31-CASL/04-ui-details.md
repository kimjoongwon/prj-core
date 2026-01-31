# 04. UI 상세 (역기획)

> ⚠️ 이 문서는 기존 코드를 분석하여 자동 생성되었습니다.

## 엔티티 (L7)

### Role 엔티티

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-001 | id | UUID | PK | 고유 식별자 |
| L7-FLD-002 | seq | Int | unique, auto | 시퀀스 번호 |
| L7-FLD-003 | name | String | unique, required | 역할 식별자 (영문 대문자) |
| L7-FLD-004 | displayName | String | optional | 표시명 (한글) |
| L7-FLD-005 | description | String | optional | 역할 설명 |
| L7-FLD-006 | isSystem | Boolean | default: false | 시스템 역할 여부 |
| L7-FLD-007 | createdAt | DateTime | default: now | 생성일 |
| L7-FLD-008 | updatedAt | DateTime | auto | 수정일 |
| L7-FLD-009 | removedAt | DateTime | optional | 삭제일 (소프트 삭제) |

### Ability 엔티티

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-010 | id | UUID | PK | 고유 식별자 |
| L7-FLD-011 | subjectId | UUID | FK, required | Subject 참조 |
| L7-FLD-012 | actionId | UUID | FK, required | Action 참조 |
| L7-FLD-013 | roleId | UUID | FK, optional | Role 기반 권한 |
| L7-FLD-014 | userId | UUID | FK, optional | User 예외 권한 |
| L7-FLD-015 | fields | String[] | default: [] | 대상 필드 목록 |
| L7-FLD-016 | conditions | JSON | optional | ABAC 조건 |
| L7-FLD-017 | inverted | Boolean | default: false | can/cannot 구분 |
| L7-FLD-018 | reason | String | optional | 거부 사유 |
| L7-FLD-019 | name | String | optional | 권한 이름 |
| L7-FLD-020 | description | String | optional | 권한 설명 |
| L7-FLD-021 | isActive | Boolean | default: true | 활성화 여부 |
| L7-FLD-022 | priority | Int | default: 0 | 우선순위 |

### Subject 엔티티

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-023 | id | UUID | PK | 고유 식별자 |
| L7-FLD-024 | name | String | unique, required | Subject 이름 |
| L7-FLD-025 | displayName | String | optional | 표시명 |
| L7-FLD-026 | icon | String | optional | 아이콘 |
| L7-FLD-027 | order | Int | default: 0 | 정렬 순서 |
| L7-FLD-028 | isSystem | Boolean | default: true | 시스템 여부 |
| L7-FLD-029 | group | String | optional | 그룹 (entity, menu, feature) |

### Action 엔티티

| ID | 필드 | 타입 | 제약조건 | 설명 |
|----|------|------|----------|------|
| L7-FLD-030 | id | UUID | PK | 고유 식별자 |
| L7-FLD-031 | name | String | unique, required | Action 이름 |
| L7-FLD-032 | displayName | String | optional | 표시명 |
| L7-FLD-033 | description | String | optional | 설명 |
| L7-FLD-034 | group | String | optional | 그룹 (crud, visibility, bulk) |
| L7-FLD-035 | order | Int | default: 0 | 정렬 순서 |
| L7-FLD-036 | isSystem | Boolean | default: true | 시스템 여부 |
| L7-FLD-037 | config | JSON | optional | Action 설정 (마스킹 등) |

---

## ERD

```
┌──────────────────┐       ┌──────────────────┐
│      Role        │       │      User        │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ name             │       │ ...              │
│ displayName      │       └────────┬─────────┘
│ isSystem         │                │
└────────┬─────────┘                │
         │                          │
         │ roleId (FK)              │ userId (FK)
         │                          │
         ▼                          ▼
┌──────────────────────────────────────────────┐
│                   Ability                     │
├──────────────────────────────────────────────┤
│ id (PK)                                       │
│ subjectId (FK) ─────────────────────────────────┐
│ actionId (FK) ──────────────────────────────────┼──┐
│ roleId (FK, nullable)                          │  │
│ userId (FK, nullable)                          │  │
│ fields[], conditions, inverted                 │  │
│ priority, isActive                             │  │
└──────────────────────────────────────────────┘  │  │
                                                  │  │
         ┌────────────────────────────────────────┘  │
         ▼                                           │
┌──────────────────┐                                 │
│     Subject      │                                 │
├──────────────────┤       ┌─────────────────────────┘
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
| L8-CMP-004 | AbilityEditor | widgets | 개별 권한 편집기 | 신규 필요 |
| L8-CMP-005 | ConditionEditor | inputs | JSON 조건 편집기 | 신규 필요 |
| L8-CMP-006 | SystemBadge | ui | 시스템 역할 뱃지 | 기존 Badge 활용 |

### 기존 컴포넌트 재사용

| 컴포넌트 | 유형 | 용도 |
|----------|------|------|
| DataGrid | ui | 역할/권한 목록 표시 |
| Button | ui | 액션 버튼 |
| Modal | ui | 삭제 확인, 권한 편집 |
| Select | inputs | Subject, Action 선택 |
| TextInput | inputs | 이름, 설명 입력 |
| Checkbox | inputs | inverted, isActive 토글 |
| Badge | ui | 시스템 역할 표시 |
| PageSurface | layouts | 페이지 래퍼 |
| SectionSurface | layouts | 섹션 래퍼 |

---

## 테이블 컬럼 정의

### 역할 목록 테이블

| 컬럼명 | 필드 | 필수 | 정렬 | 설명 |
|--------|------|:----:|:----:|------|
| # | seq | ✅ | ✅ | 순번 |
| 역할명 | name | ✅ | ✅ | 영문 식별자 |
| 표시명 | displayName | ❌ | ✅ | 한글 표시명 |
| 설명 | description | ❌ | ❌ | 역할 설명 |
| 시스템 | isSystem | ✅ | ✅ | Badge 표시 |
| 생성일 | createdAt | ❌ | ✅ | Desktop만 |
| 액션 | - | ✅ | ❌ | 수정/삭제 버튼 |

### 권한 목록 테이블

| 컬럼명 | 필드 | 필수 | 정렬 | 설명 |
|--------|------|:----:|:----:|------|
| Subject | subject.displayName | ✅ | ✅ | 대상 |
| Action | action.displayName | ✅ | ✅ | 행위 |
| 허용/거부 | inverted | ✅ | ✅ | can/cannot |
| 조건 | conditions | ❌ | ❌ | JSON 표시 |
| 우선순위 | priority | ❌ | ✅ | 숫자 |
| 활성 | isActive | ✅ | ✅ | 체크박스 |
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

### 권한 등록 폼

| 필드 | 타입 | 필수 | 유효성 검사 | 비고 |
|------|------|:----:|------------|------|
| subjectId | Select | ✅ | - | Subject 목록 |
| actionId | Select | ✅ | - | Action 목록 |
| inverted | Checkbox | ❌ | - | "거부 권한" 체크 |
| conditions | JsonEditor | ❌ | JSON 형식 | 조건 입력 |
| priority | NumberInput | ❌ | 0-100 | 우선순위 |
| reason | TextInput | ❌ | 최대 200자 | inverted=true 시 표시 |
