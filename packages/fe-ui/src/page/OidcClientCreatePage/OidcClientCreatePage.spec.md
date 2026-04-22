# OidcClientCreatePage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcClientCreatePage/OidcClientCreatePage.tsx

## 역할

OIDC 클라이언트 등록 화면의 pure page 컴포넌트입니다.
생성 mutation과 라우팅은 route thin container가 소유하고 이 파일은 폼 렌더링과 로컬 검증 상태만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientCreatePageSubmitInput | route로 전달하는 제출 계약 |
| OidcClientCreatePageProps | pure page 입력 계약 |
| OidcClientCreatePage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | OIDC 클라이언트 등록을 pure page로 재정의하고 생성 mutation·라우팅을 route thin container로 이동 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route runtime ownership에 맞춰 page를 props 기반 pure contract로 정리 | codex |
