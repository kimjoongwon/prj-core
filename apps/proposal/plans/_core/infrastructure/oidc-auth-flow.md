# OIDC 인증 플로우

## 개요

본 프로젝트는 **OpenID Connect (OIDC) Authorization Code Flow**를 사용하여 인증을 처리합니다.

| 구성 요소 | 역할 | 포트 (개발 환경) |
|-----------|------|-----------------|
| **Admin (Next.js)** | 프론트엔드 SPA + API Route Handler | `localhost:3000` |
| **Server (NestJS)** | API 서버, OIDC Relying Party | `localhost:3006` |
| **IDP (NestJS + oidc-provider)** | OIDC Provider, 토큰 발급/검증 | `localhost:3007` |
| **Redis** | OIDC 세션/토큰 저장, 토큰 블랙리스트, Account 캐시 | `localhost:6379` |

### OIDC 클라이언트 설정

| 클라이언트 | `client_id` | Auth Method | PKCE |
|-----------|-------------|-------------|------|
| Admin Web | `prj-core-admin` | `client_secret_basic` | 선택적 |
| Mobile App | `prj-core-mobile` | `none` (Public) | **필수** |

---

## 1. 로그인 플로우 (Authorization Code Flow)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant A as Admin (Next.js)
    participant S as Server (NestJS)
    participant I as IDP (oidc-provider)
    participant R as Redis
    participant DB as Database

    Note over U,DB: 1단계: 로그인 시작
    U->>A: 로그인 버튼 클릭
    A->>S: GET /api/v1/auth/login
    S->>S: state 생성 (crypto.randomBytes)
    S->>S: Authorization URL 조립
    S-->>U: 302 Redirect → IDP /oidc/auth

    Note over U,DB: 2단계: IDP 인증
    U->>I: GET /oidc/auth?response_type=code&client_id=...&scope=openid+profile+email+roles
    I->>I: Interaction 생성 (uid)
    I-->>U: 302 Redirect → /interaction/{uid}
    U->>I: GET /interaction/{uid}
    I->>I: InteractionService.getInteractionDetails()
    I-->>U: 로그인 폼 (login.ejs)
    U->>I: POST /interaction/{uid}/login (email, password)
    I->>I: InteractionService.validateUser()
    I->>DB: 사용자 조회 (UsersService.findUserForAuth)
    I->>I: bcrypt 비밀번호 검증
    I->>I: InteractionService.completeLogin() → Grant 생성
    I->>I: Authorization Code 발급
    I-->>U: 302 Redirect → Admin callback + code + state

    Note over U,DB: 3단계: 토큰 교환
    U->>A: GET /api/auth/callback/oidc?code=...&state=...
    A->>S: GET /api/v1/auth/callback?code=...&state=...
    S->>I: POST /oidc/token (grant_type=authorization_code, code, client_secret)
    I->>I: Code 검증 + 토큰 생성 (RS256 서명)
    I-->>S: { access_token, refresh_token, id_token, expires_in }
    S->>S: access_token 디코딩 → sub (userId)
    S->>DB: 사용자 정보 조회 (getByIdWithTenants)
    S-->>A: LoginResponseDto { accessToken, refreshToken, user }

    Note over U,DB: 4단계: 쿠키 설정 및 리다이렉트
    A->>A: HttpOnly 쿠키 설정 (accessToken, refreshToken)
    A-->>U: 302 Redirect → /admin/dashboard
