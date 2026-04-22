# RoleListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/RoleListPage/RoleListPage.tsx

## 역할

역할 목록 화면의 pure page 컴포넌트입니다. 역할 조회, query state, 신규 등록 라우팅은 route thin container가 소유하고 이 파일은 안내 배너와 grid 조합만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoleListPageRole | 역할 목록 row 계약 |
| RoleListPageProps | pure page 입력 계약 |
| RoleListPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/hook | query state type 참조 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | 역할 목록을 pure page로 재정의하고 조회·query state·등록 라우팅을 route thin container로 이동 | codex |
| 2026-03-28 | 역할 목록을 `MetaDataGrid` 기반 pure page로 통합하고 `raw` 테이블 의존을 제거 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
