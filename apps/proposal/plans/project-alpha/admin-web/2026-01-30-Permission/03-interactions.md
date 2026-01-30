# 03. 인터랙션 정의

> L5-L6 레이어 기반 기획서

---

## 1. 인터랙션 (Action)

### 1.1 역할 관리 인터랙션

#### Action 1: 역할 목록 로드

| 속성 | 값 |
|------|-----|
| **Trigger** | 페이지 진입 시 |
| **Source** | `/roles` |
| **Handler** | `onLoadRoles()` |
| **API Call** | `GET /roles` |
| **Success** | 목록 테이블 렌더링 |
| **Error** | 에러 토스트 표시 |

---

#### Action 2: 역할 생성

| 속성 | 값 |
|------|-----|
| **Trigger** | "역할 생성" 버튼 클릭 후 폼 제출 |
| **Source** | `/roles/new` |
| **Handler** | `onSubmitRole(formData)` |
| **Validation** | 이름 필수, 중복 체크 |
| **API Call** | `POST /roles` |
| **Success** | 성공 토스트 → `/roles`로 이동 |
| **Error** | 폼 에러 메시지 표시 |

---

#### Action 3: 역할 삭제

| 속성 | 값 |
|------|-----|
| **Trigger** | "삭제" 버튼 클릭 → 확인 다이얼로그 |
| **Source** | `/roles/[id]/edit` |
| **Handler** | `onClickDelete(roleId)` |
| **Validation** | 시스템 역할인 경우 삭제 불가 |
| **API Call** | `DELETE /roles/:id` |
| **Success** | 성공 토스트 → `/roles`로 이동 |
| **Error** | 에러 토스트 표시 |

---

### 1.2 권한 관리 인터랙션

#### Action 4: Role 권한 매트릭스 수정

| 속성 | 값 |
|------|-----|
| **Trigger** | Ability 매트릭스 체크박스 클릭 |
| **Source** | `/roles/abilities/roles` |
| **Handler** | `onChangeAbility(subject, action, checked)` |
| **State Update** | 로컬 상태 업데이트 (즉시 반영) |
| **API Call** | `PUT /roles/:id/abilities` ("저장" 버튼 클릭 시) |
| **Success** | 성공 토스트 |
| **Error** | 에러 토스트, 원래 상태로 롤백 |

---

#### Action 5: Conditions 편집

| 속성 | 값 |
|------|-----|
| **Trigger** | Conditions 편집기(JSON) 수정 |
| **Source** | `/roles/abilities/roles`, `/roles/abilities/users` |
| **Handler** | `onChangeConditions(jsonString)` |
| **Validation** | JSON 형식 검증, 템플릿 변수 검증 |
| **State Update** | 로컬 상태 업데이트 |
| **Error** | JSON 에러 메시지 표시 |

---

#### Action 6: User 예외 권한 추가

| 속성 | 값 |
|------|-----|
| **Trigger** | "예외 권한 추가" 버튼 클릭 → 모달 오픈 |
| **Source** | `/roles/abilities/users` |
| **Handler** | `onClickAddUserAbility()` |
| **Form** | User 선택, Subject 선택, Action 선택, Conditions 입력 |
| **API Call** | `POST /abilities` (userId 설정) |
| **Success** | 목록 리로드, 성공 토스트 |
| **Error** | 에러 토스트 |

---

#### Action 7: Subject 추가/수정

| 속성 | 값 |
|------|-----|
| **Trigger** | "Subject 추가" 버튼 클릭 → 모달 오픈 |
| **Source** | `/roles/abilities/subjects` |
| **Handler** | `onClickAddSubject()` / `onClickEditSubject(subjectId)` |
| **Form** | 이름, 표시명, 아이콘, 그룹, 정렬 순서 |
| **API Call** | `POST /subjects` (추가) / `PUT /subjects/:id` (수정) |
| **Success** | 목록 리로드, 성공 토스트 |
| **Error** | 에러 토스트 |

---

#### Action 8: Action 추가/수정

| 속성 | 값 |
|------|-----|
| **Trigger** | "Action 추가" 버튼 클릭 → 모달 오픈 |
| **Source** | `/roles/abilities/actions` |
| **Handler** | `onClickAddAction()` / `onClickEditAction(actionId)` |
| **Form** | 이름, 표시명, 설명, 그룹, Config (JSON) |
| **API Call** | `POST /actions` (추가) / `PUT /actions/:id` (수정) |
| **Success** | 목록 리로드, 성공 토스트 |
| **Error** | 에러 토스트 |

---

#### Action 9: UI 가시성 매트릭스 수정

