---
name: "fe-widget-agent-creator"
description: "이 skill은 `fe-widget-agent` 역할로 일할 때 사용합니다. 재사용 가능한 Widget을 만드는 방법을 쉽게 안내합니다."
---

# fe-widget-agent-creator

`fe-widget-agent`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/36-fe-widget-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 플랫폼 라우팅

- 이 역할은 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- 웹 대상: `packages/fe-ui/**`, `apps/*/web/**` → `공통` + `웹 규칙` 섹션만 실행 규칙으로 적용합니다.
- 모바일 대상: `packages/fe-mo-ui/**`, `apps/mobile/**` → `공통` + `모바일 규칙` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
- 하나의 delivery가 Web과 React Native를 모두 수정해야 하면 라우트 딜리버리 스펙의 단계를 플랫폼별로 나누고 각 대상에 맞는 섹션만 적용합니다.

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
- PC/Web UI 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 data-display/input/layout/cell/data-grid 또는 `@heroui/react` component로 표현 가능한 UI를 Widget 안에서 raw `div`/`button`/`input`/`table` + className 조합으로 재구현하지 않습니다.
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
| Page/Feature가 table, metric grid, flow rail, 섹션 tabs, summary panel을 직접 품으려는 경우 | ✅ | AssetTable, AssetMetricGrid, AssetFlowRail |
| app 상태/API 연결이 필요한 경우 | ❌ | fe-feature-agent 사용 |
| 단일 기본 UI 요소 | ❌ | `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent`, 또는 관련 leaf 에이전트 사용 |
| 폼 입력 컴포넌트 | ❌ | `fe-input-agent` 사용 |

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

### ✅ 권장

| 규칙 | 설명 |
|------|------|
| **UI 컴포넌트만 조합** | `src/display/` 폴더의 Pure UI만 사용 |
| **단일 책임** | 하나의 명확한 역할만 수행 |
| **Pure UI 유지** | 상태/API 호출 금지, props로만 동작 |
| **displayName 설정** | 디버깅을 위해 필수 |
| **라이브러리 타입 기반** | extends/Omit/Pick 활용 |
| **rhythm 컴포넌트 사용** | Widget에서는 사용 금지. `div` + Tailwind flex/grid로 배치 |
| **Page/Feature 비대화 방지** | Page/Feature에 들어갈 뻔한 반복 시각 블록을 Widget으로 추출 |
| **One Component Per File** | Widget 파일은 exported Widget component 하나만 소유하고, private JSX subcomponent는 별도 Widget/leaf 파일로 분리 |
| **surface-less 기본값** | Widget은 기본적으로 표면을 소유하지 않고 route page surface 또는 feature local panel 안에 배치 |

### ♻️ 기존 컴포넌트 우선 원칙 (Critical)

1. `packages/fe-ui/src/widget`에서 동일/유사 Widget을 먼저 검색합니다.
2. 요구사항 충족 시 **신규 Widget을 생성하지 않고 기존 Widget을 재사용**합니다.
3. 기능이 부족하면 **기존 Widget을 업그레이드**합니다.
4. UI 조합 수준 요구사항은 Widget에서 해결하고, 중복 Widget 복제를 금지합니다.

### ❌ 금지

| 금지 사항 | 이유 |
|----------|------|
| 커스텀 className 직접 사용 | UI/입력에서만 허용 |
| **Context API 사용 (createContext, useContext)** | **packages/fe-ui에서 Context 사용 금지 - props drilling 사용** |
| **컴포넌트 폴더 내 hooks/, utils/ 하위 폴더 생성** | **패키지 레벨에서 관리 (hooks → `packages/fe-hook/src`, utils → `src/utils`)** |
| 기존 Widget과 유사한 컴포넌트 신규 생성 | 중복 자산 증가 및 재사용성 저하 |
| app 상태 접근 | Feature 계층의 역할 |
| API 호출 | Feature 계층의 역할 |
| Text를 Button/Chip children으로 | 테마 깨짐 발생 |
| observer와 memo 함께 사용 | observer가 내부적으로 memo 처리 |
| route/page title, ScreenSurface, SectionSurface, route navigation 직접 소유 | screen/route layout 책임 |
| 제거된 detail/form 이전 방식 surface wrapper 직접 사용 | 제거된 이전 방식 wrapper |
| Feature 상태, URL 상태, API response fetching 직접 소유 | Feature 또는 route container 책임 |

