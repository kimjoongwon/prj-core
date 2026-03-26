# 에셋 관리 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/assets`

## 사용자 시나리오

1. 관리자가 Space를 선택한 뒤 폴더 트리와 에셋 목록을 탐색합니다.
2. 검색, 타입, 상태 필터로 에셋을 좁혀보고 업로드/삭제를 수행합니다.
3. 폴더 생성, 이름 변경, 삭제를 page-local modal로 처리합니다.

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/assets/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/assets/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 page-local `PageTitleBar`, `Surface`(`padding="none"`) 안의 폴더 트리/에셋 그리드, modal만 렌더링합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `master`
- reusable target: `master/table`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
- persist store hydrate와 Space 선택 여부를 page 내부에서 게이트합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `PageTitleBar` + 업로드 버튼 | 에셋 관리 진입점 |
| 브라우저 본문 | `Surface` (`padding="none"`) + `FolderTree` + `MetaDataGrid` | 폴더 탐색과 목록 브라우징 |
| 상태 블록 | loading skeleton / `EmptyState` | hydrate 전 또는 Space 미선택 상태 안내 |
| modal | folder create/rename/delete | 폴더 관리 액션 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetAssetsSuspense({ take, skip, search, kind, status, folderId })` | 에셋 목록 조회 |
| 클라이언트 렌더 | `useGetFoldersSuspense()` | 폴더 트리 조회 |
| 업로드 | `useUploadAsset()` | 파일 업로드 |
| 에셋 삭제 | `useRemoveAsset()` | 에셋 삭제 |
| 폴더 생성 | `useCreateFolder()` | 폴더 생성 |
| 폴더 수정 | `useUpdateFolder()` | 폴더명 변경 |
| 폴더 삭제 | `useRemoveFolder()` | 폴더 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickUploadButton` | 선택 폴더 기준 파일 업로드 시작 |
| `onChangeAssetFileInput` | 업로드 요청 전송 |
| `onClickCreateFolderButton` | 생성 modal 오픈 |
| `onClickRenameFolderButton` | 이름 변경 modal 오픈 |
| `onClickDeleteFolderButton` | 삭제 modal 오픈 |
| `onClickDeleteAssetButton` | 에셋 삭제 요청 |

## 구현 체크리스트

- [x] `layout.tsx`가 route skeleton 소유
- [x] `page.tsx` 단일 CSR 콘텐츠 파일
- [x] `_client.tsx` 제거
- [x] `_prefetch.ts` 없음
- [x] hydrate/Space 미선택 gate를 `page.tsx`에 통합

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-22 | 브라우저 wrapper를 범용 `Surface`(`padding="none"`) 기준으로 문서화 | codex |
| 2026-03-21 | 에셋 관리를 `master/table` 재사용 타깃으로 분류하고 page role 계약을 추가 | codex |
| 2026-03-21 | 에셋 관리 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
