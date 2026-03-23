# PRJ Core Environment Variable Reference

`prj-core`의 로컬 환경 변수 규칙은 다음과 같습니다.

- 로컬 실행은 각 프로젝트 디렉터리의 `.env`만 사용합니다.
- `.env.example`는 커밋되는 템플릿이며, 런타임에서 직접 읽지 않습니다.
- 배포 환경 변수는 `prj-devops`의 OpenBao 연동을 통해 주입됩니다.
- 아래 표는 현재 코드가 실제로 읽는 키 기준입니다.
- 주석 처리된 legacy 예시 키(`file.config.ts`, `mail.config.ts`, `database.config.ts`)는 제외했습니다.

## Overview

| 프로젝트 | 로컬 파일 | 템플릿 | 비고 |
| --- | --- | --- | --- |
| `core-api` | `apps/core/api/.env` | `apps/core/api/.env.example` | Core API 런타임 + e2e |
| `idp-api` | `apps/idp/api/.env` | `apps/idp/api/.env.example` | IDP API 런타임 |
| `admin-web` | `apps/admin/web/.env` | 없음 | Next.js Admin Web |
| `idp-web` | `apps/idp/web/.env` | 없음 | Next.js IDP Web |
| `tool-storybook` | `apps/tool/storybook/.env` | 없음 | Storybook dev server |
| `be-prisma` | `packages/be-prisma/.env` | `packages/be-prisma/.env.example` | Prisma CLI / bootstrap / data-migrate |

## apps/core/api

