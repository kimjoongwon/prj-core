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
  F --> G["/interaction/[uid]"]
  G --> H["로그인 또는 Consent 화면"]
```

- `/auth/login`은 사용자가 머무르는 화면이 아니라 IDP Web의 로그인 진입 URL입니다.
- `returnTo`는 같은 origin의 URL만 허용하고, 외부 origin은 `/dashboard`로 대체합니다.
- callback 실패처럼 `error` query가 붙은 요청은 `/error` 화면으로 넘깁니다.

## /interaction/[uid] 화면 전환

```mermaid
flowchart TD
  A["/interaction/[uid]"] --> B{"interaction detail 로딩"}
  B -- loading --> C["로그인 화면을 준비하고 있어요"]
  C --> D{"약 4초 이상 유지?"}
  D -- yes --> E["다시 시도 액션 노출"]
  D -- no --> B
  B -- error --> F["오류 화면 + 복구 액션"]
  B -- loaded --> G{"인증 필요?"}
  G -- yes --> H["로그인 폼"]
  G -- no --> I{"Consent 필요?"}
  I -- yes --> J["권한 동의 화면"]
  I -- no --> K["callback 이동"]
  H --> I
  J --> K
```

- 모바일 웹 공통 로그인 화면은 `/interaction/[uid]`가 소유합니다.
- 준비 상태 문구는 "로그인 화면을 준비하고 있어요"와 "잠시 후 안전한 인증 화면으로 이동합니다."를 사용합니다.
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
