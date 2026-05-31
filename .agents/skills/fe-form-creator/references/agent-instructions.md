# Detailed Instructions for fe-form-agent

Source agent file: `.codex/agents/fe-form-agent.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## Platform Routing

- 이 role은 React Web only agent입니다.
- 적용 target은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router와 Web Storybook/Test 계약입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native runtime 작업은 이 role의 실행 범위가 아닙니다.

## Common

### 내장 Spec 정책 (Mandatory)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 실행 source of truth는 route delivery spec입니다: web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `Agent Assignment Matrix`, `Execution Graph`, `Backend / API Contract`, `Foundation Contract`, `Shared File Locks`, `Approval / Execution Log`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 route delivery spec의 inventory와 assignment row에 기록합니다.
- 승인된 route delivery spec이 있으면 그 spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.

### Common Execution Rules

- 먼저 `Platform Routing`으로 현재 target이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 route delivery spec과 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- source owner가 다른 파일이나 다른 플랫폼 target이 필요하면 직접 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.
- Storybook/Test 책임은 source를 소유한 agent가 함께 갱신하고, route/layout/store/backend-only step은 route delivery spec의 검증 계약을 따릅니다.

## React Web

### React Web Runtime Baseline (Mandatory)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` target에만 적용합니다.
- React Web 작업은 `@heroui/react` upstream source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web target에서만 적용합니다.
- React Native target에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (Mandatory)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- form/control 후보는 `@cocrepo/ui` export만 보지 말고 upstream `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 form/control 또는 `@heroui/react` input/control로 표현 가능한 UI를 Form 안에서 raw `input`/`select`/`textarea`/`button` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### FE Form Agent

생성/수정 입력 화면이 재사용하는 form 계층을 `packages/fe-ui/src/form`에 생성/정리하는 전용 에이전트입니다.

### 역할

- Create/Edit 페이지의 표준 form 재사용 계층
- 입력 필드 조합, 유효성 메시지, state 기반 안내
- page가 아닌 `form` 소유의 재사용 입력 UI

### 분류 규칙

- 생성/등록/수정/입력 중심 화면이면 기본 목적지는 `form`
- `AiForm`은 상단 보조 feature로 유지하고, 실제 폼 본문 소유는 `form`
- 기존 도메인 폴더(`widget/user` 등)에 흩어진 폼 위젯이 있으면 `form`으로 통합

### 출력

- 메인 컴포넌트: `packages/fe-ui/src/form/<Name>/<Name>.tsx`
- 대응 spec: route `page.spec.md` 또는 관련 fe-ui Feature spec의 Form Contract 섹션
- barrel: `packages/fe-ui/src/form/index.ts`
- 필요 시 `packages/fe-ui/src/index.ts`와 허용 owner spec을 함께 갱신

### 필수 규칙

- API 호출/라우터 이동이 필요한 로직은 page 또는 feature가 담당하고, form 계층은 입력 UI 조합 책임만 가집니다.
- form은 반드시 `packages/fe-ui/src/control`의 control component만 사용합니다.
  - raw HeroUI `Input`, `Button`, `Checkbox`, `Link` 등을 form 안에서 직접 사용하는 패턴은 금지합니다.
- 필요한 control이 `packages/fe-ui/src/control`에 없으면 form을 계속 만들지 말고,
  먼저 `fe-control-agent` 규칙에 맞는 control을 생성/정리합니다.
- form은 field state를 내부에서 선언하지 않습니다.
  - 금지 예: `useState`, `useReducer`, `useLocalObservable`로 form 입력값을 직접 소유
  - 허용: page/feature가 page MobX class 내부에 선언한 `state` slice를 props로 받아 `control`에 전달
- form이 받는 `state`는 form slice만 의미합니다.
  - 예: `loginForm`, `forgotPasswordForm`, `resetPasswordForm`
  - page root state(`loginPage`, `resetPasswordPage`) 설계는 `fe-route-agent` 책임입니다.
  - form slice는 page MobX class 내부에 선언된 observable field를 기본 계약으로 사용합니다.
- form은 submit/cancel/click 같은 이벤트 handler props를 직접 받지 않습니다.
  - 금지 예: `onSubmitForm`, `onClickCancelButton`, `onAbortInteraction`
  - 허용: `type="submit"`, `data-action="abort-interaction"` 같은 semantic signal
- 실제 이벤트 연결은 page 또는 feature가 form 바깥 wrapper에서 소유합니다.
  - pure screen/feature는 `onSubmit`, `onSubmitCapture`, `onClickCapture` 등으로 native event를 연결할 수 있습니다.
- 코드 수정 시 대응 owner spec과 `## 변경 이력`를 동기화합니다.

### Storybook / Unit Test 책임

- Form component를 신규 생성하거나 수정하면 같은 작업에서 Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 create/update, disabled/readOnly/hidden, validation error, AI fillable state를 포함합니다.
- unit test는 field rendering, validation message, disabled/readOnly/hidden priority, submit signal을 검증합니다.
- schema/type-only 변경이면 Storybook/Test 계약과 최종 보고에 불필요 사유를 남깁니다.
## Feedback Packet (Mandatory)

이 role이 `orch-delivery`의 실행 agent로 동작하거나 follow-up을 받으면 최종 보고 마지막에 아래 packet을 반드시 포함합니다.
finding이 없으면 `status: resolved`, `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 채웁니다. packet은 생략하지 않습니다.

```text
Feedback:
- status: resolved | blocked | needs-spec | needs-approval | needs-contract | needs-implementation | needs-test | needs-reentry
- feedback_type: none | spec-gap | approval-needed | contract-gap | api-integration-gap | ui-composition-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
