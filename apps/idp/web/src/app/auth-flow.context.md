# IDP 인증 및 Consent 흐름 컨텍스트

> 타입: app-context
> 위치: apps/idp/web/src/app/auth-flow.context.md

## /auth/login redirect-only entrypoint

```mermaid
flowchart TD
  A["모바일 웹/관리자/외부 앱: 로그인 필요"] --> B["GET /auth/login"]
  B --> C{"error query 존재?"}
  C -- yes --> D["/error?error=... 이동"]
  C -- no --> E["/api/v1/auth/login?clientId=idp-web&returnTo=... 302"]
  E --> F["OIDC authorize"]
  F --> G["prompt에 따라 /auth/login/[uid] 또는 /auth/consent/[uid]"]
  G --> H["로그인 폼 또는 권한 동의 화면"]
```

- `/auth/login`은 사용자가 머무르는 화면이 아니라 IDP Web의 로그인 진입 URL입니다.
- `returnTo`는 같은 origin의 URL만 허용하고, 외부 origin은 `/dashboard`로 대체합니다.
- callback 실패처럼 `error` query가 붙은 요청은 `/error` 화면으로 넘깁니다.

## /auth/login/[uid] · /auth/consent/[uid] 라우팅과 렌더

```mermaid
flowchart TD
  A["provider interactions.url<br/>(prompt.name 기준 분기)"] --> B{"prompt"}
  B -- login --> L["/auth/login/[uid] (서버 컴포넌트)"]
  B -- consent --> C["/auth/consent/[uid] (서버 컴포넌트)"]
  L --> LQ{"SSR interaction 조회<br/>(쿠키 포워딩, IDP_API_INTERNAL_URL)"}
  C --> CQ{"SSR interaction 조회"}
  LQ -- 만료/오류 --> F["실패 화면 + 복구 액션"]
  CQ -- 만료/오류 --> F
  LQ -- type 불일치 --> C
  CQ -- type 불일치 --> L
  LQ -- 성공 --> LF["로그인 폼 렌더<br/>(첫 페인트부터 폼 포함)"]
  CQ -- 성공 --> CF["권한 동의 화면 렌더"]
  LF --> S["POST /api/interaction/:uid/login (브라우저 XHR)"]
  S --> R["redirectTo → /oidc/auth/:uid resume"]
  R --> RC{"동의 필요?"}
  RC -- yes --> A2["새 interaction uid로<br/>/auth/consent/[uid]"]
  RC -- no --> K["callback 이동"]
  CF --> CC["POST /api/interaction/:uid/confirm 또는 abort"]
  CC --> K
  A2 --> CF
```

- 모바일 웹 공통 로그인 화면은 `/auth/login/[uid]`가, 권한 동의 화면은 `/auth/consent/[uid]`가 소유합니다.
- 두 페이지 모두 서버 컴포넌트로 interaction을 조회(SSR)해 첫 페인트부터 폼/동의 화면을 렌더합니다. 제출(로그인·동의·취소)은 세션 쿠키가 브라우저에 심겨야 하므로 브라우저 XHR로만 수행합니다.
- URL과 interaction type이 어긋나면 서버가 반대 라우트로 redirect합니다.
- 작은 viewport에서도 입력, 권한 목록, 주요 CTA가 넘치지 않아야 합니다.

## Admin OIDC Client first-party 설정

```mermaid
flowchart TD
  A["OIDC Client 생성/수정"] --> B["First-party 클라이언트 토글"]
  B -- off --> C["skipConsent=false / Consent 생략 토글 비활성"]
  B -- on --> D["Consent 생략 토글 활성"]
  D --> E{"skipConsent=true?"}
  E -- yes --> F["first-party + consent 생략"]
  E -- no --> G["first-party지만 consent 표시"]
  C --> H["third-party / consent 표시"]
```

- First-party는 플랫폼이 소유하거나 신뢰하는 client를 FULL_ACCESS 관리자가 수동 지정합니다.
- `skipConsent`는 별도 값이지만, `isFirstParty=true`일 때만 유효합니다.

## Runtime consent skip 판단

```mermaid
flowchart TD
  A["OIDC authorize request"] --> B["client 조회"]
  B --> C{"prompt=consent?"}
  C -- yes --> D["Consent 화면 표시"]
  C -- no --> E{"client.isFirstParty && client.skipConsent?"}
  E -- yes --> F["Grant 자동 생성/재사용"]
  E -- no --> D
  F --> G["callback redirect"]
  D --> G
```

- consent skip 판단은 DB의 `isFirstParty && skipConsent`만 사용합니다.
- `prompt=consent`는 항상 우선하며, first-party + skipConsent 설정도 무시하고 동의 화면을 표시합니다.
