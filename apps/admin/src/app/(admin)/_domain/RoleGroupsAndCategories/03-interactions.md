# L5-L6: 인터랙션 및 API (RoleGroupsAndCategories)

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 12개 기능
  - 역할 그룹: 목록 표시, 검색/필터, 상세 정보, 등록 폼, 수정 폼, 삭제 (6개)
  - 역할 카테고리: 목록 표시, 검색/필터, 상세 정보, 등록 폼, 수정 폼, 삭제 (6개)
- **L4 Screens**: 8개 화면
  - 역할 그룹: 목록/상세/등록/수정 (4개)
  - 역할 카테고리: 목록/상세/등록/수정 (4개)

---

## L5: 인터랙션 정의

### RGC-L4-SCR-001: 역할 그룹 목록 화면 (`/roles/groups`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-001 | 검색어 입력 | 검색창 입력 후 Enter 또는 디바운스 | 그룹 목록 필터링 (클라이언트 사이드, name/label 기준) | - |
| RGC-L5-ACT-002 | 그룹 행 클릭 | DataGrid 행 클릭 | 그룹 상세 화면으로 이동 (`/roles/groups/[groupId]`) | - |
| RGC-L5-ACT-003 | 그룹 등록 버튼 클릭 | PageSurface actions 영역 "그룹 등록" 버튼 클릭 | 그룹 등록 화면으로 이동 (`/roles/groups/new`) | `can('create', 'group')` |
| RGC-L5-ACT-004 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, label, createdAt 기준 오름차순/내림차순 전환 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/groups?type=Role 호출 -> 목록 표시 | 에러 메시지 + 재시도 버튼 |
| 검색어 입력 | 클라이언트 사이드 필터링 (전체 목록은 이미 로드됨, 데이터 수가 적으므로) | - |
| 그룹 행 클릭 | `/roles/groups/[groupId]`로 라우팅 | - |
| 그룹 등록 버튼 | `/roles/groups/new`로 라우팅 | - |

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/groups?type=Role
    |
    +-- 성공 --> [데이터 표시] <--> [검색/정렬]
    |                |
    |                +-- 행 클릭 --> [상세 화면 이동]
    |                +-- 등록 버튼 --> [등록 화면 이동]
    |
    +-- 실패 --> [에러 상태] --> 재시도 버튼 --> [로딩 상태]
