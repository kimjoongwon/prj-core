# Detailed Instructions for fe-control-agent

Source subagent file: `.codex/agents/fe-control-agent.toml`

This reference preserves the detailed implementation instructions that previously lived in the subagent TOML. Follow it after reading the thin subagent contract and this skill's `SKILL.md`.

---

## Platform Routing

- 이 subagent는 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- React Web target: `packages/fe-ui/**`, `apps/*/web/**` -> `Common` + `React Web` 섹션만 실행 규칙으로 적용합니다.
- React Native target: `packages/fe-mo-ui/**`, `apps/mobile/**` -> `Common` + `React Native` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
- 하나의 delivery가 Web과 React Native를 모두 수정해야 하면 route delivery spec의 step을 플랫폼별로 나누고 각 target에 맞는 섹션만 적용합니다.

## Common

### 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 subagent 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `subagent 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/subagent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.

### Common Execution Rules

- 먼저 `Platform Routing`으로 현재 target이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 service delivery spec과 생성된 route delivery spec의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당가 다른 파일이나 다른 플랫폼 target이 필요하면 직접 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.
- Storybook/Test 책임은 source를 소유한 subagent가 함께 갱신하고, route/layout/store/backend-only step은 route delivery spec의 검증 계약을 따릅니다.

## React Web

### React Web Runtime Baseline (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` target에만 적용합니다.
- React Web 작업은 `@heroui/react` upstream source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web target에서만 적용합니다.
- React Native target에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- Control 후보는 `@cocrepo/ui` export만 보지 말고 upstream `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- `@heroui/react`에 존재하지만 `@cocrepo/ui`에 아직 없는 control은 custom 구현이 아니라 thin wrapper/re-export/alias 추가 대상으로 구현합니다.
- `Input`, `TextField`, `TextArea`, `SearchField`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `DatePicker`, `NumberField`, `Autocomplete`, `Dropdown`, `Pagination` 등으로 표현 가능한 UI를 raw `input`/`select`/`textarea`/`button` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### Control 컴포넌트 subagent

당신은 **사용자 조작/입력 컴포넌트**를 현재 `packages/fe-ui/src/control/` 레이어에 생성하는 전문가입니다.

---

### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 폼에서 값 입력/수정이 필요할 때 | ✅ | Input, Checkbox, RadioGroup, DatePicker |
| MobX 상태와 양방향 바인딩 필요 | ✅ | Stateful Control (index.tsx) 생성 |
| 단순 표시/선택용 UI | ✅ | Dropdown, Pagination (Pure만) |
| HeroUI input/control 래핑 | ✅ | onChange 시그니처 단순화 |
| 비즈니스 로직 포함 | ❌ | fe-feature-agent 사용 |
| 레이아웃/표시용 컴포넌트 | ❌ | `fe-layout-agent`, `fe-data-display-agent`, `fe-feedback-agent`, 또는 `fe-overlay-agent` 사용 |

---

### 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 컴포넌트명 | ✅ | 생성할 Control 컴포넌트 이름 |
| HeroUI 기반 여부 | ⚪ | 래핑할 HeroUI 컴포넌트 |
| Stateful 필요 여부 | ⚪ | MobX 연동 wrapper 필요 여부 |

### 출력

#### Pure Control만 필요한 경우

| 항목 | 경로 |
|------|------|
| Pure Control | `packages/fe-ui/src/control/[Name]/[Name].tsx` |
| Storybook | `packages/fe-ui/src/control/[Name]/[Name].stories.tsx` |

#### Pure + Stateful 모두 필요한 경우

| 항목 | 경로 |
|------|------|
| Pure Control | `packages/fe-ui/src/control/[Name]/[Name].tsx` |
| Stateful wrapper | `packages/fe-ui/src/control/[Name]/index.tsx` |
| Storybook | `packages/fe-ui/src/control/[Name]/[Name].stories.tsx` |

---

### 3. 핵심 규칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **Pure/Stateful 레이어 분리** | 순수 Control UI와 MobX 연동 분리 |
| **HeroUI 우선 확인** | 동일 컴포넌트 있는지 확인 |
| **onChange 시그니처 단순화** | e.target.value -> value |
| **MobxProps 확장** | Stateful에서 path, state props 필수 |
| **observer 감싸기** | Stateful에서 MobX 반응성 필수 |
| **커스텀 className 허용** | Control 컴포넌트에서는 직접 스타일링 가능 |

### ❌ Don't

| 금지 사항 | 이유 |
|----------|------|
| Pure Control에서 상태 사용 | useState, useReducer 등 금지 |
| **Context API 사용 (createContext, useContext)** | **packages/fe-ui에서 Context 사용 금지 - props drilling 사용** |
| **컴포넌트 폴더 내 hooks/, utils/ 하위 폴더 생성** | **패키지 레벨에서 관리 (hooks → src/hooks/, utils → src/utils/)** |
| 비즈니스 로직 포함 | Feature 계층의 역할 |
| 앱 종속 이름 | AdminInput, CoinDatePicker 등 금지 |

---

### 4. 프로세스

### 4.1 레이어 구조 결정

| 레이어 | 파일 | 상태 | MobX | 용도 |
|--------|------|:----:|:----:|------|
| **Pure Control** | `ComponentName.tsx` | ❌ | ❌ | 순수 UI, Props로만 동작 |
| **Stateful Control** | `index.tsx` | ✅ | ✅ | MobX 상태 연동 wrapper |

### 4.2 언제 어떤 레이어를 만드는가?

| 상황 | Pure만 | Pure + Stateful |
|------|:------:|:---------------:|
| 단순 표시용 (Dropdown, Pagination) | ✅ | ❌ |
| 폼에서 값 입력/수정 (Input, Checkbox) | ✅ | ✅ |
| MobX 상태와 양방향 바인딩 필요 | ✅ | ✅ |

### 4.3 파일 구조 생성

#### Pure Control만 필요한 경우

```
packages/fe-ui/src/control/[ComponentName]/
├── [ComponentName].tsx         # Pure Control (메인)
└── [ComponentName].stories.tsx # Storybook
```

#### Pure + Stateful 모두 필요한 경우

```
packages/fe-ui/src/control/[ComponentName]/
├── [ComponentName].tsx         # Pure Control (Base)
├── [ComponentName].stories.tsx # Storybook
└── index.tsx                   # Stateful wrapper (MobX 연동)
```

### 4.4 barrel export 추가

```ts
// inputs/index.ts
// Pure만 있는 경우
export { [ComponentName] } from "./[ComponentName]/[ComponentName]";

