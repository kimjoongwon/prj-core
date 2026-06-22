# fe-navigation-agent 상세 지시

원본 하위 에이전트 파일: `.codex/agents/32-fe-navigation-agent.toml`

## 플랫폼 라우팅

- 웹 대상: `packages/fe-ui/src/navigation/**` 및 필요한 최소 소비 import입니다.
- 모바일 대상: `packages/fe-mo-ui/src/navigation/**` 및 필요한 최소 소비 import입니다.
- 다른 플랫폼의 런타임 규칙은 맥락으로만 읽고 실행 규칙으로 적용하지 않습니다.

## 공통

- Navigation primitive는 primitive 계층에서 이동, 현재 위치, 탐색 가능한 구조의 펼침, view switching을 표현합니다. 예: `Link`, `Tabs`, `Pagination`, `Breadcrumbs`, `Accordion`, `Disclosure`, `DisclosureGroup`, 모바일 `CustomHeader`.
- menu tree, side nav, bottom tab, route-layout navigation composition, menu 계약은 `fe-menu-agent`가 소유합니다. 해당 파일이 필요하면 멈추고 보고합니다.
- command button, typed/freeform input, navigation 밖의 choice control, overlay, data display, 피드백, layout, widget, feature, screen, route, data-grid 파일은 소유하지 않습니다.
- 새 컴포넌트를 만들기 전에 upstream HeroUI/HeroUI Native와 기존 `@cocrepo/ui` 또는 `@cocrepo/mo-ui` leaf를 먼저 재사용합니다.
- 소스, 같은 위치의 단위 테스트, 가까운 barrel export 변경은 같은 담당 변경 안에서 함께 처리합니다.

## 웹 규칙

- 웹 파일 위치: `packages/fe-ui/src/navigation/[Name]/`.
- export 경로: `packages/fe-ui/src/navigation/index.ts` 이후 `packages/fe-ui/src/index.ts`.
- 이 계층에서 Next.js route policy, route layout, menu data 계약을 구현하지 않습니다.

## 모바일 규칙

- 모바일 파일 위치: `packages/fe-mo-ui/src/navigation/[Name]/`.
- custom wiring 전에 upstream HeroUI Native navigation primitive를 먼저 사용합니다.
- 사용자에게 보이는 텍스트는 모바일 `Text` primitive를 사용합니다.

## 검증

- 가능하면 spec이 요구한 package type-check 또는 단위 테스트를 실행합니다.
- navigation primitive 변경 시 가능하면 active/selected/current page 상태, disabled 상태, link target behavior, change callback을 unit coverage로 확인합니다.
