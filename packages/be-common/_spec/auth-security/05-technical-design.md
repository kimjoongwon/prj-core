# L9-L10: 비즈니스 로직, 테스트

## L9: Logic (비즈니스 로직)

### 비밀번호 정책

**위치**: `packages/be-common/src/utils/password-policy.ts`
**공유**: 백엔드 검증 + 프론트엔드 PasswordStrengthIndicator 표시용

```typescript
interface PasswordPolicyResult {
  isValid: boolean;
  rules: Array<{
    rule: string;
    label: string;
    passed: boolean;
  }>;
}

function validatePasswordPolicy(password: string): PasswordPolicyResult {
  const rules = [
    { rule: "minLength", label: "8자 이상", test: pw => pw.length >= 8 },
    { rule: "maxLength", label: "128자 이하", test: pw => pw.length <= 128 },
    { rule: "uppercase", label: "영문 대문자 포함", test: pw => /[A-Z]/.test(pw) },
    { rule: "lowercase", label: "영문 소문자 포함", test: pw => /[a-z]/.test(pw) },
    { rule: "number", label: "숫자 포함", test: pw => /[0-9]/.test(pw) },
    { rule: "special", label: "특수문자 포함", test: pw => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pw) },
  ];

  const results = rules.map(r => ({ ...r, passed: r.test(password) }));
  return { isValid: results.every(r => r.passed), rules: results };
}
```

### 로그인 검증 로직 (InteractionService 강화)

**위치**: `apps/core/api/src/module/interaction/interaction.service.ts`

```
validateUser(email, password, ipAddress, userAgent, clientId):

  1. 사용자 조회 (DirectUserRepository.findByEmailForAuth)
     → 없으면:
        감사 로그 저장 (FAILURE, "USER_NOT_FOUND")
        return { success: false, error: "INVALID_CREDENTIALS" }
        // 사용자 존재 여부 노출 방지: 동일 에러 메시지

  2. 활성 상태 확인 (isActive)
     → 비활성이면:
        감사 로그 저장 (FAILURE, "ACCOUNT_INACTIVE")
        return { success: false, error: "INVALID_CREDENTIALS" }
        // 보안: 계정 존재 여부 노출 방지

  3. 영구 잠금 확인 (isPermanentlyLocked)
     → true면:
        감사 로그 저장 (LOCKED, "ACCOUNT_LOCKED_PERMANENT")
        return { success: false, error: "ACCOUNT_LOCKED_PERMANENT" }

  4. 일시 잠금 확인 (lockedUntil)
     → lockedUntil > now():
        감사 로그 저장 (LOCKED, "ACCOUNT_LOCKED_TEMPORARY")
        return { success: false, error: "ACCOUNT_LOCKED_TEMPORARY", lockedUntil }
     → lockedUntil <= now():
        잠금 자동 해제 (failedLoginAttempts=0, lockedUntil=null)

  5. 비밀번호 검증 (HashedPassword.compare)
     → 실패:
        failedLoginAttempts += 1

        if (failedLoginAttempts >= 10):
          isPermanentlyLocked = true
          감사 로그 저장 (LOCKED, "ACCOUNT_LOCKED_PERMANENT")
          return { success: false, error: "ACCOUNT_LOCKED_PERMANENT" }

        if (failedLoginAttempts >= 5):
          lockedUntil = now() + 15분
          감사 로그 저장 (LOCKED, "ACCOUNT_LOCKED_TEMPORARY")
          return { success: false, error: "ACCOUNT_LOCKED_TEMPORARY", lockedUntil }

        감사 로그 저장 (FAILURE, "INVALID_CREDENTIALS")
        return { success: false, error: "INVALID_CREDENTIALS",
                 remainingAttempts: 5 - failedLoginAttempts }

     → 성공:
        failedLoginAttempts = 0
        lockedUntil = null
        lastLoginAt = now()
        lastLoginIp = ipAddress
        감사 로그 저장 (SUCCESS)
        return { success: true, userId: user.id, mustChangePassword }
```