// Stateful이 있는 경우
export { [ComponentName] } from "./[ComponentName]";
```

---

### 5. 템플릿

### 5.1 Pure Control

```tsx
// packages/fe-ui/src/control/[ComponentName]/[ComponentName].tsx
import {
  ComponentName as HeroUIComponent,
  ComponentNameProps as HeroUIComponentProps,
} from "@heroui/react";

export interface [ComponentName]Props
  extends Omit<HeroUIComponentProps, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
}

export const [ComponentName] = (props: [ComponentName]Props) => {
  const { value, onChange, ...rest } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <HeroUIComponent
      {...rest}
      value={value}
      onChange={handleChange}
    />
  );
};
```

### 5.2 Stateful Control (index.tsx)

```tsx
// packages/fe-ui/src/control/[ComponentName]/index.tsx
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
  [ComponentName] as Base[ComponentName],
  type [ComponentName]Props as Base[ComponentName]Props,
} from "./[ComponentName]";

export interface [ComponentName]Props<T>
  extends MobxProps<T>,
    Omit<Base[ComponentName]Props, "value" | "onChange"> {}

export const [ComponentName] = observer(
  <T extends object>(props: [ComponentName]Props<T>) => {
    const { path, state, ...rest } = props;

    const initialValue = tools.get(state, path) || "";

    const formField = useFormField({ value: initialValue, state, path });

    const handleChange = (value: string) => {
      formField.setValue(value);
    };

    return (
      <Base[ComponentName]
        {...rest}
        value={formField.state.value}
        onChange={handleChange}
      />
    );
  },
);

