# LoginPage Screen Planning Spec

> 생성일: 2026-03-03
> 갱신일: 2026-06-06
> 타입: Screen/Feature Planning Spec
> 위치: `packages/fe-ui/src/screen/LoginPage/LoginPage.tsx`
> 상위 route/page spec: `apps/admin/web/src/app/auth/login/page.spec.md`
> 상위 service spec: `docs/services/admin-auth.delivery.spec.md`
> 상태: reusable Screen UI 계약 owner

## 상위 참조

| row id | 상위 spec | section/row id | 결정값 | 이 planning spec의 소비 방식 |
|--------|-----------|----------------|--------|-------------------------------|
| LOGIN-SCREEN-REF-SERVICE | `docs/services/admin-auth.delivery.spec.md` | `AUTH-REF-SCREEN`, `AUTH-DESIGN-*` | 관리자 native login은 상태와 다음 행동을 먼저 보여주는 auth screen을 재사용한다. | service-level 목표/색상 역할/QA 기준만 참조 |
| LOGIN-SCREEN-REF-ROUTE | `apps/admin/web/src/app/auth/login/page.spec.md` | `LOGIN-ROUTE-SCREEN-LOGIN`, `LOGIN-ROUTE-FORM-NO-SPEC` | route가 `LoginPage`에 state/event/loading/title/caption을 주입한다. | 화면 러프, props/event, 상태별 렌더링, `LoginForm` 하위 조합을 소유 |

## 목표

| row id | 항목 | 내용 |
|--------|------|------|
| LOGIN-SCREEN-GOAL | Screen 목표 | 로그인 page 레이어에서 보안 세션 badge, 제목/설명, API scope hint, 입력 form, page-level feedback, submit CTA를 한 surface로 조합한다. |
| LOGIN-SCREEN-BOUNDARY | 소유 경계 | 이 spec은 reusable `LoginPage` UI 출력물과 props/event/rendering/story/unit 계약만 소유한다. Route wiring, API 호출, session 저장, E2E는 route/page spec이 소유한다. |
| LOGIN-SCREEN-REUSE | 재사용 전략 | 기존 `LoginPage` screen과 `LoginForm` form을 재사용/검증한다. 신규 Feature나 Widget은 만들지 않는다. |
| LOGIN-SCREEN-NO-FORM-SPEC | form spec 미생성 사유 | `LoginForm`은 현재 `LoginPage` 하위 입력 조합으로 충분히 설명되며, 변경된 기준의 planning spec 대상은 Screen/Feature다. 따라서 `packages/fe-ui/src/form/LoginForm/LoginForm.spec.md`는 생성하지 않는다. |

## UI 산출물 인벤토리

| row id | 컴포넌트 | 생성 폴더 | 재사용 검토 | 재활용 컴포넌트 | 신규 조합 의존 | 이름 기준 | 출력물 | 필수 상태 |
|--------|----------|-----------|-------------|-----------------|----------------|-----------|--------|-----------|
| LOGIN-SCREEN-OUTPUT-PAGE | `LoginPage` | `packages/fe-ui/src/screen/LoginPage` | 기존 screen이 title/caption/form/error/CTA 책임을 이미 소유하므로 신규 screen 생성 없이 planning spec을 갱신한다. | `Surface`, `VStack`, `HStack`, `Text`, `Button`, `LoginForm`, lucide icons | none-current | app/route 전용명이 아니라 로그인 화면 역할을 나타내는 재사용 가능 Screen 이름 | auth form surface 안에 보안 badge, 제목/설명, session hint, login form, feedback, CTA를 배치 | ready, loading, error, long text, narrow viewport |
| LOGIN-SCREEN-COMP-FORM | `LoginForm` | `packages/fe-ui/src/form/LoginForm` | email/password 입력 조합이 이미 존재하고 route가 직접 소비하지 않으므로 별도 planning spec 없이 하위 조합으로 재사용한다. | `Input`, `VStack`, lucide icons | none-current | form 역할이 명확하고 `LoginPage` 외 다른 로그인 화면에서도 재사용 가능 | 이메일/비밀번호 field stack | empty, with values, long value |
| LOGIN-SCREEN-FEATURE-NONE | none-current | none | 신규/수정 reusable Feature 없음 | none | none | none | none | none |

