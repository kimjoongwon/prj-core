# OidcInteractionPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcInteractionPage/OidcInteractionPage.tsx

## 역할

OIDC interaction의 loading, error, login, consent 상태를 page 레이어에서 조합하며,
상위 route가 설계한 `oidcInteractionPage` state slice 안의 `oidcLoginForm`, `oidcConsentPanel`을 각 branch에 연결합니다.
login/consent 상호작용 이벤트는 page wrapper가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 디자인 스케치

```text
OidcInteractionPage
- OidcLoginForm
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `AuthCard` | `../../widget` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `AuthCardHeader` | `../../widget` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AlertBanner` | `../../display` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Button` | `../../control` | 사용자 액션 실행 |
| `OidcConsentPanel` | `../../form` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `OidcLoginForm` | `../../form` | 입력 폼 또는 AI 입력 흐름 구성 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| IdpInteractionClientInfo | 공개 계약 요소 |
| OidcInteractionPageState | 공개 계약 요소 |
| OidcInteractionPageProps | 공개 계약 요소 |
| OidcInteractionPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | loading/error 분기 문구의 런타임 i18n 번역 적용 경로 반영 | codex |
| 2026-04-22 | OIDC 로그인/동의 상태와 액션 책임 경계 정리 | codex |
| 2026-04-22 | OIDC 상호작용 모드와 login 폼 상태 묶음 계약 정리 | codex |
| 2026-04-22 | OIDC 로그인 분기의 form 조합 계약 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시명 기준 정리 | codex |
| 2026-03-25 | 초기 화면 기획 수립 | codex |
