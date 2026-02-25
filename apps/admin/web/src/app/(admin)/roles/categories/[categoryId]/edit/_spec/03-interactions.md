# 03-interactions: 역할 카테고리 수정

## 이전 레이어 요약 (L3-L4)

- **L3 Features**: 12개 기능
  - 역할 그룹: 목록 표시, 검색/필터, 상세 정보, 등록 폼, 수정 폼, 삭제 (6개)
  - 역할 카테고리: 목록 표시, 검색/필터, 상세 정보, 등록 폼, 수정 폼, 삭제 (6개)
- **L4 Screens**: 8개 화면
  - 역할 그룹: 목록/상세/등록/수정 (4개)
  - 역할 카테고리: 목록/상세/등록/수정 (4개)

---

## L5: 인터랙션 정의

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

## 관련 API

| API ID | Method | Endpoint | 설명 |
|--------|--------|----------|------|
| RGC-L6-API-007 | GET | `/api/v1/categories/:id` | 카테고리 상세 조회 (prefill) |
| RGC-L6-API-006 | GET | `/api/v1/categories` | 카테고리 목록 조회 (parentId Select 옵션) |
| RGC-L6-API-009 | PATCH | `/api/v1/categories/:id` | 카테고리 수정 |

> 전체 API 상세는 `_domain/RoleGroupsAndCategories/03-interactions.md`를 참조하세요.
