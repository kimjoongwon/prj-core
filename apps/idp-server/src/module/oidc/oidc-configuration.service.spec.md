# OIDC Configuration Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: apps/idp-server/src/module/oidc/oidc-configuration.service.ts

## 역할

oidc-provider 인스턴스 초기화에 필요한 전체 설정 객체(`OidcConfiguration`)를 빌드합니다. DB에서 활성 OIDC 클라이언트를 로드하고, DB 접근 실패 시 하드코딩된 폴백 클라이언트를 사용합니다. Redis Adapter, JWT 서명키, TTL, 쿠키, Claims 매핑 등을 조합합니다.

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `ConfigService` | OIDC issuer, JWKS, 쿠키 키, IDP_CLIENT_URL 환경 설정 조회 |
| `AccountService` | oidc-provider의 `findAccount` 함수 제공 |
| `RedisOidcAdapterFactory` | Redis 기반 oidc-provider Adapter 팩토리 |
| `OidcClientRepository` | DB에서 활성 OIDC 클라이언트 목록 조회 |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `buildConfiguration` | - | `Promise<OidcConfiguration>` | oidc-provider 초기화용 전체 설정 객체 빌드 |
| `loadClients` (private) | - | `Promise<OidcClientConfig[]>` | DB에서 활성 클라이언트 로드, 실패 시 폴백 클라이언트 반환 |

## 비즈니스 규칙

### 클라이언트 로드 전략

- DB에서 `isActive = true`인 OIDC 클라이언트를 조회
- DB 접근 실패(RLS 등) 시 정적 폴백 클라이언트 3개 사용:
  - `prj-core-admin`: 어드민 웹 (client_secret_post, authorization_code + refresh_token)
  - `prj-core-mobile`: 모바일 앱 (PKCE 필수, none auth method)
  - `prj-core-swagger`: Swagger UI (authorization_code만)

### TTL 설정

| 토큰 타입 | TTL |
|----------|-----|
| AccessToken | 3600초 (1시간) |
| AuthorizationCode | 600초 (10분) |
| IdToken | 3600초 (1시간) |
| RefreshToken | 86400 * 30초 (30일) |
| Session | 86400 * 14초 (14일) |
| Grant | 86400 * 14초 (14일) |
| Interaction | 3600초 (1시간) |

### 주요 Features

| Feature | 설정 |
|---------|------|
| `devInteractions` | disabled (idp-client에서 UI 제공) |
| `clientCredentials` | enabled |
| `introspection` | enabled |
| `revocation` | enabled |
| `rpInitiatedLogout` | enabled |
| `resourceIndicators` | enabled (JWT Access Token 발급) |
| `jwtUserinfo` | disabled |

### Resource Indicators

- JWT Access Token 형식(RS256)으로 발급
- default resource: issuer URL
- scope: `openid profile email roles`

### PKCE 정책

- `tokenEndpointAuthMethod === "none"` 인 Public Client는 PKCE 필수

### 에러 렌더링

- OIDC 에러 발생 시 `${idpClientUrl}/error?error=...&error_description=...`으로 리다이렉트하는 HTML 응답 반환

## 구현 체크리스트

- [x] oidc-configuration.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
