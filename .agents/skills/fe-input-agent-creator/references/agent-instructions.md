# fe-input-agent 상세 지시

원본 하위 에이전트 파일: `.codex/agents/30-fe-input-agent.toml`

## 플랫폼 라우팅

- 웹 대상: `packages/fe-ui/src/input/**` 및 필요한 최소 소비 import입니다.
- 모바일 대상: `packages/fe-mo-ui/src/input/**` 및 필요한 최소 소비 import입니다.
- 다른 플랫폼의 런타임 규칙은 맥락으로만 읽고 실행 규칙으로 적용하지 않습니다.

## 공통

- Input primitive는 사용자가 입력하는 자유 형식 값 또는 프로젝트 전용 입력 동작을 담당합니다. 예: `Input`, `TextField`, `TextArea`, `SearchField`, `NumberField`, `DateField`, `TimeInput`, `ColorField`, `InputOTP`, `InputGroup`, `FileUploader`, `StringListInput`.
- 프로젝트 동작을 추가하지 않는 React Web field metadata/composition primitive, 예를 들어 HeroUI `Label`, `Description`, `FieldError`, `ErrorMessage`, `Fieldset`은 local `@cocrepo/ui` wrapper로 소유하지 않습니다. 필요하면 `@heroui/react`에서 직접 import합니다.
- command button, choice control, navigation, menu composition, overlay, data display, 피드백, layout, widget, feature, screen, route, data-grid 파일은 소유하지 않습니다.
- 새 컴포넌트를 만들기 전에 upstream HeroUI/HeroUI Native와 기존 `@cocrepo/ui` 또는 `@cocrepo/mo-ui` leaf를 먼저 재사용합니다.
- 소스, 같은 위치의 단위 테스트, 가까운 barrel export 변경은 같은 담당 변경 안에서 함께 처리합니다.
- input primitive에 비즈니스 로직, API 호출, route 결정, app-specific 이름을 추가하지 않습니다.

## 웹 규칙

- 웹 파일 위치: `packages/fe-ui/src/input/[Name]/`.
- export 경로: `packages/fe-ui/src/input/index.ts` 이후 `packages/fe-ui/src/index.ts`.
- MobX 연결 wrapper가 필요하면 같은 컴포넌트 폴더 안에서 순수 component와 상태 보유 wrapper를 분리합니다.

## 모바일 규칙

- 모바일 파일 위치: `packages/fe-mo-ui/src/input/[Name]/`.
- custom field wiring 전에 upstream `TextField`, `Label`, `Description`, `FieldError`, `InputGroup` composition을 먼저 사용합니다.
- 사용자에게 보이는 텍스트는 모바일 `Text` primitive를 사용합니다. raw `react-native` `Text` import는 text primitive 구현 내부에서만 허용합니다.

## 검증

- 가능하면 spec이 요구한 package type-check 또는 단위 테스트를 실행합니다.
- input primitive 변경 시 가능하면 value change, disabled/read-only/error/helper 상태를 unit coverage로 확인합니다.
