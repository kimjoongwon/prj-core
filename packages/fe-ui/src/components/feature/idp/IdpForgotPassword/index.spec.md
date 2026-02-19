# IdpForgotPassword Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/idp/IdpForgotPassword/

## 역할

비밀번호 찾기(재설정 요청) Feature 컴포넌트입니다.
ForgotPasswordForm Widget에 비밀번호 재설정 요청 API 호출 로직을 연결합니다.
사용자가 이메일을 입력하면 서버에 재설정 링크 발송을 요청합니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| API | `@cocrepo/api` > `useRequestPasswordReset` | 비밀번호 재설정 요청 API (mutation) |
| Widget | `ForgotPasswordForm` | 비밀번호 찾기 폼 UI |

## Props

```typescript
// Props 없음
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| (없음) | - | API 훅을 직접 사용 (Store 불필요) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleSubmit` | 폼 제출 시 | useRequestPasswordReset 호출, 에러 시 메시지 반환 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `ForgotPasswordForm` | Widget | 이메일 입력 폼 UI |

## 구현 체크리스트

- [x] IdpForgotPassword.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] API 연결 (useRequestPasswordReset)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
