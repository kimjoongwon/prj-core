# useAdminAssetBrowser hook 기획서

> 생성일: 2026-04-01
> 타입: hook
> 위치: apps/admin/web/src/app/(admin)/hooks/useAdminAssetBrowser.ts

## 역할

관리자 app에서 에셋 브라우저에 필요한 route-side 책임을 공통으로 묶습니다.
persist store hydrate/Space gate, query state, assets/folders 조회, asset/folder CRUD mutation, toast와 cache invalidation을 이 hook이 소유합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `AdminAssetBrowserBindings` | `AssetBrowser`에 바로 주입할 수 있는 route-side props 묶음 |
| `useAdminAssetBrowser` | 공개 hook |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-01 | 신규 생성 | codex |
