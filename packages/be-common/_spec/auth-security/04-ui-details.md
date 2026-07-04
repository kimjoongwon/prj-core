# L7-L8: 데이터 모델, UI 컴포넌트

## L7: Entity (데이터 모델)

### User 모델 확장

```prisma
model User {
  // ... 기존 필드 유지 ...

  // 인증 보안 (신규 필드)
  failedLoginAttempts   Int       @default(0) @map("failed_login_attempts")
  lockedUntil           DateTime? @map("locked_until") @db.Timestamptz(6)
  isPermanentlyLocked   Boolean   @default(false) @map("is_permanently_locked")
  mustChangePassword    Boolean   @default(false) @map("must_change_password")
  passwordChangedAt     DateTime? @map("password_changed_at") @db.Timestamptz(6)
  lastLoginAt           DateTime? @map("last_login_at") @db.Timestamptz(6)
  lastLoginIp           String?   @map("last_login_ip")
  isActive              Boolean   @default(true) @map("is_active")

  // 관계 (신규)
  passwordHistory       PasswordHistory[]
  authAuditLogs         AuthAuditLog[]
}
```

**필드 설명**:

| 필드 | 용도 | 여정 |
|------|------|------|
| `failedLoginAttempts` | 연속 실패 횟수 (0으로 리셋 조건: 성공, 잠금 해제) | 여정 2 |
| `lockedUntil` | 일시 잠금 해제 시각 (null=잠금 아님, 미래=잠김) | 여정 2 |
| `isPermanentlyLocked` | 영구 잠금 여부 (관리자만 해제 가능) | 여정 2 |
| `mustChangePassword` | 다음 로그인 시 비밀번호 변경 강제 | 여정 1 |
| `passwordChangedAt` | 마지막 비밀번호 변경 시각 (만료 계산용) | 여정 7 |
| `lastLoginAt` | 마지막 성공 로그인 시각 | 여정 9 |
| `lastLoginIp` | 마지막 성공 로그인 IP | 여정 9 |
| `isActive` | 계정 활성 상태 (비활성 시 로그인 불가) | 여정 2 |

### 신규: AuthAuditLog

```prisma
model AuthAuditLog {
  id            String          @id @default(uuid())
  createdAt     DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)

  email         String
  userId        String?         @map("user_id")
  result        AuthAuditResult
  failureReason String?         @map("failure_reason")
  ipAddress     String          @map("ip_address")
  userAgent     String?         @map("user_agent")
  clientId      String?         @map("client_id")

  // 관계
  user          User?           @relation(fields: [userId], references: [id])

  @@index([email])
  @@index([userId])
  @@index([createdAt])
  @@index([result])
  @@map("auth_audit_logs")
}

enum AuthAuditResult {
  SUCCESS
  FAILURE
  LOCKED
}
```

**저장 시점**: 모든 로그인 시도 (성공/실패/잠금)
**failureReason 예시**: `INVALID_CREDENTIALS`, `ACCOUNT_LOCKED_TEMPORARY`, `ACCOUNT_LOCKED_PERMANENT`, `ACCOUNT_INACTIVE`, `USER_NOT_FOUND`

### 신규: PasswordHistory (이전 비밀번호 재사용 방지)

```prisma
model PasswordHistory {
  id            String   @id @default(uuid())
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  userId        String   @map("user_id")
  passwordHash  String   @map("password_hash")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("password_histories")
}
```

**규칙**: 최근 5개 보관. 비밀번호 변경/재설정 시 비교 후 저장

### Redis 키 구조 (신규/변경)

| 키 패턴 | 용도 | TTL | Phase |
|---------|------|-----|-------|
| `password-reset:{hashedToken}` | 비밀번호 재설정 토큰 → `{userId, email}` | 30분 | Phase 2 |
| `blacklist:{tokenHash}` | Access Token 블랙리스트 (기존, 이제 실제 사용) | AT 남은 TTL | Phase 1 |

**기존 키 (변경 없음)**:
- `oidc:{modelType}:{id}` - OIDC 세션/토큰
- `refresh:{userId}` - Refresh Token
- `oidc:state:{state}` - OIDC State + PKCE

---

## L8: Component (UI 컴포넌트)

### 공통 위젯 (packages/fe-ui)

#### PasswordStrengthIndicator

| 항목 | 내용 |
|------|------|
| **유형** | Widget |
| **위치** | `packages/fe-ui/src/widget/PasswordStrengthIndicator/` |
| **용도** | 비밀번호 정책 실시간 검증 표시 |
| **사용 위치** | 비밀번호 재설정, 비밀번호 변경, 첫 로그인 변경 |

```tsx
interface PasswordStrengthIndicatorProps {
  password: string;
}

// 표시할 규칙
const rules = [
  { label: "8자 이상", test: (pw) => pw.length >= 8 },
  { label: "영문 대문자 포함", test: (pw) => /[A-Z]/.test(pw) },
  { label: "영문 소문자 포함", test: (pw) => /[a-z]/.test(pw) },
  { label: "숫자 포함", test: (pw) => /[0-9]/.test(pw) },
  { label: "특수문자 포함", test: (pw) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pw) },
];

// 각 규칙: ✅ (통과, text-success) / ❌ (미달, text-default-400)
```

#### AuthAlertBanner

