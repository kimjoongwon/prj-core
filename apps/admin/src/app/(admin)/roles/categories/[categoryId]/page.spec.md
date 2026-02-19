# 역할 카테고리 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/categories/[categoryId]`

## 사용자 시나리오

1. 관리자가 특정 역할 카테고리의 상세 정보를 조회한다.
2. 기본 정보 섹션에서 카테고리명, 타입, 상위 카테고리, 생성일, 수정일을 확인한다 (CategoryInfoSection 컴포넌트 사용).
3. 하위 카테고리 섹션에서 하위 카테고리 목록을 확인한다 (CategoryChildrenSection 컴포넌트 사용).
4. 분류된 역할 섹션에서 해당 카테고리에 분류된 역할 목록을 확인한다 (CategoryRoleListSection 컴포넌트 사용).
5. "수정" 버튼으로 수정 페이지로 이동할 수 있다.
6. "삭제" 버튼 클릭 시 삭제 확인 모달이 나타나고, 확인 시 카테고리가 삭제된다.
7. 하위 카테고리가 있는 경우 삭제 버튼이 비활성화되고, 경고 안내가 표시된다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | PageSurface | title="역할 카테고리 상세", description 동적 |
| 헤더 액션 | Button (목록, 수정, 삭제) | 삭제 버튼은 hasChildren일 때 isDisabled |
| 하위 카테고리 경고 | div (warning) | hasChildren일 때만 표시 |
| 기본 정보 | SectionSurface > CategoryInfoSection | 카테고리 기본 정보 표시, 상위 카테고리 링크 포함 |
| 하위 카테고리 | SectionSurface > CategoryChildrenSection | 하위 카테고리 목록 표시 |
| 분류된 역할 | SectionSurface > CategoryRoleListSection | 분류된 역할 목록 표시 |
| 삭제 모달 | Modal | 삭제 확인 (연결된 역할 분류도 함께 삭제 경고) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 호출 중 | "로딩 중..." 텍스트 |
| 데이터 없음 | category가 null | "카테고리를 찾을 수 없습니다." + 목록으로 버튼 |
| 데이터 표시 | 정상 조회 | 기본 정보 + 하위 카테고리 + 분류된 역할 |
| 삭제 불가 | hasChildren = true | 삭제 버튼 비활성화 + 경고 안내 |
| 삭제 중 | DELETE 호출 중 | 삭제 버튼 isLoading |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 | `useQuery (GET /api/v1/categories/${categoryId})` | 카테고리 상세 조회, 임시 customInstance 사용 |
| 삭제 | `useMutation (DELETE /api/v1/categories/${categoryId})` | 카테고리 삭제, 임시 customInstance 사용 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles/categories`로 이동 |
| onClickEditButton | `/roles/categories/${categoryId}/edit`로 이동 |
| deleteModal.onOpen | 삭제 확인 모달 열기 |
| onClickDeleteConfirm | deleteCategory 호출, 성공 시 쿼리 무효화 + `/roles/categories`로 이동 |

## 비고

- SSR Prefetch 미적용 (TODO: Orval codegen 후 추가 예정)
- CategoryInfoSection에 `categoriesBasePath="/roles/categories"` 전달 (상위 카테고리 링크 경로)
- CategoryChildrenSection에 `categoriesBasePath="/roles/categories"` 전달 (하위 카테고리 링크 경로)
- CategoryInfoSection, CategoryChildrenSection, CategoryRoleListSection은 `@cocrepo/ui` 공용 컴포넌트 사용

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, prefetch 미적용)
- [x] _client.tsx (클라이언트 컴포넌트, observer)
- [ ] Orval codegen 후 useGetCategoryById, useDeleteCategory 훅 교체

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