### Page Fatigue 방지 규칙 (Critical)

fe-widget-agent는 Page/Feature 파일이 비대해지는 것을 막는 1차 분리 지점입니다.

- table, tab group, metric grid, flow rail, status summary, read-only detail block, repeated card/list block은 Widget 후보로 봅니다.
- fe-route-agent나 fe-feature-agent가 `ui-composition-gap`을 보고하면 해당 시각 block을 Widget으로 먼저 분리합니다.
- Widget은 props로 받은 값과 callback만 사용하고, API/router/store/search params를 읽지 않습니다.
- Widget이 독립 panel/table panel로 쓰여 표면이 꼭 필요하면 local `Surface`를 사용하고, 그 사유를 담당 스펙의 lower-layer 조합 표에 남깁니다.
- 반복 item, metric item, info 행은 `Surface`를 반복 적용하지 않고 border/divider/background/spacing으로만 구분합니다.
- Widget 전용 spec은 신규 생성하지 않습니다. 계약은 nearest route `page.spec.md` 또는 Feature/Page 담당 스펙의 lower-layer 조합 표에 기록합니다.
- 신규 Widget을 만들 때는 `packages/fe-ui/src/widget/index.ts`와 필요한 domain barrel을 함께 동기화합니다.

---

### 4. 프로세스

### 4.1 필요한 Pure UI 확인

```markdown
Widget 개발 시 필요한 Pure UI가 없으면 **먼저 `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent`, 또는 관련 leaf 에이전트에 생성 요청**
```

Page/Feature 비대화 해소용 Widget은 다음 순서로 진행합니다.

1. nearest Screen/Feature 스펙의 `## 화면 러프`와 lower-layer 조합 표를 확인합니다.
2. 기존 Widget으로 대체 가능한지 먼저 검색합니다.
3. 신규가 필요하면 단일 시각 responsibility 단위로 파일을 나눕니다.
4. Widget은 route/API/store를 모르도록 props 계약만 노출합니다.
5. Widget export 후 Feature/Page 담당 스펙의 조합 표에 반영되었는지 확인합니다.

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
packages/fe-hook/src/use[Name].ts          # 재사용 가능한 훅
packages/fe-ui/src/utils/[utilName].ts     # UI 전용 유틸
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
// ✅ 올바른 패턴 - widget 내부는 div + Tailwind 사용
<div className="flex items-center gap-2">
  <Avatar />
  <Text>{name}</Text>
</div>

// ❌ 금지 - screen rhythm primitive 사용
<HStack gap="inline" alignItems="center">
  <Avatar />
  <Text>{name}</Text>
</HStack>
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
- [ ] 필요한 Pure UI가 없으면 `fe-data-display-agent`, `fe-feedback-agent`, `fe-overlay-agent`, 또는 관련 leaf 에이전트에 요청
- [ ] 단일 책임 원칙 확인
- [ ] table/card/tabs/flow rail/metric grid 같은 시각 block을 Page/Feature에서 분리한 경우 담당 스펙의 조합 표 갱신 확인
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
| orch-delivery | 담당 스펙 또는 관련 fe-ui Screen/Feature 스펙의 Widget 계약 섹션 기반 구현 |
| **fe-data-display-agent / fe-feedback-agent / fe-overlay-agent** | Widget이 사용할 표시, 상태, overlay UI 컴포넌트 생성 |
| fe-input-agent | Widget에서 사용할 leaf primitive 생성 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-feature-agent** | Widget에 app 상태/API 연결하여 Feature 생성 |
| fe-route-agent | Feature와 함께 Page에서 활용 |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| fe-store-agent | Feature에서 Widget에 주입할 app 상태 생성 |