```

### 관련 코드

| 단계 | 파일 | 핵심 로직 |
|------|------|----------|
| 로그인 시작 | `apps/admin/src/app/auth/login/hooks/useAuthLoginPage.tsx:28` | `window.location.href = "/api/v1/auth/login"` |
| Authorization URL 생성 | `packages/facade/src/auth.facade.ts:75-85` | `getAuthorizationUrl()` - scope: `openid profile email roles` |
| IDP 리다이렉트 | `apps/server/src/module/auth/auth.controller.ts:62-66` | `login()` - state 생성 후 redirect |
| Interaction 화면 | `apps/idp/src/module/interaction/interaction.controller.ts:55-84` | `getInteraction()` - prompt에 따라 login/consent 분기 |
| 사용자 인증 | `apps/idp/src/module/interaction/interaction.service.ts:67-94` | `validateUser()` - bcrypt 비밀번호 검증 |
| 로그인 완료 | `apps/idp/src/module/interaction/interaction.service.ts:100-116` | `completeLogin()` - interactionResult 호출 |
| 동의 처리 | `apps/idp/src/module/interaction/interaction.service.ts:122-169` | `processConsent()` - Grant 생성/업데이트 |
| Claims 조회 | `apps/idp/src/module/oidc/account.service.ts:47-63` | `findAccount()` - Redis 캐시 활용 |
| Claims 빌드 | `apps/idp/src/module/oidc/account.service.ts:106-139` | `buildFullClaims()` - 전체 claims 빌드 후 캐시 |
| Claims 필터 | `apps/idp/src/module/oidc/account.service.ts:144-172` | `filterClaimsByScope()` - scope별 claims 필터링 |
| Callback 처리 (Admin) | `apps/admin/src/app/api/auth/callback/oidc/route.ts:9-89` | Next.js Route Handler - 토큰 쿠키 설정 |
| Callback 처리 (Server) | `apps/server/src/module/auth/auth.controller.ts:78-84` | `handleCallback()` |
| 토큰 교환 | `packages/facade/src/auth.facade.ts:126-154` | `exchangeCodeForTokens()` - IDP token endpoint 호출 |

---

## 2. API 요청 인증 플로우 (JwtAuthGuard + JWKS)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant A as Admin (Next.js)
    participant S as Server (NestJS)
    participant I as IDP (oidc-provider)
    participant R as Redis

    U->>A: API 요청 (예: 회원 목록)
    A->>S: GET /api/v1/users (Cookie: accessToken=..., x-space-id=...)

    Note over S: JwtAuthGuard 실행
    S->>S: @Public() 데코레이터 확인
    alt Public 라우트
        S->>S: 인증 건너뛰기
    else 인증 필요
        S->>S: 쿠키에서 accessToken 추출
        S->>R: 블랙리스트 확인 (blacklist:{tokenHash})
        alt 블랙리스트 등록됨
            S-->>U: 401 Unauthorized (토큰이 무효화되었습니다)
        else 유효한 토큰
            Note over S,I: JwtStrategy - JWKS 검증
            S->>I: GET /oidc/jwks (캐시: 10분)
            I-->>S: { keys: [{ kty: "RSA", ... }] }
            S->>S: RS256 서명 검증 (공개키)
            S->>S: issuer, exp 검증
            S->>S: payload.sub → userId 추출
            S->>S: usersService.getByIdWithTenants(userId)
            S->>S: request.user에 사용자 정보 주입
            S-->>U: 200 OK + 응답 데이터
        end
    end
```

### JWT 토큰 추출 우선순위

`JwtStrategy`는 다음 순서로 Access Token을 추출합니다:

1. **쿠키**: `req.cookies.accessToken` (Admin Web 기본)
2. **Authorization 헤더**: `Bearer {token}` (API 직접 호출, Mobile App)

### 관련 코드

| 구성 요소 | 파일 | 핵심 로직 |
|-----------|------|----------|
| JwtAuthGuard | `packages/be-common/src/guard/jwt.auth-guard.ts:13-73` | 블랙리스트 확인 + Passport 인증 |
| JwtStrategy | `packages/be-common/src/strategy/jwt.strategy.ts:25-82` | JWKS 기반 RS256 검증, 사용자 조회 |
| Request 인터셉터 | `packages/api/src/libs/customAxios.ts:29-40` | `x-space-id` 헤더 자동 추가 |

---

