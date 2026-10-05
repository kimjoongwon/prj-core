# 로컬 개발 환경 구성도

로컬 개발 환경의 서비스 구성, 통신 경로, 인증 흐름을 그린 문서입니다.
(2026-09-23 기준 — 발급자 단일화: idp-api가 발급자, idp-web이 공용 로그인 UI,
core-api는 비즈니스 API + 토큰 검증만 담당. prod ingress 구조와 동형)

## 서비스 구성 다이어그램

```mermaid
flowchart LR
    browser["브라우저"]

    subgraph web["admin-web :3000 (Next dev, basePath /admin)"]
        pages["페이지/위젯\n(auth/login · dashboard)"]
        proxy["dev rewrites (프록시)\n/api/v1/auth·/api/v1/idp·/api/v1/oidc-* → idp-api\n비밀번호 재설정·나머지 /api/v1/* → core-api"]
    end

    subgraph idpweb["idp-web :3008 (Next dev) — 인증 origin"]
        loginui["공용 로그인 UI\n/auth/login/[uid] · /auth/consent/[uid] (SSR)"]
        idpproxy["dev rewrites\n/oidc/* · /api/interaction/* → idp-api"]
    end

    subgraph idpapi["idp-api :3007 (Nest) — 발급자"]
        oidc["oidc-provider\n(issuer = http://localhost:3008)"]
        authuc["auth/interaction/oidc-clients·sessions\nidp-accounts·dashboard 유스케이스"]
    end

    subgraph api["core-api :3006 (Nest)"]
        guards["JwtStrategy (RS256/JWKS)\n+ RoleCategory/Space 가드"]
        uc["도메인 유스케이스\n+ 비밀번호 재설정"]
        storage["TokenStorageService\n(sessionId→refreshToken, 블랙리스트)"]
    end

    proposal["proposal-web :3011\n(선택 실행)"]

    subgraph infra["로컬 인프라"]
        redis[("Redis :6379\n(native Homebrew)\nOIDC adapter · throttle · token storage")]
        pgLocal[("PostgreSQL :5432\n(native, OS role wallykim)\nplate · plate_e2e")]
        pgRemote[("원격 공유 DB\n(SSH 터널 :5433)\ncocrepo@…/plate")]
    end

    bao["OpenBao (팀 시크릿)\npnpm secrets:pull → .env 병합"]

    browser -->|"같은 origin 상대경로"| pages
    pages --> proxy
    proxy -->|"IDP_API_INTERNAL_URL\n기본 http://localhost:3007"| authuc
    proxy -->|"CORE_API_INTERNAL_URL\n기본 http://localhost:3006"| guards
    browser -->|"로그인 폼에서 크로스 origin 이동\n(authorize·interaction)"| loginui
    loginui --> idpproxy
    idpproxy --> oidc
    proposal -.->|"독립 실행\n(ingress 라우팅 가정)"| guards

    oidc --> redis
    authuc --> redis
    guards --> uc
    uc --> redis
    storage --> redis
    authuc -->|"DATABASE_URL"| pgLocal
    uc -->|"DATABASE_URL"| pgLocal
    uc -.->|"DATABASE_URL=…:5433 (터널 모드)"| pgRemote

    bao -.->|"SMTP · 객체스토리지 · OIDC_JWKS_KEYS · 클라이언트 시크릿"| idpapi
    bao -.->|"SMTP · 객체스토리지"| api
```

## 로그인 인증 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant B as 브라우저
    participant W as admin-web :3000
    participant I as idp-api :3007 (발급자)
    participant U as idp-web :3008 (로그인 UI)
    participant R as Redis :6379
    participant D as PostgreSQL

    B->>W: GET /admin (루트 진입)
    W-->>B: 307 /admin/auth/login → 307 /api/v1/auth/oidc/login?clientId=admin-web
    W->>I: GET /api/v1/auth/oidc/login (rewrite)
    I-->>B: 302 http://localhost:3008/oidc/auth?…(PKCE S256)
    B->>I: GET /oidc/auth (idp-web origin 경유 rewrite)
    I->>R: interaction 저장
    I-->>B: 302 /auth/login/{uid} (+ _interaction 쿠키, 3008 origin)
    B->>U: GET /auth/login/{uid}
    U->>I: GET /api/interaction/{uid} (SSR — idp-web 서버가 브라우저 쿠키를 전달해 내부 조회)
    I-->>U: 로그인 폼 데이터 (DEV 모드 admin@plate.com 자동입력)
    U-->>B: 로그인 폼 렌더 (첫 페인트부터 폼 포함)
    B->>I: POST /api/interaction/{uid}/login {email, password} (브라우저 XHR — Set-Cookie가 브라우저에 심겨야 함)
    I->>D: 사용자 조회·검증 (securityPolicy 잠금, auth_audit_logs 기록)
    I->>R: provider 세션/grant 저장 (first-party skip-consent 자동 승인)
    I-->>B: 200 {redirectTo}
    B->>I: GET /oidc/auth/{uid} (resume) → code 발급 → 302 localhost:3000/api/v1/auth/callback?code…
    W->>I: GET /api/v1/auth/callback (admin-web origin rewrite)
    I->>I: code ↔ /oidc/token 교환 (refresh_token 발급 — first-party 정책)
    I-->>B: Set-Cookie: accessToken·refreshToken·sessionId (HttpOnly, 3000 origin) + loggedIn (JS 읽기 허용)<br/>302 /admin/dashboard
    B->>W: GET /admin/dashboard
    Note over B,W: SessionBootstrap — loggedIn 마커 확인
    B->>I: POST /api/v1/auth/token/refresh (단일 비행, admin origin rewrite)
    I->>R: 세션 갱신 로테이션
    I-->>B: 200 {accessToken, refreshToken, sessionId, user} → 스토어/persist 저장
    B->>I: GET /api/v1/auth/current-space · /my-spaces (스페이스 자동 선택)
    B->>I: GET /api/v1/auth/verify-token
    B->>W: GET /api/v1/abilities/my 등 도메인 API (Authorization Bearer RS256 — core-api가 JWKS로 검증)