```

---

### RGC-L4-SCR-002: 역할 그룹 상세 화면 (`/roles/groups/[groupId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-005 | 수정 버튼 클릭 | PageSurface actions 영역 "수정" 버튼 클릭 | 수정 화면으로 이동 (`/roles/groups/[groupId]/edit`) | `can('update', 'group')` |
| RGC-L5-ACT-006 | 삭제 버튼 클릭 | PageSurface actions 영역 "삭제" 버튼 클릭 | 삭제 확인 모달 표시 | `can('delete', 'group')` |
| RGC-L5-ACT-007 | 삭제 확인 | 모달에서 "삭제" 버튼 클릭 | DELETE /api/v1/groups/:id 호출 | - |
| RGC-L5-ACT-008 | 삭제 취소 | 모달에서 "취소" 버튼 클릭 | 모달 닫기 | - |
| RGC-L5-ACT-009 | 소속 역할 클릭 | 소속 역할 목록에서 역할명 클릭 | 역할 상세 화면으로 이동 (`/roles/[roleId]`) | - |
| RGC-L5-ACT-010 | 뒤로가기 | 브라우저 뒤로가기 또는 목록 링크 | 그룹 목록 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/groups/:id 호출 -> 상세 정보 + 소속 역할 목록 표시 | 에러 메시지 (404: "역할 그룹을 찾을 수 없습니다") |
| 삭제 확인 | DELETE 호출 -> "역할 그룹이 삭제되었습니다" 성공 토스트 -> 그룹 목록으로 이동 | 에러 토스트 |
| 삭제 취소 | 모달 닫기 | - |

#### 삭제 모달 분기

```
삭제 버튼 클릭
    |
    v
소속 역할 수 확인 (클라이언트에서 상세 데이터 기반 판단)
    |
    +-- 0개 --> [기본 삭제 확인 모달]
    |               "정말로 삭제하시겠습니까?"
    |
    +-- N개 --> [경고 삭제 확인 모달]
                "이 그룹에 N개의 역할이 소속되어 있습니다.
                 삭제하면 연결이 해제됩니다."
```

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/groups/:id
    |
    +-- 성공 --> [데이터 표시]
    |                |
    |                +-- 수정 버튼 --> [수정 화면 이동]
    |                +-- 삭제 버튼 --> [삭제 확인 모달]
    |                |                    |
    |                |                    +-- 확인 --> [삭제 처리] --> 성공 --> [목록 이동]
    |                |                    +-- 취소 --> [데이터 표시]
    |                |
    |                +-- 역할 클릭 --> [역할 상세 이동]
    |
    +-- 실패 --> [에러 상태] --> 목록 이동
```

---

### RGC-L4-SCR-003: 역할 그룹 등록 화면 (`/roles/groups/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-011 | name 입력 | 이름 Input 입력 | 실시간 유효성 검사 (영문 대문자 + 언더스코어) | - |
| RGC-L5-ACT-012 | label 입력 | 라벨 Input 입력 | 값 업데이트 | - |
| RGC-L5-ACT-013 | 등록 버튼 클릭 | "등록" 버튼 클릭 | 유효성 검사 후 POST /api/v1/groups 호출 | name 필수 |
| RGC-L5-ACT-014 | 취소 버튼 클릭 | "취소" 버튼 클릭 | 그룹 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 등록 버튼 클릭 | POST 호출 -> "역할 그룹이 등록되었습니다" 성공 토스트 -> 그룹 목록으로 이동 | 에러 토스트 (400: 유효성 오류, 409: 이름 중복) |

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수, `^[A-Z][A-Z0-9_]*$`, 최대 50자 | "그룹 이름은 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" |
| label | 선택, 최대 50자 | "라벨은 50자 이내로 입력해주세요" |

#### 상태 전이

```
[페이지 진입]
    |
    v
[폼 초기 상태] (type=Role, spaceId 자동 설정)
    |
    +-- 입력 --> [입력 중] --> 유효성 검사
    |
    +-- 등록 버튼 --> [유효성 체크]
    |                    |
    |                    +-- 통과 --> [로딩] -- POST /api/v1/groups
    |                    |              |
    |                    |              +-- 성공 --> [목록 이동]
    |                    |              +-- 실패 --> [에러 표시]
    |                    |
    |                    +-- 실패 --> [유효성 에러 표시]
    |
    +-- 취소 버튼 --> [목록 이동]
```

---

### RGC-L4-SCR-004: 역할 그룹 수정 화면 (`/roles/groups/[groupId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-015 | label 수정 | 라벨 Input 변경 | 값 업데이트 | - |
| RGC-L5-ACT-016 | 저장 버튼 클릭 | "저장" 버튼 클릭 | PATCH /api/v1/groups/:id 호출 | - |
| RGC-L5-ACT-017 | 취소 버튼 클릭 | "취소" 버튼 클릭 | 그룹 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/groups/:id -> 기존 데이터 prefill | 에러 메시지 (404) |
| 저장 버튼 클릭 | PATCH 호출 -> "역할 그룹이 수정되었습니다" 성공 토스트 -> 그룹 상세 화면으로 이동 | 에러 토스트 |

#### 제약사항

- name(그룹 이름) 필드는 `readonly` 표시 (식별자 변경 방지)
- label만 수정 가능

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/groups/:id
    |
    +-- 성공 --> [폼 표시 (prefill)]
    |                |
    |                +-- label 수정 --> [수정 중]
    |                |
    |                +-- 저장 버튼 --> [로딩] -- PATCH /api/v1/groups/:id
    |                |                   |
    |                |                   +-- 성공 --> [상세 화면 이동]
    |                |                   +-- 실패 --> [에러 표시]
    |                |
    |                +-- 취소 버튼 --> [상세 화면 이동]
    |
    +-- 실패 --> [에러 상태] --> 목록 이동
```

---

### RGC-L4-SCR-005: 역할 카테고리 목록 화면 (`/roles/categories`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-018 | 검색어 입력 | 검색창 입력 후 Enter 또는 디바운스 | 카테고리 목록 필터링 (클라이언트 사이드, name 기준) | - |
| RGC-L5-ACT-019 | 상위 카테고리 필터 선택 | 상위 카테고리 Select 변경 | 선택된 상위 카테고리의 하위 카테고리만 필터링 | - |
| RGC-L5-ACT-020 | 카테고리 행 클릭 | DataGrid 행 클릭 | 카테고리 상세 화면으로 이동 (`/roles/categories/[categoryId]`) | - |
| RGC-L5-ACT-021 | 카테고리 등록 버튼 클릭 | PageSurface actions 영역 "카테고리 등록" 버튼 클릭 | 카테고리 등록 화면으로 이동 (`/roles/categories/new`) | `can('create', 'category')` |
| RGC-L5-ACT-022 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, createdAt 기준 오름차순/내림차순 전환 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/categories?type=Role 호출 -> 목록 표시 | 에러 메시지 + 재시도 버튼 |
| 검색어/필터 변경 | 클라이언트 사이드 필터링 (전체 목록은 이미 로드됨, 데이터 수가 적으므로) | - |
| 카테고리 행 클릭 | `/roles/categories/[categoryId]`로 라우팅 | - |
| 카테고리 등록 버튼 | `/roles/categories/new`로 라우팅 | - |

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/categories?type=Role
    |
    +-- 성공 --> [데이터 표시] <--> [검색/필터/정렬]
    |                |
    |                +-- 행 클릭 --> [상세 화면 이동]
    |                +-- 등록 버튼 --> [등록 화면 이동]
    |
    +-- 실패 --> [에러 상태] --> 재시도 버튼 --> [로딩 상태]
```

---

### RGC-L4-SCR-006: 역할 카테고리 상세 화면 (`/roles/categories/[categoryId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-023 | 수정 버튼 클릭 | PageSurface actions 영역 "수정" 버튼 클릭 | 수정 화면으로 이동 (`/roles/categories/[categoryId]/edit`) | `can('update', 'category')` |
| RGC-L5-ACT-024 | 삭제 버튼 클릭 | PageSurface actions 영역 "삭제" 버튼 클릭 | 삭제 확인 모달 표시 (하위 카테고리가 있으면 차단) | `can('delete', 'category')` |
| RGC-L5-ACT-025 | 삭제 확인 | 모달에서 "삭제" 버튼 클릭 | DELETE /api/v1/categories/:id 호출 | 하위 카테고리 없음 |
| RGC-L5-ACT-026 | 삭제 취소 | 모달에서 "취소" 버튼 클릭 | 모달 닫기 | - |
| RGC-L5-ACT-027 | 분류된 역할 클릭 | 분류된 역할 목록에서 역할명 클릭 | 역할 상세 화면으로 이동 (`/roles/[roleId]`) | - |
| RGC-L5-ACT-028 | 부모 카테고리 클릭 | 기본 정보 섹션에서 상위 카테고리명 클릭 | 해당 카테고리 상세 화면으로 이동 (`/roles/categories/[categoryId]`) | parentId 존재 시 |
| RGC-L5-ACT-029 | 하위 카테고리 클릭 | 하위 카테고리 목록에서 카테고리명 클릭 | 해당 카테고리 상세 화면으로 이동 (`/roles/categories/[categoryId]`) | - |
| RGC-L5-ACT-030 | 뒤로가기 | 브라우저 뒤로가기 또는 목록 링크 | 카테고리 목록 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/categories/:id 호출 -> 상세 정보 + 분류된 역할 + 하위 카테고리 표시 | 에러 메시지 (404: "역할 카테고리를 찾을 수 없습니다") |
| 삭제 확인 | DELETE 호출 -> "역할 카테고리가 삭제되었습니다" 성공 토스트 -> 카테고리 목록으로 이동 | 에러 토스트 |
| 삭제 취소 | 모달 닫기 | - |

#### 삭제 모달 분기

```
삭제 버튼 클릭
    |
    v
하위 카테고리 수 확인
    |
    +-- 1개 이상 --> [삭제 차단 모달]
    |                   "하위 카테고리를 먼저 삭제하거나 이동해주세요."
    |                   (삭제 버튼 비활성화, 확인 버튼만 표시)
    |
    +-- 0개 --> 분류된 역할 수 확인
                    |
                    +-- 0개 --> [기본 삭제 확인 모달]
                    |               "정말로 삭제하시겠습니까?"
                    |
                    +-- N개 --> [경고 삭제 확인 모달]
                                "이 카테고리에 N개의 역할이 분류되어 있습니다.
                                 삭제하면 분류가 해제됩니다."
```

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/categories/:id
    |
    +-- 성공 --> [데이터 표시]
    |                |
    |                +-- 수정 버튼 --> [수정 화면 이동]
    |                +-- 삭제 버튼 --> [삭제 분기 판단]
    |                |                    |
    |                |                    +-- 하위 있음 --> [차단 모달] --> [데이터 표시]
    |                |                    +-- 하위 없음 --> [삭제 확인 모달]
    |                |                                         |
    |                |                                         +-- 확인 --> [삭제 처리] --> 성공 --> [목록 이동]
    |                |                                         +-- 취소 --> [데이터 표시]
    |                |
    |                +-- 역할 클릭 --> [역할 상세 이동]
    |                +-- 부모 카테고리 클릭 --> [카테고리 상세 이동]
    |                +-- 하위 카테고리 클릭 --> [카테고리 상세 이동]
    |
    +-- 실패 --> [에러 상태] --> 목록 이동
```

---

### RGC-L4-SCR-007: 역할 카테고리 등록 화면 (`/roles/categories/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-031 | name 입력 | 이름 Input 입력 | 실시간 유효성 검사 (영문 대문자 + 언더스코어) | - |
| RGC-L5-ACT-032 | parentId 선택 | 상위 카테고리 Select 변경 | 선택값 업데이트 (type=Role인 카테고리만 표시) | - |
| RGC-L5-ACT-033 | 등록 버튼 클릭 | "등록" 버튼 클릭 | 유효성 검사 후 POST /api/v1/categories 호출 | name 필수 |
| RGC-L5-ACT-034 | 취소 버튼 클릭 | "취소" 버튼 클릭 | 카테고리 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/categories?type=Role 호출 -> parentId Select 옵션 로드 | 에러 메시지 |
| 등록 버튼 클릭 | POST 호출 -> "역할 카테고리가 등록되었습니다" 성공 토스트 -> 카테고리 목록으로 이동 | 에러 토스트 (400: 유효성 오류, 409: 이름 중복) |

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수, `^[A-Z][A-Z0-9_]*$`, 최대 50자, unique | "카테고리 이름은 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" |
| parentId | 선택, type=Role인 카테고리만 | - |

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/categories?type=Role (상위 카테고리 옵션)
    |
    +-- 성공 --> [폼 초기 상태] (type=Role, spaceId 자동 설정)
    |                |
    |                +-- 입력 --> [입력 중] --> 유효성 검사
    |                |
    |                +-- 등록 버튼 --> [유효성 체크]
    |                |                    |
    |                |                    +-- 통과 --> [로딩] -- POST /api/v1/categories
    |                |                    |              |
    |                |                    |              +-- 성공 --> [목록 이동]
    |                |                    |              +-- 실패 --> [에러 표시]
    |                |                    |
    |                |                    +-- 실패 --> [유효성 에러 표시]
    |                |
    |                +-- 취소 버튼 --> [목록 이동]
    |
    +-- 실패 --> [에러 상태]
```

---

### RGC-L4-SCR-008: 역할 카테고리 수정 화면 (`/roles/categories/[categoryId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| RGC-L5-ACT-035 | parentId 변경 | 상위 카테고리 Select 변경 | 선택값 업데이트 | 자기 자신 및 하위 카테고리 제외 |
| RGC-L5-ACT-036 | 저장 버튼 클릭 | "저장" 버튼 클릭 | PATCH /api/v1/categories/:id 호출 | - |
| RGC-L5-ACT-037 | 취소 버튼 클릭 | "취소" 버튼 클릭 | 카테고리 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/categories/:id + GET /api/v1/categories?type=Role 병렬 호출 -> 기존 데이터 prefill + parentId Select 옵션 로드 | 에러 메시지 (404) |
| 저장 버튼 클릭 | PATCH 호출 -> "역할 카테고리가 수정되었습니다" 성공 토스트 -> 카테고리 상세 화면으로 이동 | 에러 토스트 (400: 순환 참조 등) |

#### 제약사항

- name(카테고리 이름) 필드는 `readonly` 표시 (식별자 변경 방지)
- parentId Select에서 자기 자신과 자신의 하위 카테고리는 비활성화 (순환 참조 방지)

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/categories/:id + GET /api/v1/categories?type=Role (병렬)
    |
    +-- 성공 --> [폼 표시 (prefill)]
    |                |
    |                +-- parentId 변경 --> [수정 중]
    |                |
    |                +-- 저장 버튼 --> [로딩] -- PATCH /api/v1/categories/:id
    |                |                   |
    |                |                   +-- 성공 --> [상세 화면 이동]
    |                |                   +-- 실패 --> [에러 표시]
    |                |
    |                +-- 취소 버튼 --> [상세 화면 이동]
    |
    +-- 실패 --> [에러 상태] --> 목록 이동
```

---

## 모달 정의

### 삭제 확인 모달 (그룹/카테고리 공통)

```
+------------------------------------+
|         삭제 확인                    |
+------------------------------------+
|                                     |
|  정말로 삭제하시겠습니까?            |
|  이 작업은 되돌릴 수 없습니다.       |
|                                     |
+------------------------------------+
|    [취소]           [삭제]          |
+------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 제목 | "삭제 확인" |
| 본문 | "정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다." |
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 삭제 버튼 | DELETE API 호출 (color="danger") |

### 경고 삭제 확인 모달 (소속/분류 역할 존재 시)

```
+------------------------------------+
|         삭제 확인                    |
+------------------------------------+
|                                     |
|  이 [그룹/카테고리]에 N개의 역할이  |
|  [소속/분류]되어 있습니다.           |
|  삭제하면 연결이 해제됩니다.         |
|                                     |
|  정말로 삭제하시겠습니까?            |
|                                     |
+------------------------------------+
|    [취소]           [삭제]          |
+------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 제목 | "삭제 확인" |
| 본문 | 소속/분류 역할 수를 포함한 경고 메시지 |
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 삭제 버튼 | DELETE API 호출 (color="danger") |

### 삭제 차단 모달 (하위 카테고리 존재 시)

```
+------------------------------------+
|         삭제 불가                    |
+------------------------------------+
|                                     |
|  하위 카테고리가 존재하여 삭제할     |
|  수 없습니다.                       |
|  하위 카테고리를 먼저 삭제하거나     |
|  이동해주세요.                      |
|                                     |
+------------------------------------+
|                      [확인]         |
+------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 제목 | "삭제 불가" |
| 본문 | 하위 카테고리 존재 안내 |
| 확인 버튼 | 모달 닫기 (variant="flat") |

---

## 피드백 메시지

| 상황 | 유형 | 메시지 |
|------|------|--------|
| 그룹 등록 성공 | success | "역할 그룹이 등록되었습니다." |
| 그룹 수정 성공 | success | "역할 그룹이 수정되었습니다." |
| 그룹 삭제 성공 | success | "역할 그룹이 삭제되었습니다." |
| 카테고리 등록 성공 | success | "역할 카테고리가 등록되었습니다." |
| 카테고리 수정 성공 | success | "역할 카테고리가 수정되었습니다." |
| 카테고리 삭제 성공 | success | "역할 카테고리가 삭제되었습니다." |
| 이름 중복 | error | "이미 존재하는 이름입니다." |
| 저장 실패 | error | "저장에 실패했습니다. 다시 시도해주세요." |
| 권한 없음 | warning | "해당 작업을 수행할 권한이 없습니다." |
| 네트워크 에러 | error | "네트워크 오류가 발생했습니다." |
| 순환 참조 | error | "상위 카테고리로 자기 자신이나 하위 카테고리를 선택할 수 없습니다." |
| 하위 카테고리 존재 | warning | "하위 카테고리를 먼저 삭제하거나 이동해주세요." |

---

## L6: API 엔드포인트 정의

### 신규 API (이 기획에서 구현 필요)

Group과 Category는 범용 모델이므로 `/api/v1/groups`, `/api/v1/categories`로 범용 엔드포인트를 구현합니다. 프론트엔드에서 `type=Role` 쿼리 파라미터로 필터링하여 사용합니다.

---

#### RGC-L6-API-001: 그룹 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-001 |
| **Method** | GET |
| **Endpoint** | `/api/v1/groups` |
| **Operation ID** | `getGroups` |
| **설명** | 그룹 목록을 조회합니다. type 쿼리 파라미터로 그룹 유형별 필터링 가능. 소속 연결 수(_count) 포함. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Query Parameters** (`QueryGroupDto`):

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| name | string | - | 이름 부분 일치 검색 (containsFilter) |
| type | GroupTypes | - | 그룹 유형 필터 (Role, User, Space, File) |
| skip | number | - | 건너뛸 항목 수 (페이지네이션) |
| take | number | - | 조회할 항목 수 (페이지네이션) |

**Response** (`GroupDto[]` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "TRUSTED",
      "type": "Role",
      "label": "신뢰",
      "spaceId": "uuid",
      "creatorId": "uuid",
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleAssociations": 2
      }
    }
  ]
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 500 | 서버 에러 |

