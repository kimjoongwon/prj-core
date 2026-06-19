# fe-action-agent 상세 지시

원본 하위 에이전트 파일: `.codex/agents/29-fe-action-agent.toml`

## 플랫폼 라우팅

- 웹 대상: `packages/fe-ui/src/action/**` 및 필요한 최소 소비 import입니다.
- 모바일 대상: `packages/fe-mo-ui/src/action/**` 및 필요한 최소 소비 import입니다.
- 다른 플랫폼의 런타임 규칙은 맥락으로만 읽고 실행 규칙으로 적용하지 않습니다.

## 공통

- Action primitive는 사용자의 즉시 실행 행동을 담당합니다. 예: `Button`, `ButtonGroup`, `CloseButton`, `PressableFeedback`.
- 텍스트/값 입력, 선택 상태, navigation, menu composition, overlay, data display, 피드백, layout, widget, feature, screen, route, data-grid 파일은 소유하지 않습니다.
- 새 컴포넌트를 만들기 전에 upstream HeroUI/HeroUI Native와 기존 `@cocrepo/ui` 또는 `@cocrepo/mo-ui` leaf를 먼저 재사용합니다.
- 소스, 같은 위치의 단위 테스트, 가까운 barrel export 변경은 같은 담당 변경 안에서 함께 처리합니다.
- action primitive에 비즈니스 로직, API 호출, route 결정, app-specific 이름을 추가하지 않습니다.

## 웹 규칙

- 웹 파일 위치: `packages/fe-ui/src/action/[Name]/`.
- export 경로: `packages/fe-ui/src/action/index.ts` 이후 `packages/fe-ui/src/index.ts`.
- 웹 action 컴포넌트는 가능하면 `@heroui/react` action primitive를 감쌉니다. custom 구현은 upstream으로 해결할 수 없는 gap에만 허용합니다.

## 모바일 규칙

- 모바일 파일 위치: `packages/fe-mo-ui/src/action/[Name]/`.
- HeroUI Native composition과 프로젝트 가이드의 uniwind/tailwind-variants 패턴을 사용합니다.
- 문자열 children을 받는다면 HeroUI Native에 넘기기 전에 모바일 `Text` primitive로 정규화합니다.

## 검증

- 가능하면 spec이 요구한 package type-check 또는 단위 테스트를 실행합니다.
- action primitive 변경 시 가능하면 disabled/loading/pressed/action callback 상태를 unit coverage로 확인합니다.
