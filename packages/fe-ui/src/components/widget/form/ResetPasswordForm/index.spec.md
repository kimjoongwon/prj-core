# ResetPasswordForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/form/ResetPasswordForm/

## 역할

비밀번호 재설정 폼입니다. 4단계 UI를 포함합니다: validating(토큰 검증 중), invalid(토큰 만료/무효), form(비밀번호 입력), complete(변경 완료). PasswordStrengthIndicator로 비밀번호 강도를 실시간 표시합니다.

## Props

```typescript
interface ResetPasswordFormProps {
  step: ResetPasswordStep;  // "validating" | "invalid" | "form" | "complete"
  tokenError?: string | null;
  tokenEmail?: string;
  passwordRules: PasswordRule[];
  onSubmit: (data: { password: string; confirmPassword: string }) => Promise<string | null>;
  onTokenExpired?: () => void;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| AuthCard | 인증 카드 컨테이너 |
| AuthCardHeader | 새 비밀번호 설정 헤더 |
| AlertBanner | 제출 에러 메시지 |
| PasswordStrengthIndicator | 비밀번호 강도 표시 |
| HeroUI Input | 새 비밀번호, 비밀번호 확인 입력 |
| HeroUI Button | 비밀번호 변경, 다시 요청하기, 로그인하기 |
| HeroUI Link | 로그인으로 돌아가기, 비밀번호 재요청 |

## 상태 관리

로컬: password, confirmPassword, isSubmitting, submitError, isComplete (모두 useState)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
