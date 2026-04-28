# ForgotPasswordPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/ForgotPasswordPage/ForgotPasswordPage.tsx

## 역할

비밀번호 찾기 page가 상위 route가 설계한 `forgotPasswordPage` state slice를 받아
`state.forgotPasswordForm`만 `ForgotPasswordForm`에 전달하는 순수 조합 레이어입니다.
submit 이벤트는 page wrapper가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 디자인 스케치

```text
ForgotPasswordPage
- ForgotPasswordForm
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `ForgotPasswordForm` | `../../form/ForgotPasswordForm/ForgotPasswordForm` | 입력 폼 또는 AI 입력 흐름 구성 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| ForgotPasswordPageProps | 공개 계약 요소 |
| ForgotPasswordPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | 비밀번호 찾기 제출 흐름과 폼 상태 계약 정리 | codex |
| 2026-04-22 | 비밀번호 찾기 화면 상태 묶음 계약 정리 | codex |
| 2026-04-22 | 인증 폼 상태와 제출 책임 경계 정리 | codex |
| 2026-03-25 | 초기 화면 기획 수립 | codex |
