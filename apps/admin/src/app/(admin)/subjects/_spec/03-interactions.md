# 03-interactions: 대상 목록

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 21개 기능 (Role 7, Ability 6, Action 6, Subject 2)
- **L4 Screens**: 14개 화면
  - Role: 목록/상세(+Grant 배치 할당)/등록/수정
  - Ability: 목록/상세/등록/수정
  - Action: 목록/상세/등록/수정
  - Subject: 목록/상세 (조회 전용)

---

## L5: 인터랙션 정의

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

## L6: API 엔드포인트 정의

### ROL-L6-API-017: Subject 목록 조회

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
