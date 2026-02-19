# OidcLoginForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/form/OidcLoginForm/

## 역할

OIDC 로그인 폼입니다. 이메일/비밀번호 입력, 로그인 상태 유지, 비밀번호 찾기 링크를 포함합니다. 로그인 실패 시 잔여 시도 횟수를 표시하고, 계정 잠금(일시/영구) 상태를 배너로 안내합니다. DEV 모드에서는 기본 계정이 자동 입력됩니다.

## Props

```typescript
interface OidcLoginFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    remember: boolean;
  }) => Promise<LoginErrorResponse | null>;
  onAbort: () => void;
  client?: {
    clientId: string;
    clientName: string;
    logoUri?: string;
  } | null;
  isDev?: boolean;  // 기본값: false
}

interface LoginErrorResponse {
  error: string;
  remainingAttempts?: number;
  lockedUntil?: string;
  temporaryLockThreshold?: number;
  temporaryLockDurationMin?: number;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| AuthCard | 인증 카드 컨테이너 |
| AuthCardHeader | 로그인 아이콘 + 클라이언트명 헤더 |
| AlertBanner | DEV 모드 경고, 잠금 안내, 에러 메시지 |
| HeroUI Input | 이메일, 비밀번호 입력 |
| HeroUI Checkbox | 로그인 상태 유지 |
| HeroUI Button | 로그인 버튼 |
| HeroUI Link | 비밀번호 찾기, 비밀번호 재설정 |

## 상태 관리

로컬: email, password, remember, error, isSubmitting, isLocked (모두 useState)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
