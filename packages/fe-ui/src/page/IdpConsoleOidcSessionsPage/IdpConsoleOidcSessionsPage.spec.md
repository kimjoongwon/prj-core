# IdpConsoleOidcSessionsPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/IdpConsoleOidcSessionsPage/IdpConsoleOidcSessionsPage.tsx

## 역할

OIDC 세션 목록 화면의 pure page 컴포넌트입니다.
조회, query state, revoke mutation은 route thin container가 소유하고 이 파일은 stats/grid 조합과 confirm modal만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdpConsoleOidcSessionsPageSession | 세션 row 계약 |
| IdpConsoleOidcSessionsPageStats | 세션 통계 계약 |
| IdpConsoleOidcSessionsPageProps | pure page 입력 계약 |
| idpConsoleOidcSessionsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| IdpConsoleOidcSessionsPage | 공개 계약 요소 |
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | OIDC 세션 목록을 pure page로 재정의하고 조회·통계·revoke mutation·query state를 route thin container로 이동 | codex |
| 2026-03-27 | 컬럼 builder 이관 후 남은 미사용 `OidcSessionDto` type import를 제거 | codex |
| 2026-03-27 | OIDC 세션 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
