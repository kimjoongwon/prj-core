# OIDC Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: controller
> 위치: apps/idp-server/src/module/oidc/oidc.controller.ts

## 역할

oidc-provider 라이브러리의 모든 OIDC 표준 엔드포인트 요청을 NestJS에서 수신하여 oidc-provider에 위임하는 통합 프록시 컨트롤러입니다. `@All("*path")` 패턴으로 `/oidc/**` 경로의 모든 HTTP 메서드를 처리합니다. Swagger 문서에서는 제외됩니다(`@ApiExcludeController`).

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| ALL | /oidc/* | oidc-provider에 모든 OIDC 표준 요청 위임 | Public (oidc-provider 자체 처리) |

### oidc-provider가 처리하는 표준 엔드포인트

| 경로 | 설명 |
|------|------|
| GET/POST /oidc/auth | Authorization 엔드포인트 (인증 요청 진입) |
| POST /oidc/token | Token 엔드포인트 (코드→토큰 교환, 리프레시) |
| GET /oidc/me | UserInfo 엔드포인트 (사용자 정보 조회) |
| GET /oidc/jwks | JWKS (JSON Web Key Set) 공개키 |
| GET /oidc/.well-known/openid-configuration | OIDC Discovery Document |
| POST /oidc/token/introspection | Token Introspection (토큰 검증) |
| POST /oidc/token/revocation | Token Revocation (토큰 폐기) |
| GET/POST /oidc/session/end | End Session (RP 개시 로그아웃) |

## 인증/인가

- `@Public()` 데코레이터로 NestJS Guard를 건너뜀
- 실제 인증/인가는 oidc-provider 내부에서 처리
- `@ApiExcludeController()`로 Swagger 문서 제외

## 구현 세부사항

- Express 요청을 oidc-provider(Koa 기반)가 처리할 수 있도록 URL 변환
- `req.url`에서 `/oidc` prefix를 제거한 후 oidc-provider 콜백에 전달
- `provider.callback()`이 Express의 `(req, res)` 핸들러 역할 수행

## 지원 Scope

| Scope | 포함 Claims |
|-------|------------|
| `openid` | sub |
| `profile` | name, updated_at |
| `email` | email, email_verified |
| `phone` | phone_number, phone_number_verified |
| `roles` | roles, spaces (커스텀 클레임) |

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `OidcApplicationService` | oidc-provider 위임 처리를 캡슐화 |

## 구현 체크리스트

- [x] oidc.controller.ts
- [x] `@Controller("oidc")` 데코레이터
- [x] `@ApiExcludeController()` 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-12 | OidcController가 OidcProviderService 직접 주입에서 OidcApplicationService로 전환 | codex |