### 로그아웃 완성 로직 (Auth UseCase 강화)

**위치**: `packages/be-usecase/src/auth/logout-with-cookie.usecase.ts`

```
logoutWithCookie(accessToken, res):

  1. Access Token 디코딩 (JWT payload에서 sub, jti 추출)

  2. IDP 토큰 무효화 (Revocation Endpoint)
     POST /oidc/token/revocation
     → 실패해도 계속 진행 (best-effort)

  3. Access Token 블랙리스트 등록 (Redis)
     → tokenStorageService.addToBlacklist(accessToken)
     → 이후 이 토큰으로의 API 요청은 JwtAuthGuard에서 차단

  4. Refresh Token 삭제 (Redis)
     → tokenStorageService.deleteRefreshToken(userId)

  5. 쿠키 삭제
     → clearTokenCookies(res)        // accessToken, refreshToken
     → res.clearCookie("tenantId")
     → res.clearCookie("workspaceId")

  return true
```

### 비밀번호 재설정 로직

**위치**: `apps/core/api/src/module/password-reset/password-reset.service.ts`

```
requestReset(email):

  1. 사용자 조회 (DirectUserRepository.findByEmail)
     → 없거나 비활성이면: 조용히 종료 (return true, 이메일 미발송)
     → 보안: 이메일 존재 여부 노출 방지

  2. 토큰 생성
     const rawToken = crypto.randomBytes(32).toString("hex")
     const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

  3. Redis 저장
     SET password-reset:{hashedToken} = JSON.stringify({ userId, email })
     TTL = 30분

  4. 이메일 발송
     EmailService.sendPasswordResetEmail(email, rawToken)
     → 링크: {OIDC_INTERACTION_BASE_URL}/auth/reset-password/{rawToken}

  return true

validateToken(rawToken):

  1. 토큰 해시
     const hashedToken = SHA256(rawToken)

  2. Redis 조회
     const data = GET password-reset:{hashedToken}
     → null이면: { valid: false, reason: "TOKEN_EXPIRED" }

  3. return { valid: true, email: data.email }

executeReset(rawToken, newPassword):

  1. 토큰 검증 + 데이터 조회
     → 만료/미존재면 에러

  2. 비밀번호 정책 검증
     validatePasswordPolicy(newPassword)
     → 미달이면 에러

  3. 이전 비밀번호 재사용 확인
     PasswordHistory에서 최근 5개 해시 조회
     각각 bcrypt.compare(newPassword, hash)
     → 매칭되면 에러 "PASSWORD_REUSE"

  4. 비밀번호 변경
     const hashed = await bcrypt.hash(newPassword, saltRounds)
     UPDATE User SET password=hashed, passwordChangedAt=now(),
                     failedLoginAttempts=0, lockedUntil=null,
                     isPermanentlyLocked=false, mustChangePassword=false

  5. 이전 비밀번호 히스토리 저장
     INSERT PasswordHistory (userId, passwordHash=hashed)
     5개 초과 시 가장 오래된 것 삭제

  6. Redis 토큰 삭제 (일회용)
     DEL password-reset:{hashedToken}

  7. 전체 세션 무효화
     Redis에서 해당 사용자의 모든 OIDC Grant 폐기
     → oidc:*:grant:* 패턴으로 찾아서 삭제
     Account 캐시 무효화
     → DEL oidc:account:{userId}

  return true
```

### 세션 조회 로직

**위치**: `packages/be-usecase/src/auth/refresh-token-with-idp.usecase.ts`, 외부 OIDC 호출은 `packages/be-client/src/oidc.client.ts`

```
getMySession(userId, currentAccessToken):

  1. Redis에서 해당 사용자의 OIDC Session 조회
     → SCAN으로 oidc:Session:* 패턴에서 accountId === userId인 것 필터
     → 또는 Grant를 통해 연결된 Session 조회

  2. 각 세션에서 정보 추출:
     - grantId
     - userAgent → ua-parser-js로 파싱 (deviceType, browser, os)
     - ip (세션 생성 시 저장된 IP)
     - lastActivity (마지막 토큰 발급 시간)
     - isCurrent (현재 Access Token의 Grant와 일치 여부)

  3. SessionInfo[] 반환
```

