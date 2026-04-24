# AssetListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AssetListPage/AssetListPage.tsx

## 역할

에셋 목록 화면의 pure page 컴포넌트입니다.
route thin container가 데이터/변경 훅을 소유하고, 이 파일은 공통 `AssetBrowser` feature를 inline 관리 화면으로 마운트하는 thin page wrapper만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AssetListPageAsset | 에셋 목록 row 계약 |
| AssetListPageProps | pure page 입력 계약 |
| adminAssetsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| AssetListPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | query state 타입을 AssetBrowser의 명시 계약으로 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-04-01 | 페이지 내부 조합 책임을 `AssetBrowser` feature로 위임하고 thin wrapper로 축소 | codex |
| 2026-03-30 | 업로드 CTA를 선택된 폴더 기준으로만 동작시키고 page 내부 warning toast 의존을 제거 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | 에셋 목록을 pure page로 재정의하고 persist store/API/query state를 route thin container로 이동 | codex |
| 2026-03-27 | 에셋 목록 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
