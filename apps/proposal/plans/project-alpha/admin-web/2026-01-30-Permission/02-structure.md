# 02. 화면 구조

> L3-L4 레이어 기반 기획서

---

## 1. 기능 (Feature)

### 1.1 역할 관리 (Role Management)

| Feature | 설명 | 화면 |
|---------|------|------|
| **역할 목록 조회** | 시스템 역할 및 커스텀 역할 목록 표시 | `/roles` |
| **커스텀 역할 생성** | 새로운 역할 생성 | `/roles/new` |
| **역할 상세/수정** | 역할 정보 및 권한 수정 | `/roles/[id]/edit` |
| **역할 삭제** | 커스텀 역할 삭제 (시스템 역할 제외) | `/roles/[id]/edit` |

### 1.2 권한 관리 (Ability Management)

| Feature | 설명 | 화면 |
|---------|------|------|
| **Role 권한 설정** | Role별 Ability 매트릭스 관리 | `/roles/abilities/roles` |
| **User 예외 권한** | 사용자별 예외 Ability 목록 관리 | `/roles/abilities/users` |
| **Subject 관리** | 권한 대상(entity, menu, feature, ui) 관리 | `/roles/abilities/subjects` |
| **Action 관리** | 행위(crud, visibility, bulk, workflow) 관리 | `/roles/abilities/actions` |
| **UI 가시성 설정** | Role별 UI 요소 가시성 매트릭스 관리 | `/roles/abilities/ui-elements` |

### 1.3 권한 확인 (Permission Check)

| Feature | 설명 | 사용처 |
|---------|------|--------|
| **단일 권한 확인** | 특정 권한 허용 여부 확인 | Hook: `usePermission` |
| **엔티티 권한 확인** | 엔티티별 CRUD 권한 확인 | Hook: `useEntityPermissions` |
| **메뉴 접근 확인** | 메뉴 접근 권한 확인 | Hook: `useMenuAccess` |
| **메뉴 필터링** | 권한 기반 메뉴 필터링 | Hook: `useFilteredMenus` |

---

## 2. 화면 (Screen)

### 2.1 역할 관리 화면

#### Screen 1: 역할 목록 (`/roles`)

| 구성 요소 | 설명 |
|----------|------|
| **페이지 타이틀** | "역할 관리" |
| **설명** | "시스템 역할 및 커스텀 역할을 관리합니다." |
| **액션 버튼** | "역할 생성" |
| **DataTable** | 역할 목록 테이블 |

**DataTable 컬럼:**
| 컬럼명 | 설명 | 정렬 |
|--------|------|------|
| 이름 | 역할 이름 (SUPER_ADMIN, ADMIN, USER 등) | O |
| 표시명 | 한글 표시명 | O |
| 설명 | 역할 설명 | X |
| 시스템 여부 | 시스템 역여부 (아이콘) | X |
| 사용자 수 | 해당 역할 사용자 수 | X |
| 권한 수 | 부여된 권한 수 | X |
| 생성일 | 생성 날짜 | O |
| 액션 | 수정, 삭제 버튼 | X |

---

#### Screen 2: 역할 생성 (`/roles/new`)

| 구성 요소 | 설명 |
|----------|------|
| **페이지 타이틀** | "역할 생성" |
| **설명** | "새로운 역할을 생성합니다." |
| **폼** | 역할 정보 입력 폼 |
| **액션 버튼** | "취소", "저장" |

**폼 필드:**
| 필드명 | 타입 | 필수 | 설명 |
|--------|------|:----:|------|
| 이름 | TextInput | ✅ | 영문 대문자, 언더스코어 허용 (예: MANAGER) |
| 표시명 | TextInput | ✅ | 한글 표시명 (예: 매니저) |
| 설명 | TextArea | ❌ | 역할 설명 |
| 시스템 역할 여부 | Switch | ❌ | 기본값: false |

---

#### Screen 3: 역할 수정 (`/roles/[id]/edit`)

