# IdpConsoleOidcSessionsPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/IdpConsoleOidcSessionsPage/IdpConsoleOidcSessionsPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdpConsoleOidcSessionsPage | 공개 계약 요소 |
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/idp/oidc-sessions | 기능 구현 의존성 |
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| @tanstack/react-query | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-27 | 컬럼 builder 이관 후 남은 미사용 `OidcSessionDto` type import를 제거 | codex |
| 2026-03-27 | OIDC 세션 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