| 항목 | 내용 |
|------|------|
| **유형** | Widget |
| **위치** | `packages/fe-ui/src/widget/AuthAlertBanner/` |
| **용도** | 인증 관련 경고/에러 배너 |
| **사용 위치** | 로그인 (잠금 메시지), 비밀번호 만료 경고 |

```tsx
interface AuthAlertBannerProps {
  type: "warning" | "error" | "info";
  message: string;
  actions?: Array<{ label: string; onPress: () => void }>;
  dismissible?: boolean;
}
```

#### SessionCard

| 항목 | 내용 |
|------|------|
| **유형** | Widget |
| **위치** | `packages/fe-ui/src/widget/SessionCard/` |
| **용도** | 세션 정보 카드 (기기, 브라우저, IP, 마지막 활동) |
| **사용 위치** | 내 세션 관리 |

```tsx
interface SessionCardProps {
  isCurrent?: boolean;           // 현재 세션 여부 (🟢 표시)
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browser: string;               // "Chrome 120"
  os: string;                    // "macOS Sonoma"
  ipAddress: string;
  lastActivity: string;          // ISO datetime
  onRevoke?: () => void;         // 세션 종료 핸들러 (현재 세션은 없음)
}
```

### Cell 컴포넌트 (packages/fe-ui)

#### 감사 결과 ChipCell 표시

| 항목 | 내용 |
|------|------|
| **위치** | `packages/fe-ui/src/data-grid/columns/data-grid/idpColumns.tsx` |
| **용도** | 감사 로그 결과를 `ChipCell` label/color 매핑으로 표시 |

```tsx
// SUCCESS → Chip color="success" "성공"
// FAILURE → Chip color="danger" "실패"
// LOCKED  → Chip color="warning" "잠금"
```

#### UserAgentCell

| 항목 | 내용 |
|------|------|
| **위치** | `packages/fe-ui/src/cell/UserAgentCell/` |
| **용도** | User Agent 파싱하여 브라우저/OS 표시 |

```tsx
// "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
// → "Chrome 120 · macOS" (아이콘 + 텍스트)
```

**UA 파싱**: `ua-parser-js` 라이브러리 사용 (경량, 프론트엔드용)

### IDP Client Feature 컴포넌트

#### ForgotPasswordForm

| 항목 | 내용 |
|------|------|
| **위치** | `apps/admin/web/src/app/auth/(flow)/forgot-password/` |
| **용도** | 비밀번호 찾기 이메일 입력 + 발송 확인 |

**상태**:
- `idle` → 이메일 입력 폼
- `sending` → 발송 중 (버튼 로딩)
- `sent` → 발송 완료 메시지 (다시 보내기 링크)

#### ResetPasswordForm

| 항목 | 내용 |
|------|------|
| **위치** | `apps/admin/web/src/app/auth/(flow)/reset-password/[token]/` |
| **용도** | 새 비밀번호 입력 + 정책 검증 |

**상태**:
- `validating` → 토큰 검증 중 (로딩)
- `valid` → 비밀번호 입력 폼 + PasswordStrengthIndicator
- `expired` → 만료 메시지 + 다시 요청 링크
- `used` → 이미 사용된 토큰 메시지

### Admin Feature 컴포넌트 (packages/fe-ui)

#### ChangePasswordForm

| 항목 | 내용 |
|------|------|
| **위치** | `packages/fe-ui/src/feature/ChangePasswordForm/` |
| **용도** | 비밀번호 변경 폼 (현재/새/확인 + 정책 검증) |

```tsx
interface ChangePasswordFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string; logoutOtherDevices: boolean }) => void;
  isLoading?: boolean;
}
```

#### SecurityInfoPanel

| 항목 | 내용 |
|------|------|
| **위치** | `packages/fe-ui/src/widget/SecurityInfoPanel/` |
| **용도** | 사용자 보안 정보 표시 (관리자용) |

```tsx
interface SecurityInfoPanelProps {
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  isPermanentlyLocked: boolean;
  passwordChangedAt: string | null;
}
```

#### UserSecurityActions

| 항목 | 내용 |
|------|------|
| **위치** | `packages/fe-ui/src/feature/UserSecurityActions/` |
| **용도** | 관리자 보안 액션 버튼 그룹 |

```tsx
interface UserSecurityActionsProps {
  userId: string;
  isLocked: boolean;
  onUnlock: () => void;
  onForceResetPassword: () => void;
  onInvalidateSessions: () => void;
}
```

### 컴포넌트 목록 요약

| Phase | 유형 | 이름 | 위치 | 설명 |
|-------|------|------|------|------|
| 1 | Widget | AuthAlertBanner | fe-ui | 잠금/에러 경고 배너 |
| 2 | Widget | PasswordStrengthIndicator | fe-ui | 비밀번호 정책 실시간 검증 |
| 2 | Feature | ForgotPasswordForm | idp-client | 비밀번호 찾기 폼 |
| 2 | Feature | ResetPasswordForm | idp-client | 비밀번호 재설정 폼 |
| 2 | Feature | ChangePasswordForm | fe-ui | 비밀번호 변경 폼 |
| 3 | Widget | SessionCard | fe-ui | 세션 정보 카드 |
| 3 | Widget | SecurityInfoPanel | fe-ui | 보안 정보 패널 |
| 3 | Feature | UserSecurityActions | fe-ui | 관리자 보안 액션 |
| 3 | Cell | ChipCell | fe-ui | 감사 결과 뱃지 |
| 3 | Cell | UserAgentCell | fe-ui | UA 파싱 셀 |
