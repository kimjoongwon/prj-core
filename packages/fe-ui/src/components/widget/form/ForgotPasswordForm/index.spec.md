# ForgotPasswordForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/form/ForgotPasswordForm/

## 역할

비밀번호 찾기 폼입니다. 이메일 입력 단계와 발송 완료 단계의 2단계 UI를 포함합니다. 발송 완료 시 "다시 보내기" 기능을 제공합니다.

## Props

```typescript
interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<string | null>;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| AuthCard | 인증 카드 컨테이너 |
| AuthCardHeader | 아이콘 + 제목 + 부제목 헤더 |
| AlertBanner | 에러 메시지 표시 |
| HeroUI Input | 이메일 입력 (type="email") |
| HeroUI Button | 재설정 링크 보내기, 다시 보내기 |
| HeroUI Link | 로그인으로 돌아가기 |

## 상태 관리

로컬: email (useState), isSubmitting (useState), isSubmitted (useState), error (useState)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
