# ForgotPasswordScreen ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/screen/ForgotPasswordScreen/ForgotPasswordScreen.tsx

## 역할

비밀번호 찾기 page가 상위 route가 설계한 `forgotPasswordPage` state slice를 받아
`state.forgotPasswordForm`만 `ForgotPasswordForm`에 전달하는 순수 조합 레이어입니다.
submit 이벤트는 page wrapper가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 디자인 스케치

```text
ForgotPasswordScreen
- ForgotPasswordForm
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `ForgotPasswordForm` | `../../form/ForgotPasswordForm/ForgotPasswordForm` | 입력 폼 또는 AI 입력 흐름 구성 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| ForgotPasswordScreenProps | 공개 계약 요소 |
| ForgotPasswordScreen | 공개 계약 요소 |