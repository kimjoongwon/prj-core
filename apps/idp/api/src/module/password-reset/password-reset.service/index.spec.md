# Password Reset Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: service
> 위치: apps/idp/api/src/module/password-reset/password-reset.service/index.ts

## 역할

비밀번호 찾기/재설정 흐름의 비즈니스 로직을 담당합니다. 재설정 토큰 생성 및 Redis 저장, 이메일 발송, 토큰 검증, 비밀번호 정책 검증, 비밀번호 재사용 방지, 실제 비밀번호 변경을 처리합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `DirectUserRepository` | 이메일로 사용자 조회 (인증용 최적화 쿼리) |
| `DirectPrismaProvider` | SecurityPolicy, PasswordHistory, User 직접 조회/변경 (RLS 우회) |
| `EmailService` | 비밀번호 재설정 이메일 발송 |
| `RedisService` | 재설정 토큰 저장/조회/삭제 (TTL 30분) |
| `ConfigService` | IDP_CLIENT_URL 환경 설정 (재설정 링크 생성) |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getPasswordPolicy` | - | `Promise<{ minLength, maxLength, requireUppercase, requireLowercase, requireNumber, requireSpecial }>` | DB에서 보안 정책 조회하여 비밀번호 정책 반환 |
| `requestReset` | email: string | `Promise<void>` | 재설정 토큰 생성 → Redis 저장 → 이메일 발송 |
| `validateToken` | rawToken: string | `Promise<TokenValidationResult>` | 토큰 해시화 후 Redis 조회로 유효성 확인 |
| `executeReset` | rawToken: string, newPassword: string | `Promise<void>` | 토큰 검증 → 정책 검증 → 재사용 확인 → 비밀번호 변경 |

## 비즈니스 규칙

### 토큰 보안

- 토큰 생성: `crypto.randomBytes(32)` → hex 문자열 (raw token)
- Redis 저장: SHA-256 해시값을 키로 사용 (raw token 노출 방지)
- 이메일 링크: raw token 포함 (`${idpClientUrl}/reset-password/{rawToken}`)
- 키 형식: `password-reset:{hashedToken}`
- TTL: 30분 (`TOKEN_TTL_SECONDS = 1800`)
- 일회용: 재설정 완료 후 즉시 토큰 삭제

### 이메일 보안

- 이메일 발송 요청 시 이메일 존재 여부 관계없이 항상 정상 처리 (열거 공격 방지)
- 비활성 계정도 동일하게 무시 처리
- 이메일 발송 실패 시 로그만 기록하고 예외 미발생

### 비밀번호 정책 검증 (executeReset)

DB `SecurityPolicy` 기준으로 검증:
- 최소 길이 (`passwordMinLength`, 기본 8)
- 최대 길이 (128자 고정)
- 영문 대문자 포함 (`requireUppercase`)
- 영문 소문자 포함 (`requireLowercase`)
- 숫자 포함 (`requireNumber`)
- 특수문자 포함 (`requireSpecial`)

위반 시 `PASSWORD_POLICY_VIOLATION: {구체적인 요구사항}` 예외 발생

### 비밀번호 재사용 방지

- 최근 5개 비밀번호 히스토리 확인 (`MAX_PASSWORD_HISTORY = 5`)
- 현재 비밀번호도 재사용 대상에 포함
- 재사용 감지 시 `PASSWORD_REUSE` 예외 발생
- 변경 성공 시 신규 비밀번호를 히스토리에 추가
- 히스토리 5개 초과 시 오래된 것부터 삭제

### 비밀번호 변경 시 처리

- `password`: 새 해시값으로 업데이트
- `passwordChangedAt`: 현재 시간
- `failedLoginAttempts`: 0으로 초기화
- `lockedUntil`: null로 해제
- `isPermanentlyLocked`: false로 해제
- `mustChangePassword`: false로 해제

## 인터페이스

### TokenValidationResult

```typescript
{
  valid: boolean;
  email?: string;    // 유효한 경우 이메일 반환
  reason?: string;   // 무효한 경우 이유 (TOKEN_EXPIRED)
}
```

## 구현 체크리스트

- [x] password-reset.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `password-reset.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | 중첩 폴더 구조에 맞게 OIDC 의존성 상대 import를 `../../oidc/*`로 보정 | codex |