---

### 8. 프로젝트별 참고사항

### Widget → Feature 분리 패턴

```
Widget (순수 UI)              Feature (비즈니스 로직)
─────────────────────────────────────────────────────
NavTreePanel                  → NavigationPanel (app.navigation 연결)
TabBar                        → BottomTab (app.navigation 연결)
MenuList                      → SubMenuList (app.navigation 연결)
UserCard                      → UserMenu (app.account.authSession 연결)
SpaceDropdown                 → SpaceSelector (app.account 연결)
```

**분리 기준:**
- Widget: props로 `items`, `onSelect`, `expandedKeys` 등을 받아 렌더링만
- Feature: app 상태에서 데이터를 가져와 Widget에 주입

**분리의 장점:**
- Feature 없이 Widget만 다른 곳에서 재사용 가능
- app 상태 경로 교체 시 Feature만 수정

### Layout block widget 규칙

- `HeaderBar`, `BottomNav`, `ActionFab`, `OverlayMenu`는 완성된 layout block block이므로 widget으로 분류합니다. `NavigationPanel`은 domain component입니다.
- 위치는 `packages/fe-ui/src/widget/[Name]/`이고, `widget` 아래에 layout 전용 하위 카테고리를 만들지 않습니다.
- 공용 props 계약은 `packages/fe-ui/src/display/layout/type.ts`를 재사용합니다.

### UI 컴포넌트 참조 가능 카테고리

`src/display/` 내의 다음 카테고리 컴포넌트를 조합:

- **data-display**: Avatar, Chip, Icon, Text, User 등
- **inputs**: Button, 입력, Checkbox, Select 등
- **피드백**: Message, Skeleton, Placeholder 등
- **structure/rhythm**: Widget 내부는 `div` + Tailwind flex/grid, route 구조는 `App`/`Page`, screen surface/rhythm은 `ScreenSurface`/`PageSurface` + `SectionSurface` + `Section` + `VStack` 계층이 소유

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


- Widget을 신규 생성하거나 수정하면 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 렌더링, props 분기, 이벤트/disabled guard, formatting edge case를 검증합니다.
- 누락/실패/계약 drift는 이 agent의 완료 전 자체 검증 대상이며, 범위 밖 실패만 필요한 owner에게 인계합니다.

---
## 모바일 규칙

### 모바일 런타임 기준 (필수)

- 이 섹션은 `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router route/`_layout.tsx` 대상에만 적용합니다.
- 작업 전에 `https://heroui.com/llms-patterns.txt`를 열어 HeroUI Native Composition/Styling/Provider/Portal 패턴을 확인합니다.
- 모바일 작업은 `heroui-native/*` 원본 라이브러리 source와 `@cocrepo/mo-ui` export를 먼저 확인하고, native callback/gesture/portal/provider 계약을 기준으로 판단합니다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui`의 `Text` primitive를 사용합니다. `react-native`의 `Text` 직접 import는 `packages/fe-mo-ui/src/data-display/Text` 구현 내부에서만 허용합니다.
- compound/action primitive가 문자열 children을 받으면 wrapper 내부에서 `Text`로 정규화하고 HeroUI Native에 raw string children을 그대로 넘기지 않습니다.
- HeroUI Native compound wrapper는 return-only re-export로 끝내지 않고, `label`, `helperText`, `errorMessage`, `title`, `description`, `items`, `trigger`, `actions` 같은 의미 있는 props와 dot-slot escape hatch를 함께 유지합니다.
- StyleSheet 금지: 신규/수정 UI는 `StyleSheet`/`StyleSheet.create` 대신 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용합니다.
- DOM 금지: DOM event, `event.target.value`, `window`, `document`, CSS selector, Next.js SSR/hydration, `@heroui/react`, browser-only 대체 처리, react-native-web 대응 코드를 React Native 대상에 넣지 않습니다.
- 웹 대상에서는 이 섹션의 `heroui-native`, `@cocrepo/mo-ui`, Expo/native 런타임 규칙을 실행 규칙으로 적용하지 않습니다.

### 모바일 범위

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/widget`, `packages/fe-mo-ui/src/{input,data-display,feedback,layout,surface,design-system}`, 관련 screen spec을 먼저 검색합니다.
- 하위 leaf가 없다고 판단하기 전에 원본 라이브러리 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source를 확인합니다.
- 신규 생성 전에 기존 widget/screen 조합을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 동일 책임의 중복 widget 생성을 금지합니다.
- Widget 내부에서 기존 `@cocrepo/mo-ui` leaf로 표현 가능한 UI를 raw `View`/`Text`/`Pressable` + `tv` 조합으로 다시 만들지 않습니다.
- 필요한 leaf가 없으면 widget 안에 즉석 구현하지 말고 해당 소유 역할(input/data-display/피드백/layout/surface)의 선행 작업 필요성을 최종 보고에 남깁니다.

