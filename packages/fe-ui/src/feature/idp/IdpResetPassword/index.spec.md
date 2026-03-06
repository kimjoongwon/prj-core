# IdpResetPassword Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/idp/IdpResetPassword/

## 역할

비밀번호 재설정 Feature 컴포넌트입니다.
ResetPasswordForm Widget에 토큰 검증 및 비밀번호 변경 API를 연결합니다.
서버에서 비밀번호 정책을 조회하여 동적으로 검증 규칙을 생성하고, 3단계(validating -> form -> invalid/success) 플로우를 관리합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[단계 1: validating - 토큰 검증 중]
┌──────────────────────────────────────────┐
│                                          │
│            ◌ 토큰 확인 중...             │
│                                          │
└──────────────────────────────────────────┘

[단계 2: form - 비밀번호 재설정 폼]
┌──────────────────────────────────────────┐
│                                          │
│           비밀번호 재설정                 │
│  user@example.com 계정의                 │
│  새 비밀번호를 설정합니다.               │
│                                          │
│  새 비밀번호                             │
│  ┌────────────────────────────────────┐  │
│  │ ••••••••••••                    👁 │  │
│  └────────────────────────────────────┘  │
│  ✔ 8자 이상   ✔ 대문자 포함             │
│  ✔ 숫자 포함  ✕ 특수문자 포함           │
│                                          │
│  비밀번호 확인                           │
│  ┌────────────────────────────────────┐  │
│  │ ••••••••••••                    👁 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │          비밀번호 변경             │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘

[단계 3: invalid - 토큰 만료/오류]
┌──────────────────────────────────────────┐
│                                          │
│               ✕ 링크 만료               │
│                                          │
│  이 링크는 더 이상 유효하지 않습니다.   │
│  비밀번호 찾기를 다시 시도해 주세요.    │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │         비밀번호 찾기로 이동        │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| validating | 스피너 + 확인 중 메시지 |
| form | 새 비밀번호/확인 입력 + 정책 체크리스트 |
| invalid | 토큰 만료 안내 + 재시도 버튼 |
| 제출 중 | 변경 버튼 로딩 상태 |
| 오류 | 에러 코드별 메시지 표시 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| API | `@cocrepo/api` > `useValidateResetToken` | 토큰 검증 API (query) |
| API | `@cocrepo/api` > `useGetPasswordPolicy` | 비밀번호 정책 조회 API (query) |
| API | `@cocrepo/api` > `useExecutePasswordReset` | 비밀번호 재설정 실행 API (mutation) |
| API Type | `@cocrepo/api` > `PasswordPolicyDto`, `ResetPasswordErrorDto` | 응답 타입 |
| Constant | `@cocrepo/constant` > `PASSWORD_RULES` | 기본 비밀번호 규칙 (정책 조회 전 기본값) |
| Type | `@cocrepo/constant` > `PasswordRule` | 비밀번호 규칙 타입 |
| Library | `axios` > `AxiosError` | 에러 응답 타입 캐스팅 |
| Widget | `ResetPasswordForm` | 비밀번호 재설정 폼 UI |

## Props

```typescript
interface IdpResetPasswordProps {
  /** 비밀번호 재설정 토큰 */
  token: string;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| (없음) | - | API 훅 + useState로 상태 관리 |

## 내부 상태

| 상태 | 타입 | 설명 |
|------|------|------|
| `step` | `ResetPasswordStep` | 현재 단계 (validating / form / invalid) |
| `tokenError` | `string \| null` | 토큰 검증 에러 메시지 |
| `tokenEmail` | `string` | 토큰에서 추출한 이메일 |
| `passwordRules` | `PasswordRule[]` | 서버 정책 기반 비밀번호 규칙 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleSubmit` | 비밀번호 변경 폼 제출 시 | useExecutePasswordReset 호출, 에러 코드별 메시지 반환 |
| (내부) `handleTokenExpired` | 토큰 만료 감지 시 | step을 "invalid"로 전환 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `ResetPasswordForm` | Widget | 비밀번호 재설정 폼 UI (단계별 화면 전환) |

## 에러 코드 매핑

| 에러 코드 | 사용자 메시지 |
|----------|-------------|
| `PASSWORD_REUSE` | 최근 사용한 비밀번호는 다시 사용할 수 없습니다. |
| `PASSWORD_POLICY_VIOLATION*` | 비밀번호가 정책 조건을 충족하지 않습니다. |
| `TOKEN_EXPIRED` | 링크가 만료되었습니다. (step을 invalid로 전환) |
| `PASSWORD_MISMATCH` | 비밀번호가 일치하지 않습니다. |

## 구현 체크리스트

- [x] IdpResetPassword.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] API 연결 (useValidateResetToken, useGetPasswordPolicy, useExecutePasswordReset)
- [x] 동적 비밀번호 규칙 생성 (buildPasswordRules)
- [x] 3단계 플로우 관리 (validating -> form -> invalid)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