## 화면 러프

```text
LOGIN-SCREEN-ROUGH-DESKTOP

┌─ LoginPage form surface ────────────────────────────────────┐
│ [badge] 안전한 운영 세션                                    │
│ 관리자 로그인                                                │
│ 예약, 결제, 권한 상태를 이어서 확인하세요.                   │
│                                                              │
│ [session hint] 로그인 후 선택된 지점 scope로 관리자 API 호출 │
│                                                              │
│ LoginForm                                                    │
│   이메일                                                     │
│   [ admin@plate.com                                      ]   │
│   비밀번호                                                   │
│   [ 비밀번호를 입력하세요                                ]   │
│                                                              │
│ 입력한 계정으로 운영 콘솔 접근 권한을 확인합니다.            │
│ [ 로그인 -> ]                                                │
└──────────────────────────────────────────────────────────────┘
```

```text
LOGIN-SCREEN-ROUGH-ERROR

┌─ LoginPage form surface ────────────────────────────────────┐
│ ...header / session hint / LoginForm                         │
│                                                              │
│ [danger alert] 이메일 또는 비밀번호를 다시 확인해주세요.     │
│ [ 로그인 -> ]                                                │
└──────────────────────────────────────────────────────────────┘
```

```text
LOGIN-SCREEN-ROUGH-NARROW

┌─ narrow width surface ───────────────────────┐
│ badge wraps only if needed                   │
│ title/caption wrap without overlap           │
│ email/password fields remain stacked         │
│ feedback area keeps stable height            │
│ full-width CTA keeps fixed touch/click size  │
└──────────────────────────────────────────────┘
```

## Props / Event 계약

### Props Contract

| row id | Prop | 타입/shape | 설명 | owner | route 소비 |
|--------|------|------------|------|-------|------------|
| LOGIN-SCREEN-PROPS-STATE | `state` | `LoginPageState` | screen이 렌더링할 route-owned 상태 slice | screen type contract | route hook 반환값을 그대로 전달 |
| LOGIN-SCREEN-PROPS-FORM | `state.loginForm` | `LoginFormState` | `LoginForm`에 전달되는 email/password state | screen/form contract | route는 form을 직접 렌더링하지 않음 |
| LOGIN-SCREEN-PROPS-ERROR | `state.errorMessage` | `string` | 비어 있으면 helper 안내, 값이 있으면 alert feedback 표시 | screen rendering contract | route helper가 문자열만 제공 |
| LOGIN-SCREEN-PROPS-TITLE | `title` | `string` | surface 제목 | route supplies text, screen renders | route page가 전달 |
| LOGIN-SCREEN-PROPS-CAPTION | `caption` | `string` | surface 보조 설명 | route supplies text, screen renders | route page가 전달 |
| LOGIN-SCREEN-PROPS-LOADING | `isLoading` | `boolean` | submit CTA loading/disabled guard | screen rendering contract | route mutation pending state 전달 |
| LOGIN-SCREEN-PROPS-SUBMIT | `onSubmitLoginForm` | `() => void \| Promise<void>` | submit 이벤트를 route handler로 위임 | event contract | route hook handler 전달 |

### Event Contract

| row id | 이벤트 | 발생 위치 | 동작 | route/API side effect |
|--------|--------|-----------|------|-----------------------|
| LOGIN-SCREEN-EVENT-SUBMIT | form submit | `LoginPage` root form | default submit을 막고 `isLoading`이면 무시한 뒤 `onSubmitLoginForm` 호출 | route/page spec `LOGIN-ROUTE-EVENT-SUBMIT` 참조 |
| LOGIN-SCREEN-EVENT-EMAIL | email change | `LoginForm` email input | `LoginFormState.email` 갱신 | API 호출 없음 |
| LOGIN-SCREEN-EVENT-PASSWORD | password change | `LoginForm` password input | `LoginFormState.password` 갱신 | API 호출 없음 |

## 리듬 / 레이아웃 계약

