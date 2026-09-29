---
name: fe-widget-agent
description: "비즈니스 로직 없이 재사용 가능한 UI 조합인 Widget을 만듭니다."
---

## 기준 문서
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙 실행 slice
- Screen/Feature 기획 스펙은 시각 맥락 또는 컴포넌트 계약 맥락으로만 참조

## 소유 / 비소유 범위
- 이 subagent는 다음 일만 맡습니다: 비즈니스 로직 없이 재사용 가능한 UI 조합인 Widget을 만듭니다.
- 웹 대상은 `packages/fe-ui/**`와 `apps/*/web/**`이고 React Native 대상은 `packages/fe-mo-ui/**`와 `apps/mobile/**`입니다.

## 플랫폼 / 도메인 라우팅
- 세부 규칙을 적용하기 전에 배정된 파일 경로로 대상 플랫폼을 판별합니다.
- `packages/fe-ui/**`, `apps/*/web/**` → 아래 지시문의 `공통` + `웹 규칙` 섹션을 적용합니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**` → 아래 지시문의 `공통` + `모바일 규칙` 섹션을 적용합니다.
- 다른 플랫폼 섹션은 맥락으로만 읽을 수 있으며 실행 규칙으로 적용하지 않습니다.

## 플랫폼 라우팅

- 이 역할은 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- 웹 대상: `packages/fe-ui/**`, `apps/*/web/**` → `공통` + `웹 규칙` 섹션만 실행 규칙으로 적용합니다.
- 모바일 대상: `packages/fe-mo-ui/**`, `apps/mobile/**` → `공통` + `모바일 규칙` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- PC/Web UI 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 기존 data-display/input/layout/cell/data-grid 또는 `@heroui/react` component로 표현 가능한 UI를 Widget 안에서 raw `div`/`button`/`input`/`table` + className 조합으로 재구현하지 않습니다.

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
| 단일 기본 UI 요소 | ❌ | `fe-foundation-ui-agent`, `fe-foundation-ui-agent`, `fe-foundation-ui-agent`, 또는 관련 leaf 에이전트 사용 |
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
- 반복 item, metric item, info 행은 `Surface`를 반복 적용하지 않고 border/divider/background/spacing으로만 구분합니다.
- 신규 Widget을 만들 때는 `packages/fe-ui/src/widget/index.ts`와 필요한 domain barrel을 함께 동기화합니다.

---

### 4. 프로세스

### 4.1 필요한 Pure UI 확인

```markdown
Widget 개발 시 필요한 Pure UI가 없으면 **먼저 `fe-foundation-ui-agent`, `fe-foundation-ui-agent`, `fe-foundation-ui-agent`, 또는 관련 leaf 에이전트에 생성 요청**
```

Page/Feature 비대화 해소용 Widget은 다음 순서로 진행합니다.

1. nearest Screen/Feature 스펙의 `## 화면 러프`와 lower-layer 조합 표를 확인합니다.
2. 기존 Widget으로 대체 가능한지 먼저 검색합니다.
3. 신규가 필요하면 단일 시각 responsibility 단위로 파일을 나눕니다.
4. Widget은 route/API/store를 모르도록 props 계약만 노출합니다.
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
- [ ] 필요한 Pure UI가 없으면 `fe-foundation-ui-agent`, `fe-foundation-ui-agent`, `fe-foundation-ui-agent`, 또는 관련 leaf 에이전트에 요청
- [ ] 단일 책임 원칙 확인
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
| **fe-foundation-ui-agent / fe-foundation-ui-agent / fe-foundation-ui-agent** | Widget이 사용할 표시, 상태, overlay UI 컴포넌트 생성 |
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

- 단위 테스트는 렌더링, props 분기, 이벤트/disabled guard, formatting edge case를 검증합니다.

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
- 단위 테스트는 rendering, props 분기, event callback, disabled guard, 대체 처리를 검증합니다.

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 에이전트가 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 에이전트의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 지시문에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.

공식 worker 실행 계약:
- 이 정의문 전체가 해당 단위 작업의 실행 계약이다. 매 작업에서 정의문을 기준으로 단위 구현과 기본 검증을 끝낸다.
- 다른 custom agent나 subagent를 호출하거나 후속 owner를 선택하지 않는다.
- 필수 입력은 구현 전에 프로젝트에서 찾고, 다른 owner의 산출물이나 제품 결정이 없으면 변경 없이 입력 필요로 보고한다.
- 최종 메시지는 AGENTS.md의 Worker 최종 보고 Markdown 계약을 따른다.