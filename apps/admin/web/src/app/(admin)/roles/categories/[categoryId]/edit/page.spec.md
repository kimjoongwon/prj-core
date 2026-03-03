# 역할 카테고리 수정 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/categories/[categoryId]/edit`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  역할 카테고리 수정                          [← 상세로 돌아가기]         │
│  WORKSPACE                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                           │
│                                                                          │
│  카테고리명 *                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ WORKSPACE                                        (대문자 자동변환) │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  상위 카테고리                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ PLATFORM                                                   ▼       │ │
│  │ ─────────────────────                                              │ │
│  │ 없음 (최상위)                                                      │ │
│  │ SHARED  (자기 자신 및 하위 카테고리는 목록에서 제외)               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                                    [취소]  [💾 저장]    │
└─────────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 기존 역할 카테고리의 정보를 수정하기 위해 페이지에 진입한다.
2. 기존 데이터가 로드되어 폼에 미리 채워진다.
3. 카테고리명(name)을 수정할 수 있다 (대문자 자동 변환).
4. 상위 카테고리(parentId)를 변경할 수 있다 (자기 자신과 하위 카테고리는 선택 불가).
5. "저장" 버튼 클릭 시 유효성 검사 후 PATCH API를 호출한다.
6. 수정 성공 시 카테고리 상세 페이지(`/roles/categories/${categoryId}`)로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | 페이지 헤더 영역 | title="역할 카테고리 수정", description 동적 |
| 헤더 액션 | Button | "상세로 돌아가기" 버튼, ArrowLeft 아이콘 |
| 입력 폼 | 섹션 영역 | name, parentId 입력 필드 |
| 하단 버튼 | Button x2 | "취소", "저장" |

## 폼 필드 정의

| 필드 | 라벨 | 타입 | 필수 | 유효성 검사 |
|------|------|------|:----:|-------------|
| name | 카테고리명 | Input | O | 필수, 최대 50자 |
| parentId | 상위 카테고리 | Select | X | 자기 자신 + 하위 카테고리 제외, 순환 참조 서버 검증 |

## 상위 카테고리 선택 제약

- 자기 자신(categoryId)은 후보에서 제외
- 현재 카테고리의 하위 카테고리(children)도 후보에서 제외
- 선택하지 않으면 최상위 카테고리(parentId: null)로 설정
- 순환 참조 최종 검증은 서버에서 수행

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 호출 중 | "로딩 중..." 텍스트 |
| 데이터 없음 | category가 null | "카테고리를 찾을 수 없습니다." + 목록으로 버튼 |
| 편집 가능 | 정상 조회 | 폼 필드 표시 (기존 데이터 prefill) |
| 유효성 오류 | 검증 실패 | isInvalid + errorMessage 표시 |
| 제출 중 | PATCH 호출 중 | 저장 버튼 isLoading |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 | `useQuery (GET /api/v1/categories/${categoryId})` | 카테고리 상세 조회, 임시 customInstance 사용 |
| 클라이언트 | `useQuery (GET /api/v1/categories?type=Role)` | 상위 카테고리 선택 목록, 임시 customInstance 사용 |
| 폼 제출 | `useMutation (PATCH /api/v1/categories/${categoryId})` | 카테고리 수정, 임시 customInstance 사용 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles/categories/${categoryId}`로 이동 |
| onClickListButton | `/roles/categories`로 이동 |
| onClickSubmitButton | 유효성 검사 -> updateCategory 호출 |
| name Input 변경 | 대문자 자동 변환 (value.toUpperCase()) |
| parentId Select 변경 | state.parentId 업데이트 |

## 폼 상태 관리

`useLocalObservable`로 관리하는 `CategoryEditFormState`:
- `name`: string
- `parentId`: string
- `errors.name`: string
- `isInitialized`: boolean (useEffect로 초기값 설정, 한 번만)

## 비고

- SSR Prefetch 미적용 (TODO: Orval codegen 후 추가 예정)
- parentId가 빈 문자열이면 null로 변환하여 최상위 카테고리로 설정
- 수정 성공 시 해당 카테고리 쿼리 캐시 무효화

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, prefetch 미적용)
- [x] _client.tsx (클라이언트 컴포넌트, observer)
- [ ] Orval codegen 후 useGetCategoryById, useUpdateCategory, useGetCategories 훅 교체

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx`를 `Page + PageHeader` 기반으로 리팩터링 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