| row id | 영역 | 리듬/컴포넌트 | 방향/정렬 | gap preset | 감싸는 대상 | 필수 규칙 |
|--------|------|---------------|-----------|------------|-------------|-----------|
| LOGIN-SCREEN-RHYTHM-FORM | root form | native `form` + `Surface` | full-width / stretch | n/a | 전체 login surface | route shell 안에서 width만 소비하고 internal layout은 screen이 소유 |
| LOGIN-SCREEN-RHYTHM-SURFACE | surface body | `VStack` | vertical / stretch | `section` | header, session hint, form, feedback, CTA | same elevation surface 중첩 금지 |
| LOGIN-SCREEN-RHYTHM-HEADER | header | `VStack` + badge `HStack` | vertical / start | `block`, `inline` | badge, title, caption | title/caption long text 줄바꿈 허용 |
| LOGIN-SCREEN-RHYTHM-HINT | session hint | `HStack` | horizontal / center | `block` | status dot, helper text | 좁은 폭에서 text wrap 허용 |
| LOGIN-SCREEN-RHYTHM-FIELDS | form fields | `LoginForm` internal `VStack` | vertical / stretch | `section` | email/password inputs | field label/helper/error proximity 유지 |
| LOGIN-SCREEN-RHYTHM-FEEDBACK | feedback | reserved feedback block | vertical / start | `block` | hint or danger alert | loading/error 전환 시 높이 급변 방지 |
| LOGIN-SCREEN-RHYTHM-CTA | submit action | `Button` | full-width | n/a | login CTA | loading/disabled state에서 layout shift 금지 |

## 하위 component 조합

| row id | 하위 요소 | 출처 | 역할 | 전달 계약 | 변경 시 owner |
|--------|-----------|------|------|-----------|-------------|
| LOGIN-SCREEN-COMP-SURFACE | `Surface` | `../../surface` | login form surface | padding/elevation/border/radius | `fe-screen-agent` |
| LOGIN-SCREEN-COMP-TYPOGRAPHY | `Typography` | `../../display/data-display/Typography` | badge/title/caption/hint/error text | 사용자 노출 텍스트 렌더링 | `fe-screen-agent` |
| LOGIN-SCREEN-COMP-RHYTHM | `VStack`, `HStack` | `../../rhythm/**` | semantic rhythm | `section`, `block`, `inline` 등 preset | `fe-screen-agent` |
| LOGIN-SCREEN-COMP-FORM | `LoginForm` | `../../form/LoginForm/LoginForm` | email/password input stack | `state.loginForm`만 전달 | `fe-screen-agent` |
| LOGIN-SCREEN-COMP-CTA | `Button` | `../../action/Button/Button` | login submit action | type submit, loading, disabled, full-width | `fe-screen-agent` |
| LOGIN-SCREEN-COMP-ICON | lucide icons | `lucide-react` | badge/error/CTA visual affordance | aria-hidden decorative icons | `fe-screen-agent` |

## 상태별 렌더링

| row id | 상태 | 렌더링 계약 | 이벤트/제약 | 테스트 |
|--------|------|-------------|-------------|--------|
| LOGIN-SCREEN-STATE-READY | Ready | badge, title/caption, session hint, `LoginForm`, helper text, enabled CTA 표시 | submit 가능 | `LoginPage.test.tsx`, Default story |
| LOGIN-SCREEN-STATE-LOADING | Loading | CTA `isLoading`과 disabled 상태, form은 같은 구조 유지 | 중복 submit 차단 | `LoginPage.test.tsx`, Loading story |
| LOGIN-SCREEN-STATE-ERROR | Error | helper 영역 대신 `danger` alert feedback 표시, CTA는 재시도 가능 | route가 전달한 `errorMessage`만 표시 | `LoginPage.test.tsx`, ServerError story |
| LOGIN-SCREEN-STATE-LONG | Long text | title/caption/error/email value가 줄바꿈 또는 input scroll 전략으로 parent 밖으로 넘치지 않음 | layout shift 최소화 | LongContent story |
| LOGIN-SCREEN-STATE-NARROW | Narrow viewport | single column full-width stack, CTA fixed height 유지 | text/button overlap 금지 | NarrowViewport story |
| LOGIN-SCREEN-STATE-DISABLED | Disabled/pending submit | `isLoading`이 true면 submit event handler가 route callback을 호출하지 않음 | keyboard submit도 차단 | `LoginPage.test.tsx` |

