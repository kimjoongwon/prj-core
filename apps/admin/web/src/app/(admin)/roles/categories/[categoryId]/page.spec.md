# 역할 카테고리 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/categories/[categoryId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  역할 카테고리 상세          [← 목록]  [✏ 수정]  [🗑 삭제 (비활성화)]  │
│  WORKSPACE                                                               │
│  ⚠ 하위 카테고리가 있어 삭제할 수 없습니다.                             │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  기본 정보                                                │
│  카테고리명     WORKSPACE                                                │
│  타입           Role                                                     │
│  상위 카테고리  PLATFORM →                                              │
│  생성일         2026-01-10 09:00                                         │
│  수정일         2026-01-10 09:00                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  하위 카테고리                                            │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ PROJECT  →  |  TECHNICAL  →                                         │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  분류된 역할                                              │
│ ┌──────────────────────────┬──────────────────────────────────────────┐ │
│ │ 역할명                   │ 설명                                     │ │
│ ├──────────────────────────┼──────────────────────────────────────────┤ │
│ │ MANAGE                   │ 관리 권한을 가진 역할                    │ │
│ └──────────────────────────┴──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

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
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="역할 카테고리 상세", description 동적 |
| 헤더 액션 | Button (목록, 수정, 삭제) | 삭제 버튼은 hasChildren일 때 isDisabled |
| 하위 카테고리 경고 | div (warning) | hasChildren일 때만 표시 |
| 기본 정보 | section > CategoryInfoSection | 카테고리 기본 정보 표시, 상위 카테고리 링크 포함 |
| 하위 카테고리 | section > CategoryChildrenSection | 하위 카테고리 목록 표시 |
| 분류된 역할 | section > CategoryRoleListSection | 분류된 역할 목록 표시 |
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
| 클라이언트 | `useGetCategoryById(categoryId)` | 카테고리 상세 조회 |
| 삭제 | `useDeleteCategory` | 카테고리 삭제 후 목록 쿼리 무효화 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles/categories`로 이동 |
| onClickEditButton | `/roles/categories/${categoryId}/edit`로 이동 |
| deleteModal.onOpen | 삭제 확인 모달 열기 |
| onClickDeleteConfirm | deleteCategory 호출, 성공 시 쿼리 무효화 + `/roles/categories`로 이동 |

## 비고

- 현재 route는 thin container + CSR fetch 패턴을 유지하며 별도 `_prefetch.ts`는 사용하지 않음
- CategoryInfoSection에 `categoriesBasePath="/roles/categories"` 전달 (상위 카테고리 링크 경로)
- CategoryChildrenSection에 `categoriesBasePath="/roles/categories"` 전달 (하위 카테고리 링크 경로)
- CategoryInfoSection, CategoryChildrenSection, CategoryRoleListSection은 `@cocrepo/ui` 공용 컴포넌트 사용
- 상세 조회/삭제는 `@cocrepo/api/core/categories`의 Orval 생성 훅을 사용

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [x] `useGetCategoryById`, `useDeleteCategory` 훅 사용


## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/categories/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/categories/[categoryId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-31 | 상세 조회/삭제 흐름을 `useGetCategoryById`, `useDeleteCategory` 기준으로 갱신 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 로딩/빈 상태/정상 상태 헤더를 `PageTitleBar` 기반으로 통일 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure page props를 주입하는 구조로 정리 | codex |
