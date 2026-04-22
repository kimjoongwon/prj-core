# OidcInteractionPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcInteractionPage/OidcInteractionPage.tsx

## 역할

OIDC interaction의 loading, error, login, consent 상태를 page 레이어에서 조합하며,
상위 route가 설계한 `oidcInteractionPage` state slice 안의 `oidcLoginForm`, `oidcConsentPanel`을 각 branch에 연결합니다.
login/consent 상호작용 이벤트는 page wrapper가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

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
| 2026-04-22 | consent state slice를 `oidcConsentPanel`로 추가하고 login/consent action을 page wrapper가 소유하도록 정리 | codex |
| 2026-04-22 | mode/client/error/missingScopes와 `oidcLoginForm`을 한 `oidcInteractionPage` state slice로 받아 분기하도록 계약을 정리 | codex |
| 2026-04-22 | login branch가 route-local state를 가진 `OidcLoginForm`을 조합하도록 page 계약을 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-25 | interaction route 시각 owner를 page 레이어로 이동 | codex |
