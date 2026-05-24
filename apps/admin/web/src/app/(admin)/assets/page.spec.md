# 에셋 관리 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/assets`

## 사용자 시나리오

1. 관리자가 Space를 선택한 뒤 폴더 트리와 에셋 목록을 탐색합니다.
2. 검색, 타입, 상태 필터로 에셋을 좁혀보고 업로드/삭제를 수행합니다.
3. 폴더 생성, 이름 변경, 삭제를 page-local modal로 처리합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/AssetListPage/AssetListPage.tsx`
- route는 공통 `useAdminAssetBrowser()` hook을 통해 persist store hydrate/Space 선택 gate, query state, assets/folders 조회, folder/asset mutation을 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetAssets({ take, skip, search, kind, status, folderId })` | 에셋 목록 조회 |
| 클라이언트 렌더 | `useGetFolders()` | 폴더 트리 조회 |
| 업로드 | `useUploadAsset()` | 파일 업로드 |
| 에셋 삭제 | `useRemoveAsset()` | 에셋 삭제 |
| 폴더 생성 | `useCreateFolder()` | 폴더 생성 |
| 폴더 수정 | `useUpdateFolder()` | 폴더명 변경 |
| 폴더 삭제 | `useRemoveFolder()` | 폴더 삭제 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onUploadAsset` | route가 업로드 mutation 실행 후 목록 캐시를 무효화 |
| `onDeleteAsset` | route가 삭제 mutation 실행 후 목록 캐시를 무효화 |
| `onCreateFolder` | route가 생성 mutation과 폴더 캐시 무효화를 처리 |
| `onRenameFolder` | route가 수정 mutation과 폴더 캐시 무효화를 처리 |
| `onDeleteFolder` | route가 삭제 mutation과 폴더 캐시 무효화를 처리 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | grid 컴포넌트 명칭을 DataGrid로 통일한 구조 변경을 반영 | codex |
| 2026-04-28 | page role을 `collection`으로 갱신 | codex |
| 2026-04-28 | DataGrid 공식 재사용 타깃을 `data-grid`로 갱신 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-04-01 | `/assets` route의 조회/변경 책임을 `useAdminAssetBrowser` 공통 hook으로 통합하고 UI는 `AssetBrowser` feature 재사용으로 전환 | codex |
| 2026-03-29 | `AssetListPage` pure screen와 thin route container 구조로 전환하고 persist store/API/query state 책임을 route로 이동 | codex |
| 2026-03-26 | 브라우저 wrapper의 zero-padding 예시를 제거하고 기본 `Surface` 여백 기준으로 정정 | codex |
| 2026-03-21 | 에셋 관리 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
