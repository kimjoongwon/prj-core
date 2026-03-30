# AdminAssetsPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AdminAssetsPage/AdminAssetsPage.tsx

## 역할

에셋 목록 화면의 pure page 컴포넌트입니다. persist store hydrate, Space 선택, API 조회/변경, query state는 route thin container가 소유하고 이 파일은 폴더 트리, grid, folder modal 조합만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminAssetsPageAsset | 에셋 목록 row 계약 |
| AdminAssetsPageProps | pure page 입력 계약 |
| adminAssetsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| AdminAssetsPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/hook | query state type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 업로드 CTA를 선택된 폴더 기준으로만 동작시키고 page 내부 warning toast 의존을 제거 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | 에셋 목록을 pure page로 재정의하고 persist store/API/query state를 route thin container로 이동 | codex |
| 2026-03-27 | 에셋 목록 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
