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
- screen component path: `packages/fe-ui/src/screen/AssetListScreen/AssetListScreen.tsx`
- route는 공통 `useAssetBrowser()` hook을 통해 persist store hydrate/Space 선택 gate, query state, assets/folders 조회, folder/asset mutation을 소유합니다.

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