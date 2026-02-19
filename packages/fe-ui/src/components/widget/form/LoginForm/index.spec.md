# LoginForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/form/LoginForm/

## 역할

이메일과 비밀번호 입력 필드를 제공하는 간단한 로그인 폼입니다. state 객체를 직접 받아 Input 컴포넌트의 path 바인딩을 사용합니다.

## Props

```typescript
interface LoginFormProps {
  state: {
    email: string;
    password: string;
  };
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| Input (커스텀, path 바인딩) | 이메일 입력 (type="email"), 비밀번호 입력 (type="password") |
| VStack | 레이아웃 |

## 상태 관리

**없음** (외부에서 state 객체를 관리)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
