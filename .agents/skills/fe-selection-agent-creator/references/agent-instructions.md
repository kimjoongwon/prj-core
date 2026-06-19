# fe-selection-agent 상세 지시

원본 하위 에이전트 파일: `.codex/agents/31-fe-selection-agent.toml`

## 플랫폼 라우팅

- 웹 대상: `packages/fe-ui/src/selection/**` 및 필요한 최소 소비 import입니다.
- 모바일 대상: `packages/fe-mo-ui/src/selection/**` 및 필요한 최소 소비 import입니다.
- 다른 플랫폼의 런타임 규칙은 맥락으로만 읽고 실행 규칙으로 적용하지 않습니다.

## 공통

- Selection primitive는 제한된 값이나 범위 중 하나를 고르게 합니다. 예: `Select`, `ComboBox`, `AutoComplete`, `Checkbox`, `CheckboxGroup`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `DateRangePicker`, `Calendar`, `RangeCalendar`, `ColorPicker`, `ColorArea`, `ColorSlider`, `ColorSwatchPicker`, `ChipSelect`, `ListBoxSelect`, `MultiSelect`, `ToggleButton`, `ToggleButtonGroup`, `WeekInput`.
- command button, typed/freeform input, navigation, menu composition, overlay, data display, 피드백, layout, widget, feature, screen, route, data-grid 파일은 소유하지 않습니다.
- 새 컴포넌트를 만들기 전에 upstream HeroUI/HeroUI Native와 기존 `@cocrepo/ui` 또는 `@cocrepo/mo-ui` leaf를 먼저 재사용합니다.
- 소스, 같은 위치의 단위 테스트, 가까운 barrel export 변경은 같은 담당 변경 안에서 함께 처리합니다.
- selection primitive에 비즈니스 로직, API 호출, route 결정, app-specific 이름을 추가하지 않습니다.

## 웹 규칙

- 웹 파일 위치: `packages/fe-ui/src/selection/[Name]/`.
- export 경로: `packages/fe-ui/src/selection/index.ts` 이후 `packages/fe-ui/src/index.ts`.
- MobX 연결 wrapper가 필요하면 같은 컴포넌트 폴더 안에서 순수 component와 상태 보유 wrapper를 분리합니다.

## 모바일 규칙

- 모바일 파일 위치: `packages/fe-mo-ui/src/selection/[Name]/`.
- custom selection wiring 전에 upstream checkbox, radio, select, switch, slider, calendar, tabs, control-field primitive를 먼저 사용합니다.
- 사용자에게 보이는 텍스트는 모바일 `Text` primitive를 사용합니다.

## 검증

- 가능하면 spec이 요구한 package type-check 또는 단위 테스트를 실행합니다.
- selection primitive 변경 시 가능하면 selected value, disabled 상태, option rendering, change callback을 unit coverage로 확인합니다.