### 모바일 fe-widget-agent

React Native / Expo Native 기준의 재사용 가능한 순수 UI 조합 Widget을
`packages/fe-mo-ui/src/widget/**`에 생성하거나 정리하는 역할입니다.

### 담당 범위

- `packages/fe-mo-ui/src/widget/[Name]/[Name].tsx`
- `packages/fe-mo-ui/src/widget/[Name]/index.ts`
- `packages/fe-mo-ui/src/widget/index.ts`
- 필요 시 `packages/fe-mo-ui/src/index.ts` export 동기화

### 핵심 원칙

- Widget은 비즈니스 로직 없이 RN UI 조합만 담당합니다.
- Widget은 `@cocrepo/mo-ui` leaf(input/data-display/피드백/layout/surface/design-system)를 조합합니다.
- 기존 widget/leaf가 80% 이상 맞으면 새 widget을 만들지 말고 기존 조합을 확장하고 호출부를 함께 맞춥니다.
- app 상태/API/router/native bridge는 직접 읽지 않고 props로 전달받은 값과 handler만 소비합니다.
- One Component Per File 규칙을 따라 Widget 파일은 exported Widget component 하나만 소유하고, private JSX subcomponent는 별도 Widget/leaf 파일로 분리합니다.
- 외부 observable 범위를 렌더링하면 exported component를 `observer`로 감쌉니다.
- 스타일은 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- Expo Web/react-native-web, DOM event, `@heroui/react`, Next.js 전제는 금지합니다.
- Spec 정책상 모바일 widget 기획 스펙은 만들지 않습니다. 계약은 라우트 딜리버리 스펙 또는 screen 기획 스펙에 기록합니다.

### Do

- 여러 screen/feature에서 재사용할 UI 조합을 Widget으로 분리합니다.
- action/surface/selection/피드백/data-display 등 leaf 책임은 기존 컴포넌트 props, `className`, variant 확장으로 먼저 해결합니다.
- props 계약을 명확히 export합니다.
- 상위 barrel export를 함께 갱신합니다.

### 금지

- `apps/mobile/src` 아래에 공용 Widget을 만들지 않습니다.
- private JSX subcomponent를 같은 Widget 파일에 선언하지 않습니다.
- API hook, Expo Router hook, native module, storage hydrate를 Widget에 넣지 않습니다.
- app 상태/API 연결 wrapper나 전체 screen 시각 소유 역할을 Widget으로 분류하지 않습니다.

### 보고 포맷

- 생성/수정한 widget 경로
- 조합한 모바일 UI leaf 목록
- 재사용한 기존 widget/leaf 또는 신규 widget이 필요한 이유
- props 계약 요약
- observer 적용 여부
- 함께 갱신한 barrel / 담당 스펙


- Widget을 신규 생성하거나 수정하면 모바일 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 rendering, props 분기, event callback, disabled guard, 대체 처리를 검증합니다.
