# 역할 카테고리 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/categories`

## 사용자 시나리오

1. 관리자가 역할 카테고리 목록을 조회한다.
2. 각 카테고리의 이름, 상위 카테고리, 하위 카테고리 수, 생성일을 테이블 형태로 확인한다.
3. "카테고리 추가" 버튼을 클릭하여 등록 페이지로 이동한다.
4. 각 카테고리의 "상세" 버튼을 클릭하여 상세 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | PageSurface | title="역할 카테고리 목록", description="역할을 카테고리로 분류하여 관리합니다." |
| 헤더 액션 | Button (Link) | "카테고리 추가" 버튼, `/roles/categories/new`로 이동, Plus 아이콘 |
| 카테고리 테이블 | SectionSurface > table | 컬럼: 카테고리명, 상위 카테고리, 하위 카테고리 수, 생성일, 액션 |
| 테이블 푸터 | div | 총 N건 표시 |

## 테이블 컬럼 정의

| 필드 | 라벨 | 크기 | 셀 렌더링 |
|------|------|------|-----------|
| name | 카테고리명 | 200px | font-mono |
| parent | 상위 카테고리 | 180px | ParentCategoryCell (parent.name 또는 "-") |
| children | 하위 카테고리 수 | 120px, center | children.length |
| createdAt | 생성일 | 150px | DateTimeCell |
| (액션) | 액션 | 100px, center | "상세" Button (Link) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 호출 중 | "로딩 중..." 텍스트 |
| 빈 목록 | categories.length === 0 | FolderTree 아이콘 + "등록된 역할 카테고리가 없습니다." |
| 데이터 표시 | 카테고리 목록 존재 | 테이블 + 총 건수 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 | `useQuery (getCategories)` | 카테고리 목록 조회 (GET /api/v1/categories?type=Role), 임시 customInstance 사용 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "카테고리 추가" 버튼 클릭 | `/roles/categories/new`로 Link 이동 |
| "상세" 버튼 클릭 | `/roles/categories/${category.id}`로 Link 이동 |

## 비고

- SSR Prefetch 미적용 (TODO: Orval codegen 후 추가 예정)
- `type: "Role"` 쿼리 파라미터로 역할 카테고리만 필터링
- ParentCategoryCell은 `@cocrepo/ui` 공용 컴포넌트 사용

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, prefetch 미적용)
- [x] _client.tsx (클라이언트 컴포넌트, observer)
- [ ] Orval codegen 후 useGetCategories 훅 교체

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