| 구성 요소 | 설명 |
|----------|------|
| **페이지 타이틀** | "{역할명} 수정" |
| **설명** | "역할 정보를 수정합니다." |
| **탭 네비게이션** | 기본 정보, 권한 설정, 사용자 목록 |
| **액션 버튼** | "삭제", "저장" |

**탭 1: 기본 정보**
- 역할 생성 폼과 동일
- 시스템 역할은 수정 불가

**탭 2: 권한 설정**
- Ability 매트릭스
- Conditions 편집기
- Fields 체크박스

**탭 3: 사용자 목록**
- 해당 역할을 가진 사용자 목록
- 사용자 이름, 이메일, Space

---

### 2.2 권한 관리 화면

#### Screen 4: 권한 관리 메인 (`/roles/abilities`)

| 구성 요소 | 설명 |
|----------|------|
| **페이지 타이틀** | "권한 관리" |
| **설명** | "시스템의 권한을 관리합니다." |
| **탭 네비게이션** | Role 권한, User 예외 권한, Subject, Action, UI 가시성 |

---

#### Screen 5: Role 권한 탭 (`/roles/abilities/roles`)

| 구성 요소 | 설명 |
|----------|------|
| **Role 선택 드롭다운** | 권한을 설정할 Role 선택 |
| **Subject 그룹 필터** | entity, menu, feature, ui 필터 |
| **Ability 매트릭스** | Subject × Action 매트릭스 |
| **Conditions 편집기** | JSON 형식으로 Conditions 편집 |
| **Fields 체크박스** | 필드 레벨 권한 설정 |
| **액션 버튼** | "저장", "초기화" |

**Ability 매트릭스 구조:**
```
               CREATE  READ    UPDATE  DELETE  MANAGE
entity:User     [ ]    [x]     [ ]     [ ]     [ ]
entity:Ground   [ ]    [x]     [x]     [ ]     [ ]
menu:members    [ ]    [ ]     [ ]     [ ]     [ ]
```

---

#### Screen 6: User 예외 권한 탭 (`/roles/abilities/users`)

| 구성 요소 | 설명 |
|----------|------|
| **User 검색** | 사용자 검색 (이름, 이메일) |
| **Ability 목록 테이블** | 사용자별 예외 Ability 목록 |
| **추가 버튼** | 새 예외 권한 추가 |
| **우선순위 설정** | Priority 설정 (기본값: 10) |

**테이블 컬럼:**
| 컬럼명 | 설명 |
|--------|------|
| 사용자 | 이름 + 이메일 |
| Subject | 권한 대상 |
| Action | 행위 |
| Conditions | 조건 (JSON 편집) |
| Inverted | 거부 여부 (토글) |
| Priority | 우선순위 |
| 액션 | 수정, 삭제 버튼 |

---

#### Screen 7: Subject 관리 탭 (`/roles/abilities/subjects`)

| 구성 요소 | 설명 |
|----------|------|
| **그룹 필터** | entity, menu, feature, ui 필터 |
| **Subject 테이블** | Subject 목록 |
| **추가 버튼** | 새 Subject 추가 |

**테이블 컬럼:**
| 컬럼명 | 설명 |
|--------|------|
| 이름 | Subject 이름 (예: entity:User) |
| 표시명 | 한글 표시명 |
| 아이콘 | 아이콘 (옵션) |
| 그룹 | entity, menu, feature, ui |
| 시스템 여부 | 시스템 Subject 여부 |
| 정렬 순서 | 정렬 순서 |
| 액션 | 수정, 삭제 버튼 |

**Subject 그룹:**
| 그룹 | 설명 | 예시 |
|-----|------|------|
| **entity** | Prisma 모델 기반 CRUD 권한 | User, Ground, File |
| **menu** | 메뉴 접근 권한 | members, settings |
| **feature** | 기능 사용 권한 | export, bulk-delete |
| **ui** | UI 요소 가시성 | sidebar, bottom-tab |

---

#### Screen 8: Action 관리 탭 (`/roles/abilities/actions`)

| 구성 요소 | 설명 |
|----------|------|
| **그룹 필터** | crud, visibility, bulk, workflow 필터 |
| **Action 테이블** | Action 목록 |
| **추가 버튼** | 새 Action 추가 |