**프론트엔드 호출 예시**: `GET /api/v1/groups?type=Role`

---

#### RGC-L6-API-002: 그룹 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-002 |
| **Method** | GET |
| **Endpoint** | `/api/v1/groups/:id` |
| **Operation ID** | `getGroupById` |
| **설명** | ID로 그룹을 상세 조회합니다. roleAssociations(소속 역할) 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 그룹 ID |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 상세 조회 성공",
  "data": {
    "id": "uuid",
    "name": "TRUSTED",
    "type": "Role",
    "label": "신뢰",
    "spaceId": "uuid",
    "creatorId": "uuid",
    "space": { "id": "uuid", "name": "System" },
    "roleAssociations": [
      {
        "id": "uuid",
        "roleId": "uuid",
        "groupId": "uuid",
        "role": {
          "id": "uuid",
          "name": "FULL_ACCESS",
          "displayName": "전체 접근",
          "isSystem": true
        }
      },
      {
        "id": "uuid",
        "roleId": "uuid",
        "groupId": "uuid",
        "role": {
          "id": "uuid",
          "name": "MANAGE",
          "displayName": "관리",
          "isSystem": true
        }
      }
    ],
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 그룹을 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-003: 그룹 생성

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-003 |
| **Method** | POST |
| **Endpoint** | `/api/v1/groups` |
| **Operation ID** | `createGroup` |
| **설명** | 새로운 그룹을 생성합니다. type과 spaceId는 프론트엔드에서 전달합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Status Code** | 201 Created |

**Request Body** (`CreateGroupDto`):

```json
{
  "name": "VIP",
  "type": "Role",
  "label": "VIP 전용",
  "spaceId": "uuid",
  "tenantId": "uuid"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | O | 그룹 이름 (영문 대문자 + 언더스코어) |
| type | GroupTypes | O | 그룹 유형 (프론트엔드에서 'Role' 고정) |
| label | string | - | 한글 표시명 |
| spaceId | UUID | O | Space ID (현재 Space 자동 설정) |
| tenantId | UUID | O | Tenant ID (현재 Tenant 자동 설정) |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 201,
  "message": "그룹 생성 성공",
  "data": {
    "id": "uuid",
    "name": "VIP",
    "type": "Role",
    "label": "VIP 전용",
    "spaceId": "uuid",
    "createdAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 (name 형식, 필수 필드 누락) |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 409 | 이름 중복 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-004: 그룹 수정

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-004 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/groups/:id` |
| **Operation ID** | `updateGroup` |
| **설명** | 그룹 정보를 수정합니다. 부분 수정(Partial Update) 지원. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 그룹 ID |

**Request Body** (`UpdateGroupDto` - Partial):

```json
{
  "label": "수정된 라벨"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | - | 그룹 이름 (프론트엔드에서 readonly, 전송하지 않음) |
| label | string | - | 한글 표시명 |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 수정 성공",
  "data": {
    "id": "uuid",
    "name": "TRUSTED",
    "type": "Role",
    "label": "수정된 라벨",
    "spaceId": "uuid",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 그룹을 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-005: 그룹 삭제

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-005 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/groups/:id` |
| **Operation ID** | `deleteGroup` |
| **설명** | 그룹을 소프트 삭제합니다. 소속 역할의 RoleAssociation도 함께 해제(삭제)됩니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 그룹 ID |

**Response** (`GroupDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "그룹 삭제 성공",
  "data": {
    "id": "uuid",
    "name": "VIP",
    "type": "Role",
    "removedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 그룹을 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-006: 카테고리 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-006 |
| **Method** | GET |
| **Endpoint** | `/api/v1/categories` |
| **Operation ID** | `getCategories` |
| **설명** | 카테고리 목록을 조회합니다. type 쿼리 파라미터로 카테고리 유형별 필터링 가능. 부모 카테고리, 연결 수(_count) 포함. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Query Parameters** (`QueryCategoryDto`):

| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| name | string | - | 이름 부분 일치 검색 (containsFilter) |
| type | CategoryTypes | - | 카테고리 유형 필터 (Role, User, Space, File) |
| parentId | UUID | - | 상위 카테고리 ID 정확 매칭 |
| spaceId | UUID | - | Space ID 정확 매칭 |
| skip | number | - | 건너뛸 항목 수 (페이지네이션) |
| take | number | - | 조회할 항목 수 (페이지네이션) |

**Response** (`CategoryDto[]` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "PLATFORM",
      "type": "Role",
      "parentId": null,
      "spaceId": "uuid",
      "creatorId": "uuid",
      "parent": null,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleClassifications": 1,
        "children": 0
      }
    },
    {
      "id": "uuid",
      "name": "WORKSPACE",
      "type": "Role",
      "parentId": null,
      "spaceId": "uuid",
      "parent": null,
      "createdAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleClassifications": 1,
        "children": 2
      }
    },
    {
      "id": "uuid",
      "name": "PUBLIC",
      "type": "Role",
      "parentId": "uuid (WORKSPACE)",
      "spaceId": "uuid",
      "parent": { "id": "uuid", "name": "WORKSPACE" },
      "createdAt": "2026-01-15T10:30:00.000Z",
      "_count": {
        "roleClassifications": 1,
        "children": 0
      }
    }
  ]
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 500 | 서버 에러 |

**프론트엔드 호출 예시**: `GET /api/v1/categories?type=Role`

---

#### RGC-L6-API-007: 카테고리 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-007 |
| **Method** | GET |
| **Endpoint** | `/api/v1/categories/:id` |
| **Operation ID** | `getCategoryById` |
| **설명** | ID로 카테고리를 상세 조회합니다. roleClassifications(분류된 역할), children(하위 카테고리), parent(부모 카테고리) 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 카테고리 ID |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 상세 조회 성공",
  "data": {
    "id": "uuid",
    "name": "WORKSPACE",
    "type": "Role",
    "parentId": null,
    "spaceId": "uuid",
    "creatorId": "uuid",
    "parent": null,
    "space": { "id": "uuid", "name": "System" },
    "children": [
      {
        "id": "uuid",
        "name": "PUBLIC",
        "type": "Role",
        "parentId": "uuid",
        "_count": { "roleClassifications": 1 }
      },
      {
        "id": "uuid",
        "name": "PROJECT",
        "type": "Role",
        "parentId": "uuid",
        "_count": { "roleClassifications": 0 }
      }
    ],
    "roleClassifications": [
      {
        "id": "uuid",
        "roleId": "uuid",
        "categoryId": "uuid",
        "role": {
          "id": "uuid",
          "name": "MANAGE",
          "displayName": "관리",
          "isSystem": true
        }
      }
    ],
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-01-15T10:30:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 카테고리를 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-008: 카테고리 생성

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-008 |
| **Method** | POST |
| **Endpoint** | `/api/v1/categories` |
| **Operation ID** | `createCategory` |
| **설명** | 새로운 카테고리를 생성합니다. type과 spaceId는 프론트엔드에서 전달합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Status Code** | 201 Created |

**Request Body** (`CreateCategoryDto`):

```json
{
  "name": "ANALYTICS",
  "type": "Role",
  "parentId": null,
  "spaceId": "uuid",
  "tenantId": "uuid"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | O | 카테고리 이름 (영문 대문자 + 언더스코어, unique) |
| type | CategoryTypes | O | 카테고리 유형 (프론트엔드에서 'Role' 고정) |
| parentId | UUID | - | 상위 카테고리 ID (null이면 최상위) |
| spaceId | UUID | O | Space ID (현재 Space 자동 설정) |
| tenantId | UUID | O | Tenant ID (현재 Tenant 자동 설정) |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 201,
  "message": "카테고리 생성 성공",
  "data": {
    "id": "uuid",
    "name": "ANALYTICS",
    "type": "Role",
    "parentId": null,
    "spaceId": "uuid",
    "createdAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 (name 형식, 필수 필드 누락) |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 409 | 이름 중복 (Category name은 @unique) |
| 500 | 서버 에러 |

---

#### RGC-L6-API-009: 카테고리 수정

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-009 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/categories/:id` |
| **Operation ID** | `updateCategory` |
| **설명** | 카테고리 정보를 수정합니다. 부분 수정(Partial Update) 지원. parentId 변경 시 순환 참조를 서버에서 검증합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 카테고리 ID |

**Request Body** (`UpdateCategoryDto` - Partial):

```json
{
  "parentId": "uuid"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| name | string | - | 카테고리 이름 (프론트엔드에서 readonly, 전송하지 않음) |
| parentId | UUID | - | 상위 카테고리 ID (null이면 최상위로 변경) |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 수정 성공",
  "data": {
    "id": "uuid",
    "name": "PUBLIC",
    "type": "Role",
    "parentId": "uuid (새 부모)",
    "spaceId": "uuid",
    "createdAt": "2026-01-15T10:30:00.000Z",
    "updatedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 유효성 오류 (순환 참조, 자기 자신 선택 등) |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 카테고리를 찾을 수 없음 |
| 500 | 서버 에러 |

---

#### RGC-L6-API-010: 카테고리 삭제

| 항목 | 내용 |
|------|------|
| **ID** | RGC-L6-API-010 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/categories/:id` |
| **Operation ID** | `deleteCategory` |
| **설명** | 카테고리를 소프트 삭제합니다. 하위 카테고리가 있으면 서버에서 삭제를 거부합니다. 분류된 역할의 RoleClassification은 함께 해제(삭제)됩니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |

**Path Parameters**:

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | UUID | 카테고리 ID |

**Response** (`CategoryDto` 래핑):

```json
{
  "httpStatus": 200,
  "message": "카테고리 삭제 성공",
  "data": {
    "id": "uuid",
    "name": "ANALYTICS",
    "type": "Role",
    "removedAt": "2026-02-17T10:00:00.000Z"
  }
}
```

**에러**:

| 코드 | 설명 |
|------|------|
| 400 | 하위 카테고리 존재 ("하위 카테고리를 먼저 삭제하거나 이동해주세요.") |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 카테고리를 찾을 수 없음 |
| 500 | 서버 에러 |

---

## API 호출 흐름 요약

| 화면 | 액션 | API | 성공 시 | 실패 시 |
|------|------|-----|---------|---------|
| 그룹 목록 | 페이지 진입 | GET /api/v1/groups?type=Role | 목록 표시 | 에러 메시지 |
| 그룹 목록 | 검색 | 클라이언트 필터링 | 목록 갱신 | - |
| 그룹 상세 | 페이지 진입 | GET /api/v1/groups/:id | 상세 표시 | 에러 메시지 |
| 그룹 상세 | 삭제 | DELETE /api/v1/groups/:id | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 그룹 등록 | 저장 | POST /api/v1/groups | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 그룹 수정 | 페이지 진입 | GET /api/v1/groups/:id | 폼 prefill | 에러 메시지 |
| 그룹 수정 | 저장 | PATCH /api/v1/groups/:id | 상세 이동 + 성공 토스트 | 에러 토스트 |
| 카테고리 목록 | 페이지 진입 | GET /api/v1/categories?type=Role | 목록 표시 | 에러 메시지 |
| 카테고리 목록 | 검색/필터 | 클라이언트 필터링 | 목록 갱신 | - |
| 카테고리 상세 | 페이지 진입 | GET /api/v1/categories/:id | 상세 표시 | 에러 메시지 |
| 카테고리 상세 | 삭제 | DELETE /api/v1/categories/:id | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 카테고리 등록 | 페이지 진입 | GET /api/v1/categories?type=Role | Select 옵션 로드 | 에러 메시지 |
| 카테고리 등록 | 저장 | POST /api/v1/categories | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 카테고리 수정 | 페이지 진입 | GET /api/v1/categories/:id + GET /api/v1/categories?type=Role | 폼 prefill + Select 옵션 | 에러 메시지 |
| 카테고리 수정 | 저장 | PATCH /api/v1/categories/:id | 상세 이동 + 성공 토스트 | 에러 토스트 |

---

## 백엔드 구현 요약

### 신규 모듈 구조

```
apps/server/src/module/
├── group/
│   ├── groups.controller.ts    → GroupsController
│   ├── groups.module.ts        → GroupsModule
│   └── index.ts
└── category/
    ├── categories.controller.ts → CategoriesController
    ├── categories.module.ts     → CategoriesModule
    └── index.ts

packages/be-service/src/
├── groups.service.ts           → GroupsService
└── categories.service.ts       → CategoriesService

packages/be-repository/src/
├── groups.repository.ts        → GroupsRepository
└── categories.repository.ts    → CategoriesRepository
```

### 서비스 레이어 비즈니스 로직

**GroupsService**:
- `getAll(query)`: type 필터 + _count.roleAssociations include
- `getById(id)`: roleAssociations.role include
- `create(dto)`: name 중복 검사 (같은 type 내)
- `update(id, dto)`: 존재 여부 확인
- `delete(id)`: 소프트 삭제 (removedAt 설정) + 연결된 RoleAssociation 소프트 삭제

**CategoriesService**:
- `getAll(query)`: type 필터 + parent include + _count.roleClassifications, children include
- `getById(id)`: parent, children, roleClassifications.role include
- `create(dto)`: name 중복 검사 (unique 제약)
- `update(id, dto)`: 순환 참조 검증 (parentId가 자기 자신이나 하위 카테고리가 아닌지)
- `delete(id)`: 하위 카테고리 존재 시 400 에러, 소프트 삭제 + 연결된 RoleClassification 소프트 삭제

### 기존 DTO 활용

| DTO | 용도 | 비고 |
|-----|------|------|
| `GroupDto` | 응답 DTO | `@cocrepo/dto` 기존 |
| `CreateGroupDto` | 생성 요청 | `@cocrepo/dto` 기존 |
| `UpdateGroupDto` | 수정 요청 | `@cocrepo/dto` 기존 |
| `QueryGroupDto` | 목록 조회 쿼리 | `@cocrepo/dto` 기존 (type 필터 추가 필요) |
| `CategoryDto` | 응답 DTO | `@cocrepo/dto` 기존 |
| `CreateCategoryDto` | 생성 요청 | `@cocrepo/dto` 기존 |
| `UpdateCategoryDto` | 수정 요청 | `@cocrepo/dto` 기존 |
| `QueryCategoryDto` | 목록 조회 쿼리 | `@cocrepo/dto` 기존 |

### QueryGroupDto 수정 필요

현재 `QueryGroupDto`에 `type` 필터가 없으므로 추가가 필요합니다:

```typescript
// packages/be-dto/src/query/query-group.dto.ts 수정 필요
export class QueryGroupDto extends PrismaQueryDto<Prisma.GroupWhereInput> {
  @StringFieldOptional()
  name?: string;

  @EnumFieldOptional(() => GroupTypes)
  type?: GroupTypes;  // 추가 필요

  @StringFieldOptional()
  label?: string;  // 추가 필요 (label 검색용)
}
```

---

## Requirement Graph (L5-L6)

```json
{
  "nodes": [
    { "id": "RGC-L5-ACT-001", "level": 5, "subLevel": "1", "type": "action", "label": "검색어 입력 (그룹)", "description": "검색창에 검색어 입력하여 그룹 목록 필터링" },
    { "id": "RGC-L5-ACT-002", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 행 클릭", "description": "DataGrid 행 클릭하여 그룹 상세로 이동" },
    { "id": "RGC-L5-ACT-003", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 등록 버튼 클릭", "description": "그룹 등록 화면으로 이동" },
    { "id": "RGC-L5-ACT-004", "level": 5, "subLevel": "1", "type": "action", "label": "컬럼 정렬 (그룹)", "description": "DataGrid 컬럼 정렬" },
    { "id": "RGC-L5-ACT-005", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 수정 버튼", "description": "그룹 수정 화면으로 이동" },
    { "id": "RGC-L5-ACT-006", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 삭제 버튼", "description": "삭제 확인 모달 표시" },
    { "id": "RGC-L5-ACT-007", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 삭제 확인", "description": "모달에서 삭제 확인" },
    { "id": "RGC-L5-ACT-008", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 삭제 취소", "description": "모달 닫기" },
    { "id": "RGC-L5-ACT-009", "level": 5, "subLevel": "1", "type": "action", "label": "소속 역할 클릭", "description": "역할 상세로 이동" },
    { "id": "RGC-L5-ACT-010", "level": 5, "subLevel": "1", "type": "action", "label": "뒤로가기 (그룹)", "description": "그룹 목록으로 이동" },
    { "id": "RGC-L5-ACT-011", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 name 입력", "description": "그룹 이름 입력 (유효성 검사)" },
    { "id": "RGC-L5-ACT-012", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 label 입력", "description": "그룹 라벨 입력" },
    { "id": "RGC-L5-ACT-013", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 등록 저장", "description": "그룹 등록 POST 요청" },
    { "id": "RGC-L5-ACT-014", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 등록 취소", "description": "그룹 목록으로 이동" },
    { "id": "RGC-L5-ACT-015", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 label 수정", "description": "그룹 라벨 수정" },
    { "id": "RGC-L5-ACT-016", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 수정 저장", "description": "그룹 수정 PATCH 요청" },
    { "id": "RGC-L5-ACT-017", "level": 5, "subLevel": "1", "type": "action", "label": "그룹 수정 취소", "description": "그룹 상세로 이동" },
    { "id": "RGC-L5-ACT-018", "level": 5, "subLevel": "1", "type": "action", "label": "검색어 입력 (카테고리)", "description": "검색창에 검색어 입력하여 카테고리 목록 필터링" },
    { "id": "RGC-L5-ACT-019", "level": 5, "subLevel": "1", "type": "action", "label": "상위 카테고리 필터", "description": "상위 카테고리 Select 필터" },
    { "id": "RGC-L5-ACT-020", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 행 클릭", "description": "DataGrid 행 클릭하여 카테고리 상세로 이동" },
    { "id": "RGC-L5-ACT-021", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 등록 버튼 클릭", "description": "카테고리 등록 화면으로 이동" },
    { "id": "RGC-L5-ACT-022", "level": 5, "subLevel": "1", "type": "action", "label": "컬럼 정렬 (카테고리)", "description": "DataGrid 컬럼 정렬" },
    { "id": "RGC-L5-ACT-023", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 수정 버튼", "description": "카테고리 수정 화면으로 이동" },
    { "id": "RGC-L5-ACT-024", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 삭제 버튼", "description": "삭제 확인 모달 표시" },
    { "id": "RGC-L5-ACT-025", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 삭제 확인", "description": "모달에서 삭제 확인" },
    { "id": "RGC-L5-ACT-026", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 삭제 취소", "description": "모달 닫기" },
    { "id": "RGC-L5-ACT-027", "level": 5, "subLevel": "1", "type": "action", "label": "분류된 역할 클릭", "description": "역할 상세로 이동" },
    { "id": "RGC-L5-ACT-028", "level": 5, "subLevel": "1", "type": "action", "label": "부모 카테고리 클릭", "description": "상위 카테고리 상세로 이동" },
    { "id": "RGC-L5-ACT-029", "level": 5, "subLevel": "1", "type": "action", "label": "하위 카테고리 클릭", "description": "하위 카테고리 상세로 이동" },
    { "id": "RGC-L5-ACT-030", "level": 5, "subLevel": "1", "type": "action", "label": "뒤로가기 (카테고리)", "description": "카테고리 목록으로 이동" },
    { "id": "RGC-L5-ACT-031", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 name 입력", "description": "카테고리 이름 입력 (유효성 검사)" },
    { "id": "RGC-L5-ACT-032", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 parentId 선택", "description": "상위 카테고리 Select 변경" },
    { "id": "RGC-L5-ACT-033", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 등록 저장", "description": "카테고리 등록 POST 요청" },
    { "id": "RGC-L5-ACT-034", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 등록 취소", "description": "카테고리 목록으로 이동" },
    { "id": "RGC-L5-ACT-035", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 parentId 변경", "description": "상위 카테고리 변경 (순환 참조 방지)" },
    { "id": "RGC-L5-ACT-036", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 수정 저장", "description": "카테고리 수정 PATCH 요청" },
    { "id": "RGC-L5-ACT-037", "level": 5, "subLevel": "1", "type": "action", "label": "카테고리 수정 취소", "description": "카테고리 상세로 이동" },
    { "id": "RGC-L6-API-001", "level": 6, "subLevel": "1", "type": "api", "label": "GET /api/v1/groups", "description": "그룹 목록 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/groups", "queryParams": [{ "name": "type", "type": "GroupTypes", "description": "그룹 유형 필터" }, { "name": "name", "type": "string", "description": "이름 검색" }], "responseBody": "GroupDto", "isArrayResponse": true, "auth": "Bearer Token", "permissions": ["MANAGE", "FULL_ACCESS"] } },
    { "id": "RGC-L6-API-002", "level": 6, "subLevel": "1", "type": "api", "label": "GET /api/v1/groups/:id", "description": "그룹 상세 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/groups/:id", "pathParams": [{ "name": "id", "type": "UUID", "required": true, "description": "그룹 ID" }], "responseBody": "GroupDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["MANAGE", "FULL_ACCESS"] } },
    { "id": "RGC-L6-API-003", "level": 6, "subLevel": "1", "type": "api", "label": "POST /api/v1/groups", "description": "그룹 생성 API", "metadata": { "method": "POST", "endpoint": "/api/v1/groups", "requestBody": "CreateGroupDto", "responseBody": "GroupDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "RGC-L6-API-004", "level": 6, "subLevel": "1", "type": "api", "label": "PATCH /api/v1/groups/:id", "description": "그룹 수정 API", "metadata": { "method": "PATCH", "endpoint": "/api/v1/groups/:id", "pathParams": [{ "name": "id", "type": "UUID", "required": true, "description": "그룹 ID" }], "requestBody": "UpdateGroupDto", "responseBody": "GroupDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "RGC-L6-API-005", "level": 6, "subLevel": "1", "type": "api", "label": "DELETE /api/v1/groups/:id", "description": "그룹 삭제 API", "metadata": { "method": "DELETE", "endpoint": "/api/v1/groups/:id", "pathParams": [{ "name": "id", "type": "UUID", "required": true, "description": "그룹 ID" }], "responseBody": "GroupDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "RGC-L6-API-006", "level": 6, "subLevel": "1", "type": "api", "label": "GET /api/v1/categories", "description": "카테고리 목록 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/categories", "queryParams": [{ "name": "type", "type": "CategoryTypes", "description": "카테고리 유형 필터" }, { "name": "name", "type": "string", "description": "이름 검색" }, { "name": "parentId", "type": "UUID", "description": "상위 카테고리 필터" }], "responseBody": "CategoryDto", "isArrayResponse": true, "auth": "Bearer Token", "permissions": ["MANAGE", "FULL_ACCESS"] } },
    { "id": "RGC-L6-API-007", "level": 6, "subLevel": "1", "type": "api", "label": "GET /api/v1/categories/:id", "description": "카테고리 상세 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/categories/:id", "pathParams": [{ "name": "id", "type": "UUID", "required": true, "description": "카테고리 ID" }], "responseBody": "CategoryDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["MANAGE", "FULL_ACCESS"] } },
    { "id": "RGC-L6-API-008", "level": 6, "subLevel": "1", "type": "api", "label": "POST /api/v1/categories", "description": "카테고리 생성 API", "metadata": { "method": "POST", "endpoint": "/api/v1/categories", "requestBody": "CreateCategoryDto", "responseBody": "CategoryDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "RGC-L6-API-009", "level": 6, "subLevel": "1", "type": "api", "label": "PATCH /api/v1/categories/:id", "description": "카테고리 수정 API", "metadata": { "method": "PATCH", "endpoint": "/api/v1/categories/:id", "pathParams": [{ "name": "id", "type": "UUID", "required": true, "description": "카테고리 ID" }], "requestBody": "UpdateCategoryDto", "responseBody": "CategoryDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "RGC-L6-API-010", "level": 6, "subLevel": "1", "type": "api", "label": "DELETE /api/v1/categories/:id", "description": "카테고리 삭제 API", "metadata": { "method": "DELETE", "endpoint": "/api/v1/categories/:id", "pathParams": [{ "name": "id", "type": "UUID", "required": true, "description": "카테고리 ID" }], "responseBody": "CategoryDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } }
  ],
  "edges": [
    { "from": "RGC-L4-SCR-001", "to": "RGC-L5-ACT-001", "type": "parent" },
    { "from": "RGC-L4-SCR-001", "to": "RGC-L5-ACT-002", "type": "parent" },
    { "from": "RGC-L4-SCR-001", "to": "RGC-L5-ACT-003", "type": "parent" },
    { "from": "RGC-L4-SCR-001", "to": "RGC-L5-ACT-004", "type": "parent" },
    { "from": "RGC-L4-SCR-001", "to": "RGC-L6-API-001", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L5-ACT-005", "type": "parent" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L5-ACT-006", "type": "parent" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L5-ACT-007", "type": "parent" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L5-ACT-008", "type": "parent" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L5-ACT-009", "type": "parent" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L5-ACT-010", "type": "parent" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L6-API-002", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-002", "to": "RGC-L6-API-005", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-003", "to": "RGC-L5-ACT-011", "type": "parent" },
    { "from": "RGC-L4-SCR-003", "to": "RGC-L5-ACT-012", "type": "parent" },
    { "from": "RGC-L4-SCR-003", "to": "RGC-L5-ACT-013", "type": "parent" },
    { "from": "RGC-L4-SCR-003", "to": "RGC-L5-ACT-014", "type": "parent" },
    { "from": "RGC-L4-SCR-003", "to": "RGC-L6-API-003", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-004", "to": "RGC-L5-ACT-015", "type": "parent" },
    { "from": "RGC-L4-SCR-004", "to": "RGC-L5-ACT-016", "type": "parent" },
    { "from": "RGC-L4-SCR-004", "to": "RGC-L5-ACT-017", "type": "parent" },
    { "from": "RGC-L4-SCR-004", "to": "RGC-L6-API-002", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-004", "to": "RGC-L6-API-004", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-005", "to": "RGC-L5-ACT-018", "type": "parent" },
    { "from": "RGC-L4-SCR-005", "to": "RGC-L5-ACT-019", "type": "parent" },
    { "from": "RGC-L4-SCR-005", "to": "RGC-L5-ACT-020", "type": "parent" },
    { "from": "RGC-L4-SCR-005", "to": "RGC-L5-ACT-021", "type": "parent" },
    { "from": "RGC-L4-SCR-005", "to": "RGC-L5-ACT-022", "type": "parent" },
    { "from": "RGC-L4-SCR-005", "to": "RGC-L6-API-006", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-023", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-024", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-025", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-026", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-027", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-028", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-029", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L5-ACT-030", "type": "parent" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L6-API-007", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-006", "to": "RGC-L6-API-010", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-007", "to": "RGC-L5-ACT-031", "type": "parent" },
    { "from": "RGC-L4-SCR-007", "to": "RGC-L5-ACT-032", "type": "parent" },
    { "from": "RGC-L4-SCR-007", "to": "RGC-L5-ACT-033", "type": "parent" },
    { "from": "RGC-L4-SCR-007", "to": "RGC-L5-ACT-034", "type": "parent" },
    { "from": "RGC-L4-SCR-007", "to": "RGC-L6-API-006", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-007", "to": "RGC-L6-API-008", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-008", "to": "RGC-L5-ACT-035", "type": "parent" },
    { "from": "RGC-L4-SCR-008", "to": "RGC-L5-ACT-036", "type": "parent" },
    { "from": "RGC-L4-SCR-008", "to": "RGC-L5-ACT-037", "type": "parent" },
    { "from": "RGC-L4-SCR-008", "to": "RGC-L6-API-007", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-008", "to": "RGC-L6-API-006", "type": "calls", "label": "호출" },
    { "from": "RGC-L4-SCR-008", "to": "RGC-L6-API-009", "type": "calls", "label": "호출" }
  ]
}
```
