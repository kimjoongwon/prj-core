# fe-page-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-page-builder.toml

## 역할

`fe-page-builder`는 더 이상 page-level visual component 자체를 소유하지 않습니다.
이제 역할은 `apps/admin/web/src/app/**/page.tsx`, `apps/idp/web/src/app/**/page.tsx`,
`@slot/**/page.tsx`의 thin route container를 구현하는 것입니다.

순수 page visual composition은 `fe-ui-page-builder`가 `packages/fe-ui/src/page/[PageName]/[PageName].tsx`에 구현하고,
`fe-page-builder`는 그 page component를 import해 데이터와 핸들러를 연결합니다.
즉, pure page component 생성/수정 owner는 아니고 pure page 소비/연결 owner입니다.

## 운영 규칙

- app route `page.tsx`와 `@slot/**/page.tsx`는 thin container만 허용합니다.
- 시각 page owner는 반드시 `packages/fe-ui/src/page/[PageName]/[PageName].tsx`입니다.
- route page는 API 조회, router/search params 해석, redirect, handler wiring만 담당합니다.
- route page는 pure page component를 import해 props를 주입하며, pure page owner를 직접 생성/수정하지 않습니다.
- route page가 feature/widget/page-level 시각 트리를 직접 소유하면 안 됩니다.
- `Rendering Decision.page component path`는 반드시 `packages/fe-ui/src/page/[PageName]/[PageName].tsx` 형식을 사용합니다.
- 작업 시작 전에 반드시 sibling `layout.spec.md`와 `page.spec.md`를 읽고 `Consumed Layout Contract`를 확인해야 합니다.
- `_client.tsx`, `_prefetch.ts`, `HydrationBoundary` 기반 SSR/prefetch 패턴은 개발자 승인된 예외에서만 허용합니다.
- page 단위 `useSuspenseQuery`는 기본 패턴이 아니며, 기본 조회는 `useQuery`/`useInfiniteQuery`로 연결합니다.
- `page.spec.md`의 `Rendering Decision`에는 `page role`, `reusable target`, `page component path`가 포함되어야 합니다.
- page state는 `fe-page-builder`가 설계하고 소유합니다.
  - 페이지당 하나의 page MobX class를 선언합니다.
  - class constructor에서 `makeAutoObservable(this)`를 호출합니다.
  - route page에서는 `useLocalObservable(() => new PageStateClass())`로 인스턴스화합니다.
  - action / computed / reaction / 상태 변경은 class 내부에서 처리합니다.
  - state root key: pure page 이름의 lower camel case (`loginPage`, `forgotPasswordPage`)
  - UI slice key: component 이름의 lower camel case (`loginForm`, `resetPasswordForm`)
  - logic state key: 목적이 드러나는 명칭 (`resetPasswordStep`, `interactionErrorMessage`)
  - 예시: `class LoginRoutePageState { loginPage = { loginForm: { username: "", password: "" } } }`
  - pure page에는 항상 `state={state.loginPage}` 같은 page slice만 전달합니다.
- route/page는 form submit/click 이벤트도 함께 설계합니다.
  - child form에는 이벤트 handler props를 직접 넘기지 않고 wrapper에서 native event를 바인딩합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | page state 예시를 plain object 대신 page MobX class 예시로 교체 | codex |
| 2026-04-22 | route/page state를 page MobX class + `makeAutoObservable` + `useLocalObservable(() => new ...)` 패턴으로 명시 | codex |
| 2026-04-22 | route/page state 구현이 plain object가 아닌 MobX observable object여야 한다는 규칙을 추가 | codex |
| 2026-04-22 | route/page가 form 이벤트 소유권도 설계하고 child form에는 handler props를 직접 넘기지 않는 규칙을 추가 | codex |
| 2026-04-22 | page state owner를 `fe-page-builder`로 명시하고 root/component naming 규칙을 추가 | codex |
| 2026-04-22 | page-level `SuspenseQuery` 지양 정책에 맞춰 thin container 기본 조회를 `useQuery` 중심으로 정리 | codex |
| 2026-04-21 | `fe-page-builder`를 pure page 생성자가 아닌 pure page import/use thin container로 명시 | codex |
| 2026-03-26 | page owner 경로를 folder-based sidecar 기준으로 구체화 | codex |
| 2026-03-26 | thin container가 참조하는 page component 경로를 folder-based sidecar 패턴으로 명시 | codex |
| 2026-03-25 | pure page와 thin route container를 분리하고, fe-page-builder를 app route 전용으로 재정의 | codex |
| 2026-03-21 | `master/detail/form` 페이지 역할 분류와 `reusable target` 계약을 추가 | codex |
| 2026-03-21 | route layout ownership 기준에 맞게 page builder를 콘텐츠 전용으로 재정의 | codex |
| 2026-03-21 | named slot 콘텐츠(`@slot/**/page.tsx`) 지원 규칙을 추가 | codex |
