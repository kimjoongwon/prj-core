# IdpConsoleSecurityPolicyPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/IdpConsoleSecurityPolicyPage/IdpConsoleSecurityPolicyPage.tsx

## 역할

보안 정책 설정 화면의 pure page 컴포넌트입니다.
정책 조회, 저장 mutation, 성공 상태 관리는 route thin container가 소유하고 이 파일은 form shell과 로컬 입력 상태만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdpConsoleSecurityPolicyPagePolicy | 보안 정책 표시 계약 |
| IdpConsoleSecurityPolicyPageSubmitInput | 저장 payload 계약 |
| IdpConsoleSecurityPolicyPageProps | pure page 입력 계약 |
| IdpConsoleSecurityPolicyPage | 공개 계약 요소 |
| default export | 공개 계약 요소 |

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
| 2026-03-29 | 보안 정책 화면을 pure page로 재정의하고 정책 조회·저장 mutation·저장 성공 상태를 route thin container로 이동 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