## 3. 토큰 자동 갱신 플로우 (401 Interceptor)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant AX as Axios Interceptor
    participant S as Server (NestJS)
    participant I as IDP (oidc-provider)

    U->>AX: API 요청
    AX->>S: 원래 요청 (만료된 accessToken)
    S-->>AX: 401 Unauthorized

    Note over AX: Response Interceptor 동작

    alt 이미 갱신 중 (isRefreshing=true)
        AX->>AX: failedQueue에 추가하여 대기
    else 갱신 시작
        AX->>AX: isRefreshing = true
        AX->>S: POST /api/v1/auth/token/refresh (Cookie: refreshToken)
        S->>I: POST /oidc/token (grant_type=refresh_token)
        alt 갱신 성공
            I-->>S: { access_token, refresh_token (optional) }
            S->>S: 새 토큰으로 쿠키 업데이트
            S-->>AX: 200 OK + TokenRefreshResponseDto
            AX->>AX: processQueue(null) - 대기 중 요청 해제
            AX->>S: 원래 요청 재시도 (새 쿠키 자동 적용)
            S-->>AX: 200 OK
            AX-->>U: 응답 데이터
        else 갱신 실패
            I-->>S: 401 (refresh_token 만료)
            S-->>AX: 401 Unauthorized
            AX->>AX: processQueue(error) - 대기 중 요청 실패
            AX-->>U: Redirect → /admin/auth/login
        end
    end
```

### 동시 요청 처리 (Queue 패턴)

여러 API 요청이 동시에 401을 받았을 때 토큰 갱신이 한 번만 실행되도록 Queue 패턴을 사용합니다:

```
요청 A → 401 → 갱신 시작 (isRefreshing=true)
요청 B → 401 → 큐에 대기
요청 C → 401 → 큐에 대기
         ↓
     갱신 완료 → 큐 해제
         ↓
요청 A → 재시도 → 성공
요청 B → 재시도 → 성공
요청 C → 재시도 → 성공
```

### 관련 코드

| 구성 요소 | 파일 | 핵심 로직 |
|-----------|------|----------|
| 401 인터셉터 | `packages/api/src/libs/customAxios.ts:61-116` | 토큰 갱신 + 큐 패턴 |
| Refresh 엔드포인트 | `apps/server/src/module/auth/auth.controller.ts:87-108` | 쿠키에서 refreshToken 추출 |
| IDP 토큰 갱신 | `packages/facade/src/auth.facade.ts:159-217` | `refreshTokenWithIdp()` |

---

## 4. 로그아웃 플로우

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant A as Admin (Next.js)
    participant S as Server (NestJS)
    participant I as IDP (oidc-provider)

    U->>A: 로그아웃 버튼 클릭
    A->>A: AuthStore.logout() 호출

    A->>S: POST /api/v1/auth/logout (Cookie: accessToken)

    Note over S: 1. IDP 토큰 무효화
    S->>I: POST /oidc/token/revocation (token, client_id, client_secret)
    I->>I: 토큰 폐기 (Grant/Session 무효화)
    I-->>S: 200 OK

    Note over S: 2. 쿠키 삭제
    S->>S: clearCookie(accessToken)
    S->>S: clearCookie(refreshToken)
    S->>S: clearCookie(tenantId)
    S->>S: clearCookie(workspaceId)

    S-->>A: 200 OK { data: true }

    A-->>U: Redirect → /admin/auth/login
```

### 관련 코드

| 구성 요소 | 파일 | 핵심 로직 |
|-----------|------|----------|
| 프론트엔드 로그아웃 | `packages/store/src/stores/authStore.ts:27-42` | `logout()` - API 호출 후 리다이렉트 |
| 로그아웃 컨트롤러 | `apps/server/src/module/auth/auth.controller.ts:149-168` | 쿠키에서 accessToken 추출 |
| IDP 토큰 폐기 | `packages/facade/src/auth.facade.ts:242-262` | `revokeToken()` - revocation endpoint 호출 |
| 쿠키 삭제 | `packages/facade/src/auth.facade.ts:222-237` | `logoutWithCookie()` |
| 토큰 쿠키 관리 | `packages/service/src/token.service.ts:64-75` | `clearTokenCookies()` |

---

## 5. 보안 특성

