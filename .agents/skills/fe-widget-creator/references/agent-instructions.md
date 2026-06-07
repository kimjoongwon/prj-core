# Detailed Instructions for fe-widget-agent

Source agent file: `.codex/agents/fe-widget-agent.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## Platform Routing

- 이 role은 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- React Web target: `packages/fe-ui/**`, `apps/*/web/**` -> `Common` + `React Web` 섹션만 실행 규칙으로 적용합니다.
- React Native target: `packages/fe-mo-ui/**`, `apps/mobile/**` -> `Common` + `React Native` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
- 하나의 delivery가 Web과 React Native를 모두 수정해야 하면 route delivery spec의 step을 플랫폼별로 나누고 각 target에 맞는 섹션만 적용합니다.

## Common

### 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.

### Common Execution Rules

- 먼저 `Platform Routing`으로 현재 target이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 service delivery spec과 생성된 route delivery spec의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당가 다른 파일이나 다른 플랫폼 target이 필요하면 직접 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.
- Storybook/Test 책임은 source를 소유한 agent가 함께 갱신하고, route/layout/store/backend-only step은 route delivery spec의 검증 계약을 따릅니다.

## React Web

### React Web Runtime Baseline (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` target에만 적용합니다.
- React Web 작업은 `@heroui/react` upstream source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web target에서만 적용합니다.
- React Native target에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- PC/Web UI 후보는 `@cocrepo/ui` export만 보지 말고 upstream `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 data-display/action/input/selection/navigation/layout/cell/data-grid 또는 `@heroui/react` component로 표현 가능한 UI를 Widget 안에서 raw `div`/`button`/`input`/`table` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### Widget 컴포넌트 에이전트

**재사용 가능한 작은 UI 조각**을 `packages/fe-ui/src/widget`에 생성합니다.

---

### 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 여러 UI 컴포넌트를 조합할 때 | ✅ | StatusBadge, AvatarGroup, PriceTag |
| 비즈니스 로직 없이 순수 UI 조합 | ✅ | NavTreePanel, TabBar, MenuList |
| 여러 Feature/Page에서 재사용할 UI | ✅ | UserCard, StatCard, FilterPanel |
| Page/Feature가 table, metric grid, flow rail, section tabs, summary panel을 직접 품으려는 경우 | ✅ | CourseTable, CourseMetricGrid, CourseFlowRail |
| Store/API 연결이 필요한 경우 | ❌ | fe-feature-agent 사용 |
| 단일 기본 UI 요소 | ❌ | `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent`, 또는 관련 leaf agent 사용 |
| 폼 입력 컴포넌트 | ❌ | `fe-input-agent` 또는 `fe-selection-agent` 사용 |

---

### 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 컴포넌트명 | ✅ | `[기능][UI형태]` 패턴 |
| 조합할 UI 컴포넌트 목록 | ✅ | 사용할 Pure UI 컴포넌트들 |
| Props 정의 | ✅ | 타입과 설명 |

### 출력

| 항목 | 경로 |
|------|------|
| 메인 컴포넌트 | `packages/fe-ui/src/widget/[Name]/[Name].tsx` |
| barrel export | `packages/fe-ui/src/widget/[Name]/index.ts` |
| 상위 barrel | `packages/fe-ui/src/widget/index.ts` (추가) |

---

### 3. 핵심 규칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **UI 컴포넌트만 조합** | `src/display/` 폴더의 Pure UI만 사용 |
| **단일 책임** | 하나의 명확한 역할만 수행 |
| **Pure UI 유지** | 상태/API 호출 금지, props로만 동작 |
| **displayName 설정** | 디버깅을 위해 필수 |
| **라이브러리 타입 기반** | extends/Omit/Pick 활용 |
| **rhythm 컴포넌트 사용** | HStack, VStack 등으로 배치 |
| **Page/Feature 비대화 방지** | Page/Feature에 들어갈 뻔한 반복 시각 블록을 Widget으로 추출 |
| **One Component Per File** | Widget 파일은 exported Widget component 하나만 소유하고, private JSX subcomponent는 별도 Widget/leaf 파일로 분리 |

### ♻️ 기존 컴포넌트 우선 원칙 (Critical)

1. `packages/fe-ui/src/widget`에서 동일/유사 Widget을 먼저 검색합니다.
2. 요구사항 충족 시 **신규 Widget을 생성하지 않고 기존 Widget을 재사용**합니다.
3. 기능이 부족하면 **기존 Widget을 업그레이드**합니다.
4. UI 조합 수준 요구사항은 Widget에서 해결하고, 중복 Widget 복제를 금지합니다.

### ❌ Don't

| 금지 사항 | 이유 |
|----------|------|
| 커스텀 className 직접 사용 | UI/Input에서만 허용 |
| **Context API 사용 (createContext, useContext)** | **packages/fe-ui에서 Context 사용 금지 - props drilling 사용** |
| **컴포넌트 폴더 내 hooks/, utils/ 하위 폴더 생성** | **패키지 레벨에서 관리 (hooks → src/hooks/, utils → src/utils/)** |
| 기존 Widget과 유사한 컴포넌트 신규 생성 | 중복 자산 증가 및 재사용성 저하 |
| Store 접근 | Feature 계층의 역할 |
| API 호출 | Feature 계층의 역할 |
| Text를 Button/Chip children으로 | 테마 깨짐 발생 |
| observer와 memo 함께 사용 | observer가 내부적으로 memo 처리 |
| route/page title, PageSurface, route navigation 직접 소유 | Page/route shell 책임 |
| Feature state, URL state, API response fetching 직접 소유 | Feature 또는 route container 책임 |
| private JSX subcomponent를 같은 Widget 파일에 선언 | component ownership과 Storybook/test 추적이 흐려짐 |

### Page Fatigue 방지 규칙 (Critical)

fe-widget-agent는 Page/Feature 파일이 비대해지는 것을 막는 1차 분리 지점입니다.

- table, tab group, metric grid, flow rail, status summary, read-only detail block, repeated card/list block은 Widget 후보로 봅니다.
- fe-route-agent나 fe-feature-agent가 `ui-composition-gap`을 보고하면 해당 visual block을 Widget으로 먼저 분리합니다.
- Widget은 props로 받은 값과 callback만 사용하고, API/router/store/search params를 읽지 않습니다.
- Widget 전용 spec은 신규 생성하지 않습니다. 계약은 nearest route `page.spec.md` 또는 Feature/Page owner spec의 lower-layer 조합 표에 기록합니다.
- 신규 Widget을 만들 때는 `packages/fe-ui/src/widget/index.ts`와 필요한 domain barrel을 함께 동기화합니다.

---

### 4. 프로세스

### 4.1 필요한 Pure UI 확인

```markdown
Widget 개발 시 필요한 Pure UI가 없으면 **먼저 `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent`, 또는 관련 leaf agent에 생성 요청**
```

Page/Feature 비대화 해소용 Widget은 다음 순서로 진행합니다.

1. nearest Screen/Feature spec의 `## 화면 러프`와 lower-layer 조합 표를 확인합니다.
2. 기존 Widget으로 대체 가능한지 먼저 검색합니다.
3. 신규가 필요하면 단일 visual responsibility 단위로 파일을 나눕니다.
4. Widget은 route/API/store를 모르도록 props contract만 노출합니다.
5. Widget export 후 Feature/Page owner spec의 조합 표에 반영되었는지 확인합니다.

### 4.2 네이밍 결정

| 패턴 | 설명 | 예시 |
|------|------|------|
| `[기능]Panel` | 패널 형태의 UI | NavTreePanel, FilterPanel |
| `[기능]Bar` | 막대 형태의 UI | TabBar, ToolBar, SearchBar |
| `[기능]List` | 목록 형태의 UI | MenuList, ItemList |
| `[기능]Card` | 카드 형태의 UI | UserCard, StatCard |
| `[기능]Badge` | 뱃지 형태의 UI | StatusBadge, CountBadge |

### 4.3 파일 구조 생성

```
packages/fe-ui/src/widget/[Name]/
├── [Name].tsx     # 메인 컴포넌트
└── index.ts       # barrel export

# ⚠️ 컴포넌트 폴더 내 hooks/, utils/ 하위 폴더 생성 금지!
# 재사용 가능한 훅/유틸은 패키지 레벨에서 관리:
packages/fe-ui/src/hook/use[Name].ts       # 재사용 가능한 훅
packages/fe-ui/src/util/[utilName].ts      # 재사용 가능한 유틸
```

### 4.4 barrel export 추가

`packages/fe-ui/src/widget/index.ts`에 새 컴포넌트 export 추가

---

### 5. 템플릿

### 5.1 기본 Widget

```tsx
// packages/fe-ui/src/widget/StatusBadge/StatusBadge.tsx
import { Chip } from "../../ui/data-display/Chip/Chip";

type Status = "active" | "inactive" | "pending";

export interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const statusConfig: Record<Status, { color: "success" | "danger" | "warning"; text: string }> = {
  active: { color: "success", text: "활성" },
  inactive: { color: "danger", text: "비활성" },
  pending: { color: "warning", text: "대기중" },
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Chip color={config.color} size="sm">
      {label ?? config.text}
    </Chip>
  );
};

StatusBadge.displayName = "StatusBadge";
```

### 5.2 라이브러리 타입 기반 Widget

```tsx
import { Chip, ChipProps } from "@heroui/react";

export interface StatusBadgeProps extends Omit<ChipProps, "color" | "children"> {
  status: "active" | "inactive" | "pending";
  label?: string;
}

export const StatusBadge = ({ status, label, ...rest }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Chip {...rest} color={config.color}>
      {label ?? config.text}
    </Chip>
  );
};
```

### 5.3 레이아웃 컴포넌트 활용

```tsx
// ✅ 올바른 패턴 - 레이아웃 컴포넌트 사용
<HStack gap="inline" alignItems="center">
  <Avatar />
  <Text>{name}</Text>
</HStack>

// ❌ 금지 - className으로 레이아웃 제어
<div className="flex items-center gap-2">
  <Avatar />
  <span className="ml-2">{name}</span>
</div>
```

### 5.4 index.ts

```ts
export { StatusBadge } from "./StatusBadge";
export type { StatusBadgeProps } from "./StatusBadge";
```

---

### 6. 체크리스트

- [ ] 기존 Widget 컴포넌트 검색 완료 (`rg --files packages/fe-ui/src/widget`)
- [ ] 기존 Widget 재사용 가능 여부 판단 및 결과 기록
- [ ] 기능 부족 시 기존 Widget 업그레이드로 처리 (신규 복제 금지)
- [ ] `packages/fe-ui/src/widget/[Name]/` 에 생성
- [ ] 필요한 Pure UI가 없으면 `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent`, 또는 관련 leaf agent에 요청
- [ ] 단일 책임 원칙 확인
- [ ] table/card/tabs/flow rail/metric grid 같은 visual block을 Page/Feature에서 분리한 경우 owner spec의 조합 표 갱신 확인
- [ ] API/router/store/search params를 직접 읽지 않음
- [ ] Widget 신규 전용 spec을 만들지 않음
- [ ] 커스텀 className 사용하지 않음 (HeroUI/레이아웃 컴포넌트만)
- [ ] **라이브러리 타입 기반 Props 설계** (extends/Omit/Pick)
- [ ] observer 사용 시 memo 제외 확인
- [ ] Props 인터페이스 export
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] widget/index.ts에 barrel export 추가

---

### 7. 연관 에이전트

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 에이전트

| 에이전트 | 관계 |
|----------|------|
| orch-delivery | owner spec 또는 관련 fe-ui Screen/Feature spec의 Widget Contract 섹션 기반 구현 |
| **fe-data-display-agent / fe-feedback-agent / fe-overlay-agent** | Widget이 사용할 표시, 상태, overlay UI 컴포넌트 생성 |
| fe-action-agent / fe-input-agent / fe-selection-agent / fe-navigation-agent | Widget에서 사용할 leaf primitive 생성 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-feature-agent** | Widget에 Store/API 연결하여 Feature 생성 |
| fe-route-agent | Feature와 함께 Page에서 활용 |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| fe-store-agent | Feature에서 Widget에 주입할 Store 생성 |

---

### 8. 프로젝트별 참고사항

### Widget → Feature 분리 패턴

```
Widget (순수 UI)              Feature (비즈니스 로직)
─────────────────────────────────────────────────────
NavTreePanel                  → SideNav (NavigationStore 연결)
TabBar                        → BottomTab (NavigationStore 연결)
MenuList                      → SubMenuList (NavigationStore 연결)
UserCard                      → UserMenu (AuthStore 연결)
SpaceDropdown                 → SpaceSelector (PersistStore 연결)
```

**분리 기준:**
- Widget: props로 `items`, `onSelect`, `expandedKeys` 등을 받아 렌더링만
- Feature: Store에서 데이터를 가져와 Widget에 주입

**분리의 장점:**
- Widget은 Storybook에서 독립 테스트 가능
- Feature 없이 Widget만 다른 곳에서 재사용 가능
- Store 교체 시 Feature만 수정

### Layout shell widget 규칙

- `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 완성된 layout shell block이므로 widget으로 분류합니다.
- 위치는 `packages/fe-ui/src/widget/[Name]/`이고, `widget` 아래에 layout 전용 하위 카테고리를 만들지 않습니다.
- 공용 props 계약은 `packages/fe-ui/src/display/layout/type.ts`를 재사용합니다.

### UI 컴포넌트 참조 가능 카테고리

`src/display/` 내의 다음 카테고리 컴포넌트를 조합:

- **data-display**: Avatar, Chip, Icon, Text, User 등
- **inputs**: Button, Input, Checkbox, Select 등
- **feedback**: Message, Skeleton, Placeholder 등
- **structure/rhythm**: Container, HStack, VStack, Spacer 등

### memo 사용 규칙

| 상황 | memo 필요 여부 | 이유 |
|------|:-------------:|------|
| `observer` 사용 시 | ❌ 불필요 | observer가 내부적으로 memo 처리 |
| 순수 함수 컴포넌트 | ⚠️ 선택적 | 성능 이슈 있을 때만 추가 |

### Widget 후보 예시

| 카테고리 | 컴포넌트 |
|----------|----------|
| **상태 표시** | StatusBadge, OnlineIndicator, ProgressLabel |
| **사용자** | AvatarGroup, UserChip, RoleBadge |
| **데이터** | PriceTag, DateLabel, CountBadge |
| **액션** | CopyButton, ShareButton, BookmarkToggle |

### Storybook / Unit Test 책임

- Widget을 신규 생성하거나 수정하면 같은 작업에서 colocated Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 ready, disabled, empty/long text, 주요 variant를 최소 2개 이상 보여줍니다.
- unit test는 렌더링, props branch, 이벤트/disabled guard, formatting edge case를 검증합니다.
- thin barrel/export-only 변경처럼 story/test가 불필요하면 owner spec의 `Storybook / 테스트 계약`와 최종 보고에 사유를 남깁니다.
- QA role은 누락/실패/contract drift를 검증하며, agent는 story/test 파일을 QA로 넘기기 전 완료해야 합니다.

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

### Mobile Scope

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/widget`, `packages/fe-mo-ui/src/{action,input,selection,navigation,data-display,feedback,layout,surface,design-system}`, 관련 screen spec을 먼저 검색합니다.
- 하위 leaf가 없다고 판단하기 전에 upstream `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source를 확인합니다.
- 신규 생성 전에 기존 widget/screen 조합을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 동일 책임의 중복 widget 생성을 금지합니다.
- Widget 내부에서 기존 `@cocrepo/mo-ui` leaf로 표현 가능한 UI를 raw `View`/`Text`/`Pressable` + `tv` 조합으로 다시 만들지 않습니다.
- 필요한 leaf가 없으면 widget 안에 즉석 구현하지 말고 해당 owner role(action/input/selection/navigation/data-display/feedback/layout/surface)의 선행 작업 필요성을 최종 보고에 남깁니다.

### Mobile fe-widget-agent

React Native / Expo Native 기준의 재사용 가능한 순수 UI 조합 Widget을
`packages/fe-mo-ui/src/widget/**`에 생성하거나 정리하는 role입니다.

### 담당 범위

- `packages/fe-mo-ui/src/widget/[Name]/[Name].tsx`
- `packages/fe-mo-ui/src/widget/[Name]/index.ts`
- `packages/fe-mo-ui/src/widget/index.ts`
- 필요 시 `packages/fe-mo-ui/src/index.ts` export 동기화

### 핵심 원칙

- Widget은 비즈니스 로직 없이 RN UI 조합만 담당합니다.
- Widget은 `@cocrepo/mo-ui` leaf(action/input/selection/navigation/data-display/feedback/layout/surface/design-system)를 조합합니다.
- 기존 widget/leaf가 80% 이상 맞으면 새 widget을 만들지 말고 기존 조합을 확장하고 호출부를 함께 맞춥니다.
- Store/API/router/native bridge는 직접 읽지 않고 props로 전달받은 값과 handler만 소비합니다.
- One Component Per File 규칙을 따라 Widget 파일은 exported Widget component 하나만 소유하고, private JSX subcomponent는 별도 Widget/leaf 파일로 분리합니다.
- 외부 observable slice를 렌더링하면 exported component를 `observer`로 감쌉니다.
- 스타일은 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- Expo Web/react-native-web, DOM event, `@heroui/react`, Next.js 전제는 금지합니다.
- Spec 정책상 mobile widget planning spec은 만들지 않습니다. 계약은 route delivery spec 또는 screen planning spec에 기록합니다.

### Do

- 여러 screen/feature에서 재사용할 UI 조합을 Widget으로 분리합니다.
- action/surface/selection/feedback/data-display 등 leaf 책임은 기존 컴포넌트 props, `className`, variant 확장으로 먼저 해결합니다.
- props contract를 명확히 export합니다.
- 상위 barrel export를 함께 갱신합니다.

### Don't

- `apps/mobile/src` 아래에 공용 Widget을 만들지 않습니다.
- private JSX subcomponent를 같은 Widget 파일에 선언하지 않습니다.
- API hook, Expo Router hook, native module, storage hydrate를 Widget에 넣지 않습니다.
- Store/API 연결 wrapper나 전체 screen visual owner 역할을 Widget으로 분류하지 않습니다.

### 보고 포맷

- 생성/수정한 widget 경로
- 조합한 mobile UI leaf 목록
- 재사용한 기존 widget/leaf 또는 신규 widget이 필요한 이유
- props contract 요약
- observer 적용 여부
- 함께 갱신한 barrel / owner spec

### Storybook / Unit Test 책임

- Widget을 신규 생성하거나 수정하면 같은 작업에서 mobile Storybook story와 unit test를 작성/갱신합니다.
- Storybook은 ready, empty, disabled, long text, 주요 variant/state branch를 포함합니다.
- unit test는 rendering, props branch, event callback, disabled guard, fallback을 검증합니다.
- Storybook/Test 계약은 route `index.spec.md` 또는 screen owner spec의 `Storybook / 테스트 계약`를 따릅니다.
