# page page 기획서

> 생성일: 2026-03-03
> 타입: page
> 위치: apps/idp/web/src/app/(console)/oidc-clients/[oidcClientId]/page.tsx

## 역할

이 파일은 page 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@cocrepo/api/idp/oidc-clients` | OIDC 클라이언트 상세 조회, 활성 상태 전환, 삭제 |
| `@cocrepo/ui` | `DetailPage`, `DetailSection`, `SecretField`, `ConfirmModal` |
| `@heroui/react` | 액션 버튼, chip, 삭제 확인 상태 |

## 동작 흐름

1. OIDC 클라이언트 상세 데이터를 조회하고 활성화/삭제 액션을 준비합니다.
2. 결과를 `DetailPage`와 `DetailSectionCard` 기반 detail shell로 조합합니다.
3. 기본 정보, 인증 설정, Redirect URI, 추가 정보를 읽기 전용으로 렌더링합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 콘텐츠 구성

| 영역 | 구성 요소 | 설명 |
|------|-----------|------|
| 페이지 헤더 | `DetailPage` + `PageTitleBar` | client id/name과 목록 복귀, 수정, 활성화, 삭제 액션 |
| 기본 정보 | `DetailSectionCard` + `SecretField` | client id/secret, 이름, 활성 상태, first-party 신뢰 구분, 권한 동의 화면 생략 상태, 등록일 |
| 인증 설정 | `DetailSectionCard` | 인증 방식, grant/response type, scope |
| Redirect URIs / 로그인 화면 설정 / 추가 정보 | `DetailSectionCard` | redirect URI 목록, `loginUi` 표시 설정, logo/policy/tos URI |

## 화면 러프

### Desktop

```text
(console) layout > children
┌──────────────────────────────────────────────────────────────┐
│ OidcClientDetailPage                                         │
│ admin-web                                  [수정][비활성][삭제]│
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 기본 정보                                                │ │
│ │ 신뢰 구분 [First-party]  권한 동의 화면 [생략]           │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ 인증 설정 / Redirect URIs / 로그인 화면 설정 / 추가 정보 │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Tablet

```text
(console) layout > children
┌──────────────────────────────────────────────┐
│ admin-web                         [actions]  │
│ ┌──────────────────────────────────────────┐ │
│ │ 기본 정보 grid는 2열에서 1~2열로 조정    │ │
│ │ [First-party] [생략/표시] chip 유지      │ │
│ ├──────────────────────────────────────────┤ │
│ │ 긴 URI와 URL은 줄바꿈/가로폭 안에서 표시 │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Mobile

```text
(console) layout > children
┌──────────────────────────────┐
│ admin-web                     │
│ [목록][수정][비활성][삭제]    │
│ ┌──────────────────────────┐ │
│ │ 기본 정보                │ │
│ │ 신뢰 구분                │ │
│ │ [First-party]            │ │
│ │ 권한 동의 화면           │ │
│ │ [생략] 또는 [표시]       │ │
│ ├──────────────────────────┤ │
│ │ 인증 설정                │ │
│ ├──────────────────────────┤ │
│ │ Redirect URIs            │ │
│ │ 긴 값은 break-all        │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/idp/web/src/app/(console)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/(console)/oidc-clients/[oidcClientId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface` |

- `page.tsx`는 OIDC 클라이언트 상세 조회, 활성 상태 전환, 삭제, 라우팅만 담당하고 `isFirstParty`, `skipConsent`, `loginUi` 표시를 포함한 시각 조합은 `OidcClientDetailPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `detail`
- reusable target: `detail/view`
- screen component path: `packages/fe-ui/src/screen/OidcClientDetailPage/OidcClientDetailPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 상세 route sidecar에 Desktop/Tablet/Mobile detail 화면 러프와 신뢰 구분/consent chip 표시 기준을 추가 | codex |
| 2026-05-09 | OIDC 클라이언트 상세 표시 계약에 `isFirstParty` 전달 추가 | codex |
| 2026-05-05 | OIDC 클라이언트 상세 표시 계약에 client별 로그인 화면 설정 `loginUi` 전달 추가 | codex |
| 2026-05-05 | OIDC 클라이언트 상세 표시 계약에 권한 동의 화면 생략 상태 전달 추가 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `OidcClientDetailPage` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-22 | parent `(console)` layout 참조와 primitive skeleton 범위를 최신 계약으로 보정 | codex |
| 2026-03-22 | OIDC 클라이언트 상세를 `DetailPage`/`DetailSectionCard` 기반 detail/view shell로 정리하고 spec 의존성을 동기화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | Biome import 정렬 규칙 반영에 맞춰 OIDC 클라이언트 상세 E2E lint 기준을 동기화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | IDP 로그인 헬퍼 import를 test-e2e 경로로 변경 | codex |
| 2026-03-04 | 로그인 헬퍼 import를 @cocrepo/e2e 패키지 경로로 전환 | codex |