| 항목 | 설정 | 설명 |
|------|------|------|
| **서명 알고리즘** | RS256 (RSA + SHA-256) | 비대칭 키 - IDP만 서명, Server는 공개키로 검증 |
| **토큰 검증** | JWKS Endpoint | `{issuer}/oidc/jwks` 에서 공개키 조회 (캐시 10분) |
| **쿠키 보안** | HttpOnly, Secure, SameSite=Lax | XSS 방어, CSRF 완화 |
| **토큰 저장** | HttpOnly Cookie | JavaScript 접근 불가 |
| **블랙리스트** | Redis (SHA-256 해시) | 로그아웃/무효화된 토큰 차단 |
| **PKCE** | Public Client 필수 | Mobile App 등 client_secret 없는 클라이언트 보호 |
| **State 파라미터** | crypto.randomBytes(32) | CSRF 방어용 난수 |
| **Issuer 검증** | JwtStrategy | 토큰의 issuer가 설정된 IDP와 일치하는지 확인 |
| **JWKS Rate Limit** | 10 requests/min | IDP 과부하 방지 |
| **토큰 폐기** | IDP Revocation Endpoint | RFC 7009 - 로그아웃 시 토큰 즉시 무효화 |
| **Account 캐시** | Redis (TTL 5분) | AccountService에서 반복 DB 조회 방지 |

---

## 6. 토큰 TTL 정리

IDP에서 설정하는 토큰 수명 (`apps/idp/src/module/oidc/oidc-configuration.service.ts:94-104`):

| 토큰 유형 | TTL | 설명 |
|-----------|-----|------|
| **AccessToken** | 1시간 (3600s) | API 인증용, 짧은 수명 |
| **RefreshToken** | 30일 (2,592,000s) | Access Token 갱신용 |
| **AuthorizationCode** | 10분 (600s) | Code → Token 교환 제한 시간 |
| **IdToken** | 1시간 (3600s) | 사용자 identity 정보 |
| **Session** | 14일 (1,209,600s) | IDP 세션 유지 |
| **Grant** | 14일 (1,209,600s) | 사용자 동의(grant) 유지 |
| **Interaction** | 1시간 (3600s) | 로그인/동의 화면 유효 시간 |
| **DeviceCode** | 10분 (600s) | Device Authorization Flow |
| **ClientCredentials** | 1시간 (3600s) | M2M 인증용 |

### 쿠키 만료 시간

Admin Next.js Route Handler에서 설정 (`apps/admin/src/app/api/auth/callback/oidc/route.ts:59-80`):

| 쿠키 | maxAge | 비고 |
|-------|--------|------|
| `accessToken` | 1시간 | IDP AccessToken TTL과 동일 |
| `refreshToken` | 30일 | IDP RefreshToken TTL과 동일 |

---

## 7. OIDC Claims 매핑

IDP의 `AccountService`가 scope에 따라 반환하는 claims.
전체 claims를 빌드 후 Redis에 캐시(5분)하고, 요청된 scope에 따라 필터링하여 반환합니다.

### Claims 정의 (`OidcConfigurationService`)

`apps/idp/src/module/oidc/oidc-configuration.service.ts:63-69`:

```typescript
claims: {
    openid: ["sub"],
    profile: ["name", "updated_at"],
    email: ["email", "email_verified"],
    phone: ["phone_number", "phone_number_verified"],
    roles: ["roles", "spaces"],
},
```

### Scope별 Claims 매핑 (`AccountService`)

| Scope | Claims | 데이터 소스 |
|-------|--------|------------|
| `openid` | `sub` | `user.id` |
| `profile` | `name`, `updated_at` | `user.name`, `user.updatedAt` |
| `email` | `email`, `email_verified` | `user.email`, `true` (항상) |
| `phone` | `phone_number`, `phone_number_verified` | `user.phone`, `true` (항상) |
| `roles` | `roles[]`, `spaces[]` | `user.tenants` (spaceId, roleId, roleName 등) |

### `roles` scope 응답 구조

```json
{
  "roles": [
    {
      "spaceId": "space-uuid",
      "roleId": "role-uuid",
      "roleName": "SUPER_ADMIN",
      "roleDisplayName": "슈퍼 관리자",
      "isSystemRole": true
    }
  ],
  "spaces": [
    {
      "spaceId": "space-uuid",
      "groundName": "System Ground"
    }
  ]
}
```

