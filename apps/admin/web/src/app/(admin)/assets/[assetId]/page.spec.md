# 에셋 상세 페이지 기획서

> 생성일: 2026-02-22
> 타입: page
> 경로: `/assets/[assetId]`

## 사용자 시나리오

1. 관리자가 에셋 상세 정보를 확인합니다.
2. 목록으로 돌아가거나 다른 폴더로 이동합니다.
3. 필요하면 에셋을 삭제합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `detail`
- reusable target: `detail/read`
- screen component path: `packages/fe-ui/src/screen/AssetDetailScreen/AssetDetailScreen.tsx`
- route는 `useGetAssetById`, `useGetFolders`, `useRemoveAsset`, `useMoveAsset`, `router`를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetAssetById(assetId)` | 에셋 상세 조회 |
| 클라이언트 렌더 | `useGetFolders()` | 이동 대상 폴더 목록 조회 |
| 삭제 | `useRemoveAsset()` | 에셋 삭제 |
| 폴더 이동 | `useMoveAsset()` | 에셋 폴더 이동 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickBackButton` | route가 `/assets`로 이동 |
| `onClickDeleteAssetButton` | route가 삭제 mutation과 목록/상세 캐시 무효화를 처리 |
| `onChangeTargetFolderSelection` | route가 이동 대상 폴더 선택값과 검증 오류를 관리 |
| `onClickMoveAssetButton` | route가 이동 mutation과 상세/폴더 캐시 무효화, 대상 폴더 검증을 처리 |