// Pure 버전 타입 재export (필요 시)
export type { Base[ComponentName]Props as Pure[ComponentName]Props };
```

### 5.3 Storybook

```tsx
// packages/fe-ui/src/control/[ComponentName]/[ComponentName].stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { [ComponentName] } from "./[ComponentName]";

const meta: Meta<typeof [ComponentName]> = {
  title: "Controls/[ComponentName]",
  component: [ComponentName],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof [ComponentName]>;

export const Default: Story = {
  args: {},
};

export const WithValue: Story = {
  args: {
    value: "Example value",
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};
```

### 5.4 CVA 스타일링 (자체 구현 시)

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const inputStyles = cva(
  "rounded-md border border-default-300",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-2",
        md: "h-10 text-base px-3",
        lg: "h-12 text-lg px-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
```

---

### 6. 체크리스트

### Pure Control 생성 시

- [ ] `packages/fe-ui/src/control/[Name]/` 에 생성
- [ ] HeroUI 컴포넌트 존재 여부 확인
- [ ] 상태(useState) 사용하지 않음
- [ ] onChange 시그니처 단순화 (value만 전달)
- [ ] Storybook 스토리 작성
- [ ] `inputs/index.ts`에 export 추가

### Stateful Control 생성 시 (추가)

- [ ] `MobxProps<T>` 확장
- [ ] `useFormField` 훅 사용
- [ ] `observer`로 감싸기
- [ ] Base 컴포넌트 import 및 사용
- [ ] `Pure[Name]Props` 타입 재export

---

### 7. 연관 subagent

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 subagent

| subagent | 관계 |
|----------|------|
| /design-analyze (Skill) | Figma 분석 후 필요한 Control 컴포넌트 식별 |
| orch-delivery | owner spec에서 필요한 폼 요소 도출 |

### 후행 subagent

| subagent | 관계 |
|----------|------|
| fe-widget-agent | Control 컴포넌트를 포함한 Widget 생성 |
| **fe-feature-agent** | 폼 Feature에서 Control 컴포넌트 사용 |
| fe-route-agent | Page에서 폼 구성 시 사용 |

### 관련 subagent

| subagent | 관계 |
|----------|------|
| fe-layout-agent / fe-data-display-agent / fe-feedback-agent / fe-overlay-agent | 비입력 UI 컴포넌트 담당 |

---

### 8. 프로젝트별 참고사항

### 담당 경로

```
packages/fe-ui/src/control/
```

> **주의**: ui, widget, feature, layouts, page 컴포넌트는 이 subagent의 담당이 아닙니다.

### 스타일링 규칙

| 위치 | className 사용 |
|------|:-------------:|
| `src/display/` | ✅ 허용 |
| `src/control/` | ✅ 허용 |
| `src/widget/` | ❌ 금지 |
| `src/feature/` | ❌ 금지 |
| `src/screen/` | ❌ 금지 |
| `src/layout/` | ❌ 금지 |

### 기존 컴포넌트 예시

#### Pure Control만 있는 경우 (index.tsx 없음)

| 컴포넌트 | 용도 |
|----------|------|
| `Dropdown` | 드롭다운 메뉴 (선택 후 액션) |
| `Pagination` | 페이지네이션 |
| `ButtonGroup` | 버튼 그룹 |

#### Pure + Stateful 모두 있는 경우 (index.tsx 있음)

| 컴포넌트 | 용도 |
|----------|------|
| `Input` | 텍스트 입력 |
| `Checkbox` | 체크박스 |
| `RadioGroup` | 라디오 버튼 그룹 |
| `Textarea` | 멀티라인 텍스트 |
| `DatePicker` | 날짜 선택 |
| `AutoComplete` | 자동완성 입력 |
| `ListboxSelect` | 리스트 선택 |

### 공용 패키지 네이밍 규칙

```typescript
// ✅ 올바른 예시 (범용적인 이름)
export const Input = observer(...);
export const DatePicker = observer(...);

// ❌ 금지 (앱 이름이 포함된 이름)
export const AdminInput = observer(...);
export const CoinDatePicker = observer(...);
```

### 주의사항

1. **HeroUI 우선 확인** - 구현 전에 HeroUI에 동일 컴포넌트가 있는지 확인
2. **레이어 구분 명확히** - Pure와 Stateful의 책임 분리
3. **타입 안전성** - Generic `<T>`를 활용한 타입 추론
4. **onChange 시그니처** - 이벤트 객체가 아닌 값만 전달
5. **재사용성** - Pure Control은 MobX 없이도 사용 가능해야 함

### 검증 메시지 상수 활용

@cocrepo/schema의 검증 메시지 상수를 활용하여 일관된 에러 메시지를 표시합니다。

```typescript
import { VALIDATION_MESSAGES } from "@cocrepo/schema";

// 검증 메시지 상수
VALIDATION_MESSAGES.EMAIL_FORMAT    // "유효한 이메일 형식이 아닙니다"
VALIDATION_MESSAGES.REQUIRED        // "필수 항목입니다"
VALIDATION_MESSAGES.MIN_LENGTH      // "최소 {min}자 이상 입력해주세요"
VALIDATION_MESSAGES.MAX_LENGTH      // "최대 {max}자까지 입력 가능합니다"
```

**Stateful Control에서 활용 예시:**
```typescript
const getErrorMessage = (field: string, errorType: string): string => {
  return VALIDATION_MESSAGES[errorType] ?? "잘못된 입력입니다";
};
```

### Storybook / Unit Test 책임

- Control/Input component를 신규 생성하거나 수정하면 같은 작업에서 colocated Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 default, disabled, invalid/error, filled, long value, interaction 상태를 포함합니다.
- unit test는 label/accessibility, value change, submit/press callback, disabled guard, validation message rendering을 검증합니다.
- thin re-export만 바뀌어 unit test가 불필요하면 Storybook/Test 계약과 최종 보고에 사유를 남깁니다.

---
## React Native

### React Native Runtime Baseline (필수)

- 이 섹션은 `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router route/`_layout.tsx` target에만 적용합니다.
- 작업 전에 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- React Native 작업은 `heroui-native/*` upstream source와 `@cocrepo/mo-ui` export를 먼저 확인하고, native callback/gesture/portal/provider 계약을 기준으로 판단합니다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive를 사용합니다. `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- compound/action primitive가 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화하고 HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- HeroUI Native compound wrapper는 return-only re-export로 끝내지 않고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot escape hatch를 함께 유지합니다.
- StyleSheet 금지: 신규/수정 UI는 `StyleSheet`/`StyleSheet.create` 대신 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용합니다.
- DOM 금지: DOM event, `event.target.value`, `window`, `document`, CSS selector, Next.js SSR/hydration, `@heroui/react`, browser-only fallback, react-native-web 대응 코드를 React Native target에 넣지 않습니다.
- React Web target에서는 이 섹션의 `heroui-native`, `@cocrepo/mo-ui`, Expo/native runtime 규칙을 실행 규칙으로 적용하지 않습니다.

### Mobile Action Scope

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/action`, `apps/mobile`, `packages/fe-store`를 먼저 검색합니다.
- 신규 추가 전에 `heroui-native/*` 재노출만으로 해결 가능한지 먼저 판단합니다.
- upstream 후보는 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source까지 확인합니다.
- thin re-export 로 충분하면 커스텀 wrapper 를 만들지 않습니다.
- 동일 책임의 중복 wrapper 를 금지합니다.
- `Button`, `LinkButton`, `CloseButton`, `PressableFeedback`으로 표현 가능한 CTA/action을 raw `Pressable` + `Text` + `tv` 조합으로 재구현하지 않습니다.
- 기존 action leaf가 80% 이상 맞으면 새 컴포넌트를 만들지 말고 기존 leaf를 확장하고 호출부를 함께 맞춥니다.

### Mobile Action Subagent

React Native / Expo Native 기준의 command/action 컴포넌트를 `packages/fe-mo-ui/src/action/**`에 생성하거나 정리하는 전문가입니다.

### 범위

- `packages/fe-mo-ui/src/action/[Name]/index.ts`
- `packages/fe-mo-ui/src/action/index.ts`

### 핵심 원칙

- 기본 구현은 `heroui-native/*` 공개 계약을 `@cocrepo/mo-ui`로 재노출하는 thin wrapper 입니다.
- upstream HeroUI Native에 존재하지만 `@cocrepo/mo-ui`에 아직 없는 action은 custom action이 아니라 thin re-export/alias 추가 대상으로 구현합니다.
- custom action 구현은 upstream과 기존 leaf가 책임을 커버하지 못하는 경우에만 허용하며, 보고에 배제한 후보와 이유를 적습니다.
- action 은 값을 입력받기보다 명령을 실행하는 컴포넌트를 뜻합니다.
- RN callback 시그니처를 유지합니다. DOM `event.target.value` 전제는 금지합니다.
- 스타일이 필요한 경우 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- 웹 전용 Storybook 설정 파일, `@heroui/react`, `mobx-react-lite`, Next.js, Tailwind DOM/CVA 전제는 사용하지 않습니다.
- Expo Web/react-native-web 호환 wrapper를 추가하지 않습니다.
- leaf 폴더 안에는 기본적으로 `index.ts`만 둡니다.
- 앱/screen/스토어 로직은 넣지 않습니다.

### Do

- `heroui-native/button`, `link-button`, `close-button`, `pressable-feedback` 등 command/action 계열 모듈을 우선 재사용합니다.
- 부모 배럴과 공개 export 를 함께 정리합니다.
- `apps/mobile`은 소비자이고, 이 subagent는 공용 mobile ui 패키지 계약만 다룹니다.
- 단순 색/크기/disabled/press feedback 차이는 새 action 컴포넌트 사유가 아니며, 기존 primitive props/className/variant로 해결합니다.

### Don't

- `packages/fe-ui/**` 경로를 출력 대상으로 사용하지 않습니다.
- `@heroui/react` 또는 웹 DOM 타입을 import 하지 않습니다.
- 값 입력/선택/탭 전환 컴포넌트를 함께 수정하지 않습니다.
- 웹 Storybook 설정 파일은 만들지 않습니다. 단, mobile Storybook용 colocated `*.stories.tsx`는 작성/갱신합니다.

### 보고 포맷

- 수정 leaf 경로
- 사용한 upstream `heroui-native/*` 모듈
- 재사용한 기존 component 또는 신규 구현이 필요한 이유
- 추가/변경한 export 별칭
- 함께 갱신한 배럴 경로

### Storybook / Unit Test 책임

- Action component를 신규 생성하거나 수정하면 같은 작업에서 mobile Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 default, pressed/loading, disabled, tone/size, long label 상태를 포함합니다.
- unit test는 label rendering, `onPress`, disabled guard, loading/aria state를 검증합니다.
- thin re-export/alias만 바뀌어 unit test가 불필요하면 owner spec과 최종 보고에 사유를 남깁니다.

---

### Mobile Input Scope

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/input`, `apps/mobile`, `packages/fe-store`를 먼저 검색합니다.
- 신규 추가 전에 `heroui-native/*` 재노출만으로 해결 가능한지 먼저 판단합니다.
- upstream 후보는 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source까지 확인합니다.
- thin re-export 로 충분하면 커스텀 wrapper 를 만들지 않습니다.
- 동일 책임의 중복 wrapper 를 금지합니다.
- `Input`, `Textarea`, `SearchField`, `InputOTP`, `Label`, `Description`, `FieldError`, `InputGroup`으로 표현 가능한 입력 UI를 raw `TextInput`/`View`/`Text` + `tv` 조합으로 재구현하지 않습니다.
- 기존 input leaf가 80% 이상 맞으면 새 컴포넌트를 만들지 말고 기존 leaf를 확장하고 호출부를 함께 맞춥니다.

### Mobile Input Subagent

React Native / Expo Native 기준의 text/input 컴포넌트를 `packages/fe-mo-ui/src/input/**`에 생성하거나 정리하는 전문가입니다.

### 범위

- `packages/fe-mo-ui/src/input/[Name]/index.ts`
- `packages/fe-mo-ui/src/input/index.ts`

### 핵심 원칙

- 기본 구현은 `heroui-native/*` 공개 계약을 `@cocrepo/mo-ui`로 재노출하는 thin wrapper 입니다.
- upstream HeroUI Native에 존재하지만 `@cocrepo/mo-ui`에 아직 없는 input/label/description/field-error/input-group 계열은 custom input이 아니라 thin re-export/alias 추가 대상으로 구현합니다.
- custom input 구현은 upstream `heroui-native/*`와 기존 `@cocrepo/mo-ui` input leaf가 명확히 감당하지 못하는 경우에만 허용합니다.
- input 은 사용자가 직접 문자열이나 값을 입력하는 컴포넌트를 뜻합니다.
- RN callback 시그니처를 유지합니다. DOM `event.target.value` 전제는 금지합니다.
- 스타일이 필요한 경우 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- 웹 전용 Storybook 설정 파일, `@heroui/react`, `mobx-react-lite`, Next.js, Tailwind DOM/CVA 전제는 사용하지 않습니다.
- Expo Web/react-native-web 호환 wrapper를 추가하지 않습니다.
- leaf 폴더 안에는 기본적으로 `index.ts`만 둡니다.
- 앱/screen/스토어 로직은 넣지 않습니다.

### Do

- `heroui-native/input`, `text-area`, `text-field`, `search-field`, `input-otp`, `label`, `description`, `field-error`, `input-group` 계열 모듈을 우선 재사용합니다.
- label/helper/error/disabled/loading 같은 상태 표현은 기존 primitive props, `className`, variant 확장으로 먼저 해결합니다.
- 부모 배럴과 공개 export 를 함께 정리합니다.
- `apps/mobile`은 소비자이고, 이 subagent는 공용 mobile ui 패키지 계약만 다룹니다.

### Don't

- `packages/fe-ui/**` 경로를 출력 대상으로 사용하지 않습니다.
- `@heroui/react` 또는 웹 DOM 타입을 import 하지 않습니다.
- action/selection/navigation 컴포넌트를 함께 수정하지 않습니다.
- 웹 Storybook 설정 파일은 만들지 않습니다. 단, mobile Storybook용 colocated `*.stories.tsx`는 작성/갱신합니다.

### 보고 포맷

- 수정 leaf 경로
- 사용한 upstream `heroui-native/*` 모듈
- 재사용한 기존 input leaf 또는 신규 구현이 필요한 이유
- 추가/변경한 export 별칭
- 함께 갱신한 배럴 경로

### Storybook / Unit Test 책임

- Input component를 신규 생성하거나 수정하면 같은 작업에서 mobile Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 empty, filled, disabled, invalid/error, long value, secure/keyboard 관련 상태를 포함합니다.
- unit test는 label/accessibility, value change, error message, disabled/readOnly branch를 검증합니다.
- thin re-export/alias만 바뀌어 unit test가 불필요하면 owner spec과 최종 보고에 사유를 남깁니다.

---

### Mobile Selection Scope

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/selection`, `apps/mobile`, `packages/fe-store`를 먼저 검색합니다.
- 신규 추가 전에 `heroui-native/*` 재노출만으로 해결 가능한지 먼저 판단합니다.
- upstream 후보는 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source까지 확인합니다.
- thin re-export 로 충분하면 커스텀 wrapper 를 만들지 않습니다.
- 동일 책임의 중복 wrapper 를 금지합니다.
- `Radio`, `RadioGroup`, `Checkbox`, `Select`, `Switch`, `Slider`, `Tabs`, `ControlField`로 표현 가능한 선택 UI를 raw `Pressable`/indicator + `tv` 조합으로 재구현하지 않습니다.
- 기존 selection leaf가 80% 이상 맞으면 새 컴포넌트를 만들지 말고 기존 leaf를 확장하고 호출부를 함께 맞춥니다.

### Mobile Selection Subagent

React Native / Expo Native 기준의 selection/stateful choice 컴포넌트를 `packages/fe-mo-ui/src/selection/**`에 생성하거나 정리하는 전문가입니다.

### 범위

- `packages/fe-mo-ui/src/selection/[Name]/index.ts`
- `packages/fe-mo-ui/src/selection/index.ts`

### 핵심 원칙

- 기본 구현은 `heroui-native/*` 공개 계약을 `@cocrepo/mo-ui`로 재노출하는 thin wrapper 입니다.
- upstream HeroUI Native에 존재하지만 `@cocrepo/mo-ui`에 아직 없는 selection 계열은 custom selection이 아니라 thin re-export/alias 추가 대상으로 구현합니다.
- custom selection 구현은 upstream과 기존 leaf가 책임을 커버하지 못하는 경우에만 허용하며, 보고에 배제한 후보와 이유를 적습니다.
- selection 은 checkbox, radio, select, switch, slider, tabs, calendar 같은 choice/control 컴포넌트를 뜻합니다.
- Calendar 류는 날짜/범위 선택이라는 선택 책임으로 다룹니다.
- RN callback 시그니처를 유지합니다. DOM `event.target.value` 전제는 금지합니다.
- 스타일이 필요한 경우 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- 웹 전용 Storybook 설정 파일, `@heroui/react`, `mobx-react-lite`, Next.js, Tailwind DOM/CVA 전제는 사용하지 않습니다.
- Expo Web/react-native-web 호환 wrapper를 추가하지 않습니다.
- leaf 폴더 안에는 기본적으로 `index.ts`만 둡니다.
- 앱/screen/스토어 로직은 넣지 않습니다.

### Do

- `heroui-native/checkbox`, `radio`, `radio-group`, `select`, `switch`, `slider`, `calendar`, `tabs`, `control-field` 계열 모듈을 우선 재사용합니다.
- 부모 배럴과 공개 export 를 함께 정리합니다.
- `apps/mobile`은 소비자이고, 이 subagent는 공용 mobile ui 패키지 계약만 다룹니다.
- 선택 표시, selected/disabled/accessibility 상태는 기존 primitive props와 compound part를 먼저 사용합니다.

### Don't

- `packages/fe-ui/**` 경로를 출력 대상으로 사용하지 않습니다.
- `@heroui/react` 또는 웹 DOM 타입을 import 하지 않습니다.
- action/input/navigation 컴포넌트를 함께 수정하지 않습니다.
- 웹 Storybook 설정 파일은 만들지 않습니다. 단, mobile Storybook용 colocated `*.stories.tsx`는 작성/갱신합니다.

### 보고 포맷

- 수정 leaf 경로
- 사용한 upstream `heroui-native/*` 모듈
- 재사용한 기존 component 또는 신규 구현이 필요한 이유
- 추가/변경한 export 별칭
- 함께 갱신한 배럴 경로

### Storybook / Unit Test 책임

- Selection component를 신규 생성하거나 수정하면 같은 작업에서 mobile Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 selected/unselected, disabled, multi/single, empty option, long label 상태를 포함합니다.
- unit test는 selection change, disabled guard, selected state rendering, accessibility label을 검증합니다.
- thin re-export/alias만 바뀌어 unit test가 불필요하면 owner spec과 최종 보고에 사유를 남깁니다.

---

### Mobile Navigation Scope

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/navigation`, `apps/mobile`, `packages/fe-store`를 먼저 검색합니다.
- 신규 추가 전에 `heroui-native/*` 재노출만으로 해결 가능한지 먼저 판단합니다.
- upstream 후보는 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source까지 확인합니다.
- thin re-export 로 충분하면 커스텀 wrapper 를 만들지 않습니다.
- 동일 책임의 중복 wrapper 를 금지합니다.
- `Tabs`, `CustomHeader` 등 기존 navigation UI로 표현 가능한 header/navigation control을 raw `View`/`Text`/`Pressable` 조합으로 재구현하지 않습니다.
- 기존 navigation leaf가 80% 이상 맞으면 새 컴포넌트를 만들지 말고 기존 leaf를 확장하고 호출부를 함께 맞춥니다.

### Mobile Navigation Subagent

React Native / Expo Native 기준의 navigation control 컴포넌트를 `packages/fe-mo-ui/src/navigation/**`에 생성하거나 정리하는 전문가입니다.

### 범위

- `packages/fe-mo-ui/src/navigation/[Name]/index.ts`
- `packages/fe-mo-ui/src/navigation/index.ts`

### 핵심 원칙

- 기본 구현은 `heroui-native/*` 공개 계약을 `@cocrepo/mo-ui`로 재노출하는 thin wrapper 입니다.
- upstream HeroUI Native에 존재하지만 `@cocrepo/mo-ui`에 아직 없는 navigation 계열은 custom navigation이 아니라 thin re-export/alias 추가 대상으로 구현합니다.
- custom navigation 구현은 upstream `heroui-native/*`와 기존 `@cocrepo/mo-ui` navigation leaf가 명확히 감당하지 못하는 경우에만 허용합니다.
- navigation 은 탭처럼 뷰 전환과 위치 이동을 담당하는 control 을 뜻합니다.
- RN callback 시그니처를 유지합니다. DOM `event.target.value` 전제는 금지합니다.
- 스타일이 필요한 경우 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- 웹 전용 Storybook 설정 파일, `@heroui/react`, `mobx-react-lite`, Next.js, Tailwind DOM/CVA 전제는 사용하지 않습니다.
- Expo Web/react-native-web 호환 wrapper를 추가하지 않습니다.
- leaf 폴더 안에는 기본적으로 `index.ts`만 둡니다.
- 앱/screen/스토어 로직은 넣지 않습니다.

### Do

- `heroui-native/tabs` 같은 navigation 계열 모듈을 우선 재사용합니다.
- Expo Router header는 route layout에서 `CustomHeader`를 우선 사용하고, screen 본문에서 중복 hero/header를 만들지 않습니다.
- 부모 배럴과 공개 export 를 함께 정리합니다.
- `apps/mobile`은 소비자이고, 이 subagent는 공용 mobile ui 패키지 계약만 다룹니다.

### Don't

- `packages/fe-ui/**` 경로를 출력 대상으로 사용하지 않습니다.
- `@heroui/react` 또는 웹 DOM 타입을 import 하지 않습니다.
- action/input/selection 컴포넌트를 함께 수정하지 않습니다.
- 웹 Storybook 설정 파일은 만들지 않습니다. 단, mobile Storybook용 colocated `*.stories.tsx`는 작성/갱신합니다.

### 보고 포맷

- 수정 leaf 경로
- 사용한 upstream `heroui-native/*` 모듈
- 재사용한 기존 navigation leaf 또는 신규 구현이 필요한 이유
- 추가/변경한 export 별칭
- 함께 갱신한 배럴 경로

### Storybook / Unit Test 책임

- Navigation component를 신규 생성하거나 수정하면 같은 작업에서 mobile Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 default, active, disabled, long title/subtitle, icon/no-icon 상태를 포함합니다.
- unit test는 label rendering, press callback, active/disabled branch, accessibility role/label을 검증합니다.
- thin re-export/alias만 바뀌어 unit test가 불필요하면 owner spec과 최종 보고에 사유를 남깁니다.
