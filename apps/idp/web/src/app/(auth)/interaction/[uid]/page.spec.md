# OIDC Interaction 페이지 기획서

> 생성일: 2026-03-03
> 수정일: 2026-05-09
> 타입: page
> 경로: `/interaction/[uid]`

## 재사용 우선 점검

| 후보 | 판단 | 이유 |
|------|------|------|
| `useGetInteraction(uid)` | 재사용 | interaction 타입 분기와 만료 판별의 기준 데이터로 충분하다. |
| `OidcInteractionPage` | 재사용 | loading/error/login/consent의 page-level 시각 구성을 page 레이어로 위임할 수 있다. |
| 기존 `AuthCard` 기반 full-screen 콘텐츠 구조 | 재사용 불가 | route layout이 shell을 소유해야 하므로 page 내부에서 full-screen 카드 레이아웃을 계속 중첩하면 책임이 충돌한다. |

## 사용자 시나리오

1. 사용자는 외부 클라이언트에서 보호된 리소스 접근 후 OIDC interaction URL로 이동한다.
2. 페이지는 `uid` 기준으로 interaction 상태를 조회하고, loading이 약 4초 이상 지속되면 복구 액션을 노출한다.
3. `type === "login"`이면 route-local login state와 `client.loginUi` 표시 설정을 준비한 뒤 primary panel 안에 로그인 입력 폼을 노출한다.
4. 로그인 실패 시 입력한 이메일은 유지하고, 실패 사유에 따라 잔여 시도/잠금 복구 액션을 가장 가까운 위치에서 안내한다.
5. `type === "consent"`이면 권한 요청 정보를 보여주고 승인/거절을 진행한다.
6. interaction이 만료되었거나 찾을 수 없으면 현재 요청을 복구할 수 없는 상태임을 설명하고 `/auth/login` 재진입 액션을 제공한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| route shell | `(auth)/layout.tsx` | 전체 배경, 중앙 배치, support copy, primary panel frame |
| loading | `OidcInteractionPage` loading mode | interaction 데이터 조회 중 |
| login | `OidcInteractionPage` + `OidcLoginForm` | 로그인 폼, 에러, recovery action |
| consent | `OidcInteractionPage` + `OidcConsentPanel` | scope 승인/거절 |
| error | `OidcInteractionPage` error mode | 만료/오류 상태 설명과 복구 액션 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| `isLoading` | interaction 조회 중 | 중앙 spinner + "로그인 화면을 준비하고 있어요" + 4초 후 "다시 시도" |
| `login` | 로그인 필요 | 서비스명, 로그인 목적, 입력 폼, 복구 링크 |
| `consent` | 권한 동의 필요 | scope 목록, 승인/거절 버튼 |
| `expired` | 400/404 만료 또는 유효하지 않은 UID | 만료 안내, `/auth/login` 재진입 CTA |
| `error` | 기타 오류 | 일반 오류 메시지, 이전 페이지 또는 안전한 복귀 CTA |

## 화면 러프

### Desktop

```text
(auth) layout shell
┌───────────────────────────────┬────────────────────────────────┐
│ IDP 안내/브랜드 영역           │ primary panel                   │
│ layout이 소유                  │ ┌────────────────────────────┐ │
│                               │ │ OidcInteractionPage        │ │
│                               │ │ loading/login/consent/error│ │
│                               │ │ branch를 route state로 주입 │ │
│                               │ └────────────────────────────┘ │
└───────────────────────────────┴────────────────────────────────┘

loading 4초 이상:
┌────────────────────────────┐
│ 로그인 화면을 준비하고 있어요 │
│ 잠시 후 안전한 인증 화면으로 이동합니다. │
│ [다시 시도]                │
└────────────────────────────┘
```

### Tablet

```text
(auth) layout shell
┌──────────────────────────────────────┐
│ intro 영역은 layout 정책에 따라 축소  │
├──────────────────────────────────────┤
│ primary panel                         │
│ ┌──────────────────────────────────┐ │
│ │ 로그인/동의/오류 branch          │ │
│ │ route가 uid 조회 결과와 handler를 │ │
│ │ OidcInteractionPage에 전달        │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Mobile

```text
360px 기준 auth shell
┌──────────────────────────────┐
│ primary panel                 │
│ ┌──────────────────────────┐ │
│ │ loading                  │ │
│ │ 로그인 화면을 준비...    │ │
│ │ 4초 후 [다시 시도]       │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ login                    │ │
│ │ 이메일/비밀번호/CTA      │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ consent                  │ │
│ │ scope 목록 + 세로 CTA    │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 페이지 진입 | `useGetInteraction(uid)` | interaction type, client, prompt, dev mode 조회 |
| 로그인 제출 | `useSubmitLogin` | `IdpLogin`에서 위임 수행 |
| interaction 중단 | `useAbortInteraction` | `IdpLogin` 또는 `IdpConsent`에서 위임 수행 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| interaction 조회 성공 | `type` 값에 따라 `IdpLogin` 또는 `IdpConsent` 렌더링 |
| interaction 만료 오류 | `/auth/login`으로 안전하게 복귀 |
| 일반 오류 상태 CTA | 가능한 경우 `history.back()`, 불가 시 안전한 로그인 진입점으로 복귀 |