```

## 구성 요소 표

| 구성 요소 | 포트 | 역할 | 비고 |
|---|---|---|---|
| admin-web | 3000 | 어드민 프론트엔드(Next.js dev) | basePath `/admin`. dev 전용 rewrites로 `/api/v1/auth`·`/api/v1/idp`·`/api/v1/oidc-*`는 idp-api로, 비밀번호 재설정과 나머지 `/api/v1/*`는 core-api로 프록시(배포 환경은 ingress가 같은 경로 계약을 담당) |
| idp-api | 3007 | 발급자(oidc-provider) + 인증/IDP 관리 API | issuer `http://localhost:3008`(idp-web 오리진). 공유 DB/Redis 필요, 자체 `.env`(SMTP/OIDC 시크릿). `pnpm start` 선택지 7 — admin-web 선택 시 자동 포함 |
| idp-web | 3008 | 공용 로그인 UI(모든 클라이언트) | `/auth/login/[uid]`·`/auth/consent/[uid]` 소유(SSR — 서버가 `IDP_API_INTERNAL_URL`로 interaction 조회). `/oidc/*`·`/api/interaction/*`·`/api/v1/*`를 idp-api로 프록시. `pnpm start` 선택지 8 — admin-web 선택 시 자동 포함 |
| core-api | 3006 | 백엔드 도메인 API + 비밀번호 재설정 | 발급자 없음 — `OIDC_JWKS_URI`로 idp 발급 토큰을 RS256 검증만 함 |
| proposal-web | 3011 | 퍼블릭 제안 랜딩 | 선택 실행 |
| Redis | 6379 | OIDC 어댑터(interaction/grant/session/code), rate limit, 세션 저장소 | native Homebrew. 여러 세션에서 공유 |
| PostgreSQL (native) | 5432 | 로컬 DB `plate`, e2e DB `plate_e2e` | OS role `wallykim`(trust). `DATABASE_URL` 미지정 시 자동 탐색으로 선택됨 |
| PostgreSQL (터널) | 5433 | 원격 공유 dev DB | SSH 포워딩. 사용하려면 `DATABASE_URL` 명시 |
| OpenBao | — | 팀 시크릿 원천 | `pnpm secrets:pull`이 core-api/idp-api `.env`에 병합(SMTP, 객체스토리지, OIDC 서명 키, 클라이언트 시크릿 — 두 `.env`는 같은 JWKS/쿠키 시크릿 값을 공유) |

## 브라우저 측 인증 상태

- **HttpOnly 쿠키(앱 origin 3000)**: `accessToken`(RS256 at+jwt), `refreshToken`, `sessionId` — JS가 읽을 수 없고 모든 요청에 자동 첨부
- **HttpOnly 쿠키(발급자 origin 3008)**: `_session` 등 OP 세션 쿠키 — SSO 재개·RP-Initiated Logout에 사용
- **`loggedIn` 마커 쿠키**: 비민감 값, JS 읽기 허용. SessionBootstrap/fetch 클라이언트(customFetch)가 이 표시가 없으면 갱신 요청 없이 로그인 화면으로 이동
- **localStorage `admin-persist`**: MobX 스토어 부트스트랩 결과(토큰 세션, 선택 스페이스, 가용 스페이스 목록)

## 주의사항

- **issuer = idp-web 오리진(3008)**: 발급자 엔드포인트(`/oidc/*`)와 로그인 UI는 같은 origin이어야 interaction 세션 쿠키가 로그인 제출 XHR에 실려갑니다. 포트를 바꿀 때는 `OIDC_ISSUER`·`OIDC_INTERACTION_BASE_URL`·`IDP_WEB_PORT`를 함께 맞춰야 합니다(start.sh가 idp-web이 세션에 있으면 자동으로 덮어씁니다).
- **admin-web 로컬 개발은 서버 4개**: admin-web + core-api + idp-api + idp-web — `pnpm start`에서 admin-web을 선택하면 나머지 셋이 자동으로 포함됩니다.
- **Next dev는 프로젝트 디렉터리당 1개만 실행 가능**(`.next/dev` 락). 포트를 바꿔도 두 번째 인스턴스는 뜨지 않습니다.
- **DB는 `DATABASE_URL`이 없으면 자동 탐색** — probe 순서: `DATABASE_URL` → `POSTGRES_*` → 로컬 OS role(native PG 5432) → cocrepo 기본값(docker-compose용). 원격 터널(5433)을 쓰려면 `DATABASE_URL`을 명시하면 됩니다. 계정도 DB에 맞게 사용(5432: `admin@plate.com`, 원격: `local-admin@example.com`).
- 실행은 루트에서 `pnpm start` — OpenBao 시크릿 pull 후 인프라 기동(docker)/마이그레이션/부트스트랩을 거쳐 선택 서비스를 띄웁니다. Docker를 쓰지 않는 머신에서는 `START_SKIP_INFRA_START=1`을 지정합니다. OpenBao가 봉인(sealed) 상태면 pull이 안내 메시지와 함께 실패합니다(봉인 해제: `kubectl exec -n openbao openbao-0 -- bao operator unseal <UNSEAL_KEY>`).