| 속성 | 값 |
|------|-----|
| **Trigger** | 가시성 매트릭스 토글 클릭 |
| **Source** | `/roles/abilities/ui-elements` |
| **Handler** | `onChangeVisibility(role, uiElement, visible)` |
| **State Update** | 로컬 상태 업데이트 (즉시 반영) |
| **API Call** | `PUT /roles/abilities/visibility` ("저장" 버튼 클릭 시) |
| **Success** | 성공 토스트 |
| **Error** | 에러 토스트 |

---

### 1.3 권한 확인 인터랙션

#### Action 10: 메뉴 필터링

| 속성 | 값 |
|------|-----|
| **Trigger** | 앱 진입 시 / 권한 변경 시 |
| **Source** | 메뉴 컴포넌트 |
| **Handler** | `useFilteredMenus(menuItems)` |
| **Logic** | `ability.can('ACCESS', subject)` 확인 |
| **Output** | 권한 있는 메뉴만 렌더링 |

---

#### Action 11: 버튼 가시성 제어

| 속성 | 값 |
|------|-----|
| **Trigger** | 컴포넌트 렌더링 시 |
| **Source** | 모든 페이지 |
| **Handler** | `ability.can(action, subject)` 확인 |
| **Logic** | 권한 있으면 버튼 렌더링, 없으면 숨김 |
| **Example** | `{ability.can('UPDATE', 'entity:User') && <EditButton />}` |

---

## 2. API 설계

### 2.1 Abilities Endpoints

| Method | Path | 설명 | 인증 | 권한 |
|--------|------|------|------|------|
| GET | /abilities | Ability 목록 조회 | Bearer Token | ADMIN |
| POST | /abilities | Ability 생성 | Bearer Token | ADMIN |
| GET | /abilities/:id | Ability 상세 조회 | Bearer Token | ADMIN |
| PUT | /abilities/:id | Ability 수정 | Bearer Token | ADMIN |
| DELETE | /abilities/:id | Ability 삭제 | Bearer Token | ADMIN |

**Request/Response 예시:**

```typescript
// POST /abilities
{
  subjectId: "uuid",
  actionId: "uuid",
  fields: ["email", "phone"],
  conditions: { "id": "${user.id}" },
  inverted: false,
  roleId: "uuid",
  userId: null,
  priority: 0,
  isActive: true
}
```

---

### 2.2 Roles Endpoints

| Method | Path | 설명 | 인증 | 권한 |
|--------|------|------|------|------|
| GET | /roles | Role 목록 조회 | Bearer Token | ADMIN |
| POST | /roles | Role 생성 | Bearer Token | ADMIN |
| GET | /roles/:id | Role 상세 조회 | Bearer Token | ADMIN |
| PUT | /roles/:id | Role 수정 | Bearer Token | ADMIN |
| DELETE | /roles/:id | Role 삭제 | Bearer Token | ADMIN |
| PUT | /roles/:id/abilities | Role 권한 일괄 업데이트 | Bearer Token | ADMIN |

**Request/Response 예시:**

```typescript
// POST /roles
{
  name: "MANAGER",
  displayName: "매니저",
  description: "중간 관리자 역할",
  isSystem: false
}

// PUT /roles/:id/abilities
{
  abilities: [
    {
      subjectId: "uuid",
      actionId: "uuid",
      conditions: { "spaceId": "${user.currentSpaceId}" },
      inverted: false
    }
  ]
}
```

---

### 2.3 Subjects Endpoints

| Method | Path | 설명 | 인증 | 권한 |
|--------|------|------|------|------|
| GET | /subjects | Subject 목록 조회 | Bearer Token | ADMIN |
| POST | /subjects | Subject 생성 | Bearer Token | ADMIN |
| GET | /subjects/:id | Subject 상세 조회 | Bearer Token | ADMIN |
| PUT | /subjects/:id | Subject 수정 | Bearer Token | ADMIN |
| DELETE | /subjects/:id | Subject 삭제 | Bearer Token | ADMIN |

**Request/Response 예시:**

```typescript
// POST /subjects
{
  name: "menu:new-page",
  displayName: "새 페이지",
  icon: "file",
  group: "menu",
  order: 10,
  isSystem: false
}
```

---

### 2.4 Actions Endpoints

| Method | Path | 설명 | 인증 | 권한 |
|--------|------|------|------|------|
| GET | /actions | Action 목록 조회 | Bearer Token | ADMIN |
| POST | /actions | Action 생성 | Bearer Token | ADMIN |
| GET | /actions/:id | Action 상세 조회 | Bearer Token | ADMIN |
| PUT | /actions/:id | Action 수정 | Bearer Token | ADMIN |
| DELETE | /actions/:id | Action 삭제 | Bearer Token | ADMIN |

**Request/Response 예시:**

