# L5-L6: 인터랙션, API

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

### ROL-L4-SCR-001: 역할 목록 화면 (`/roles`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-001 | 검색어 입력 | 검색창 입력 후 Enter 또는 디바운스 | 역할 목록 필터링 (클라이언트 사이드) | - |
| ROL-L5-ACT-002 | 카테고리 필터 선택 | 카테고리 Select 변경 | 선택된 카테고리의 역할만 필터링 | - |
| ROL-L5-ACT-003 | 그룹 필터 선택 | 그룹 Select 변경 | 선택된 그룹의 역할만 필터링 | - |
| ROL-L5-ACT-004 | 시스템 여부 필터 | 시스템 여부 Select 변경 | 시스템/커스텀 역할 필터링 | - |
| ROL-L5-ACT-005 | 역할 행 클릭 | DataGrid 행 클릭 | 역할 상세 화면으로 이동 (`/roles/[roleId]`) | - |
| ROL-L5-ACT-006 | 역할 등록 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 역할 등록 화면으로 이동 (`/roles/new`) | `can('create', 'role')` |
| ROL-L5-ACT-007 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, displayName, createdAt 기준 오름차순/내림차순 전환 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/roles 호출 → 목록 표시 | 에러 메시지 + 재시도 버튼 |
| 검색/필터 변경 | 클라이언트 사이드 필터링 (전체 목록은 이미 로드됨) | - |
| 역할 행 클릭 | `/roles/[roleId]`로 라우팅 | - |
| 역할 등록 버튼 | `/roles/new`로 라우팅 | - |

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET /api/v1/roles
    |
    +-- 성공 --> [데이터 표시] <--> [검색/필터/정렬]
    |                |
    |                +-- 행 클릭 --> [상세 화면 이동]
    |                +-- 등록 버튼 --> [등록 화면 이동]
    |
    +-- 실패 --> [에러 상태] --> 재시도 버튼 --> [로딩 상태]
