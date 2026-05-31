# OIDC Client IDs

이 문서는 현재 프로젝트에서 reference-data가 소유하는 OIDC client id를 서비스별로 정리합니다.

## Canonical client ids

| 서비스 | client id | Client 유형 | 인증 방식 | 비고 |
| --- | --- | --- | --- | --- |
| Admin Web | `admin-web` | Confidential | `client_secret_post` | 기본 로그인 client입니다. |
| IDP Web | `idp-web` | Confidential | `client_secret_post` | IDP console 자체 로그인에 사용합니다. |
| Mobile App | `user-mobile` | Public | `none` | PKCE 필수 native/mobile client입니다. |
| Storybook | `storybook-web` | Confidential | `client_secret_post` | Storybook auth shell에서 사용합니다. |
| Swagger UI | `swagger-web` | Public | `none` | Swagger OAuth2 + PKCE 인증에 사용합니다. |

## Runtime managed clients

다음 client id는 런타임 환경변수로 redirect/login/default return URL 보정을 받습니다.

| client id | 주요 env override |
| --- | --- |
| `admin-web` | `OIDC_ADMIN_BASE_URL`, `OIDC_ADMIN_REDIRECT_URI`, `OIDC_ADMIN_LOGIN_URL`, `OIDC_ADMIN_DEFAULT_RETURN_TO` |
| `storybook-web` | `OIDC_STORYBOOK_BASE_URL`, `OIDC_STORYBOOK_REDIRECT_URI`, `OIDC_STORYBOOK_LOGIN_URL`, `OIDC_STORYBOOK_DEFAULT_RETURN_TO` |
| `idp-web` | `IDP_CLIENT_URL`, `OIDC_IDP_WEB_REDIRECT_URI`, `OIDC_IDP_WEB_LOGIN_URL`, `OIDC_IDP_WEB_DEFAULT_RETURN_TO` |
| `user-mobile` | `OIDC_USER_MOBILE_REDIRECT_URI` |
| `swagger-web` | `OIDC_ISSUER`, `OIDC_SWAGGER_REDIRECT_URI` |

## Legacy aliases

아래 legacy id는 canonical id로 정규화됩니다. 새 설정이나 문서에는 canonical id를 사용합니다.

| legacy id | canonical id |
| --- | --- |
| `admin` | `admin-web` |
| `storybook` | `storybook-web` |
| `idpWeb` | `idp-web` |
| `swagger` | `swagger-web` |
| `prj-core-swagger` | `swagger-web` |

reference-data sync에서는 오래된 seed business key가 DB에 남아 provider에 다시 노출되지 않도록 다음 legacy id를 관리 대상으로 둡니다.

| legacy id | 처리 기준 |
| --- | --- |
| `storybook` | `storybook-web`으로 교체된 이전 Storybook id |
| `prj-core-mobile` | `user-mobile`으로 교체된 이전 mobile id |
| `prj-core-swagger` | `swagger-web`으로 교체된 이전 Swagger id |

## Source of truth

| 항목 | 위치 |
| --- | --- |
| OIDC seed data | `packages/be-prisma/src/reference-data/definitions/oidc.ts` |
| Runtime managed client 목록 | `packages/common-constant/src/oidc/options.ts` |
| Runtime URL override 적용 | `packages/be-service/src/oidc-runtime-client-config/index.ts` |
| Auth usecase 기본값과 legacy alias | `packages/be-usecase/src/auth/auth-support.ts` |
| Mobile login client | `apps/mobile/src/auth/auth-config.ts` |
| IDP Web login client | `apps/idp/web/src/app/auth/login/route.ts` |
| Swagger OAuth client | `apps/idp/api/src/main.ts` |