| 범주 | 키 | 설명 |
| --- | --- | --- |
| App | `NODE_ENV`, `APP_NAME`, `APP_PORT`, `APP_ADMIN_EMAIL`, `API_PREFIX`, `FRONTEND_DOMAIN`, `BACKEND_DOMAIN`, `APP_FALLBACK_LANGUAGE`, `APP_HEADER_LANGUAGE` | `NODE_ENV`: 실행 환경 구분. `APP_NAME`: 서비스 이름 및 Swagger 제목. `APP_PORT`: API 리슨 포트. `APP_ADMIN_EMAIL`: 운영/관리자 기본 연락처. `API_PREFIX`: API 기본 prefix. `FRONTEND_DOMAIN`: 프론트엔드 기준 URL. `BACKEND_DOMAIN`: 백엔드 기준 URL. `APP_FALLBACK_LANGUAGE`: 기본 언어. `APP_HEADER_LANGUAGE`: 요청 언어 헤더 이름. |
| Database | `DATABASE_URL`, `DIRECT_URL` | `DATABASE_URL`: Prisma 런타임 연결 문자열. `DIRECT_URL`: Prisma direct connection 문자열로 마이그레이션/관리성 작업에 사용됩니다. |
| Auth | `AUTH_JWT_SECRET`, `AUTH_JWT_TOKEN_EXPIRES_IN`, `AUTH_JWT_TOKEN_REFRESH_IN`, `AUTH_JWT_SALT_ROUNDS` | `AUTH_JWT_SECRET`: JWT 서명 키. `AUTH_JWT_TOKEN_EXPIRES_IN`: access token 만료 시간. `AUTH_JWT_TOKEN_REFRESH_IN`: refresh token 만료 시간. `AUTH_JWT_SALT_ROUNDS`: bcrypt 해시 라운드 수. |
| Redis | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | `REDIS_HOST`: Redis 호스트. `REDIS_PORT`: Redis 포트. `REDIS_PASSWORD`: Redis 인증 비밀번호. |
| CORS | `CORS_ENABLED` | CORS 활성화 여부를 설정하는 boolean 문자열입니다. |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_SENDER` | `SMTP_HOST`: 메일 서버 호스트. `SMTP_PORT`: 메일 서버 포트. `SMTP_SECURE`: implicit TLS 사용 여부(`true`/`false`)이며, legacy/OpenBao 환경에서 키가 없거나 공백이면 `SMTP_PORT=465`일 때만 `true`로 fallback 합니다. `SMTP_USERNAME`: 인증 계정. `SMTP_PASSWORD`: 인증 비밀번호. `SMTP_SENDER`: 기본 발신자 주소. |
| Object Storage | `OBJECT_STORAGE_PROVIDER`, `OBJECT_STORAGE_ACCESS_KEY`, `OBJECT_STORAGE_SECRET_KEY`, `OBJECT_STORAGE_API_TOKEN`, `OBJECT_STORAGE_REGION`, `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_PUBLIC_BASE_URL`, `OBJECT_STORAGE_FORCE_PATH_STYLE` | `OBJECT_STORAGE_PROVIDER`: 스토리지 벤더(`aws-s3`/`backblaze-b2`/`cloudflare-r2`). `OBJECT_STORAGE_ACCESS_KEY`: 접근 키. `OBJECT_STORAGE_SECRET_KEY`: 시크릿 키. `OBJECT_STORAGE_API_TOKEN`: 벤더 API 토큰(선택). `OBJECT_STORAGE_REGION`: 스토리지 리전. `OBJECT_STORAGE_BUCKET`: 기본 버킷 이름. `OBJECT_STORAGE_ENDPOINT`: 커스텀 엔드포인트. `OBJECT_STORAGE_PUBLIC_BASE_URL`: 공개 URL base. `OBJECT_STORAGE_FORCE_PATH_STYLE`: path-style URL 강제 여부. |
| OIDC | `OIDC_ISSUER`, `OIDC_JWKS_URI`, `OIDC_ADMIN_BASE_URL`, `OIDC_ADMIN_CLIENT_ID`, `OIDC_ADMIN_CLIENT_SECRET`, `OIDC_ADMIN_REDIRECT_URI`, `OIDC_ADMIN_LOGIN_URL`, `OIDC_ADMIN_DEFAULT_RETURN_TO`, `OIDC_STORYBOOK_BASE_URL`, `OIDC_STORYBOOK_CLIENT_ID`, `OIDC_STORYBOOK_CLIENT_SECRET`, `OIDC_STORYBOOK_REDIRECT_URI`, `OIDC_STORYBOOK_LOGIN_URL`, `OIDC_STORYBOOK_DEFAULT_RETURN_TO` | `OIDC_ISSUER`: IDP issuer base URL. `OIDC_JWKS_URI`: JWKS endpoint. `OIDC_ADMIN_BASE_URL`: admin redirect/login/default return URL을 조합하는 기준 base URL. `OIDC_ADMIN_*`: admin-web 전용 client 설정 및 개별 URL override. `OIDC_STORYBOOK_BASE_URL`: Storybook redirect/login/default return URL을 조합하는 기준 base URL. `OIDC_STORYBOOK_*`: Storybook OIDC client 설정 및 개별 URL override. |
| Dev / Runtime | `ENABLE_NEST_DEVTOOLS`, `CORE_API_NEST_DEVTOOLS_PORT`, `DOCKER_ENV` | `ENABLE_NEST_DEVTOOLS`: Nest Devtools 활성화 여부. `CORE_API_NEST_DEVTOOLS_PORT`: Devtools UI 포트. `DOCKER_ENV`: Docker 환경 여부를 로그/운영 상태 표시용으로 구분할 때 사용합니다. |

## apps/idp/api

| 범주 | 키 | 설명 |
| --- | --- | --- |
| App | `NODE_ENV`, `APP_NAME`, `APP_PORT` | `NODE_ENV`: 실행 환경 구분. `APP_NAME`: 서비스 이름. `APP_PORT`: IDP API 리슨 포트. |
| Database | `DATABASE_URL`, `DIRECT_URL` | `DATABASE_URL`: Prisma 런타임 연결 문자열. `DIRECT_URL`: direct connection 문자열입니다. |
| Auth | `AUTH_JWT_SECRET`, `AUTH_JWT_TOKEN_EXPIRES_IN`, `AUTH_JWT_TOKEN_REFRESH_IN`, `AUTH_JWT_SALT_ROUNDS` | `AUTH_JWT_SECRET`: JWT 서명 키. `AUTH_JWT_TOKEN_EXPIRES_IN`: access token 만료 시간. `AUTH_JWT_TOKEN_REFRESH_IN`: refresh token 만료 시간. `AUTH_JWT_SALT_ROUNDS`: bcrypt 해시 라운드 수. |
| Redis | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | `REDIS_HOST`: Redis 호스트. `REDIS_PORT`: Redis 포트. `REDIS_PASSWORD`: Redis 인증 비밀번호. |
| CORS | `CORS_ENABLED` | CORS 활성화 여부를 설정하는 boolean 문자열입니다. |
| SMTP | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_SENDER` | `SMTP_HOST`: 메일 서버 호스트. `SMTP_PORT`: 메일 서버 포트. `SMTP_SECURE`: implicit TLS 사용 여부(`true`/`false`)이며, legacy/OpenBao 환경에서 키가 없거나 공백이면 `SMTP_PORT=465`일 때만 `true`로 fallback 합니다. `SMTP_USERNAME`: 인증 계정. `SMTP_PASSWORD`: 인증 비밀번호. `SMTP_SENDER`: 기본 발신자 주소. |
| OIDC Provider | `OIDC_ISSUER`, `OIDC_JWKS_URI`, `OIDC_JWKS_KEYS`, `OIDC_COOKIE_SECRET`, `IDP_CLIENT_URL`, `OIDC_STORYBOOK_BASE_URL` | `OIDC_ISSUER`: issuer base URL. `OIDC_JWKS_URI`: JWKS endpoint URL. `OIDC_JWKS_KEYS`: provider가 사용할 JWKS JSON. `OIDC_COOKIE_SECRET`: OIDC 세션 쿠키 서명 키. `IDP_CLIENT_URL`: interaction/error/Swagger redirect 조합에 쓰는 IDP web base URL. `OIDC_STORYBOOK_BASE_URL`: Storybook client URL 조합용 base URL. |
| OIDC RP / Admin | `OIDC_ADMIN_BASE_URL`, `OIDC_ADMIN_CLIENT_ID`, `OIDC_ADMIN_CLIENT_SECRET`, `OIDC_ADMIN_REDIRECT_URI`, `OIDC_ADMIN_LOGIN_URL`, `OIDC_ADMIN_DEFAULT_RETURN_TO` | `OIDC_ADMIN_BASE_URL`: admin redirect/login/default return URL을 조합하는 기준 base URL. `OIDC_ADMIN_*`: admin-web용 client id/secret/redirect 및 로그인/기본 복귀 경로 override. |
| OIDC RP / Storybook | `OIDC_STORYBOOK_CLIENT_ID`, `OIDC_STORYBOOK_CLIENT_SECRET`, `OIDC_STORYBOOK_REDIRECT_URI`, `OIDC_STORYBOOK_LOGIN_URL`, `OIDC_STORYBOOK_DEFAULT_RETURN_TO` | Storybook OIDC client id/secret/redirect 및 로그인/기본 복귀 경로 override입니다. |
| OIDC RP / IDP Web | `OIDC_IDP_WEB_CLIENT_ID`, `OIDC_IDP_WEB_CLIENT_SECRET`, `OIDC_IDP_WEB_REDIRECT_URI` | IDP web 자체를 OIDC client로 등록할 때 쓰는 client id/secret/redirect override입니다. `IDP_CLIENT_URL`이 기본 base URL이고, `OIDC_IDP_WEB_REDIRECT_URI`는 callback URL을 직접 override할 때만 사용합니다. |
| OIDC RP / Swagger | `OIDC_SWAGGER_CLIENT_ID`, `OIDC_SWAGGER_REDIRECT_URI` | Swagger UI authorization client id와 OAuth2 redirect URL override입니다. |
| Devtools | `ENABLE_NEST_DEVTOOLS`, `IDP_API_NEST_DEVTOOLS_PORT` | `ENABLE_NEST_DEVTOOLS`: Nest Devtools 활성화 여부. `IDP_API_NEST_DEVTOOLS_PORT`: Devtools UI 포트. |