### 이메일 서비스

**위치**: `packages/be-service/src/email/email.service.ts`

```typescript
@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.username, pass: smtp.password },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${idpClientUrl}/reset-password/${token}`;
    await this.transporter.sendMail({
      from: smtp.sender,
      to: email,
      subject: "비밀번호 재설정 안내",
      html: passwordResetTemplate(resetUrl), // 30분 유효, 본인이 아닌 경우 무시 안내
    });
  }

  async sendTemporaryPasswordEmail(email: string, tempPassword: string): Promise<void> {
    await this.transporter.sendMail({
      from: smtp.sender,
      to: email,
      subject: "임시 비밀번호 발급 안내",
      html: tempPasswordTemplate(tempPassword), // 즉시 변경 안내
    });
  }
}
```

### 비밀번호 만료 확인 로직 (Phase 4)

**위치**: main server 미들웨어 또는 인터셉터

```
checkPasswordExpiry(user):

  const PASSWORD_MAX_AGE_DAYS = 90;
  const WARNING_DAYS = 7;

  if (!user.passwordChangedAt):
    return { expired: true }  // 한 번도 변경 안 함

  const daysSinceChange = diffInDays(now(), user.passwordChangedAt)

  if (daysSinceChange >= PASSWORD_MAX_AGE_DAYS):
    return { expired: true }

  if (daysSinceChange >= PASSWORD_MAX_AGE_DAYS - WARNING_DAYS):
    const daysRemaining = PASSWORD_MAX_AGE_DAYS - daysSinceChange
    return { expiringSoon: true, daysRemaining }

  return { ok: true }
```

---

## L10: Test (테스트 시나리오)

### Phase 1: 로그인 강화 + 로그아웃

#### 유닛 테스트: InteractionService

```
describe("로그인 검증", () => {
  describe("정상 로그인", () => {
    it("올바른 이메일/비밀번호로 로그인하면 성공을 반환해야 한다")
    it("로그인 성공 시 failedLoginAttempts를 0으로 리셋해야 한다")
    it("로그인 성공 시 lastLoginAt과 lastLoginIp를 업데이트해야 한다")
    it("로그인 성공 시 감사 로그에 SUCCESS를 기록해야 한다")
  })

  describe("실패 제한", () => {
    it("잘못된 비밀번호로 1회 실패하면 남은 시도 4회를 반환해야 한다")
    it("4회 연속 실패 후 남은 시도 1회를 반환해야 한다")
    it("5회 연속 실패 시 15분 일시 잠금을 설정해야 한다")
    it("10회 연속 실패 시 영구 잠금을 설정해야 한다")
    it("일시 잠금 중 로그인 시도하면 ACCOUNT_LOCKED_TEMPORARY를 반환해야 한다")
    it("영구 잠금 중 로그인 시도하면 ACCOUNT_LOCKED_PERMANENT를 반환해야 한다")
    it("일시 잠금 시간 경과 후 자동으로 잠금이 해제되어야 한다")
    it("잠금 자동 해제 시 failedLoginAttempts가 0으로 리셋되어야 한다")
  })

  describe("보안", () => {
    it("존재하지 않는 이메일로 로그인 시 INVALID_CREDENTIALS를 반환해야 한다")
    it("비활성 계정으로 로그인 시 INVALID_CREDENTIALS를 반환해야 한다 (존재 노출 방지)")
    it("모든 실패 시 감사 로그가 기록되어야 한다")
  })
})
```

#### 유닛 테스트: Auth UseCase (로그아웃)

```
describe("로그아웃", () => {
  it("IDP Revocation Endpoint를 호출해야 한다")
  it("Access Token을 블랙리스트에 추가해야 한다")
  it("Refresh Token을 Redis에서 삭제해야 한다")
  it("모든 인증 쿠키를 삭제해야 한다 (accessToken, refreshToken, tenantId, workspaceId)")
  it("IDP Revocation 실패해도 쿠키는 삭제되어야 한다 (best-effort)")
})
```

### Phase 2: 비밀번호 관리

#### 유닛 테스트: 비밀번호 정책

```
describe("비밀번호 정책", () => {
  it("모든 규칙을 충족하면 유효해야 한다 - 예: 'Test1234!@'")
  it("8자 미만이면 실패해야 한다")
  it("128자 초과면 실패해야 한다")
  it("대문자 없으면 실패해야 한다")
  it("소문자 없으면 실패해야 한다")
  it("숫자 없으면 실패해야 한다")
  it("특수문자 없으면 실패해야 한다")
  it("각 규칙별 통과/미달 상태를 반환해야 한다")
})
```

#### 유닛 테스트: 비밀번호 재설정

```
describe("비밀번호 재설정 요청", () => {
  it("존재하는 이메일로 요청하면 토큰을 Redis에 저장해야 한다 (TTL 30분)")
  it("존재하는 이메일로 요청하면 이메일을 발송해야 한다")
  it("존재하지 않는 이메일로 요청해도 에러 없이 성공해야 한다 (보안)")
  it("비활성 계정 이메일로 요청해도 에러 없이 성공해야 한다 (보안)")
})

