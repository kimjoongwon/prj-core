# 루틴 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/routines`

## 사용자 시나리오

1. 관리자가 루틴 목록을 검색하거나 Space 범위로 필터링합니다.
2. 루틴 이름으로 상세 화면에 이동합니다.
3. 삭제 아이콘으로 삭제 확인 modal을 열고 루틴을 제거합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/routines/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/routines/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`, `MetaDataGrid`, 삭제 modal만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `feature/master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- `Suspense` fallback은 목록 로딩 상태만 처리합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 루틴 등록 버튼 | 진입 헤더 |
| 목록 영역 | `MetaDataGrid` | 검색, Space 범위 필터, 루틴 목록 |
| modal | 삭제 확인 dialog | 삭제 제약 안내와 확인 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetRoutinesSuspense({ take, skip, search, spaceScope })` | 루틴 목록 조회 |
| 삭제 확인 | `useDeleteRoutine()` | 루틴 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickRoutineName` | `/routines/[routineId]` 이동 |
| `onClickDeleteButton` | 삭제 대상 지정 및 modal 오픈 |
| `onClickDeleteConfirm` | 삭제 요청 및 캐시 무효화 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | 루틴 목록을 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | 루틴 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