```typescript
// POST /actions
{
  name: "ARCHIVE",
  displayName: "보관",
  description: "리소스 보관",
  group: "workflow",
  config: null,
  isSystem: false
}

// POST /actions (마스킹 설정)
{
  name: "READ:MASKED:CUSTOM",
  displayName: "사용자 정의 마스킹",
  group: "visibility",
  config: {
    type: "masking",
    preset: "PRESET_CUSTOM",
    pattern: "^(.{2}).*(.{2})$",
    replacement: "$1****$2"
  },
  isSystem: false
}
```

---

### 2.5 UI 가시성 Endpoints

| Method | Path | 설명 | 인증 | 권한 |
|--------|------|------|------|------|
| GET | /roles/abilities/visibility | UI 가시성 매트릭스 조회 | Bearer Token | ADMIN |
| PUT | /roles/abilities/visibility | UI 가시성 매트릭스 업데이트 | Bearer Token | ADMIN |

**Request/Response 예시:**

```typescript
// PUT /roles/abilities/visibility
{
  appType: "Web Admin",
  visibility: {
    "ui:sidebar": {
      "SUPER_ADMIN": true,
      "ADMIN": true,
      "USER": false
    },
    "ui:bottom-tab": {
      "SUPER_ADMIN": false,
      "ADMIN": false,
      "USER": true
    }
  }
}
```

---

### 2.6 프론트엔드 권한 확인 Endpoints

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| GET | /me/abilities | 현재 사용자의 권한 목록 조회 | Bearer Token |

**Response 예시:**

```typescript
{
  httpStatus: 200,
  message: "권한 조회 성공",
  data: {
    user: {
      id: "user-123",
      email: "user@example.com",
      currentSpaceId: "space-456",
      currentRoleId: "role-789"
    },
    abilities: [
      {
        subject: "entity:User",
        action: "READ",
        conditions: { "id": "${user.id}" },
        inverted: false
      },
      {
        subject: "menu:mypage",
        action: "ACCESS",
        conditions: null,
        inverted: false
      }
    ]
  }
}
```

---

## 3. 프론트엔드 API 사용 패턴

### 3.1 Orval 생성 훅 사용

```typescript
import { useGetRoles, useCreateRole, useDeleteRole } from "@cocrepo/api";

// 역할 목록 조회
const { data: roles, isLoading } = useGetRoles();

// 역할 생성
const createRoleMutation = useCreateRole();
const handleCreateRole = (formData) => {
  createRoleMutation.mutate({ data: formData }, {
    onSuccess: () => {
      toast.success("역할이 생성되었습니다.");
      router.push("/roles");
    }
  });
};

// 역할 삭제
const deleteRoleMutation = useDeleteRole();
const handleDeleteRole = (roleId) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    deleteRoleMutation.mutate({ id: roleId }, {
      onSuccess: () => {
        toast.success("역할이 삭제되었습니다.");
        router.push("/roles");
      }
    });
  }
};
```

---

### 3.2 권한 확인 Hook

```typescript
import { useGetMeAbilities } from "@cocrepo/api";

// 현재 사용자 권한 로드
const { data: meAbilities } = useGetMeAbilities();

// CASL Ability 생성
const ability = buildAbility(meAbilities);

// 단일 권한 확인
const canReadUser = ability.can('READ', 'entity:User');

// 조건 기반 확인
const canUpdateThisUser = ability.can('UPDATE', 'entity:User', { id: 'user-123' });

// 메뉴 접근 확인
const canAccessMembersMenu = ability.can('ACCESS', 'menu:members');
```

---

## 4. 에러 처리

### 4.1 일반 에러

| 에러 타입 | 메시지 | 대응 |
|-----------|--------|------|
| 401 Unauthorized | "로그인이 필요합니다." | 로그인 페이지로 리다이렉트 |
| 403 Forbidden | "권한이 없습니다." | 에러 토스트 표시 |
| 404 Not Found | "데이터를 찾을 수 없습니다." | 에러 토스트 표시 |
| 409 Conflict | "이미 존재하는 데이터입니다." | 폼 에러 메시지 표시 |
| 500 Internal Server Error | "서버 에러가 발생했습니다." | 에러 토스트 표시 |

### 4.2 유효성 검증 에러

```typescript
{
  httpStatus: 400,
  message: "입력값이 올바르지 않습니다.",
  errors: [
    { field: "name", message: "이름은 필수입니다." },
    { field: "conditions", message: "JSON 형식이 올바르지 않습니다." }
  ]
}
```

---

## 5. 로딩 상태

| 상황 | 로딩 표시 |
|------|----------|
| 페이지 진입 시 | 전체 페이지 Skeleton |
| 목록 조회 시 | DataTable Skeleton |
| 폼 제출 시 | 버튼 로딩 스피너 |
| 삭제 요청 시 | 삭제 버튼 로딩 스피너 |
| 매트릭스 저장 시 | 전체 화면 오버레이 스피너 |