### Claims 흐름

```
findAccount(id) → account.claims(scope)
    ↓
getClaims(userId, scope)
    ↓
Redis 캐시 확인 (oidc:account:{userId})
    ├─ 캐시 히트 → filterClaimsByScope(cached, scope)
    └─ 캐시 미스 → DB 조회 → buildFullClaims() → Redis 저장 (5분) → filterClaimsByScope()
```

---

## 8. 아키텍처 전체 구조도

```mermaid
graph TB
    subgraph "Frontend (Admin - Next.js)"
        LP[Login Page<br/>useAuthLoginPage]
        CB[Callback Route Handler<br/>/api/auth/callback/oidc]
        AX[Axios Interceptor<br/>customAxios.ts]
        AS[AuthStore<br/>authStore.ts]
    end

    subgraph "API Server (NestJS)"
        AC[AuthController<br/>/api/v1/auth/*]
        AF[AuthFacade]
        JG[JwtAuthGuard]
        JS[JwtStrategy<br/>JWKS RS256]
        TS[TokenService]
    end

    subgraph "IDP (oidc-provider)"
        OPS[OidcProviderService<br/>생명주기 관리]
        OCS[OidcConfigurationService<br/>설정 빌드]
        IC[InteractionController<br/>/interaction/*]
        IS[InteractionService<br/>로그인/동의 로직]
        ACS[AccountService<br/>Redis 캐시 + Claims]
        ROA[RedisOidcAdapter<br/>세션/토큰 저장]
        JWKS[JWKS Endpoint<br/>/oidc/jwks]
        TE[Token Endpoint<br/>/oidc/token]
        RE[Revocation Endpoint<br/>/oidc/token/revocation]
    end

    subgraph "Infrastructure"
        DB[(PostgreSQL)]
        RD[(Redis)]
    end

    LP -->|"1. /api/v1/auth/login"| AC
    AC -->|"2. Redirect"| OPS
    OPS -->|"3. Interaction"| IC
    IC -->|"delegate"| IS
    IS -->|"4. Login Form"| LP
    OPS -->|"5. Code + Redirect"| CB
    CB -->|"6. Code Exchange"| AC
    AC --> AF
    AF -->|"7. POST /oidc/token"| TE
    TE -->|"8. Tokens"| AF
    AF -->|"9. Set Cookies"| CB

    AX -->|"API Request"| JG
    JG --> JS
    JS -->|"JWKS Verify"| JWKS

    AS -->|"Logout"| AC
    AF -->|"Revoke"| RE

    OPS -.->|"buildConfiguration()"| OCS
    OCS -.-> ACS
    OCS -.-> ROA
    ACS -->|"캐시"| RD
    ACS -->|"DB 조회"| DB
    ROA -->|"세션/토큰 저장"| RD
    IS -->|"사용자 인증"| DB
```

---

## 9. IDP 모듈 구조

IDP의 OIDC 모듈은 책임별로 분리되어 있습니다:

```
apps/idp/src/module/
├── oidc/
│   ├── types/
│   │   ├── index.ts                       # 타입 re-export
│   │   └── oidc-provider.types.ts         # oidc-provider 라이브러리 타입 정의
│   ├── oidc-provider.service.ts           # Provider 생명주기 관리 (초기화, 이벤트)
│   ├── oidc-configuration.service.ts      # 설정 빌드 (clients, claims, TTL, PKCE, renderError)
│   ├── account.service.ts                 # 사용자 계정 조회 + Redis 캐시 + Claims 빌드
│   ├── oidc.adapter.ts                    # Redis 기반 OIDC Adapter (세션/토큰/Grant 저장)
│   ├── oidc-client.repository.ts          # OIDC 클라이언트 DB 조회
│   ├── oidc.controller.ts                 # oidc-provider 미들웨어 라우팅
│   └── oidc.module.ts                     # 모듈 정의
└── interaction/
    ├── interaction.controller.ts           # HTTP 라우팅 + 뷰 렌더링
    └── interaction.service.ts             # 로그인/동의/취소 비즈니스 로직
```