## apps/admin/web

| 범주 | 키 | 설명 |
| --- | --- | --- |
| Build / Dev | `NODE_ENV`, `ANALYZE`, `IDP_API_INTERNAL_URL`, `CORE_API_INTERNAL_URL` | `NODE_ENV`: Next.js 실행 모드. `ANALYZE`: bundle analyzer 활성화 여부. `IDP_API_INTERNAL_URL`: 개발 프록시에서 idp-api로 넘길 내부 대상 URL. `CORE_API_INTERNAL_URL`: 개발 프록시에서 core-api로 넘길 내부 대상 URL. |
| Public Runtime | `NEXT_PUBLIC_IDP_CLIENT_URL`, `NEXT_PUBLIC_WS_URL` | `NEXT_PUBLIC_IDP_CLIENT_URL`: 브라우저에서 사용할 IDP web base URL. `NEXT_PUBLIC_WS_URL`: 브라우저에서 사용할 WebSocket base URL. |
| Test | `E2E_SYSTEM_SPACE_ID` | E2E 테스트에서 고정 시스템 스페이스를 참조할 때 사용하는 fixture id입니다. |

## apps/idp/web

| 범주 | 키 | 설명 |
| --- | --- | --- |
| Build / Dev | `NODE_ENV`, `ANALYZE`, `IDP_API_INTERNAL_URL` | `NODE_ENV`: Next.js 실행 모드. `ANALYZE`: bundle analyzer 활성화 여부. `IDP_API_INTERNAL_URL`: 개발 프록시에서 idp-api로 넘길 내부 대상 URL. |