**테이블 컬럼:**
| 컬럼명 | 설명 |
|--------|------|
| 이름 | Action 이름 (예: READ:MASKED:EMAIL) |
| 표시명 | 한글 표시명 |
| 설명 | Action 설명 |
| 그룹 | crud, visibility, bulk, workflow |
| 시스템 여부 | 시스템 Action 여부 |
| Config | 설정 (JSON) |
| 액션 | 수정, 삭제 버튼 |

**Action 그룹:**
| 그룹 | Action | 설명 |
|-----|--------|------|
| **crud** | CREATE, READ, UPDATE, DELETE, MANAGE | 기본 CRUD 권한 |
| **visibility** | READ:FULL, READ:HIDDEN, READ:MASKED:* | 가시성 및 마스킹 |
| **bulk** | EXPORT, IMPORT | 대량 작업 |
| **workflow** | APPROVE, REJECT | 승인/거절 |

---

#### Screen 9: UI 가시성 탭 (`/roles/abilities/ui-elements`)

| 구성 요소 | 설명 |
|----------|------|
| **앱 타입 선택** | Mobile, Web Admin, Web User |
| **가시성 매트릭스** | UI 요소 × Role 매트릭스 |
| **저장 버튼** | 가시성 설정 저장 |

**앱 타입:**
| 앱 타입 | 설명 | UI 요소 예시 |
|---------|------|-------------|
| **Mobile** | 모바일 앱 | bottom-tab, floating, mobile:* |
| **Web Admin** | 웹 관리자 | sidebar, admin:* |
| **Web User** | 웹 사용자 | user:* |

**가시성 매트릭스 구조:**
```
              SUPER_ADMIN  ADMIN  USER
ui:sidebar         [x]       [x]    [ ]
ui:bottom-tab      [ ]       [ ]    [x]
menu:members       [x]       [x]    [ ]
menu:settings      [x]       [x]    [ ]
```

---

## 3. 화면 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                      권한 관리 시스템                        │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐             ┌──────▼──────┐
         │  역할 관리   │             │  권한 관리   │
         │   /roles    │             │/abilities   │
         └──────┬──────┘             └──────┬──────┘
                │                           │
        ┌───────┼───────────┐   ┌───────────┼───────────┐
        │       │           │   │           │           │
   ┌────▼──┐ ┌──▼────┐ ┌──▼──▼─┐ ┌──▼──┐ ┌────▼────┐ ┌─▼─────┐
   │ 목록  │ │ 생성  │ │ 수정   │ │Role │ │User 예외│ │Subject│
   │/roles │ │/new   │ │/[id]/ │ │권한 │ │ 권한    │ │관리   │
   └───────┘ └───────┘ └──▲───┘ └────┘ └─────────┘ └───────┘
                              │                              │
                              └──────────┬───────────────────┘
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                         ┌────▼────┐          ┌────▼────┐
                         │ Action  │          │ UI 가시성│
                         │ 관리    │          │ 설정     │
                         └─────────┘          └──────────┘
```

---

## 4. 권한 레벨별 화면 접근

| 화면 | SUPER_ADMIN | ADMIN | USER |
|------|------------|-------|------|
| `/roles` | ✅ | ✅ | ❌ |
| `/roles/new` | ✅ | ✅ | ❌ |
| `/roles/[id]/edit` (시스템 역할) | ✅ (보기 전용) | ✅ (보기 전용) | ❌ |
| `/roles/[id]/edit` (커스텀 역할) | ✅ | ✅ | ❌ |
| `/roles/abilities` | ✅ | ✅ | ❌ |
| `/roles/abilities/roles` | ✅ | ✅ | ❌ |
| `/roles/abilities/users` | ✅ | ✅ | ❌ |
| `/roles/abilities/subjects` | ✅ | ✅ | ❌ |
| `/roles/abilities/actions` | ✅ | ✅ | ❌ |
| `/roles/abilities/ui-elements` | ✅ | ✅ | ❌ |
| 마이페이지 | ✅ | ✅ | ✅ |
