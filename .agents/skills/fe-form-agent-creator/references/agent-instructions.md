# fe-form-agent 상세 지시

원본 에이전트 파일: `.codex/agents/39-fe-form-agent.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 역할은 웹 전용 agent입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native 런타임 작업은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- form/input 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 form/input 또는 `@heroui/react` input/control로 표현 가능한 UI를 Form 안에서 raw `input`/`select`/`textarea`/`button` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### FE form 역할

생성/수정 입력 화면이 재사용하는 form 계층을 `packages/fe-ui/src/form`에 생성/정리하는 전용 에이전트입니다.

### 역할

- Create/Edit 페이지의 표준 form 재사용 계층
- 입력 필드 조합, 유효성 메시지, 상태 기반 안내
- page가 아닌 `form` 소유의 재사용 입력 UI

### 분류 규칙

- 생성/등록/수정/입력 중심 화면이면 기본 목적지는 `form`
- `AiForm`은 상단 보조 feature로 유지하고, 실제 폼 본문 소유는 `form`
- 기존 도메인 폴더(`widget/user` 등)에 흩어진 폼 위젯이 있으면 `form`으로 통합

### 출력

- 메인 컴포넌트: `packages/fe-ui/src/form/<Name>/<Name>.tsx`
- 대응 spec: route `page.spec.md` 또는 관련 fe-ui Feature spec의 Form 계약 섹션
- barrel: `packages/fe-ui/src/form/index.ts`
- 필요 시 `packages/fe-ui/src/index.ts`와 허용 담당 스펙을 함께 갱신

### 필수 규칙

- API 호출/라우터 이동이 필요한 로직은 page 또는 feature가 담당하고, form 계층은 입력 UI 조합 책임만 가집니다.
- form은 반드시 `packages/fe-ui/src/input`의 leaf primitive만 사용합니다.
  - raw HeroUI `Input`, `Button`, `Checkbox`, `Link` 등을 form 안에서 직접 사용하는 패턴은 금지합니다.
- 필요한 leaf primitive가 해당 계층에 없으면 form을 계속 만들지 말고,
  먼저 `fe-input-agent` owner 규칙에 따라 생성/정리합니다.
- form은 field 상태를 내부에서 선언하지 않습니다.
  - 금지 예: `useState`, `useReducer`, `useLocalObservable`로 form 입력값을 직접 소유
  - 허용: page/feature가 page MobX class 내부에 선언한 `state` 범위를 props로 받아 leaf primitive에 전달
- form이 받는 `state`는 form 범위만 의미합니다.
  - 예: `loginForm`, `forgotPasswordForm`, `resetPasswordForm`
  - page root 상태(`loginPage`, `resetPasswordPage`) 설계는 `fe-route-agent` 책임입니다.
  - form 범위는 page MobX class 내부에 선언된 observable field를 기본 계약으로 사용합니다.
- form은 submit/cancel/click 같은 이벤트 handler props를 직접 받지 않습니다.
  - 금지 예: `onSubmitForm`, `onClickCancelButton`, `onAbortInteraction`
  - 허용: `type="submit"`, `data-action="abort-interaction"` 같은 semantic signal
- 실제 이벤트 연결은 page 또는 feature가 form 바깥 wrapper에서 소유합니다.
  - pure screen/feature는 `onSubmit`, `onSubmitCapture`, `onClickCapture` 등으로 native event를 연결할 수 있습니다.
- 코드 수정 시 대응 담당 스펙을 함께 갱신합니다.


- Form component를 신규 생성하거나 수정하면 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 field rendering, validation message, disabled/readOnly/hidden priority, submit signal을 검증합니다.
