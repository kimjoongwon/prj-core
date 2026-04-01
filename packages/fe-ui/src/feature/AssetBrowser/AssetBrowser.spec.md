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
| `AssetBrowserAsset` | 에셋 row/선택 계약 |
| `AssetBrowserProps` | feature 입력 계약 |
| `AssetBrowser` | 공개 계약 요소 |

## 핵심 규칙

- 관리 화면과 picker 화면이 같은 폴더/업로드/삭제 흐름을 사용합니다.
- folder query state는 route가 소유하고, feature는 `setQueryStates`로 선택/삭제 후 상태를 갱신합니다.
- picker 모드에서는 선택 action이 추가되고 선택된 asset id를 강조합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-01 | 신규 생성 | codex |
