# OIDC Configuration Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-28
> 타입: service
> 위치: apps/idp/api/src/module/oidc/oidc-configuration.service/index.ts

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
- DB 조회 결과가 있더라도 기본 로컬 RP(admin/storybook/mobile/swagger)는 누락 시 폴백 목록으로 병합합니다.
- DB에 같은 `client_id`가 있으면 폴백과 DB 설정을 병합하며, 기본 redirect/grant/response 계약은 유지한 채 DB 확장 값을 추가합니다.
- DB 조회 실패/빈 결과 시에도 동일한 병합 함수를 거친 고유 `client_id` 목록만 반환하여 정적 폴백 중복으로 인한 oidc-provider 초기화 실패를 방지합니다.
- reference-data sync는 개편 전 legacy clientId(`storybook`, `prj-core-mobile`, `prj-core-swagger`)를 비활성화해 provider가 더 이상 로드하지 않도록 정리합니다.
- DB 접근 실패(RLS 등) 시 정적 폴백 클라이언트 5개 사용:
  - `admin-web`: 어드민 웹 (client_secret_post, authorization_code + refresh_token, localhost:3000 `/api/v1/auth/callback?clientId=admin-web`)
  - `storybook-web`: Storybook RP (client_secret_post, authorization_code + refresh_token, localhost:6006 `/api/v1/auth/callback?clientId=storybook-web`)
  - `idp-web`: IDP 웹 (client_secret_post, authorization_code + refresh_token, localhost:3008 `/api/v1/auth/callback?clientId=idp-web`)
  - `user-mobile`: 모바일 앱 (PKCE 필수, none auth method)
  - `swagger-web`: Swagger UI (authorization_code만)
- 신규/정비 대상 first-party OIDC `clientId`는 `{realm}-{surface}` 패턴을 사용하며, repo/product 접두사(`prj-core-*`)는 사용하지 않습니다.

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
| 2026-04-14 | Storybook fallback clientId를 `storybook-web`으로 승격하고 legacy clientId 정리 규칙을 문서화 | codex |
| 2026-04-14 | first-party fallback clientId를 `{realm}-{surface}` 규칙에 맞춰 `user-mobile`, `swagger-web`으로 문서화 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-25 | first-party callback path를 clientId 기반 generic route로 정리 | codex |
| 2026-03-16 | Storybook fallback client 표시명을 clientId 기준으로 정리 | codex |
| 2026-03-16 | Storybook fallback client 식별자를 `storybook`으로 단순화하고 관련 병합 규칙 설명을 갱신 | codex |
| 2026-03-16 | DB의 기존 Storybook client가 남아 있어도 fallback redirect URI/grant/response 계약을 함께 병합하도록 보강 | codex |
| 2026-03-16 | storybook fallback client 중복을 제거하고 DB 실패 시에도 dedupe된 fallback 목록만 반환하도록 보강 | codex |
| 2026-03-16 | DB 결과에 fallback client를 병합하고 `storybook` localhost:6006 callback을 추가 | codex |
| 2026-03-18 | `idp-web` client env 키를 `OIDC_IDP_WEB_*` 정식 이름으로 정리하고 sidecar 설명을 보강 | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-03 | 폐기된 웹 앱 제거에 따라 admin fallback redirect URI를 localhost:3000으로 단순화 | codex |
| 2026-03-13 | `oidc-configuration.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | 중첩 폴더 구조에 맞게 config 및 OIDC 의존성 상대 import를 상위 폴더 기준으로 보정 | codex |