describe("재설정 토큰 검증", () => {
  it("유효한 토큰은 valid: true와 이메일을 반환해야 한다")
  it("만료된 토큰은 valid: false, reason: TOKEN_EXPIRED를 반환해야 한다")
  it("존재하지 않는 토큰은 valid: false를 반환해야 한다")
})

describe("비밀번호 재설정 실행", () => {
  it("유효한 토큰과 정책 충족 비밀번호로 변경이 성공해야 한다")
  it("토큰 사용 후 Redis에서 삭제되어야 한다 (일회용)")
  it("비밀번호 변경 후 모든 OIDC 세션이 무효화되어야 한다")
  it("정책 미달 비밀번호는 거부되어야 한다")
  it("최근 5개 비밀번호와 동일하면 거부되어야 한다")
  it("변경 후 PasswordHistory에 새 해시가 저장되어야 한다")
  it("PasswordHistory가 5개 초과 시 가장 오래된 것이 삭제되어야 한다")
})
```

#### 유닛 테스트: 비밀번호 변경

```
describe("비밀번호 변경", () => {
  it("현재 비밀번호가 올바르면 변경이 성공해야 한다")
  it("현재 비밀번호가 틀리면 CURRENT_PASSWORD_INCORRECT를 반환해야 한다")
  it("정책 미달 새 비밀번호는 거부되어야 한다")
  it("이전 비밀번호 재사용 시 PASSWORD_REUSE를 반환해야 한다")
  it("logoutOtherDevices=true 시 다른 세션이 무효화되어야 한다")
  it("logoutOtherDevices=false 시 다른 세션이 유지되어야 한다")
  it("passwordChangedAt이 업데이트되어야 한다")
})
```

### Phase 3: 세션 관리 + 관리자

#### 유닛 테스트: 세션 관리

```
describe("내 세션 목록", () => {
  it("현재 사용자의 활성 세션 목록을 반환해야 한다")
  it("현재 세션에 isCurrent: true가 설정되어야 한다")
  it("각 세션에 deviceType, browser, os, ip, lastActivity가 포함되어야 한다")
})

describe("세션 종료", () => {
  it("특정 Grant의 세션을 폐기해야 한다")
  it("현재 세션은 종료할 수 없어야 한다")
  it("다른 모든 세션 종료 시 현재 세션은 유지되어야 한다")
  it("다른 모든 세션 종료 시 폐기된 세션 수를 반환해야 한다")
})
```

#### 유닛 테스트: 관리자 보안 API

```
describe("감사 로그 조회", () => {
  it("전체 감사 로그를 페이지네이션으로 반환해야 한다")
  it("이메일로 필터링이 동작해야 한다")
  it("결과(SUCCESS/FAILURE/LOCKED)로 필터링이 동작해야 한다")
  it("날짜 범위 필터링이 동작해야 한다")
  it("PLATFORM_ADMIN이 아닌 사용자는 403이어야 한다")
})

