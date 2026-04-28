# ResetPasswordPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/ResetPasswordPage/ResetPasswordPage.tsx

## 역할

비밀번호 재설정 page가 상위 route가 설계한 `resetPasswordPage` state slice를 받아
`resetPasswordStep`, `tokenError`, `tokenEmail`, `passwordRules`, `resetPasswordForm`을 조합해
`ResetPasswordForm`에 전달하는 순수 레이어입니다.
submit 이벤트는 page wrapper가 소유하고 child form에는 handler props를 직접 전달하지 않습니다.

## 디자인 스케치

```text
ResetPasswordPage
- ResetPasswordForm
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `ResetPasswordForm` | `../../form/ResetPasswordForm/ResetPasswordForm` | 입력 폼 또는 AI 입력 흐름 구성 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| ResetPasswordPageProps | 공개 계약 요소 |
| ResetPasswordPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | 비밀번호 재설정 제출 흐름과 폼 상태 계약 정리 | codex |
| 2026-04-22 | 비밀번호 재설정 단계, 토큰, 정책 상태 계약 정리 | codex |
| 2026-04-22 | 인증 폼 상태와 제출 책임 경계 정리 | codex |
| 2026-03-25 | 초기 화면 기획 수립 | codex |
