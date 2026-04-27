# useAdminAssetBrowser hook 기획서

> 생성일: 2026-04-01
> 타입: hook
> 위치: apps/admin/web/src/app/(admin)/hooks/useAdminAssetBrowser.ts

## 역할

관리자 app에서 에셋 브라우저에 필요한 route-side 책임을 공통으로 묶습니다.
persist store hydrate/Space gate, query state, assets/folders 조회, asset/folder CRUD mutation, toast와 cache invalidation을 이 hook이 소유합니다.
assets/folders 목록 query는 PersistStore hydrate와 Space 선택 resolved 상태 이후에만 실행합니다. Space 전환은 header selector의 hard reload로 in-memory query cache를 초기화합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `AdminAssetBrowserBindings` | `AssetBrowser`에 바로 주입할 수 있는 route-side props 묶음 |
| `useAdminAssetBrowser` | 공개 hook |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-27 | assets/folders 목록의 수동 Space queryKey 분리를 제거하고 hydrate/Space 선택 enabled gate와 hard reload 기반 cache 초기화 정책으로 갱신 | codex |
| 2026-04-26 | assets/folders 목록 query에 Space bootstrap gate를 반영 | codex |
| 2026-04-24 | route가 nuqs query state를 직접 선언하도록 정리 | codex |
| 2026-04-01 | 신규 생성 | codex |
