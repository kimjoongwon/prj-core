---
name: "fe-input-agent-creator"
description: "이 skill은 `fe-input-agent` 역할로 일할 때 사용합니다. 입력, 액션, 선택, navigation leaf UI를 만드는 방법을 쉽게 안내합니다."
---

# fe-input-agent-creator

`fe-input-agent`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/30-fe-input-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 플랫폼과 경로에 맞는 input leaf 규칙만 적용합니다.
4. input 소스, 같은 위치의 단위 테스트, 가까운 barrel export, 필요한 최소 import 안에서만 작업합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 플랫폼 라우팅

- 웹 대상: `packages/fe-ui/src/input/**` 및 필요한 최소 소비 import입니다.
- 모바일 대상: `packages/fe-mo-ui/src/input/**` 및 필요한 최소 소비 import입니다.
- 다른 플랫폼의 런타임 규칙은 맥락으로만 읽고 실행 규칙으로 적용하지 않습니다.

## 공통

- Input leaf primitive는 사용자가 값을 입력하거나 선택하거나 즉시 실행하거나 화면 이동/전환을 수행하는 기본 UI를 담당합니다. 예: `Button`, `CloseButton`, `PressableFeedback`, `Input`, `TextField`, `TextArea`, `SearchField`, `NumberField`, `DateField`, `TimeInput`, `ColorField`, `InputOTP`, `InputGroup`, `FileUploader`, `StringListInput`, `Select`, `ComboBox`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `DateRangePicker`, `Calendar`, `ColorPicker`, `ChipSelect`, `ListBoxSelect`, `MultiSelect`, `ToggleButton`, `Link`, `Tabs`, `Pagination`, `Breadcrumbs`, `Accordion`, `Disclosure`, `DisclosureGroup`, `CustomHeader`.
- 프로젝트 동작을 추가하지 않는 React Web field metadata/composition primitive, 예를 들어 HeroUI `Label`, `Description`, `FieldError`, `ErrorMessage`, `Fieldset`은 local `@cocrepo/ui` wrapper로 소유하지 않습니다. 필요하면 `@heroui/react`에서 직접 import합니다.
- menu tree, side nav, bottom tab, route-layout navigation composition, overlay, data display, 피드백, layout, widget, feature, screen, route, data-grid 파일은 소유하지 않습니다.
- 새 컴포넌트를 만들기 전에 upstream HeroUI/HeroUI Native와 기존 `@cocrepo/ui` 또는 `@cocrepo/mo-ui` leaf를 먼저 재사용합니다.
- 소스, 같은 위치의 단위 테스트, 가까운 barrel export 변경은 같은 담당 변경 안에서 함께 처리합니다.
- input leaf primitive에 비즈니스 로직, API 호출, route 결정, app-specific 이름을 추가하지 않습니다.

## 웹 규칙

- 웹 파일 위치: `packages/fe-ui/src/input/[Name]/`.
- export 경로: `packages/fe-ui/src/input/index.ts` 이후 `packages/fe-ui/src/index.ts`.
- MobX 연결 wrapper가 필요하면 같은 컴포넌트 폴더 안에서 순수 component와 상태 보유 wrapper를 분리합니다.

## 모바일 규칙

- 모바일 파일 위치: `packages/fe-mo-ui/src/input/[Name]/`.
- custom field/control/navigation wiring 전에 upstream `TextField`, `Button`, `Checkbox`, `Radio`, `Select`, `Switch`, `Slider`, `Tabs`, `Label`, `Description`, `FieldError`, `InputGroup` composition을 먼저 사용합니다.
- 사용자에게 보이는 텍스트는 모바일 `Text` primitive를 사용합니다. raw `react-native` `Text` import는 text primitive 구현 내부에서만 허용합니다.

## 검증

- 가능하면 spec이 요구한 package type-check 또는 단위 테스트를 실행합니다.
- input leaf primitive 변경 시 가능하면 value change, selected value, active/current page, disabled/read-only/error/helper, pressed/action callback, link target 동작을 unit coverage로 확인합니다.
