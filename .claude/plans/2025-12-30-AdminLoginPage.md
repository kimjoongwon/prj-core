# 📋 관리자 로그인 페이지 기획서

## 개요

관리자(Admin) 전용 로그인 페이지 기획서입니다.

**작성일:** 2025-12-30

**플랫폼:** Admin Web only

---

## 📊 현재 구현 상태

### ✅ 이미 구현된 기능

관리자 로그인 페이지가 **완전히 구현되어 있습니다**.

| 구분 | 파일 경로 |
|------|----------|
| Page | `apps/admin/app/auth/login/page.tsx` |
| Hook | `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx` |
| UI Component | `packages/ui/src/components/page/Login/LoginPage.tsx` |
| Layout | `packages/ui/src/components/ui/layouts/Auth/AuthLayout.tsx` |

### 현재 기능

1. **이메일/비밀번호 입력**: MobX 연동 Input 컴포넌트
2. **유효성 검사**: `LoginSchema` (이메일 형식, 비밀번호 8자 이상)
3. **API 호출**: `POST /api/v1/auth/login` via `useLogin` 훅
4. **로그인 성공 시**: 대시보드(`/`)로 이동
5. **로그인 실패 시**: 에러 메시지 표시
6. **로딩 상태**: 버튼에 스피너 표시

---

## 🔐 역할 시스템

### Roles Enum

```prisma
enum Roles {
  USER          // 일반 사용자
  SUPER_ADMIN   // 슈퍼 관리자 (모든 권한)
  ADMIN         // 관리자
}
```

### 슈퍼매니저 권한

- 모든 관리 기능 접근 가능
- 다른 관리자 계정 관리 가능
- 시스템 설정 변경 가능
- 기본 1개 계정이 시드로 생성됨

---

## 📱 화면 구조

### 레이아웃

```
┌─────────────────────────────────────┐
│         Admin Login                 │
├─────────────────────────────────────┤
│                                     │
│   ┌─────────────────────────────┐   │
│   │     로고 또는 타이틀          │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 이메일                       │   │
│   │ [________________________]  │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 비밀번호                     │   │
│   │ [________________________]  │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │      [  로그인  ]            │   │
│   └─────────────────────────────┘   │
│                                     │
│   (에러 메시지 표시 영역)            │
│                                     │
└─────────────────────────────────────┘
```

---

## 📡 API 요구사항

### 현재 구현된 API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/v1/auth/login | 로그인 | Public |

### 요청 (Request)

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 응답 (Response - 성공)

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 응답 (Response - 실패)

```json
{
  "statusCode": 401,
  "message": "이메일 또는 비밀번호가 일치하지 않습니다."
}
```

---

## 🔧 추가 개선 제안 (선택적)

### 1. 로그인 시도 제한 (Rate Limiting)

현재 미구현 상태. 보안 강화를 위해 다음 기능 추가 가능:

| 조건 | 동작 |
|------|------|
| 5회 연속 실패 | 1분간 로그인 차단 |
| 10회 연속 실패 | 5분간 로그인 차단 |
| 15회 연속 실패 | 계정 잠금 (관리자 해제 필요) |

#### 필요한 Entity 추가

```prisma
model LoginAttempt {
  id          String    @id @default(uuid())
  seq         Int       @unique @default(autoincrement())
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz(6)

  email       String    // 시도한 이메일
  ipAddress   String    @map("ip_address") // IP 주소
  userAgent   String?   @map("user_agent") // 브라우저 정보
  success     Boolean   // 성공 여부

  @@index([email, createdAt])
  @@index([ipAddress, createdAt])
  @@map("login_attempts")
}
```

#### 프론트엔드 UI 추가

```typescript
{
  remainingAttempts: number    // 남은 시도 횟수
  lockoutUntil: Date | null    // 차단 해제 시각
  isLocked: boolean            // 현재 차단 상태
}
```

### 2. 2단계 인증 (2FA) - 향후 고려

- TOTP (Time-based One-Time Password)
- 이메일 인증 코드
- SMS 인증 코드

---

## ✅ 체크리스트

- [x] 로그인 페이지 구현
- [x] 이메일/비밀번호 입력
- [x] 유효성 검사
- [x] API 연동
- [x] 로그인 성공/실패 처리
- [x] 로딩 상태 표시
- [ ] 로그인 시도 제한 (선택적)
- [ ] 2단계 인증 (선택적)

---

## 📝 다음 단계

현재 기본 로그인 기능은 완전히 구현되어 있습니다.

추가 보안 기능이 필요하다면:

1. **로그인 시도 제한 구현 시**
   - `LoginAttempt` 엔티티 추가
   - 백엔드 미들웨어/가드 구현
   - 프론트엔드 차단 상태 UI 추가

2. **2단계 인증 구현 시**
   - 별도 기획 필요

---

## 🚨 주의사항

### 1. 보안
- HTTPS 필수
- 비밀번호는 bcrypt 해싱
- JWT 토큰 만료 시간 적절히 설정
- Refresh Token은 HttpOnly 쿠키 권장

### 2. 접근 제어
- 관리자 페이지는 ADMIN 또는 SUPER_ADMIN 역할 필요
- 권한 없는 접근 시 로그인 페이지로 리다이렉트