## Storybook / Test Contract

### Storybook 계약

| row id | 대상 | Story 파일 | 필수 상태/Variant | Fixture/데이터 | 작성 담당 `agent_type` | 검증 담당 `agent_type` | 통과 기준 |
|--------|------|------------|-------------------|----------------|-------------------------|-------------------------|-----------|
| LOGIN-SCREEN-STORY-PAGE | `LoginPage` | `packages/fe-ui/src/screen/LoginPage/LoginPage.stories.tsx` | ready, loading, server error, long content, narrow viewport | observable `LoginPageState`, Korean caption/error | `fe-screen-agent` | `qa-fe-testing` | 모든 상태가 screen rough와 rhythm contract를 만족 |
| LOGIN-SCREEN-STORY-FORM | `LoginForm` | `packages/fe-ui/src/form/LoginForm/LoginForm.stories.tsx` | empty, with values, long values | observable `LoginFormState` | `fe-screen-agent` | `qa-fe-testing` | form field stack이 `LOGIN-SCREEN-COMP-FORM` 계약을 만족 |

### Unit Test 계약

| row id | 테스트 대상 | 검증 항목 | 테스트 파일 | mock/stub | 작성 agent_type | 검증 agent_type | 통과 기준 |
|--------|-------------|-----------|-------------|-----------|------------------|------------------|-----------|
| LOGIN-SCREEN-UNIT-PAGE | `LoginPage` | title/caption/fields/button render, submit delegation, loading guard, error feedback | `packages/fe-ui/src/screen/LoginPage/LoginPage.test.tsx` | observable state, submit spy | `fe-screen-agent` | `qa-fe-testing` | `LOGIN-SCREEN-PROPS-*`, `LOGIN-SCREEN-STATE-*` 통과 |
| LOGIN-SCREEN-UNIT-FORM | `LoginForm` | email/password field render and bound state update | `packages/fe-ui/src/form/LoginForm/LoginForm.test.tsx` | observable form state | `fe-screen-agent` | `qa-fe-testing` | `LOGIN-SCREEN-COMP-FORM` 통과 |

### 정적 검증 / 금지 grep

| row id | 검증 항목 | 명령 | 검증 agent_type | 통과 기준 |
|--------|-----------|------|------------------|-----------|
| LOGIN-SCREEN-STATIC-SECTIONS | planning spec 필수 섹션 | `rg -n "^(## 목표|## 화면 러프|## Props / Event 계약|## 상태별 렌더링|## Storybook / Test Contract)" packages/fe-ui/src/screen/LoginPage/LoginPage.spec.md` | `orch-delivery` | Screen planning owner 섹션 존재 |
| LOGIN-SCREEN-STATIC-MEMO | 수동 memo 금지 | `rg -n "useMemo|useCallback" packages/fe-ui/src/screen/LoginPage packages/fe-ui/src/form/LoginForm` | `qa-type-checker` | 허가되지 않은 수동 memo 없음 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-06-06 | 변경된 `orch-delivery` 기준에 맞춰 `LoginPage`를 Screen planning owner로 재정리하고, route spec에 있던 화면 러프/props/event/상태별 렌더링 중복을 이 문서로 집중. 별도 `LoginForm.spec.md` 미생성 사유 기록 | Codex |
| 2026-06-01 | admin 로그인 화면 시각 품질 보정: 보안 세션 badge, API scope hint, alert card, pill CTA, 한글 field label 기준으로 계약 갱신 | Codex |
| 2026-05-31 | admin native login route spec 기준 surface/rhythm/error/loading/story/test 계약 보강 | Codex |
| 2026-05-02 | 로그인 page 제목/설명/CTA/에러 문구를 런타임 i18n catalog 번역 대상으로 연결 | Codex |
| 2026-04-22 | 로그인 제출 흐름과 폼 상태 계약 정리 | Codex |
| 2026-03-03 | 초기 화면 기획 수립 | Codex |
