# Interaction Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-13
> 타입: service
> 위치: apps/idp/api/src/module/interaction/interaction.service/index.ts

## 역할

OIDC Interaction 흐름(로그인, 동의, 취소)의 비즈니스 로직을 담당합니다. 사용자 이메일/비밀번호 인증, 로그인 실패 제한 및 계정 잠금, 감사 로그 기록, oidc-provider와의 상호작용 결과 처리를 수행합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `DirectUserRepository` | 인증용 사용자 조회, 로그인 성공/실패 업데이트, 감사 로그 생성 |
| `OidcProviderService` | oidc-provider 인스턴스 획득 (interactionDetails, interactionResult, Grant) |
| `DirectPrismaProvider` | SecurityPolicy 직접 조회 (RLS 우회 Prisma 클라이언트) |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getInteractionDetails` | req, res (KoaLike) | `Promise<Interaction>` | oidc-provider에서 인터랙션 상세 조회 |
| `findClient` | clientId: string | `Promise<OidcClientInfo \| undefined>` | oidc-provider에서 클라이언트 정보 조회 |
| `validateUser` | email, password, ipAddress, userAgent?, clientId? | `Promise<LoginValidationResult>` | 이메일/비밀번호 인증 + 잠금 처리 + 감사 로그 |
| `completeLogin` | req, res, accountId, remember | `Promise<InteractionResult>` | 로그인 성공 결과를 oidc-provider에 전달 |
| `processConsent` | req, res | `Promise<InteractionResult>` | 동의 Grant를 생성/저장하고 결과를 oidc-provider에 전달 |
| `abortInteraction` | req, res | `Promise<InteractionResult>` | access_denied 에러와 함께 인터랙션 중단 |

## 비즈니스 규칙

### 사용자 인증 흐름 (validateUser)

1. 이메일로 사용자 조회 → 미존재 시 `INVALID_CREDENTIALS` (사용자 존재 여부 노출 방지)
2. `isActive === false` 확인 → `INVALID_CREDENTIALS` 반환
3. `isPermanentlyLocked === true` 확인 → `ACCOUNT_LOCKED_PERMANENT` 반환
4. `lockedUntil > now` 확인 → `ACCOUNT_LOCKED_TEMPORARY` 반환; 시간 경과 시 자동 해제
5. 비밀번호 bcrypt 검증 → 실패 시 `handleLoginFailure` 호출
6. 성공 시 `updateLoginSuccess` 및 감사 로그 기록 후 `{ success: true, userId, mustChangePassword }` 반환

### 로그인 실패 처리 (handleLoginFailure)

- 실패 횟수 증가 후 보안 정책 임계값과 비교:
  - `newAttempts >= permanentLockThreshold`: 영구 잠금 설정
  - `newAttempts >= temporaryLockThreshold`: `lockedUntil = now + temporaryLockDurationMs` 설정
  - 그 외: 잔여 시도 횟수 반환
- 감사 로그에 실패 원인 기록 (`INVALID_CREDENTIALS`, `ACCOUNT_LOCKED_TEMPORARY`, `ACCOUNT_LOCKED_PERMANENT`)

### 보안 정책 캐시

- `SecurityPolicy` 테이블에서 `key = "default"` 레코드 조회
- 인메모리 캐시 TTL: 5분 (`POLICY_CACHE_TTL_MS = 300000`)
- 기본값: temporaryLockThreshold=5, permanentLockThreshold=10, temporaryLockDurationMs=15분

### 동의(Consent) 처리

- 기존 grantId가 있으면 기존 Grant를 로드하여 확장, 없으면 신규 Grant 생성
- 누락된 OIDC scope 및 resource scope를 Grant에 추가 후 저장
- `mergeWithLastSubmission: true`로 기존 제출 내용과 병합

### 인터랙션 취소

- `error: "access_denied"`, `error_description: "End-User aborted interaction"` 반환
- `mergeWithLastSubmission: false`로 이전 제출 내용 무시

## 인터페이스

### LoginValidationResult

```typescript
{
  success: boolean;
  userId?: string;
  mustChangePassword?: boolean;
  error?: string;            // INVALID_CREDENTIALS | ACCOUNT_LOCKED_TEMPORARY | ACCOUNT_LOCKED_PERMANENT
  remainingAttempts?: number;
  lockedUntil?: Date;
  temporaryLockThreshold?: number;
  temporaryLockDurationMin?: number;
}
```

## 구현 체크리스트

- [x] interaction.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `interaction.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | 중첩 폴더 구조에 맞게 OIDC 의존성 상대 import를 `../../oidc/*`로 보정하고 resource scope 순회 타입을 명시 | codex |
