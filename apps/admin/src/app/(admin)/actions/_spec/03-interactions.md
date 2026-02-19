# 03-interactions: 행위 목록

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

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

## L6: API 엔드포인트 정의

### ROL-L6-API-012: Action 목록 조회

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