## apps/tool/storybook

| 범주 | 키 | 설명 |
| --- | --- | --- |
| Auth / Proxy | `STORYBOOK_REQUIRE_AUTH`, `STORYBOOK_CORE_API_TARGET`, `STORYBOOK_IDP_API_TARGET` | `STORYBOOK_REQUIRE_AUTH`: Storybook auth plugin 강제 여부. `STORYBOOK_CORE_API_TARGET`: core-api 프록시 대상 URL. `STORYBOOK_IDP_API_TARGET`: idp-api 프록시 대상 URL. |

## packages/be-prisma

| 범주 | 키 | 설명 |
| --- | --- | --- |
| Database / Local | `DATABASE_URL`, `DIRECT_URL` | 로컬 Prisma CLI, bootstrap, data-migrate가 사용하는 기본 연결 문자열입니다. |
| Database / Staging | `DATABASE_URL_STG`, `DIRECT_URL_STG` | `db:pull:stg`, `db:push:stg`, `db:migrate:deploy:stg`, `db:data:migrate:stg` 같은 staging 스크립트에서 `DATABASE_URL`/`DIRECT_URL`로 매핑됩니다. |
| Database / Production | `DATABASE_URL_PROD`, `DIRECT_URL_PROD` | production 대상 Prisma CLI / reference-data 스크립트에서 `DATABASE_URL`/`DIRECT_URL`로 매핑됩니다. |
| OIDC Seed Override | `OIDC_ADMIN_BASE_URL`, `OIDC_ADMIN_REDIRECT_URI`, `OIDC_ADMIN_CLIENT_SECRET`, `OIDC_STORYBOOK_BASE_URL`, `OIDC_STORYBOOK_REDIRECT_URI`, `OIDC_STORYBOOK_CLIENT_SECRET`, `IDP_CLIENT_URL`, `OIDC_IDP_WEB_REDIRECT_URI`, `OIDC_IDP_WEB_CLIENT_SECRET`, `OIDC_ISSUER`, `OIDC_SWAGGER_REDIRECT_URI` | reference-data bootstrap 시 기본 OIDC client redirect URI와 confidential client secret을 환경별 값으로 덮어쓸 때 사용합니다. `OIDC_ADMIN_BASE_URL`: admin redirect 기본 base URL. `OIDC_ADMIN_REDIRECT_URI`: admin redirect 직접 override. `OIDC_ADMIN_CLIENT_SECRET`: admin client secret override. `OIDC_STORYBOOK_BASE_URL`: Storybook redirect 기본 base URL. `OIDC_STORYBOOK_REDIRECT_URI`: Storybook redirect 직접 override. `OIDC_STORYBOOK_CLIENT_SECRET`: Storybook client secret override. `IDP_CLIENT_URL`: idp-web redirect 기본 base URL. `OIDC_IDP_WEB_REDIRECT_URI`: idp-web redirect 직접 override. `OIDC_IDP_WEB_CLIENT_SECRET`: idp-web client secret override. `OIDC_ISSUER`: Swagger redirect 조합 기준 issuer. `OIDC_SWAGGER_REDIRECT_URI`: Swagger redirect 직접 override. |

## Notes

| 항목 | 설명 |
| --- | --- |
| `OIDC_ADMIN_BASE_URL`, `OIDC_STORYBOOK_BASE_URL` | admin/storybook OIDC URL 규칙을 통일하기 위해 새 기본 키로 사용합니다. redirect/login/default return URL은 이 값에서 조합됩니다. |
| `NEXT_PUBLIC_*` | 브라우저에 노출되는 public env입니다. 민감한 값은 넣지 않습니다. |
| `*_INTERNAL_URL` | Next.js / Storybook 서버 측 프록시 대상입니다. 브라우저 공개용 값이 아닙니다. |
| `DATABASE_URL_STG`, `DATABASE_URL_PROD` | `be-prisma`의 `cross-env` 스크립트에서만 사용됩니다. 일반 앱 런타임은 기본적으로 `DATABASE_URL`을 사용합니다. |