## 훅 및 하위 Feature 구성

| 항목 | 위치 | 역할 |
|------|------|------|
| `useGetInteraction` | `@cocrepo/api/idp/interaction` | interaction 데이터 조회 |
| `OidcInteractionPage` | `packages/fe-ui/src/screen/OidcInteractionPage/OidcInteractionPage.tsx` | 상태별 page-level 시각 구성 |
| `OidcLoginForm` | `packages/fe-ui/src/form/OidcLoginForm/` | 로그인 폼 widget |
| `OidcConsentPanel` | `packages/fe-ui/src/form/OidcConsentPanel/` | 권한 동의 widget |

## 특이사항

- `page.tsx`는 interaction type 분기와 복구 흐름만 소유하고, 실제 form layout 세부는 하위 feature/widget spec을 따른다.
- 모바일 웹 공통 진입 화면이므로 loading/login/consent/error branch는 360px 폭에서도 CTA와 입력이 넘치지 않도록 유지한다.
- 로그인 branch는 이번 재기획의 1차 대상이며, 동일 shell 계약을 비밀번호 찾기/재설정/에러 페이지에도 확장한다.
- 에러 상태에서도 사용자가 "무엇을 해야 하는지"를 즉시 이해할 수 있도록 기술적인 오류 문구보다 복구 행동을 우선 배치한다.

## 구현 체크리스트

- [ ] interaction loading/error/login/consent 상태 문구를 재기획안과 동기화
- [ ] `IdpLogin`이 route shell 내부 콘텐츠만 렌더링하도록 계약 정리
- [ ] 만료/오류 복귀 액션을 단일 정책으로 정리

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/idp/web/src/app/(auth)/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/idp/web/src/app/(auth)/interaction/[uid]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface`, full-screen auth shell |

- `page.tsx`는 route shell이 제공하는 primary panel 내부 콘텐츠만 담당합니다.
- login branch의 `oidcLoginForm` state와 interaction 모드/오류/client/scope/client별 `loginUi` 상태는 route page가 `InteractionRoutePageState` class 안에서 함께 설계합니다.
- route page에서는 `useLocalObservable(() => new InteractionRoutePageState())`로 인스턴스화하고 pure screen에는 page class 인스턴스를 그대로 주입합니다.
- login/consent의 실제 submit/click handler는 route page가 소유하고 pure screen/form에는 state와 page-level handler만 전달합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `form`
- reusable target: `form`
- screen component path: `packages/fe-ui/src/screen/OidcInteractionPage/OidcInteractionPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | Desktop/Tablet/Mobile 기준 route-level interaction 화면 러프와 loading 복구 CTA 흐름을 추가 | codex |
| 2026-05-09 | loading 문구를 로그인 준비 상태로 변경하고 4초 후 재시도 복구 액션을 노출하도록 갱신 | codex |
| 2026-05-05 | interaction 조회 응답의 `client.loginUi`를 route state에 보존해 IDP Web 로그인 화면을 client-aware로 렌더링하도록 갱신 | codex |
| 2026-04-22 | route page state를 `InteractionRoutePageState` class + `makeAutoObservable` + `useLocalObservable(() => new ...)` 패턴으로 정리 | codex |
| 2026-05-04 | 개발 모드 기본 로그인 계정 이메일을 Onora 브랜드 기준으로 변경 | codex |
| 2026-04-22 | route page가 `oidcInteractionPage` 자체를 `useLocalObservable` 기반 observable slice로 소유하도록 기준을 보강 | codex |
| 2026-04-22 | consent용 `oidcConsentPanel` state slice를 route state에 추가하고 실제 action handler는 route/page wrapper가 소유하도록 정리 | codex |
| 2026-04-22 | `fe-route-agent` 기준에 맞춰 route state root를 `oidcInteractionPage`로 두고 UI slice를 `oidcLoginForm` 이름으로 정리 | codex |
| 2026-04-22 | interaction login branch가 route-local form state를 소유하고 pure screen로 주입하도록 정리 | codex |
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-26 | `OidcInteractionPage` 경로를 page 폴더 기반 sidecar 구조에 맞게 갱신 | codex |
| 2026-03-25 | `OidcInteractionPage`를 도입해 loading/error/login/consent 시각 구성을 page 레이어로 이동하고 route page는 API/handler wiring만 담당하도록 정리 | codex |
| 2026-03-23 | 로그인 UX 재기획에 맞춰 interaction page의 상태 분기, route shell 소비 계약, 복구 UX 기준을 구체화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-14 | 존재하지 않는 계정 로그인 실패 시나리오를 공통 실패 처리 계약(에러 배너 또는 로그인 폼 재표시) 기준으로 정렬 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-14 | Biome import 정렬 규칙 반영에 맞춰 E2E 시나리오 lint 기준을 동기화 | codex |
| 2026-03-06 | 공통 로그인 헬퍼 import를 `@cocrepo/e2e`(fe-e2e 패키지)로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | IDP 로그인 헬퍼 import를 test-e2e 경로로 변경 | codex |
| 2026-03-04 | 로그인 헬퍼 import를 @cocrepo/e2e 패키지 경로로 전환 | codex |