describe("계정 잠금 해제", () => {
  it("잠긴 계정을 해제해야 한다 (failedLoginAttempts=0, lockedUntil=null, isPermanentlyLocked=false)")
  it("이미 잠금 해제된 계정에 대해서도 에러 없이 성공해야 한다")
  it("PLATFORM_ADMIN이 아닌 사용자는 403이어야 한다")
})

describe("비밀번호 강제 재설정", () => {
  it("임시 비밀번호를 생성하고 이메일로 발송해야 한다")
  it("mustChangePassword를 true로 설정해야 한다")
  it("기존 비밀번호 해시를 히스토리에 저장해야 한다")
  it("PLATFORM_ADMIN이 아닌 사용자는 403이어야 한다")
})

describe("전체 세션 무효화", () => {
  it("해당 사용자의 모든 OIDC Grant를 폐기해야 한다")
  it("폐기된 세션 수를 반환해야 한다")
  it("PLATFORM_ADMIN이 아닌 사용자는 403이어야 한다")
})
```

### 프론트엔드 테스트

```
describe("PasswordStrengthIndicator", () => {
  it("빈 비밀번호에서 모든 규칙이 미달 표시되어야 한다")
  it("모든 규칙 충족 시 모든 항목이 통과 표시되어야 한다")
  it("각 규칙이 독립적으로 통과/미달 표시되어야 한다")
})

describe("LoginForm 강화", () => {
  it("실패 시 남은 시도 횟수가 표시되어야 한다")
  it("일시 잠금 시 AlertBanner와 잠금 해제 시간이 표시되어야 한다")
  it("영구 잠금 시 비밀번호 재설정/관리자 문의 링크가 표시되어야 한다")
  it("비밀번호를 잊으셨나요 링크가 /forgot-password로 이동해야 한다")
})

describe("ForgotPasswordForm", () => {
  it("이메일 제출 후 발송 완료 메시지가 표시되어야 한다")
  it("다시 보내기 클릭 시 재발송이 동작해야 한다")
  it("로그인으로 돌아가기 링크가 동작해야 한다")
})

describe("ResetPasswordForm", () => {
  it("유효한 토큰이면 비밀번호 입력 폼이 표시되어야 한다")
  it("만료된 토큰이면 만료 메시지와 다시 요청 링크가 표시되어야 한다")
  it("비밀번호 입력 중 PasswordStrengthIndicator가 업데이트되어야 한다")
  it("비밀번호 불일치 시 에러 메시지가 표시되어야 한다")
})

