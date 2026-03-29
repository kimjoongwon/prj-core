# IdpConsoleAuthAuditLogsPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/IdpConsoleAuthAuditLogsPage/IdpConsoleAuthAuditLogsPage.tsx

## 역할

로그인 감사 로그 목록 화면의 pure page 컴포넌트입니다.
조회, query state, 통계 fetch는 route thin container가 소유하고 이 파일은 stats 카드와 grid 조합만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdpConsoleAuthAuditLogsPageLog | 감사 로그 row 계약 |
| IdpConsoleAuthAuditLogsPageStats | 감사 로그 통계 계약 |
| IdpConsoleAuthAuditLogsPageProps | pure page 입력 계약 |
| idpConsoleAuthAuditLogsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| IdpConsoleAuthAuditLogsPage | 공개 계약 요소 |
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | 감사 로그 목록을 pure page로 재정의하고 조회·통계·query state를 route thin container로 이동 | codex |
| 2026-03-27 | 감사 로그 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
