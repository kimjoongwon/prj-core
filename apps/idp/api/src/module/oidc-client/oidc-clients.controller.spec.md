# OIDC Clients Controller 기획서

> 생성일: 2026-02-19
> 수정일: 2026-03-28
> 타입: controller
> 위치: apps/idp/api/src/module/oidc-client/oidc-clients.controller.ts

## 역할

OIDC 클라이언트(OAuth2 앱) 관리 CRUD API를 제공합니다. 관리자가 IDP에 연동할 클라이언트 애플리케이션을 등록, 조회, 수정, 삭제, 활성화/비활성화할 수 있습니다. 모든 엔드포인트는 `FULL_ACCESS` 권한이 필요합니다.

## 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | / | OIDC 클라이언트 목록 조회 (페이지네이션, 필터링) | FULL_ACCESS, SkipSpaceCheck |
| GET | /:oidcClientId | OIDC 클라이언트 상세 조회 | FULL_ACCESS, SkipSpaceCheck |
| POST | / | OIDC 클라이언트 신규 등록 | FULL_ACCESS, SkipSpaceCheck |
| PATCH | /:oidcClientId | OIDC 클라이언트 정보 수정 | FULL_ACCESS, SkipSpaceCheck |
| DELETE | /:oidcClientId | OIDC 클라이언트 삭제 (소프트 삭제) | FULL_ACCESS, SkipSpaceCheck |
| PATCH | /:oidcClientId/toggle-active | OIDC 클라이언트 활성/비활성 토글 | FULL_ACCESS, SkipSpaceCheck |

## 인증/인가

- 컨트롤러 레벨에서 `@Roles([SYSTEM_ROLES.FULL_ACCESS])`와 `@SkipSpaceCheck()` 적용
- 모든 엔드포인트는 `@ApiAuth()` 필요
- `oidcClientId` 파라미터는 `ParseUUIDPipe`로 UUID 유효성 검증

## 요청/응답 DTO

| 엔드포인트 | 요청 DTO | 응답 DTO |
|-----------|----------|----------|
| GET / | `QueryOidcClientDto` (Query) | `OidcClientDto[]` + `PageMetaDto` |
| GET /:oidcClientId | Path: `oidcClientId` (UUID) | `OidcClientDto` |
| POST / | `CreateOidcClientDto` (Body) | `OidcClientDto` (201 Created) |
| PATCH /:oidcClientId | Path: `oidcClientId` (UUID), `UpdateOidcClientDto` (Body) | `OidcClientDto` |
| DELETE /:oidcClientId | Path: `oidcClientId` (UUID) | 204 No Content |
| PATCH /:oidcClientId/toggle-active | Path: `oidcClientId` (UUID) | `OidcClientDto` |

## 비즈니스 규칙

- `clientId`는 고유해야 하며 중복 시 409 Conflict 반환
- Client ID는 등록 후 수정 불가 (보안 정책)
- 삭제는 소프트 삭제로 처리됨 (실제 데이터 유지)
- 목록 조회는 페이지네이션 지원 (기본 skip=0, take=20)
- `CreateOidcClientDto` 필드: clientId, clientSecret, name, redirectUris, grantTypes, responseTypes, tokenEndpointAuthMethod, scope, logoUri, policyUri, tosUri

## 의존성

| 의존 서비스 | 역할 |
|------------|------|
| `OidcClientFacade` | 목록 메타 조립 및 OIDC 클라이언트 controller boundary |

## 구현 체크리스트

- [x] oidc-clients.controller.ts
- [x] `@Controller()` 데코레이터
- [x] `@ApiTags("OIDC_CLIENTS")` 태그 설정
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-12 | 컨트롤러 진입점을 `OidcClientService`로 정렬 | codex |
| 2026-03-12 | 순수성 기준으로 단일 전달형은 `@cocrepo/service` 직접 주입으로 정리 | codex |
| 2026-03-12 | 목록 응답의 페이지 메타 조립을 ApplicationService로 이관 | codex |
| 2026-03-13 | controller boundary 조합을 `OidcClientFacade`로 이관 | codex |