describe("SessionCard", () => {
  it("현재 세션에 🟢 이 기기 표시가 되어야 한다")
  it("현재 세션에는 종료 버튼이 없어야 한다")
  it("다른 세션에는 종료 버튼이 있어야 한다")
  it("디바이스 타입에 따라 적절한 아이콘이 표시되어야 한다")
})
```

---

## 구현 순서 상세

### Phase 1: 로그인 강화 + 로그아웃 완성

```
1. User 모델 확장 (failedLoginAttempts, lockedUntil, isPermanentlyLocked, lastLoginAt, lastLoginIp, isActive)
2. AuthAuditLog 모델 + Prisma migrate
3. DirectUserRepository 확장 (잠금 관리 메서드)
4. InteractionService 로그인 검증 강화 (실패 제한 + 잠금 + 감사 로그)
5. Auth UseCase 로그아웃 강화 (블랙리스트 + Refresh Token 삭제)
6. LoginForm UI 수정 (남은 시도, 잠금 배너, 비밀번호 찾기 링크)
7. Axios 인터셉터 세션 만료 메시지 개선
```

### Phase 2: 비밀번호 관리

```
8. 비밀번호 정책 유틸 (packages/be-common)
9. PasswordHistory 모델 + Prisma migrate
10. 이메일 서비스 (packages/be-service, Nodemailer + SMTP)
11. PasswordResetModule (idp-server: 요청/검증/실행)
12. PasswordStrengthIndicator 위젯 (packages/fe-ui)
13. /forgot-password 페이지 (idp-client)
14. /reset-password/[token] 페이지 (idp-client)
15. 비밀번호 변경 API (main server)
16. /my-account/change-password 페이지 (admin)
```

### Phase 3: 세션 관리 + 관리자 도구

```
17. 내 세션 목록 API (main server, Redis OIDC 세션 조회)
18. 세션 종료 API (main server)
19. SessionCard 위젯 + /my-sessions 페이지 (admin)
20. 감사 로그 조회 API (main server, PLATFORM_ADMIN)
21. 감사 결과 ChipCell 매핑 + UserAgentCell (packages/fe-ui)
22. /auth-audit-logs 페이지 (admin)
23. 계정 잠금 해제 API (main server)
24. 비밀번호 강제 재설정 API (main server)
25. 사용자 전체 세션 무효화 API (main server)
26. SecurityInfoPanel + UserSecurityActions (packages/fe-ui)
27. 사용자 상세 보안 탭 (admin)
```

### Phase 4: 비밀번호 라이프사이클

```
28. mustChangePassword 플래그 + 첫 로그인 변경 강제
29. /change-password 페이지 (idp-client)
30. 비밀번호 만료 체크 미들웨어 (main server)
31. 만료 경고 배너 (admin 레이아웃)
32. 만료 시 변경 강제 리다이렉트
```

---

## 수정 대상 핵심 파일

### Phase 1

| 파일 | 변경 |
|------|------|
| `packages/be-prisma/schema/identity/user.prisma` | User 확장 + AuthAuditLog 추가 |
| `apps/core/api/src/module/oidc/direct-user.repository.ts` | 잠금 관리 메서드 추가 |
| `apps/core/api/src/module/interaction/interaction.service.ts` | 로그인 검증 강화 |
| `packages/be-controller/src/interaction/interaction.controller.ts` | 에러 응답 포맷 변경 |
| `packages/be-usecase/src/auth/logout-with-cookie.usecase.ts` | logoutWithCookie 강화 |
| `apps/admin/web/src/app/auth/(flow)/interaction/[uid]/page.tsx` | 잠금 UI, 남은 시도, 링크 |

### Phase 2

| 파일 | 변경 |
|------|------|
| `packages/be-prisma/schema/identity/user.prisma` | PasswordHistory 추가 |
| `packages/be-common/src/utils/password-policy.ts` | 신규 |
| `packages/be-service/src/email/email.service.ts` | 신규 |
| `apps/core/api/src/module/password-reset/` | 신규 모듈 |
| `apps/admin/web/src/app/auth/(flow)/forgot-password/` | 신규 페이지 |
| `apps/admin/web/src/app/auth/(flow)/reset-password/[token]/` | 신규 페이지 |
| `packages/fe-ui/src/widget/PasswordStrengthIndicator/` | 신규 |
| `apps/admin/web/src/app/(admin)/my-account/change-password/` | 신규 페이지 |

### Phase 3

| 파일 | 변경 |
|------|------|
| `packages/be-controller/src/auth/auth.controller.ts` | 세션/감사로그/관리 API 추가 |
| `packages/fe-ui/src/widget/SessionCard/` | 신규 |
| `packages/fe-ui/src/widget/SecurityInfoPanel/` | 신규 |
| `packages/fe-ui/src/data-grid/columns/data-grid/idpColumns.tsx` | 감사 결과 ChipCell 매핑 |
| `packages/fe-ui/src/cell/UserAgentCell/` | 신규 |
| `apps/admin/web/src/app/(admin)/my-sessions/` | 신규 페이지 |
| `apps/admin/web/src/app/(admin)/auth-audit-logs/` | 신규 페이지 |
