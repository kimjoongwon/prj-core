# Assets API Surface 기획서

> 위치: `packages/fe-api/src/apis-assets.ts`

## 역할

- Swagger에 아직 노출되지 않은 assets/folders 엔드포인트를 `@cocrepo/api/assets` subpath로 제공합니다.
- 수동 구현이지만 `@cocrepo/api/core/*` generated client와 비슷한 query/mutation naming을 유지합니다.
- admin web의 CSR + Suspense 페이지가 사용할 수 있도록 suspense query helper와 hook을 제공합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `useGetAssets` / `useGetAssetsSuspense` | 에셋 목록 조회 |
| `useGetAssetById` / `useGetAssetByIdSuspense` | 에셋 상세 조회 |
| `useGetFolders` / `useGetFoldersSuspense` | 폴더 목록 조회 |
| `prefetchGetAssetsQuery` / `prefetchGetAssetByIdQuery` / `prefetchGetFoldersQuery` | SSR 예외 페이지용 prefetch helper |
| `useRemoveAsset` / `useMoveAsset` | assets mutation hook |

## 규칙

- `options` 형태는 generated client와 동일하게 `query`, `request`를 받습니다.
- suspense hook은 `UseSuspenseQueryOptions` / `UseSuspenseQueryResult` 기반으로 노출합니다.
- Swagger에 assets 경로가 다시 노출되면 이 파일은 generated client로 대체될 수 있습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | assets manual client에 suspense query helper와 hook을 추가해 generated client와 표면을 맞춤 | codex |
