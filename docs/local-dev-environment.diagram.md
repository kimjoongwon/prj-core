# 로컬 개발 환경 구성도

로컬 개발 환경의 서비스 구성, 통신 경로, 인증 흐름을 그린 문서입니다.
(2026-09-19 기준 — native 인증 경로 제거 후 OIDC 단일 체계)

## 서비스 구성 다이어그램

```mermaid
flowchart LR
    browser["브라우저"]

    subgraph web["admin-web :3000 (Next dev, basePath /admin)"]
        pages["페이지/위젯\n(auth/login · auth/interaction · dashboard)"]
        proxy["dev rewrites (프록시)\n/api/v1/* · /oidc/* · /api/interaction/* 등"]
    end

    subgraph api["core-api :3006 (Nest)"]
        guards["JwtStrategy (RS256/JWKS)\n+ RoleCategory/Space 가드"]
        oidc["임베디드 oidc-provider\n(issuer = http://localhost:3000)"]
        uc["인증/계정/도메인 유스케이스"]
        storage["TokenStorageService\n(sessionId→refreshToken, 블랙리스트)"]
    end

    proposal["proposal-web :3011\n(선택 실행)"]

    subgraph infra["로컬 인프라"]
        redis[("Redis :6379\n(native Homebrew)\nOIDC adapter · throttle · token storage")]
        pgLocal[("PostgreSQL :5432\n(native, OS role wallykim)\nplate · plate_e2e")]
        pgRemote[("원격 공유 DB\n(SSH 터널 :5433)\ncocrepo@…/plate")]
    end

    bao["OpenBao (팀 시크릿)\npnpm secrets:pull → .env 병합"]

    browser -->|"HTTPS 없음 localhost"| pages
    pages -->|"같은 origin 상대경로"| proxy
    proxy -->|"CORE_API_INTERNAL_URL\n기본 http://localhost:3006"| guards
    browser -.->|"직접 접근 없음\n(모든 /api·/oidc는 3000 경유)"| api
    proposal -.->|"독립 실행\n(ingress 라우팅 가정)"| guards

    guards --> uc
    uc --> oidc
    oidc --> redis
    uc --> redis
    storage --> redis
    uc -->|"DATABASE_URL"| pgLocal
    uc -.->|"DATABASE_URL=…:5433 (터널 모드)"| pgRemote

    bao -.->|"SMTP · 객체스토리지 · OIDC_JWKS_KEYS · 클라이언트 시크릿"| api
```

## 로그인 인증 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant B as 브라우저
    participant W as admin-web :3000
    participant A as core-api :3006
    participant R as Redis :6379
    participant D as PostgreSQL

    B->>W: GET /admin/auth/login
    Note over B,W: 400ms 후 자동 이동 (수동 버튼도 노출)
    W->>A: GET /api/v1/auth/oidc/login?clientId=admin-web (프록시)
    A-->>B: 302 /oidc/auth?…(PKCE S256, scope openid profile email roles offline_access)
    B->>A: GET /oidc/auth (프록시 → 임베디드 provider)
    A->>R: interaction 저장
    A-->>B: 303 /admin/auth/interaction/{uid} (+_interaction 쿠키)
    B->>A: GET /api/interaction/{uid} (프록시)
    A->>R: interaction 조회
    A-->>B: 로그인 폼 데이터 (DEV 모드 admin@plate.com 자동입력)
    B->>A: POST /api/interaction/{uid}/login {email, password}
    A->>D: 사용자 조회·검증 (securityPolicy 잠금, auth_audit_logs 기록)
    A->>R: provider 세션/grant 저장 (first-party skip-consent 자동 승인)
    A-->>B: 200 {redirectTo}
    B->>A: GET /oidc/auth/{uid} (resume) → code 발급 → 302 /api/v1/auth/callback?code…
    A->>A: code ↔ /oidc/token 교환 (refresh_token 발급 — first-party 정책)
    A-->>B: Set-Cookie: accessToken·refreshToken·sessionId (HttpOnly) + loggedIn (JS 읽기 허용)<br/>302 /admin/dashboard
    B->>W: GET /admin/dashboard
    Note over B,W: SessionBootstrap — loggedIn 마커 확인
    B->>A: POST /api/v1/auth/token/refresh (단일 비행)
    A->>R: 세션 갱신 로테이션
    A-->>B: 200 {accessToken, refreshToken, sessionId, user} → 스토어/persist 저장
    B->>A: GET /api/v1/auth/current-space · /my-spaces (스페이스 자동 선택)
    B->>A: GET /api/v1/auth/verify-token · /api/v1/abilities/my (Authorization Bearer RS256)
