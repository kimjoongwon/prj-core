# AssetDetailPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AssetDetailPage/AssetDetailPage.tsx

## 역할

에셋 상세 화면의 pure page 컴포넌트입니다. 에셋 조회, 폴더 목록 조회, 삭제/이동 mutation, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합과 page-local 이동 선택 상태만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AssetDetailPageAsset | 상세 에셋 데이터 계약 |
| AssetDetailPageFolder | 폴더 선택 옵션 계약 |
| AssetDetailPageProps | pure page 입력 계약 |
| AssetDetailPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | 에셋 상세를 pure page로 재정의하고 조회/삭제/폴더 이동/라우팅을 route thin container로 이동 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route runtime ownership에 맞춰 page를 props 기반 pure contract로 정리 | codex |
