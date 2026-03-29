# 에셋 상세 페이지 기획서

> 생성일: 2026-02-22
> 타입: page
> 경로: `/assets/[assetId]`

## 사용자 시나리오

1. 관리자가 에셋 상세 정보를 확인합니다.
2. 목록으로 돌아가거나 다른 폴더로 이동합니다.
3. 필요하면 에셋을 삭제합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `detail`
- reusable target: `detail/read`
- page component path: `packages/fe-ui/src/page/AdminAssetsAssetIdPage/AdminAssetsAssetIdPage.tsx`
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
| `onClickMoveAssetButton` | route가 이동 mutation과 상세/폴더 캐시 무효화를 처리 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | `AdminAssetsAssetIdPage` pure page와 thin route container 구조로 전환하고 조회/삭제/이동 책임을 route로 이동 | codex |
| 2026-03-26 | route thin container와 `AdminAssetsAssetIdPage` 분리 구조를 문서화 | codex |
| 2026-02-22 | 초기 상세 페이지 기획 | orch-screen-planner |