```

## 구성 요소 표

| 구성 요소 | 포트 | 역할 | 비고 |
|---|---|---|---|
| admin-web | 3000 | 어드민 프론트엔드(Next.js dev) | basePath `/admin`. dev 전용 rewrites로 `/api`, `/oidc`를 core-api로 프록시(배포 환경은 ingress가 같은 경로 처리) |
| core-api | 3006 | 백엔드 API + 임베디드 oidc-provider | issuer는 `http://localhost:3000`(admin-web 오리진). 토큰 검증은 RS256/JWKS 단일 전략 |
| proposal-web | 3011 | 퍼블릭 제안 랜딩 | 선택 실행 |
| Redis | 6379 | OIDC 어댑터(interaction/grant/session/code), rate limit, 세션 저장소 | native Homebrew. 여러 세션에서 공유 |
| PostgreSQL (native) | 5432 | 로컬 DB `plate`, e2e DB `plate_e2e` | OS role `wallykim`(trust). `pnpm start` 시 `DATABASE_URL` 명시 필요 |
| PostgreSQL (터널) | 5433 | 원격 공유 dev DB | SSH 포워딩. 병렬 세션 등에서 이쪽을 바라보고 실행되기도 함 |
| OpenBao | — | 팀 시크릿 원천 | `pnpm secrets:pull`이 core-api `.env`에 병합(SMTP, 객체 스토리지, OIDC 서명 키, 클라이언트 시크릿) |

## 브라우저 측 인증 상태

- **HttpOnly 쿠키**: `accessToken`(RS256 at+jwt), `refreshToken`, `sessionId` — JS가 읽을 수 없고 모든 요청에 자동 첨부
- **`loggedIn` 마커 쿠키**: 비민감 값, JS 읽기 허용. SessionBootstrap/axios 인터셉터가 이 표시가 없으면 갱신 요청 없이 로그인 화면으로 이동
- **localStorage `admin-persist`**: MobX 스토어 부트스트랩 결과(토큰 세션, 선택 스페이스, 가용 스페이스 목록)

## 주의사항

- **issuer·redirect_uri는 admin-web 오리진(3000)**: provider 엔드포인트(`/oidc/*`)의 물리적 처리는 core-api지만 URL은 3000을 경유합니다. core-api를 다른 포트로 띄우면 `OIDC_ISSUER`/`OIDC_ADMIN_BASE_URL`/`ADMIN_WEB_URL`을 함께 맞춰야 합니다.
- **Next dev는 프로젝트 디렉터리당 1개만 실행 가능**(`.next/dev` 락). 포트를 바꿔도 두 번째 인스턴스는 뜨지 않습니다.
- **DB는 `DATABASE_URL`이 없으면 자동 탐색** — probe 순서: `DATABASE_URL` → `POSTGRES_*` → 로컬 OS role(native PG 5432) → cocrepo 기본값(docker-compose용). 원격 터널(5433)을 쓰려면 `DATABASE_URL`을 명시하면 됩니다. 계정도 DB에 맞게 사용(5432: `admin@plate.com`, 원격: `local-admin@example.com`).
- 실행은 루트에서 `pnpm start` — OpenBao 시크릿 pull 후 인프라 기동(docker)/마이그레이션/부트스트랩을 거쳐 선택 서비스를 띄웁니다. Docker를 쓰지 않는 머신에서는 `START_SKIP_INFRA_START=1`을 지정합니다. OpenBao가 봉인(sealed) 상태면 pull이 안내 메시지와 함께 실패합니다(봉인 해제: `kubectl exec -n openbao openbao-0 -- bao operator unseal <UNSEAL_KEY>`).
