# ForgotPasswordPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/ForgotPasswordPage/ForgotPasswordPage.tsx

## 역할

비밀번호 찾기 page가 상위 route가 설계한 `forgotPasswordPage` state slice를 받아
`state.forgotPasswordForm`만 `ForgotPasswordForm`에 전달하는 순수 조합 레이어입니다.
submit 이벤트는 page wrapper가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| ForgotPasswordPageProps | 공개 계약 요소 |
| ForgotPasswordPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | page가 submit wrapper를 소유하고 `ForgotPasswordForm`은 state-only contract만 쓰도록 정리 | codex |
| 2026-04-22 | pure page가 `forgotPasswordPage.forgotPasswordForm` slice만 소비하도록 page state 계약을 중첩 구조로 정리 | codex |
| 2026-04-22 | page가 form state와 submit handler를 전달하는 `page -> form -> control` 조합으로 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-25 | forgot-password route 시각 owner를 page 레이어로 이동 | codex |