```

---

### ROL-L4-SCR-002: 역할 상세 화면 (`/roles/[roleId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-008 | 수정 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 수정 화면으로 이동 (`/roles/[roleId]/edit`) | `can('update', 'role')`, isSystem=false |
| ROL-L5-ACT-009 | 삭제 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 삭제 확인 모달 표시 | `can('delete', 'role')`, isSystem=false |
| ROL-L5-ACT-010 | 삭제 확인 | 모달에서 삭제 버튼 클릭 | DELETE /api/v1/roles/:id 호출 | - |
| ROL-L5-ACT-011 | 삭제 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |
| ROL-L5-ACT-012 | Grant 체크박스 토글 | Ability 할당 테이블에서 체크박스 클릭 | 해당 Ability의 할당/해제 상태 변경 (로컬) | `can('update', 'role')` |
| ROL-L5-ACT-013 | Grant isActive 토글 | 할당된 Ability의 활성화 Switch 클릭 | isActive 상태 변경 (로컬) | `can('update', 'role')` |
| ROL-L5-ACT-014 | Grant priority 변경 | priority NumberInput 값 변경 | priority 값 변경 (로컬) | `can('update', 'role')` |
| ROL-L5-ACT-015 | Subject 필터 선택 | Grant 영역 Subject 필터 Select 변경 | Subject별 Ability 목록 필터링 | - |
| ROL-L5-ACT-016 | Action 필터 선택 | Grant 영역 Action 필터 Select 변경 | Action별 Ability 목록 필터링 | - |
| ROL-L5-ACT-017 | 일괄 저장 버튼 클릭 | Grant 영역 "일괄 저장" 버튼 클릭 | 저장 확인 모달 표시 | 변경사항이 1건 이상 |
| ROL-L5-ACT-018 | 일괄 저장 확인 | 모달에서 저장 버튼 클릭 | PUT /api/v1/grants/roles/:roleId 호출 | - |
| ROL-L5-ACT-019 | 일괄 저장 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |
| ROL-L5-ACT-020 | Ability 이름 클릭 | Grant 테이블에서 Ability명 클릭 | Ability 상세 화면으로 이동 (`/abilities/[abilityId]`) | - |
| ROL-L5-ACT-021 | 뒤로가기 | 브라우저 뒤로가기 또는 목록 링크 | 역할 목록 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/roles/:id + GET /api/v1/abilities (전체) + GET /api/v1/abilities/roles/:roleId 병렬 호출 → 상세 + Grant 매트릭스 표시 | 에러 메시지 (404: "역할을 찾을 수 없습니다") |
| 삭제 확인 | DELETE 호출 → 성공 토스트 → 역할 목록으로 이동 | 에러 토스트 (400: "시스템 역할은 삭제할 수 없습니다" / "연결된 사용자가 있어 삭제할 수 없습니다") |
| Grant 변경 (체크/활성화/우선순위) | 로컬 상태 업데이트 → 변경사항 카운트 표시 | - |
| 일괄 저장 확인 | PUT 호출 → 성공 토스트 → Grant 목록 재조회 | 에러 토스트 |

#### 상태 전이

```
[페이지 진입]
    |
    v
[로딩 상태] -- GET roles/:id + abilities (전체) + abilities/roles/:roleId (병렬)
    |
    +-- 성공 --> [데이터 표시]
    |                |
    |                +-- 수정 버튼 --> [수정 화면 이동]
    |                +-- 삭제 버튼 --> [삭제 확인 모달]
    |                |                    |
    |                |                    +-- 확인 --> [삭제 처리] --> 성공 --> [목록 이동]
    |                |                    +-- 취소 --> [데이터 표시]
    |                |
    |                +-- Grant 변경 --> [변경사항 추적]
    |                |                    |
    |                |                    +-- 일괄 저장 --> [저장 확인 모달]
    |                |                    |                    |
    |                |                    |                    +-- 확인 --> [저장 처리] --> 성공 --> [Grant 재조회]
    |                |                    |                    +-- 취소 --> [변경사항 추적]
    |                |                    |
    |                |                    +-- 필터 변경 --> [필터링된 목록 표시]
    |
    +-- 실패 --> [에러 상태] --> 재시도 또는 목록 이동
```

---

### ROL-L4-SCR-003: 역할 등록 화면 (`/roles/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-022 | name 입력 | 역할 식별자 Input 입력 | 실시간 유효성 검사 (영문 대문자 + 언더스코어) | - |
| ROL-L5-ACT-023 | displayName 입력 | 표시명 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-024 | description 입력 | 설명 Textarea 입력 | 값 업데이트 | - |
| ROL-L5-ACT-025 | categoryId 선택 | 카테고리 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-026 | groupId 선택 | 그룹 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-027 | 등록 버튼 클릭 | 등록 버튼 클릭 | 유효성 검사 후 POST /api/v1/roles 호출 | name 필수 |
| ROL-L5-ACT-028 | 취소 버튼 클릭 | 취소 버튼 클릭 | 역할 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 등록 버튼 클릭 | POST 호출 → "역할이 등록되었습니다" 토스트 → 역할 상세 화면 이동 | 에러 토스트 (400: 유효성 오류, 409: 중복 이름) |

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수, `^[A-Z][A-Z0-9_]*$`, 최대 50자 | "역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" |
| displayName | 선택, 최대 50자 | "표시명은 50자 이내로 입력해주세요" |
| description | 선택, 최대 200자 | "설명은 200자 이내로 입력해주세요" |

---

### ROL-L4-SCR-004: 역할 수정 화면 (`/roles/[roleId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-029 | displayName 수정 | 표시명 Input 변경 | 값 업데이트 | - |
| ROL-L5-ACT-030 | description 수정 | 설명 Textarea 변경 | 값 업데이트 | - |
| ROL-L5-ACT-031 | categoryId 변경 | 카테고리 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-032 | groupId 변경 | 그룹 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-033 | 저장 버튼 클릭 | 저장 버튼 클릭 | PATCH /api/v1/roles/:id 호출 | - |
| ROL-L5-ACT-034 | 취소 버튼 클릭 | 취소 버튼 클릭 | 역할 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/roles/:id → 기존 데이터 prefill. isSystem=true이면 목록으로 리다이렉트 | 에러 메시지 (404) |
| 저장 버튼 | PATCH 호출 → "역할이 수정되었습니다" 토스트 → 역할 상세 화면 이동 | 에러 토스트 |

#### 제약사항

- name(역할 식별자) 필드는 `readonly` 표시
- isSystem=true인 역할은 접근 시 목록으로 리다이렉트

---

### ROL-L4-SCR-005: 권한 정의 목록 화면 (`/abilities`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-035 | 검색어 입력 | 이름 검색창 입력 | 이름/설명 기준 필터링 | - |
| ROL-L5-ACT-036 | Subject 필터 선택 | Subject Select 변경 | 선택된 Subject의 Ability만 필터링 | - |
| ROL-L5-ACT-037 | Action 필터 선택 | Action Select 변경 | 선택된 Action의 Ability만 필터링 | - |
| ROL-L5-ACT-038 | 유형 필터 선택 | 허용/거부 Select 변경 | inverted 기준 필터링 | - |
| ROL-L5-ACT-039 | Ability 행 클릭 | DataGrid 행 클릭 | Ability 상세 화면으로 이동 | - |
| ROL-L5-ACT-040 | 권한 정의 등록 버튼 | PageSurface actions 영역 버튼 클릭 | 등록 화면으로 이동 (`/abilities/new`) | `can('create', 'ability')` |
| ROL-L5-ACT-041 | 페이지 변경 | 페이지네이션 버튼 클릭 | 해당 페이지 데이터 로드 | - |
| ROL-L5-ACT-042 | 페이지 크기 변경 | 페이지 크기 Select 변경 (10/20/50) | 페이지 크기 변경 후 1페이지로 이동 | - |
| ROL-L5-ACT-043 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, createdAt 기준 정렬 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/abilities 호출 → 목록 표시 | 에러 메시지 + 재시도 |
| 필터 선택 (Subject) | GET /api/v1/subjects 사전 로드 → Select 옵션 표시 | - |
| 필터 선택 (Action) | GET /api/v1/actions 사전 로드 → Select 옵션 표시 | - |
| 검색/필터 변경 | 클라이언트 사이드 필터링 또는 서버 재요청 | - |
| 페이지/크기 변경 | 서버 재요청 → 목록 갱신 | 에러 토스트 |

**참고**: 현재 Ability 전체 목록 조회 API가 없음. 신규 API 필요 (GET /api/v1/abilities, 쿼리 파라미터로 필터링/페이지네이션 지원).

---

### ROL-L4-SCR-006: 권한 정의 상세 화면 (`/abilities/[abilityId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-044 | 수정 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 수정 화면으로 이동 (`/abilities/[abilityId]/edit`) | `can('update', 'ability')` |
| ROL-L5-ACT-045 | 삭제 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 삭제 확인 모달 표시 | `can('delete', 'ability')` |
| ROL-L5-ACT-046 | 삭제 확인 | 모달에서 삭제 버튼 클릭 | DELETE /api/v1/abilities/:id 호출 | - |
| ROL-L5-ACT-047 | 삭제 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |
| ROL-L5-ACT-048 | 할당된 Role 클릭 | 할당 현황 섹션에서 Role명 클릭 | 역할 상세 화면으로 이동 (`/roles/[roleId]`) | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/abilities/:id 호출 → 상세 정보 표시 | 에러 메시지 (404: "권한 정의를 찾을 수 없습니다") |
| 삭제 확인 | DELETE 호출 → "권한 정의가 삭제되었습니다" 토스트 → 목록으로 이동 | 에러 토스트 (연결된 Grant 관련 에러) |

---

### ROL-L4-SCR-007: 권한 정의 등록 화면 (`/abilities/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-049 | name 입력 | 이름 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-050 | description 입력 | 설명 Textarea 입력 | 값 업데이트 | - |
| ROL-L5-ACT-051 | Subject 선택 | Subject Select(검색 가능) 변경 | 선택값 업데이트 + DMMF 필드 자동 조회 | - |
| ROL-L5-ACT-052 | Action 선택 | Action Select(검색 가능) 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-053 | fields 선택 | 필드 TagInput에서 항목 추가/제거 | fields 배열 업데이트 | Subject가 entity 그룹인 경우만 활성화 |
| ROL-L5-ACT-054 | conditions 입력 | JSON 에디터에 조건 입력 | conditions JSON 업데이트 + 실시간 JSON 유효성 검사 | - |
| ROL-L5-ACT-055 | inverted 토글 | 거부 여부 Switch 토글 | inverted 상태 변경 → true이면 reason 필드 활성화 | - |
| ROL-L5-ACT-056 | reason 입력 | 거부 사유 Input 입력 | reason 값 업데이트 | inverted=true일 때만 활성화 |
| ROL-L5-ACT-057 | 등록 버튼 클릭 | 등록 버튼 클릭 | 유효성 검사 후 POST /api/v1/abilities 호출 | name, subjectId, actionId 필수 |
| ROL-L5-ACT-058 | 취소 버튼 클릭 | 취소 버튼 클릭 | 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/subjects + GET /api/v1/actions 병렬 호출 → Select 옵션 로드 | 에러 메시지 |
| Subject 선택 | entity 그룹이면 GET /api/v1/subjects/:id/fields → fields TagInput 자동완성 활성화 | 에러 토스트 |
| 등록 버튼 | POST 호출 → "권한 정의가 등록되었습니다" 토스트 → Ability 목록으로 이동 | 에러 토스트 (400: 유효성 오류) |

#### 동적 동작

1. Subject 선택 시 group이 "entity"인 경우:
   - GET /api/v1/subjects/:id/fields 호출
   - 반환된 필드 목록을 TagInput의 자동완성 후보로 설정
2. inverted 토글 시:
   - true: reason 입력 필드 활성화 (필수는 아님)
   - false: reason 필드 비활성화 + 값 초기화

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수 | "권한 정의 이름을 입력해주세요" |
| subjectId | 필수 | "Subject를 선택해주세요" |
| actionId | 필수 | "Action을 선택해주세요" |
| conditions | JSON 형식 | "올바른 JSON 형식으로 입력해주세요" |

---

### ROL-L4-SCR-008: 권한 정의 수정 화면 (`/abilities/[abilityId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-059 | 필드 수정 | 등록 화면과 동일한 필드 수정 | 값 업데이트 | - |
| ROL-L5-ACT-060 | 저장 버튼 클릭 | 저장 버튼 클릭 | PATCH /api/v1/abilities/:id 호출 | - |
| ROL-L5-ACT-061 | 취소 버튼 클릭 | 취소 버튼 클릭 | Ability 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/abilities/:id + GET /api/v1/subjects + GET /api/v1/actions 병렬 호출 → 기존 데이터 prefill | 에러 메시지 (404) |
| 저장 버튼 | PATCH 호출 → "권한 정의가 수정되었습니다" 토스트 → 상세 화면 이동 | 에러 토스트 |

---

### ROL-L4-SCR-009: 행위 목록 화면 (`/actions`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-062 | 검색어 입력 | 검색창 입력 | name, displayName 기준 필터링 | - |
| ROL-L5-ACT-063 | 그룹 필터 선택 | 그룹 Select 변경 (crud/visibility/workflow/bulk) | 그룹별 필터링 → GET /api/v1/actions?group=xxx 호출 | - |
| ROL-L5-ACT-064 | 시스템 여부 필터 | 시스템 여부 Select 변경 | 시스템/커스텀 Action 필터링 (클라이언트 사이드) | - |
| ROL-L5-ACT-065 | Action 행 클릭 | DataGrid 행 클릭 | Action 상세 화면으로 이동 | - |
| ROL-L5-ACT-066 | 행위 등록 버튼 | PageSurface actions 영역 버튼 클릭 | 등록 화면으로 이동 (`/actions/new`) | RoleCategoryGuard(WORKSPACE) |
| ROL-L5-ACT-067 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, displayName, order 기준 정렬 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/actions 호출 → 목록 표시 | 에러 메시지 |
| 그룹 필터 변경 | GET /api/v1/actions?group=xxx → 목록 갱신 | 에러 토스트 |

---

### ROL-L4-SCR-010: 행위 상세 화면 (`/actions/[actionId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-068 | 수정 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 수정 화면으로 이동 | isSystem=false, RoleCategoryGuard(WORKSPACE) |
| ROL-L5-ACT-069 | 삭제 버튼 클릭 | PageSurface actions 영역 버튼 클릭 | 삭제 확인 모달 표시 | isSystem=false, RoleCategoryGuard(WORKSPACE) |
| ROL-L5-ACT-070 | 삭제 확인 | 모달에서 삭제 버튼 클릭 | DELETE /api/v1/actions/:id 호출 | - |
| ROL-L5-ACT-071 | 삭제 취소 | 모달에서 취소 버튼 클릭 | 모달 닫기 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/actions/:id → 상세 정보 + config JSON 표시 | 에러 메시지 (404) |
| 삭제 확인 | DELETE 호출 → "행위가 삭제되었습니다" 토스트 → 목록으로 이동 | 에러 토스트 (400: "시스템 Action은 삭제할 수 없습니다") |

---

### ROL-L4-SCR-011: 행위 등록 화면 (`/actions/new`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-072 | name 입력 | 이름 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-073 | displayName 입력 | 표시명 Input 입력 | 값 업데이트 | - |
| ROL-L5-ACT-074 | description 입력 | 설명 Textarea 입력 | 값 업데이트 | - |
| ROL-L5-ACT-075 | group 선택 | 그룹 Select 변경 | 선택값 업데이트 | - |
| ROL-L5-ACT-076 | order 입력 | 정렬 순서 NumberInput 변경 | 값 업데이트 | - |
| ROL-L5-ACT-077 | isSystem 토글 | 시스템 여부 Switch 토글 | 값 업데이트 | - |
| ROL-L5-ACT-078 | config 입력 | JSON 에디터에 설정 입력 | config JSON 업데이트 + 실시간 유효성 검사 | - |
| ROL-L5-ACT-079 | 등록 버튼 클릭 | 등록 버튼 클릭 | POST /api/v1/actions 호출 | name 필수 |
| ROL-L5-ACT-080 | 취소 버튼 클릭 | 취소 버튼 클릭 | 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 등록 버튼 | POST 호출 → "행위가 등록되었습니다" 토스트 → 목록으로 이동 | 에러 토스트 (400: 유효성 오류) |

#### 유효성 검사

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수, unique, 영소문자+콜론+언더스코어 | "이름을 입력해주세요" |
| config | JSON 형식 (입력 시) | "올바른 JSON 형식으로 입력해주세요" |

---

### ROL-L4-SCR-012: 행위 수정 화면 (`/actions/[actionId]/edit`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-081 | 필드 수정 | 등록 화면과 동일한 필드 수정 | 값 업데이트 | - |
| ROL-L5-ACT-082 | 저장 버튼 클릭 | 저장 버튼 클릭 | PATCH /api/v1/actions/:id 호출 | - |
| ROL-L5-ACT-083 | 취소 버튼 클릭 | 취소 버튼 클릭 | 상세 화면으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/actions/:id → 기존 데이터 prefill. isSystem=true이면 목록으로 리다이렉트 | 에러 메시지 (404) |
| 저장 버튼 | PATCH 호출 → "행위가 수정되었습니다" 토스트 → 상세 화면 이동 | 에러 토스트 (400: "시스템 Action은 수정할 수 없습니다") |

---

### ROL-L4-SCR-013: 대상 목록 화면 (`/subjects`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-084 | 검색어 입력 | 검색창 입력 | name, displayName 기준 필터링 | - |
| ROL-L5-ACT-085 | 그룹 필터 선택 | 그룹 Select 변경 (entity/menu/feature/ui) | 그룹별 필터링 → GET /api/v1/subjects?group=xxx | - |
| ROL-L5-ACT-086 | 시스템 여부 필터 | 시스템 여부 Select 변경 | 시스템/커스텀 Subject 필터링 (클라이언트 사이드) | - |
| ROL-L5-ACT-087 | Subject 행 클릭 | DataGrid 행 클릭 | Subject 상세 화면으로 이동 | - |
| ROL-L5-ACT-088 | 컬럼 정렬 클릭 | DataGrid 헤더 클릭 | name, displayName, order 기준 정렬 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/subjects 호출 → 목록 표시 | 에러 메시지 |
| 그룹 필터 변경 | GET /api/v1/subjects?group=xxx → 목록 갱신 | 에러 토스트 |

---

### ROL-L4-SCR-014: 대상 상세 화면 (`/subjects/[subjectId]`)

#### 사용자 액션

| ID | 액션 | 트리거 | 결과 | 조건 |
|----|------|--------|------|------|
| ROL-L5-ACT-089 | 뒤로가기 | 브라우저 뒤로가기 또는 목록 링크 | 대상 목록으로 이동 | - |

#### 시스템 반응

| 액션 | 성공 시 | 실패 시 |
|------|---------|---------|
| 페이지 진입 | GET /api/v1/subjects/:id + GET /api/v1/subjects/:id/fields 병렬 호출 → 상세 + 필드 목록 표시 | 에러 메시지 (404) |

**참고**: entity 그룹이 아닌 Subject는 필드 목록이 빈 배열로 반환되며 "필드 정보가 없습니다" 안내 표시.

---

## 모달 정의

### 삭제 확인 모달 (역할/Ability/Action 공통)

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
| 추가 경고 (Ability) | 연결된 Grant가 있을 경우: "이 권한 정의에 연결된 Grant N건도 함께 삭제됩니다." |
| 추가 경고 (Role) | 연결된 사용자가 있을 경우: "연결된 사용자가 있어 삭제할 수 없습니다." (삭제 버튼 비활성화) |
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 삭제 버튼 | DELETE API 호출 (color="danger") |

### Grant 일괄 저장 확인 모달

```
+------------------------------------+
|         권한 할당 저장               |
+------------------------------------+
|                                     |
|  다음과 같이 권한 할당을 변경합니다:  |
|                                     |
|  - 추가: N건                        |
|  - 해제: N건                        |
|  - 수정: N건                        |
|                                     |
|  계속 진행하시겠습니까?              |
|                                     |
+------------------------------------+
|    [취소]           [저장]          |
+------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 제목 | "권한 할당 저장" |
| 본문 | 변경사항 요약 (추가/해제/수정 건수) |
| 취소 버튼 | 모달 닫기 (variant="flat") |
| 저장 버튼 | PUT API 호출 (color="primary") |

---

## 피드백 메시지

| 상황 | 유형 | 메시지 |
|------|------|--------|
| 역할 등록 성공 | success | "역할이 등록되었습니다." |
| 역할 수정 성공 | success | "역할이 수정되었습니다." |
| 역할 삭제 성공 | success | "역할이 삭제되었습니다." |
| 시스템 역할 수정 시도 | warning | "시스템 역할은 수정할 수 없습니다." |
| 시스템 역할 삭제 시도 | warning | "시스템 역할은 삭제할 수 없습니다." |
| 연결된 사용자 존재 시 삭제 | error | "연결된 사용자가 있어 삭제할 수 없습니다." |
| Grant 일괄 저장 성공 | success | "권한 할당이 저장되었습니다." |
| 권한 정의 등록 성공 | success | "권한 정의가 등록되었습니다." |
| 권한 정의 수정 성공 | success | "권한 정의가 수정되었습니다." |
| 권한 정의 삭제 성공 | success | "권한 정의가 삭제되었습니다." |
| 행위 등록 성공 | success | "행위가 등록되었습니다." |
| 행위 수정 성공 | success | "행위가 수정되었습니다." |
| 행위 삭제 성공 | success | "행위가 삭제되었습니다." |
| 시스템 Action 수정 시도 | warning | "시스템 Action은 수정할 수 없습니다." |
| 시스템 Action 삭제 시도 | warning | "시스템 Action은 삭제할 수 없습니다." |
| 저장 실패 | error | "저장에 실패했습니다. 다시 시도해주세요." |
| 권한 없음 | warning | "해당 작업을 수행할 권한이 없습니다." |
| 네트워크 에러 | error | "네트워크 오류가 발생했습니다." |
| JSON 형식 오류 | error | "올바른 JSON 형식으로 입력해주세요." |

---

## L6: API 엔드포인트 정의

### 기존 API (현재 구현 완료)

#### ROL-L6-API-001: 역할 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-001 |
| **Method** | GET |
| **Endpoint** | `/api/v1/roles` |
| **Operation ID** | `getRoles` |
| **설명** | 모든 역할 목록을 조회합니다. Group/Category 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |
| **Request** | 없음 (전체 목록 반환) |
| **Response** | `RoleDto[]` |
| **에러** | 401 (인증 실패), 403 (권한 없음), 500 (서버 에러) |

**Response Body 구조** (`RoleDto`):

```json
{
  "httpStatus": 200,
  "message": "역할 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "FULL_ACCESS",
      "displayName": "전체 접근",
      "description": "시스템의 모든 기능에 접근 가능합니다",
      "isSystem": true,
      "classification": {
        "id": "uuid",
        "roleId": "uuid",
        "categoryId": "uuid",
        "category": { "id": "uuid", "name": "PLATFORM" }
      },
      "associations": [
        {
          "id": "uuid",
          "roleId": "uuid",
          "groupId": "uuid",
          "group": { "id": "uuid", "name": "TRUSTED" }
        }
      ],
      "createdAt": "2026-01-15T10:30:00.000Z",
      "updatedAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

---

#### ROL-L6-API-002: 역할 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-002 |
| **Method** | GET |
| **Endpoint** | `/api/v1/roles/:id` |
| **Operation ID** | `getRoleById` |
| **설명** | ID로 역할을 상세 조회합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |
| **Path Params** | `id` (UUID) - 역할 ID |
| **Response** | `RoleDto` |
| **에러** | 401, 403, 404 (역할 없음), 500 |

---

#### ROL-L6-API-003: 역할 생성

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-003 |
| **Method** | POST |
| **Endpoint** | `/api/v1/roles` |
| **Operation ID** | `createRole` |
| **설명** | 새로운 역할을 생성합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Status Code** | 201 Created |
| **Response** | `RoleDto` |
| **에러** | 400 (유효성 오류), 401, 403, 409 (이름 중복), 500 |

**Request Body** (`CreateRoleDto`):

```json
{
  "name": "CUSTOM_ROLE",
  "displayName": "커스텀 역할",
  "description": "사용자 정의 역할입니다"
}
```

**참고**: `isSystem`, `classification`, `associations`는 CreateRoleDto에서 제외됨. Group/Category 연결은 별도 API 또는 확장 필요.

---

#### ROL-L6-API-004: 역할 수정

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-004 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/roles/:id` |
| **Operation ID** | `updateRole` |
| **설명** | 역할 정보를 수정합니다. displayName, description만 수정 가능. 시스템 역할은 수정 불가. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Path Params** | `id` (UUID) - 역할 ID |
| **Response** | `RoleDto` |
| **에러** | 400 (시스템 역할 수정 시도), 401, 403, 404, 500 |

**Request Body** (`UpdateRoleDto`):

```json
{
  "displayName": "수정된 표시명",
  "description": "수정된 설명"
}
```

---

#### ROL-L6-API-005: 역할 삭제

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-005 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/roles/:id` |
| **Operation ID** | `deleteRole` |
| **설명** | 역할을 소프트 삭제합니다. 시스템 역할 및 연결된 사용자가 있는 역할은 삭제 불가. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Path Params** | `id` (UUID) - 역할 ID |
| **Response** | `RoleDto` (삭제된 역할 정보) |
| **에러** | 400 (시스템 역할 / 연결된 사용자 존재), 401, 403, 404, 500 |

---

#### ROL-L6-API-006: 내 권한 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-006 |
| **Method** | GET |
| **Endpoint** | `/api/v1/abilities/my` |
| **Operation ID** | `getMyAbilities` |
| **설명** | 현재 로그인한 사용자의 Role 기본 권한 + User 예외 권한을 병합하여 조회합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 모든 사용자 |
| **Response** | `AbilityResponseDto[]` |
| **에러** | 400 (Role 없음), 401 (미인증), 500 |

---

#### ROL-L6-API-007: Role별 권한 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-007 |
| **Method** | GET |
| **Endpoint** | `/api/v1/abilities/roles/:roleId` |
| **Operation ID** | `getAbilitiesByRoleId` |
| **설명** | 특정 Role에 할당된 기본 권한(Ability) 목록을 조회합니다. Grant를 통해 연결된 Ability를 반환합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 모든 사용자 |
| **Path Params** | `roleId` (UUID) - Role ID |
| **Response** | `AbilityResponseDto[]` |
| **에러** | 401, 500 |

**Response Body 구조** (`AbilityResponseDto`):

```json
{
  "id": "uuid",
  "actionId": "uuid",
  "action": {
    "id": "uuid",
    "name": "read",
    "displayName": "읽기",
    "group": "crud"
  },
  "subjectId": "uuid",
  "subject": {
    "id": "uuid",
    "name": "entity:User",
    "displayName": "이용자",
    "group": "entity"
  },
  "fields": ["email", "name"],
  "conditions": { "departmentId": "${user.departmentId}" },
  "inverted": false,
  "reason": null,
  "name": "Read User",
  "description": "사용자 정보 조회 권한",
  "createdAt": "2026-01-20T14:30:00.000Z",
  "updatedAt": null
}
```

---

#### ROL-L6-API-008: Ability 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-008 |
| **Method** | GET |
| **Endpoint** | `/api/v1/abilities/:id` |
| **Operation ID** | `getAbilityById` |
| **설명** | ID로 특정 Ability를 상세 조회합니다. Subject, Action 정보를 포함합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 모든 사용자 |
| **Path Params** | `id` (UUID) - Ability ID |
| **Response** | `AbilityResponseDto` |
| **에러** | 401, 404 (Ability 없음), 500 |

---

#### ROL-L6-API-009: Ability 생성

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-009 |
| **Method** | POST |
| **Endpoint** | `/api/v1/abilities` |
| **Operation ID** | `createAbility` |
| **설명** | 새로운 권한 정의(Ability)를 생성합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 사용자 (TODO: Guard 추가 필요) |
| **Status Code** | 201 Created |
| **Response** | `AbilityResponseDto` |
| **에러** | 400 (유효성 오류), 401, 500 |

**Request Body** (`CreateAbilityDto`):

```json
{
  "name": "Read User Email Masked",
  "description": "사용자 이메일 마스킹 읽기 권한",
  "actionId": "uuid",
  "subjectId": "uuid",
  "fields": ["email", "phone"],
  "conditions": { "departmentId": "${user.departmentId}" },
  "inverted": false,
  "reason": null
}
```

---

#### ROL-L6-API-010: Ability 수정

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-010 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/abilities/:id` |
| **Operation ID** | `updateAbility` |
| **설명** | 기존 Ability의 설정을 수정합니다. Grant 메타데이터(isActive, priority)는 변경되지 않습니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 사용자 (TODO: Guard 추가 필요) |
| **Path Params** | `id` (UUID) - Ability ID |
| **Response** | `AbilityResponseDto` |
| **에러** | 400, 401, 404, 500 |

**Request Body** (`UpdateAbilityDto`, 모든 필드 optional):

```json
{
  "name": "Updated Name",
  "description": "수정된 설명",
  "actionId": "uuid",
  "subjectId": "uuid",
  "fields": ["email"],
  "conditions": null,
  "inverted": true,
  "reason": "관리자만 접근 가능합니다"
}
```

---

#### ROL-L6-API-011: Ability 삭제

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-011 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/abilities/:id` |
| **Operation ID** | `deleteAbility` |
| **설명** | Ability를 소프트 삭제합니다. |
| **인증** | Bearer Token |
| **권한** | 인증된 사용자 (TODO: Guard 추가 필요) |
| **Path Params** | `id` (UUID) - Ability ID |
| **Response** | `AbilityResponseDto` (삭제된 Ability 정보) |
| **에러** | 400 (삭제 실패), 401, 404, 500 |

---

#### ROL-L6-API-012: Action 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-012 |
| **Method** | GET |
| **Endpoint** | `/api/v1/actions` |
| **Operation ID** | `getActions` |
| **설명** | 모든 Action 목록을 조회합니다. group 쿼리 파라미터로 그룹별 필터링 가능. |
| **인증** | 불필요 (`@Public()`) |
| **Query Params** | `group` (string, optional) - crud / visibility / workflow |
| **Response** | `ActionDto[]` (목록 조회 시 config, description, order, isSystem 제외) |
| **에러** | 500 |

---

#### ROL-L6-API-013: Action 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-013 |
| **Method** | GET |
| **Endpoint** | `/api/v1/actions/:id` |
| **Operation ID** | `getActionById` |
| **설명** | ID로 Action을 상세 조회합니다. config 포함 전체 필드 반환. |
| **인증** | 불필요 (`@Public()`) |
| **Path Params** | `id` (UUID) - Action ID |
| **Response** | `ActionDto` |
| **에러** | 404 (Action 없음), 500 |

---

#### ROL-L6-API-014: Action 생성

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-014 |
| **Method** | POST |
| **Endpoint** | `/api/v1/actions` |
| **Operation ID** | `createAction` |
| **설명** | 새로운 Action을 생성합니다. |
| **인증** | Bearer Token |
| **권한** | `@RoleCategories([WORKSPACE])` + `RoleCategoryGuard` |
| **Status Code** | 201 Created |
| **Response** | `ActionDto` |
| **에러** | 400 (유효성 오류), 401, 403, 500 |

**Request Body** (`CreateActionDto`):

```json
{
  "name": "read:masked:phone",
  "displayName": "전화번호 마스킹 읽기",
  "description": "전화번호 필드를 마스킹하여 표시합니다",
  "group": "visibility",
  "order": 11,
  "isSystem": false,
  "config": {
    "type": "masking",
    "preset": "PRESET_PHONE"
  }
}
```

---

#### ROL-L6-API-015: Action 수정

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-015 |
| **Method** | PATCH |
| **Endpoint** | `/api/v1/actions/:id` |
| **Operation ID** | `updateAction` |
| **설명** | Action 정보를 수정합니다. 시스템 Action(isSystem=true)은 수정 불가. |
| **인증** | Bearer Token |
| **권한** | `@RoleCategories([WORKSPACE])` + `RoleCategoryGuard` |
| **Path Params** | `id` (UUID) - Action ID |
| **Response** | `ActionDto` |
| **에러** | 400 (시스템 Action 수정 불가 / 유효성 오류), 401, 403, 404, 500 |

**Request Body** (`UpdateActionDto`, 모든 필드 optional):

```json
{
  "displayName": "수정된 표시명",
  "description": "수정된 설명",
  "group": "visibility",
  "order": 12,
  "config": { "type": "masking", "preset": "PRESET_PHONE_V2" }
}
```

---

#### ROL-L6-API-016: Action 삭제

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-016 |
| **Method** | DELETE |
| **Endpoint** | `/api/v1/actions/:id` |
| **Operation ID** | `deleteAction` |
| **설명** | Action을 소프트 삭제합니다. 시스템 Action(isSystem=true)은 삭제 불가. |
| **인증** | Bearer Token |
| **권한** | `@RoleCategories([WORKSPACE])` + `RoleCategoryGuard` |
| **Path Params** | `id` (UUID) - Action ID |
| **Response** | `ActionDto` (삭제된 Action 정보) |
| **에러** | 400 (시스템 Action 삭제 불가), 401, 403, 404, 500 |

---

#### ROL-L6-API-017: Subject 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-017 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subjects` |
| **Operation ID** | `getSubjects` |
| **설명** | 모든 Subject 목록을 조회합니다. group 쿼리 파라미터로 필터링 가능. |
| **인증** | 불필요 (`@Public()`) |
| **Query Params** | `group` (string, optional) - entity / menu / feature / ui |
| **Response** | `SubjectDto[]` |
| **에러** | 500 |

---

#### ROL-L6-API-018: Subject 상세 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-018 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subjects/:id` |
| **Operation ID** | `getSubjectById` |
| **설명** | ID로 Subject를 상세 조회합니다. |
| **인증** | 불필요 (`@Public()`) |
| **Path Params** | `id` (UUID) - Subject ID |
| **Response** | `SubjectDto` |
| **에러** | 404, 500 |

---

#### ROL-L6-API-019: Subject 필드 목록 조회

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-019 |
| **Method** | GET |
| **Endpoint** | `/api/v1/subjects/:id/fields` |
| **Operation ID** | `getSubjectFields` |
| **설명** | Subject의 DMMF 기반 필드 목록을 조회합니다. entity 그룹만 필드 반환, 그 외는 빈 배열. |
| **인증** | 불필요 (`@Public()`) |
| **Path Params** | `id` (UUID) - Subject ID |
| **Response** | `SubjectFieldDto[]` |
| **에러** | 404 (Subject 없음), 500 |

**Response Body 구조** (`SubjectFieldDto`):

```json
[
  {
    "name": "id",
    "displayName": null,
    "type": "String",
    "isRequired": true,
    "isRelation": false
  },
  {
    "name": "email",
    "displayName": null,
    "type": "String",
    "isRequired": true,
    "isRelation": false
  },
  {
    "name": "tenants",
    "displayName": null,
    "type": "Tenant[]",
    "isRequired": false,
    "isRelation": true
  }
]
```

---

### 신규 API (구현 필요)

#### ROL-L6-API-020: Ability 전체 목록 조회 (신규)

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-020 |
| **Method** | GET |
| **Endpoint** | `/api/v1/abilities` |
| **Operation ID** | `getAbilities` |
| **설명** | 전체 Ability 목록을 조회합니다. 권한 정의 목록 화면에서 사용합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([MANAGE, FULL_ACCESS])` |
| **Status** | **신규 구현 필요** |

**Query Params**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| skip | number | - | 건너뛸 항목 수 (offset) |
| take | number | - | 조회할 항목 수 (기본: 20) |
| subjectId | string (UUID) | - | Subject 필터 |
| actionId | string (UUID) | - | Action 필터 |
| inverted | boolean | - | 허용/거부 필터 |
| name | string | - | 이름 검색 (부분 일치) |

**Response**:

```json
{
  "httpStatus": 200,
  "message": "권한 정의 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "Read User",
      "description": "사용자 조회 권한",
      "actionId": "uuid",
      "action": { "id": "uuid", "name": "read", "displayName": "읽기", "group": "crud" },
      "subjectId": "uuid",
      "subject": { "id": "uuid", "name": "entity:User", "displayName": "이용자", "group": "entity" },
      "fields": [],
      "conditions": null,
      "inverted": false,
      "reason": null,
      "createdAt": "2026-01-20T14:30:00.000Z"
    }
  ],
  "meta": {
    "total": 45,
    "skip": 0,
    "take": 20
  }
}
```

**에러**: 401, 403, 500

---

#### ROL-L6-API-021: Grant 배치 할당 (신규)

| 항목 | 내용 |
|------|------|
| **ID** | ROL-L6-API-021 |
| **Method** | PUT |
| **Endpoint** | `/api/v1/grants/roles/:roleId` |
| **Operation ID** | `updateRoleGrants` |
| **설명** | 특정 Role에 대한 Ability Grant를 배치 할당/해제합니다. PUT 방식으로 전체 목록을 동기화합니다. |
| **인증** | Bearer Token |
| **권한** | `@Roles([FULL_ACCESS])` |
| **Path Params** | `roleId` (UUID) - Role ID |
| **Status** | **신규 구현 필요** |

**Request Body**:

```json
{
  "grants": [
    {
      "abilityId": "uuid-1",
      "isActive": true,
      "priority": 0
    },
    {
      "abilityId": "uuid-2",
      "isActive": true,
      "priority": 5
    },
    {
      "abilityId": "uuid-3",
      "isActive": false,
      "priority": 0
    }
  ]
}
```

**동작 설명**:
- 요청에 포함된 abilityId 목록과 현재 Grant 목록을 비교
- **추가**: 요청에 있고 현재 Grant에 없는 항목 → 새 Grant 생성
- **유지/수정**: 요청에 있고 현재 Grant에도 있는 항목 → isActive, priority 업데이트
- **해제**: 현재 Grant에 있지만 요청에 없는 항목 → Grant 삭제 (소프트 삭제)

**Response**:

```json
{
  "httpStatus": 200,
  "message": "권한 할당이 저장되었습니다",
  "data": {
    "added": 2,
    "updated": 1,
    "removed": 3,
    "total": 5
  }
}
```

**에러**: 400 (유효성 오류), 401, 403, 404 (Role 없음), 500

---

## API 호출 흐름 요약

| 화면 | 진입 시 호출 | 액션 | API 호출 | 성공 시 | 실패 시 |
|------|-------------|------|----------|---------|---------|
| 역할 목록 | GET /api/v1/roles | 페이지 진입 | GET /api/v1/roles | 목록 표시 | 에러 메시지 |
| 역할 상세 | GET /api/v1/roles/:id, GET /api/v1/abilities, GET /api/v1/abilities/roles/:roleId | 삭제 | DELETE /api/v1/roles/:id | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 역할 상세 | (위와 동일) | Grant 일괄 저장 | PUT /api/v1/grants/roles/:roleId | Grant 재조회 + 성공 토스트 | 에러 토스트 |
| 역할 등록 | 없음 | 등록 | POST /api/v1/roles | 상세 이동 + 성공 토스트 | 에러 토스트 |
| 역할 수정 | GET /api/v1/roles/:id | 저장 | PATCH /api/v1/roles/:id | 상세 이동 + 성공 토스트 | 에러 토스트 |
| 권한 정의 목록 | GET /api/v1/abilities, GET /api/v1/subjects, GET /api/v1/actions | 페이지/필터 변경 | GET /api/v1/abilities?... | 목록 갱신 | 에러 토스트 |
| 권한 정의 상세 | GET /api/v1/abilities/:id | 삭제 | DELETE /api/v1/abilities/:id | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 권한 정의 등록 | GET /api/v1/subjects, GET /api/v1/actions | 등록 | POST /api/v1/abilities | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 권한 정의 등록 | (위와 동일) | Subject 선택 (entity) | GET /api/v1/subjects/:id/fields | 필드 자동완성 활성화 | - |
| 권한 정의 수정 | GET /api/v1/abilities/:id, GET /api/v1/subjects, GET /api/v1/actions | 저장 | PATCH /api/v1/abilities/:id | 상세 이동 + 성공 토스트 | 에러 토스트 |
| 행위 목록 | GET /api/v1/actions | 그룹 필터 | GET /api/v1/actions?group=xxx | 목록 갱신 | 에러 토스트 |
| 행위 상세 | GET /api/v1/actions/:id | 삭제 | DELETE /api/v1/actions/:id | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 행위 등록 | 없음 | 등록 | POST /api/v1/actions | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 행위 수정 | GET /api/v1/actions/:id | 저장 | PATCH /api/v1/actions/:id | 상세 이동 + 성공 토스트 | 에러 토스트 |
| 대상 목록 | GET /api/v1/subjects | 그룹 필터 | GET /api/v1/subjects?group=xxx | 목록 갱신 | 에러 토스트 |
| 대상 상세 | GET /api/v1/subjects/:id, GET /api/v1/subjects/:id/fields | 페이지 진입 | (위와 동일) | 상세 + 필드 표시 | 에러 메시지 |

---

## 신규 API 구현 요약

현재 백엔드에 없고 새로 구현해야 하는 API:

| API | 우선순위 | 설명 |
|-----|----------|------|
| **GET /api/v1/abilities** (전체 목록) | 높음 | Ability 목록 화면에서 필수. 현재 /my, /roles/:roleId, /users/:userId, /:id만 존재 |
| **PUT /api/v1/grants/roles/:roleId** | 높음 | Role 상세 화면의 Grant 배치 할당 기능에서 필수 |

기존 컨트롤러의 TODO 주석에도 명시되어 있음:
```typescript
// TODO: Implement Grant-based batch assignment endpoints
// PUT /api/v1/grants/roles/:roleId
// PUT /api/v1/grants/users/:userId
```

---

## Requirement Graph (L5-L6)

```json
{
  "level_range": "L5-L6",
  "nodes": [
    { "id": "ROL-L5-ACT-001", "level": 5, "subLevel": "1", "type": "action", "name": "검색어 입력 (역할)", "description": "역할 목록에서 검색어 입력하여 필터링" },
    { "id": "ROL-L5-ACT-002", "level": 5, "subLevel": "1", "type": "action", "name": "카테고리 필터 선택", "description": "카테고리별 역할 필터링" },
    { "id": "ROL-L5-ACT-003", "level": 5, "subLevel": "1", "type": "action", "name": "그룹 필터 선택 (역할)", "description": "그룹별 역할 필터링" },
    { "id": "ROL-L5-ACT-004", "level": 5, "subLevel": "1", "type": "action", "name": "시스템 여부 필터 (역할)", "description": "시스템/커스텀 역할 필터링" },
    { "id": "ROL-L5-ACT-005", "level": 5, "subLevel": "1", "type": "action", "name": "역할 행 클릭", "description": "역할 상세 화면으로 이동" },
    { "id": "ROL-L5-ACT-006", "level": 5, "subLevel": "1", "type": "action", "name": "역할 등록 버튼 클릭", "description": "역할 등록 화면으로 이동" },
    { "id": "ROL-L5-ACT-007", "level": 5, "subLevel": "1", "type": "action", "name": "컬럼 정렬 (역할)", "description": "역할 목록 정렬 전환" },
    { "id": "ROL-L5-ACT-008", "level": 5, "subLevel": "2", "type": "action", "name": "역할 목록 표시", "description": "역할 목록 데이터 표시" },
    { "id": "ROL-L5-ACT-009", "level": 5, "subLevel": "1", "type": "action", "name": "역할 수정 버튼 클릭", "description": "역할 수정 화면으로 이동" },
    { "id": "ROL-L5-ACT-010", "level": 5, "subLevel": "1", "type": "action", "name": "역할 삭제 버튼 클릭", "description": "삭제 확인 모달 표시" },
    { "id": "ROL-L5-ACT-011", "level": 5, "subLevel": "1", "type": "action", "name": "역할 삭제 확인", "description": "역할 삭제 API 호출" },
    { "id": "ROL-L5-ACT-012", "level": 5, "subLevel": "1", "type": "action", "name": "Grant 체크박스 토글", "description": "Ability 할당/해제 상태 변경" },
    { "id": "ROL-L5-ACT-013", "level": 5, "subLevel": "1", "type": "action", "name": "Grant isActive 토글", "description": "Grant 활성화 상태 변경" },
    { "id": "ROL-L5-ACT-014", "level": 5, "subLevel": "1", "type": "action", "name": "Grant priority 변경", "description": "Grant 우선순위 변경" },
    { "id": "ROL-L5-ACT-015", "level": 5, "subLevel": "1", "type": "action", "name": "Grant 일괄 저장", "description": "변경된 Grant를 일괄 저장" },
    { "id": "ROL-L5-ACT-016", "level": 5, "subLevel": "2", "type": "action", "name": "Grant 저장 완료", "description": "Grant 일괄 저장 성공 후 재조회" },
    { "id": "ROL-L5-ACT-017", "level": 5, "subLevel": "1", "type": "action", "name": "역할 등록 폼 제출", "description": "역할 등록 API 호출" },
    { "id": "ROL-L5-ACT-018", "level": 5, "subLevel": "2", "type": "action", "name": "역할 등록 완료", "description": "등록 성공 후 상세 화면 이동" },
    { "id": "ROL-L5-ACT-019", "level": 5, "subLevel": "1", "type": "action", "name": "역할 수정 폼 제출", "description": "역할 수정 API 호출" },
    { "id": "ROL-L5-ACT-020", "level": 5, "subLevel": "2", "type": "action", "name": "역할 수정 완료", "description": "수정 성공 후 상세 화면 이동" },
    { "id": "ROL-L5-ACT-021", "level": 5, "subLevel": "1", "type": "action", "name": "Ability 행 클릭", "description": "Ability 상세 화면으로 이동" },
    { "id": "ROL-L5-ACT-022", "level": 5, "subLevel": "1", "type": "action", "name": "Ability 등록 버튼 클릭", "description": "Ability 등록 화면으로 이동" },
    { "id": "ROL-L5-ACT-023", "level": 5, "subLevel": "1", "type": "action", "name": "Ability 필터 변경", "description": "Subject/Action/inverted 기준 필터링" },
    { "id": "ROL-L5-ACT-024", "level": 5, "subLevel": "1", "type": "action", "name": "Ability 페이지 변경", "description": "페이지네이션 변경" },
    { "id": "ROL-L5-ACT-025", "level": 5, "subLevel": "1", "type": "action", "name": "Ability 삭제 확인", "description": "Ability 삭제 API 호출" },
    { "id": "ROL-L5-ACT-026", "level": 5, "subLevel": "1", "type": "action", "name": "Subject 선택 (Ability 등록)", "description": "Subject 선택 시 DMMF 필드 조회" },
    { "id": "ROL-L5-ACT-027", "level": 5, "subLevel": "1", "type": "action", "name": "Ability 등록 폼 제출", "description": "Ability 등록 API 호출" },
    { "id": "ROL-L5-ACT-028", "level": 5, "subLevel": "1", "type": "action", "name": "Ability 수정 폼 제출", "description": "Ability 수정 API 호출" },
    { "id": "ROL-L5-ACT-029", "level": 5, "subLevel": "1", "type": "action", "name": "Action 행 클릭", "description": "Action 상세 화면으로 이동" },
    { "id": "ROL-L5-ACT-030", "level": 5, "subLevel": "1", "type": "action", "name": "Action 등록 버튼 클릭", "description": "Action 등록 화면으로 이동" },
    { "id": "ROL-L5-ACT-031", "level": 5, "subLevel": "1", "type": "action", "name": "Action 그룹 필터", "description": "그룹별 Action 필터링" },
    { "id": "ROL-L5-ACT-032", "level": 5, "subLevel": "1", "type": "action", "name": "Action 삭제 확인", "description": "Action 삭제 API 호출" },
    { "id": "ROL-L5-ACT-033", "level": 5, "subLevel": "1", "type": "action", "name": "Action 등록 폼 제출", "description": "Action 등록 API 호출" },
    { "id": "ROL-L5-ACT-034", "level": 5, "subLevel": "1", "type": "action", "name": "Action 수정 폼 제출", "description": "Action 수정 API 호출" },
    { "id": "ROL-L5-ACT-035", "level": 5, "subLevel": "1", "type": "action", "name": "Subject 행 클릭", "description": "Subject 상세 화면으로 이동" },
    { "id": "ROL-L5-ACT-036", "level": 5, "subLevel": "1", "type": "action", "name": "Subject 그룹 필터", "description": "그룹별 Subject 필터링" },

    { "id": "ROL-L6-API-001", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/roles", "description": "역할 목록 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/roles", "responseBody": "RoleDto", "isArrayResponse": true, "auth": "Bearer Token", "permissions": ["MANAGE", "FULL_ACCESS"] } },
    { "id": "ROL-L6-API-002", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/roles/:id", "description": "역할 상세 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/roles/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "역할 ID (UUID)" }], "responseBody": "RoleDto", "isArrayResponse": false, "auth": "Bearer Token", "permissions": ["MANAGE", "FULL_ACCESS"] } },
    { "id": "ROL-L6-API-003", "level": 6, "subLevel": "1", "type": "api", "name": "POST /api/v1/roles", "description": "역할 생성 API", "metadata": { "method": "POST", "endpoint": "/api/v1/roles", "requestBody": "CreateRoleDto", "responseBody": "RoleDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "ROL-L6-API-004", "level": 6, "subLevel": "1", "type": "api", "name": "PATCH /api/v1/roles/:id", "description": "역할 수정 API", "metadata": { "method": "PATCH", "endpoint": "/api/v1/roles/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "역할 ID (UUID)" }], "requestBody": "UpdateRoleDto", "responseBody": "RoleDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "ROL-L6-API-005", "level": 6, "subLevel": "1", "type": "api", "name": "DELETE /api/v1/roles/:id", "description": "역할 삭제 API", "metadata": { "method": "DELETE", "endpoint": "/api/v1/roles/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "역할 ID (UUID)" }], "responseBody": "RoleDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "ROL-L6-API-006", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/abilities/my", "description": "내 권한 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/abilities/my", "responseBody": "AbilityResponseDto", "isArrayResponse": true, "auth": "Bearer Token" } },
    { "id": "ROL-L6-API-007", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/abilities/roles/:roleId", "description": "Role별 권한 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/abilities/roles/:roleId", "pathParams": [{ "name": "roleId", "type": "string", "required": true, "description": "Role ID (UUID)" }], "responseBody": "AbilityResponseDto", "isArrayResponse": true, "auth": "Bearer Token" } },
    { "id": "ROL-L6-API-008", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/abilities/:id", "description": "Ability 상세 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/abilities/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Ability ID (UUID)" }], "responseBody": "AbilityResponseDto", "isArrayResponse": false, "auth": "Bearer Token" } },
    { "id": "ROL-L6-API-009", "level": 6, "subLevel": "1", "type": "api", "name": "POST /api/v1/abilities", "description": "Ability 생성 API", "metadata": { "method": "POST", "endpoint": "/api/v1/abilities", "requestBody": "CreateAbilityDto", "responseBody": "AbilityResponseDto", "auth": "Bearer Token" } },
    { "id": "ROL-L6-API-010", "level": 6, "subLevel": "1", "type": "api", "name": "PATCH /api/v1/abilities/:id", "description": "Ability 수정 API", "metadata": { "method": "PATCH", "endpoint": "/api/v1/abilities/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Ability ID (UUID)" }], "requestBody": "UpdateAbilityDto", "responseBody": "AbilityResponseDto", "auth": "Bearer Token" } },
    { "id": "ROL-L6-API-011", "level": 6, "subLevel": "1", "type": "api", "name": "DELETE /api/v1/abilities/:id", "description": "Ability 삭제 API", "metadata": { "method": "DELETE", "endpoint": "/api/v1/abilities/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Ability ID (UUID)" }], "responseBody": "AbilityResponseDto", "auth": "Bearer Token" } },
    { "id": "ROL-L6-API-012", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/actions", "description": "Action 목록 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/actions", "queryParams": [{ "name": "group", "type": "string", "required": false, "description": "그룹별 필터링 (crud, visibility, workflow)" }], "responseBody": "ActionDto", "isArrayResponse": true, "auth": "None" } },
    { "id": "ROL-L6-API-013", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/actions/:id", "description": "Action 상세 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/actions/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Action ID (UUID)" }], "responseBody": "ActionDto", "isArrayResponse": false, "auth": "None" } },
    { "id": "ROL-L6-API-014", "level": 6, "subLevel": "1", "type": "api", "name": "POST /api/v1/actions", "description": "Action 생성 API", "metadata": { "method": "POST", "endpoint": "/api/v1/actions", "requestBody": "CreateActionDto", "responseBody": "ActionDto", "auth": "Bearer Token", "permissions": ["RoleCategory:WORKSPACE"] } },
    { "id": "ROL-L6-API-015", "level": 6, "subLevel": "1", "type": "api", "name": "PATCH /api/v1/actions/:id", "description": "Action 수정 API", "metadata": { "method": "PATCH", "endpoint": "/api/v1/actions/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Action ID (UUID)" }], "requestBody": "UpdateActionDto", "responseBody": "ActionDto", "auth": "Bearer Token", "permissions": ["RoleCategory:WORKSPACE"] } },
    { "id": "ROL-L6-API-016", "level": 6, "subLevel": "1", "type": "api", "name": "DELETE /api/v1/actions/:id", "description": "Action 삭제 API", "metadata": { "method": "DELETE", "endpoint": "/api/v1/actions/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Action ID (UUID)" }], "responseBody": "ActionDto", "auth": "Bearer Token", "permissions": ["RoleCategory:WORKSPACE"] } },
    { "id": "ROL-L6-API-017", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/subjects", "description": "Subject 목록 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/subjects", "queryParams": [{ "name": "group", "type": "string", "required": false, "description": "그룹별 필터링 (entity, menu, feature, ui)" }], "responseBody": "SubjectDto", "isArrayResponse": true, "auth": "None" } },
    { "id": "ROL-L6-API-018", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/subjects/:id", "description": "Subject 상세 조회 API", "metadata": { "method": "GET", "endpoint": "/api/v1/subjects/:id", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Subject ID (UUID)" }], "responseBody": "SubjectDto", "isArrayResponse": false, "auth": "None" } },
    { "id": "ROL-L6-API-019", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/subjects/:id/fields", "description": "Subject 필드 목록 조회 API (DMMF)", "metadata": { "method": "GET", "endpoint": "/api/v1/subjects/:id/fields", "pathParams": [{ "name": "id", "type": "string", "required": true, "description": "Subject ID (UUID)" }], "responseBody": "SubjectFieldDto", "isArrayResponse": true, "auth": "None" } },
    { "id": "ROL-L6-API-020", "level": 6, "subLevel": "1", "type": "api", "name": "GET /api/v1/abilities (전체 목록)", "description": "Ability 전체 목록 조회 API (신규)", "metadata": { "method": "GET", "endpoint": "/api/v1/abilities", "queryParams": [{ "name": "skip", "type": "number", "required": false, "description": "건너뛸 항목 수" }, { "name": "take", "type": "number", "required": false, "description": "조회할 항목 수 (기본 20)" }, { "name": "subjectId", "type": "string", "required": false, "description": "Subject 필터" }, { "name": "actionId", "type": "string", "required": false, "description": "Action 필터" }, { "name": "inverted", "type": "boolean", "required": false, "description": "허용/거부 필터" }, { "name": "name", "type": "string", "required": false, "description": "이름 검색 (부분 일치)" }], "responseBody": "AbilityResponseDto", "isArrayResponse": true, "auth": "Bearer Token", "permissions": ["MANAGE", "FULL_ACCESS"] } },
    { "id": "ROL-L6-API-021", "level": 6, "subLevel": "1", "type": "api", "name": "PUT /api/v1/grants/roles/:roleId", "description": "Role Grant 배치 할당 API (신규)", "metadata": { "method": "PUT", "endpoint": "/api/v1/grants/roles/:roleId", "pathParams": [{ "name": "roleId", "type": "string", "required": true, "description": "Role ID (UUID)" }], "requestBody": "UpdateRoleGrantsDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } }
  ],
  "edges": [
    { "id": "e-501", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-001", "type": "parent" },
    { "id": "e-502", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-002", "type": "parent" },
    { "id": "e-503", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-003", "type": "parent" },
    { "id": "e-504", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-004", "type": "parent" },
    { "id": "e-505", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-005", "type": "parent" },
    { "id": "e-506", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-006", "type": "parent" },
    { "id": "e-507", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-007", "type": "parent" },
    { "id": "e-508", "source": "ROL-L4-SCR-001", "target": "ROL-L5-ACT-008", "type": "parent" },
    { "id": "e-509", "source": "ROL-L4-SCR-001", "target": "ROL-L6-API-001", "type": "calls", "label": "호출" },

    { "id": "e-510", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-009", "type": "parent" },
    { "id": "e-511", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-010", "type": "parent" },
    { "id": "e-512", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-011", "type": "parent" },
    { "id": "e-513", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-012", "type": "parent" },
    { "id": "e-514", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-013", "type": "parent" },
    { "id": "e-515", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-014", "type": "parent" },
    { "id": "e-516", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-015", "type": "parent" },
    { "id": "e-517", "source": "ROL-L4-SCR-002", "target": "ROL-L5-ACT-016", "type": "parent" },
    { "id": "e-518", "source": "ROL-L4-SCR-002", "target": "ROL-L6-API-002", "type": "calls", "label": "호출" },
    { "id": "e-519", "source": "ROL-L4-SCR-002", "target": "ROL-L6-API-005", "type": "calls", "label": "호출" },
    { "id": "e-520", "source": "ROL-L4-SCR-002", "target": "ROL-L6-API-007", "type": "calls", "label": "호출" },
    { "id": "e-521", "source": "ROL-L4-SCR-002", "target": "ROL-L6-API-020", "type": "calls", "label": "호출" },
    { "id": "e-522", "source": "ROL-L4-SCR-002", "target": "ROL-L6-API-021", "type": "calls", "label": "호출" },

    { "id": "e-523", "source": "ROL-L4-SCR-003", "target": "ROL-L5-ACT-017", "type": "parent" },
    { "id": "e-524", "source": "ROL-L4-SCR-003", "target": "ROL-L5-ACT-018", "type": "parent" },
    { "id": "e-525", "source": "ROL-L4-SCR-003", "target": "ROL-L6-API-003", "type": "calls", "label": "호출" },

    { "id": "e-526", "source": "ROL-L4-SCR-004", "target": "ROL-L5-ACT-019", "type": "parent" },
    { "id": "e-527", "source": "ROL-L4-SCR-004", "target": "ROL-L5-ACT-020", "type": "parent" },
    { "id": "e-528", "source": "ROL-L4-SCR-004", "target": "ROL-L6-API-002", "type": "calls", "label": "호출" },
    { "id": "e-529", "source": "ROL-L4-SCR-004", "target": "ROL-L6-API-004", "type": "calls", "label": "호출" },

    { "id": "e-530", "source": "ROL-L4-SCR-005", "target": "ROL-L5-ACT-021", "type": "parent" },
    { "id": "e-531", "source": "ROL-L4-SCR-005", "target": "ROL-L5-ACT-022", "type": "parent" },
    { "id": "e-532", "source": "ROL-L4-SCR-005", "target": "ROL-L5-ACT-023", "type": "parent" },
    { "id": "e-533", "source": "ROL-L4-SCR-005", "target": "ROL-L5-ACT-024", "type": "parent" },
    { "id": "e-534", "source": "ROL-L4-SCR-005", "target": "ROL-L6-API-020", "type": "calls", "label": "호출" },
    { "id": "e-535", "source": "ROL-L4-SCR-005", "target": "ROL-L6-API-017", "type": "calls", "label": "호출" },
    { "id": "e-536", "source": "ROL-L4-SCR-005", "target": "ROL-L6-API-012", "type": "calls", "label": "호출" },

    { "id": "e-537", "source": "ROL-L4-SCR-006", "target": "ROL-L5-ACT-025", "type": "parent" },
    { "id": "e-538", "source": "ROL-L4-SCR-006", "target": "ROL-L6-API-008", "type": "calls", "label": "호출" },
    { "id": "e-539", "source": "ROL-L4-SCR-006", "target": "ROL-L6-API-011", "type": "calls", "label": "호출" },

    { "id": "e-540", "source": "ROL-L4-SCR-007", "target": "ROL-L5-ACT-026", "type": "parent" },
    { "id": "e-541", "source": "ROL-L4-SCR-007", "target": "ROL-L5-ACT-027", "type": "parent" },
    { "id": "e-542", "source": "ROL-L4-SCR-007", "target": "ROL-L6-API-009", "type": "calls", "label": "호출" },
    { "id": "e-543", "source": "ROL-L4-SCR-007", "target": "ROL-L6-API-017", "type": "calls", "label": "호출" },
    { "id": "e-544", "source": "ROL-L4-SCR-007", "target": "ROL-L6-API-012", "type": "calls", "label": "호출" },
    { "id": "e-545", "source": "ROL-L4-SCR-007", "target": "ROL-L6-API-019", "type": "calls", "label": "호출" },

    { "id": "e-546", "source": "ROL-L4-SCR-008", "target": "ROL-L5-ACT-028", "type": "parent" },
    { "id": "e-547", "source": "ROL-L4-SCR-008", "target": "ROL-L6-API-008", "type": "calls", "label": "호출" },
    { "id": "e-548", "source": "ROL-L4-SCR-008", "target": "ROL-L6-API-010", "type": "calls", "label": "호출" },
    { "id": "e-549", "source": "ROL-L4-SCR-008", "target": "ROL-L6-API-017", "type": "calls", "label": "호출" },
    { "id": "e-550", "source": "ROL-L4-SCR-008", "target": "ROL-L6-API-012", "type": "calls", "label": "호출" },

    { "id": "e-551", "source": "ROL-L4-SCR-009", "target": "ROL-L5-ACT-029", "type": "parent" },
    { "id": "e-552", "source": "ROL-L4-SCR-009", "target": "ROL-L5-ACT-030", "type": "parent" },
    { "id": "e-553", "source": "ROL-L4-SCR-009", "target": "ROL-L5-ACT-031", "type": "parent" },
    { "id": "e-554", "source": "ROL-L4-SCR-009", "target": "ROL-L6-API-012", "type": "calls", "label": "호출" },

    { "id": "e-555", "source": "ROL-L4-SCR-010", "target": "ROL-L5-ACT-032", "type": "parent" },
    { "id": "e-556", "source": "ROL-L4-SCR-010", "target": "ROL-L6-API-013", "type": "calls", "label": "호출" },
    { "id": "e-557", "source": "ROL-L4-SCR-010", "target": "ROL-L6-API-016", "type": "calls", "label": "호출" },

    { "id": "e-558", "source": "ROL-L4-SCR-011", "target": "ROL-L5-ACT-033", "type": "parent" },
    { "id": "e-559", "source": "ROL-L4-SCR-011", "target": "ROL-L6-API-014", "type": "calls", "label": "호출" },

    { "id": "e-560", "source": "ROL-L4-SCR-012", "target": "ROL-L5-ACT-034", "type": "parent" },
    { "id": "e-561", "source": "ROL-L4-SCR-012", "target": "ROL-L6-API-013", "type": "calls", "label": "호출" },
    { "id": "e-562", "source": "ROL-L4-SCR-012", "target": "ROL-L6-API-015", "type": "calls", "label": "호출" },

    { "id": "e-563", "source": "ROL-L4-SCR-013", "target": "ROL-L5-ACT-035", "type": "parent" },
    { "id": "e-564", "source": "ROL-L4-SCR-013", "target": "ROL-L5-ACT-036", "type": "parent" },
    { "id": "e-565", "source": "ROL-L4-SCR-013", "target": "ROL-L6-API-017", "type": "calls", "label": "호출" },

    { "id": "e-566", "source": "ROL-L4-SCR-014", "target": "ROL-L6-API-018", "type": "calls", "label": "호출" },
    { "id": "e-567", "source": "ROL-L4-SCR-014", "target": "ROL-L6-API-019", "type": "calls", "label": "호출" },

    { "id": "e-568", "source": "ROL-L5-ACT-011", "target": "ROL-L5-ACT-008", "type": "parent" },
    { "id": "e-569", "source": "ROL-L5-ACT-015", "target": "ROL-L5-ACT-016", "type": "parent" },
    { "id": "e-570", "source": "ROL-L5-ACT-017", "target": "ROL-L5-ACT-018", "type": "parent" },
    { "id": "e-571", "source": "ROL-L5-ACT-019", "target": "ROL-L5-ACT-020", "type": "parent" }
  ]
}
```