| 서비스 | 역할 |
|--------|------|
| `OidcProviderService` | oidc-provider 인스턴스 생명주기 관리 (초기화, 이벤트 핸들러) |
| `OidcConfigurationService` | oidc-provider 설정 빌드 (클라이언트, claims, features, TTL, PKCE, JWKS) |
| `AccountService` | `findAccount()` 구현, Redis 캐시(5분) 활용, scope별 claims 필터링 |
| `RedisOidcAdapter` | oidc-provider 데이터 저장소 (Redis), 보조 인덱스(uid, grantId, userCode) 관리 |
| `InteractionService` | 로그인 검증, Grant 생성, Interaction 결과 처리 (Controller에서 분리) |

---

## 10. 관련 파일 경로 참조

### IDP (Identity Provider)

| 파일 | 역할 |
|------|------|
| `apps/idp/src/config/oidc.config.ts` | OIDC Provider 설정 (issuer, cookie, JWKS) |
| `apps/idp/src/module/oidc/oidc-provider.service.ts` | OIDC Provider 생명주기 관리 (초기화, 이벤트) |
| `apps/idp/src/module/oidc/oidc-configuration.service.ts` | OIDC Provider 설정 빌드 (clients, claims, TTL, PKCE) |
| `apps/idp/src/module/oidc/account.service.ts` | 사용자 계정 조회 + Redis 캐시 + Claims 매핑 |
| `apps/idp/src/module/oidc/oidc.adapter.ts` | Redis 기반 OIDC Adapter (세션/토큰/Grant 저장) |
| `apps/idp/src/module/oidc/oidc-client.repository.ts` | OIDC 클라이언트 DB 조회 |
| `apps/idp/src/module/oidc/types/oidc-provider.types.ts` | oidc-provider 타입 정의 |
| `apps/idp/src/module/interaction/interaction.controller.ts` | Interaction HTTP 라우팅 + 뷰 렌더링 |
| `apps/idp/src/module/interaction/interaction.service.ts` | 로그인/동의/취소 비즈니스 로직 |
| `apps/idp/src/views/login.ejs` | 로그인 폼 템플릿 |
| `apps/idp/src/views/consent.ejs` | 동의 화면 템플릿 |
| `apps/idp/src/views/error.ejs` | 에러 페이지 템플릿 |

### Server (API)

| 파일 | 역할 |
|------|------|
| `apps/server/src/config/oidc.config.ts` | Server측 OIDC 설정 (issuer, jwksUri, clientId/Secret) |
| `apps/server/src/module/auth/auth.controller.ts` | 인증 엔드포인트 (login, callback, refresh, logout) |

### 공용 패키지

| 파일 | 역할 |
|------|------|
| `packages/facade/src/auth.facade.ts` | OIDC 인증 비즈니스 로직 (토큰 교환, 갱신, 폐기) |
| `packages/service/src/token.service.ts` | 토큰 쿠키 관리 (설정/삭제) |
| `packages/service/src/token-storage.service.ts` | Redis 기반 토큰 블랙리스트 |
| `packages/be-common/src/strategy/jwt.strategy.ts` | JWKS 기반 JWT 검증 전략 |
| `packages/be-common/src/guard/jwt.auth-guard.ts` | 인증 Guard (블랙리스트 + JWT 검증) |

### Frontend (Admin)

| 파일 | 역할 |
|------|------|
| `apps/admin/src/app/auth/login/hooks/useAuthLoginPage.tsx` | 로그인 페이지 훅 (OIDC 리다이렉트) |
| `apps/admin/src/app/api/auth/callback/oidc/route.ts` | OIDC Callback Route Handler (토큰 쿠키 설정) |
| `apps/admin/next.config.ts` | API 프록시 설정 (OIDC callback 제외) |
| `packages/api/src/libs/customAxios.ts` | Axios 인터셉터 (401 토큰 갱신, x-space-id 헤더) |
| `packages/store/src/stores/authStore.ts` | 인증 상태 관리 Store (로그아웃 처리) |
