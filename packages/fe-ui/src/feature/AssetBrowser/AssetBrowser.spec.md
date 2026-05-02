# AssetBrowser feature 기획서

> 생성일: 2026-04-01
> 타입: feature
> 위치: packages/fe-ui/src/feature/AssetBrowser/AssetBrowser.tsx

## 역할

이 파일은 에셋 브라우저의 실제 사용자 흐름을 담당합니다.
폴더 탐색, 검색/필터 grid, 업로드, 폴더 생성/이름 변경/삭제 modal, picker 선택 동작을 하나로 조합합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `AssetBrowserMode` | `manage` 또는 `picker` |
| `AssetBrowserPresentation` | `inline` 또는 `modal` |
| `AssetBrowserAsset` | Orval `AssetDto` 기반 에셋 row/선택 계약 |
| `AssetBrowserProps` | feature 입력 계약 |
| `AssetBrowser` | 공개 계약 요소 |

## 핵심 규칙

- 관리 화면과 picker 화면이 같은 폴더/업로드/삭제 흐름을 사용합니다.
- folder query state는 route가 소유하고, feature는 `setQueryStates`로 선택/삭제 후 상태를 갱신합니다.
- picker 모드에서는 선택 action이 추가되고 선택된 asset id를 강조합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | folder/asset empty state와 modal 문구가 런타임 i18n을 사용하도록 반영 | codex |
| 2026-04-28 | 에셋 row 계약을 자체 interface 대신 Orval AssetDto alias로 정리 | codex |
| 2026-04-28 | grid 컴포넌트 명칭을 DataGrid로 통일하고 호출부를 새 계약에 맞춤 | codex |
| 2026-04-25 | DataGrid state를 useLocalObservable 기반 DataGridStateModel class instance로 생성하도록 변경 | codex |
| 2026-04-28 | 검색 input을 DataGrid toolbar 렌더링으로 되돌려 컬럼 헤더 필터 배치를 제거 | codex |
| 2026-04-25 | DataGrid server result를 rows/totalCount/isLoading props로 분리 | codex |
| 2026-04-25 | DataGrid 호출을 state prop 기반 query 계약으로 변경 | codex |
| 2026-04-24 | AssetBrowser query state 타입을 hook ReturnType 의존에서 명시 계약으로 정리 | codex |
| 2026-04-01 | 신규 생성 | codex |
