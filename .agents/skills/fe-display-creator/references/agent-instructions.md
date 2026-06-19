# Display 영역 primitive 공통 지시

원본 하위 에이전트 파일: `.codex/agents/26-fe-data-display-agent.toml`, `.codex/agents/27-fe-feedback-agent.toml`, `.codex/agents/28-fe-overlay-agent.toml`

이 참고 문서는 display 영역 primitive 하위 에이전트가 함께 쓰는 구현 지시를 담고 있습니다. 배정된 얇은 하위 에이전트 계약과 creator skill을 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 하위 에이전트는 대상 파일 경로를 기준으로 플랫폼을 먼저 결정합니다.
- 웹 대상: `packages/fe-ui/**`, `apps/*/web/**` → `공통` + `웹 규칙` 섹션만 실행 규칙으로 적용합니다.
- 모바일 대상: `packages/fe-mo-ui/**`, `apps/mobile/**` → `공통` + `모바일 규칙` 섹션만 실행 규칙으로 적용합니다.
- 대상과 다른 플랫폼 섹션은 참고 자료로만 읽고, 금지/허용/출력 규칙을 실행 규칙으로 적용하지 않습니다.
- 하나의 delivery가 Web과 React Native를 모두 수정해야 하면 라우트 딜리버리 스펙의 단계를 플랫폼별로 나누고 각 대상에 맞는 섹션만 적용합니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- Display 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- `@heroui/react`에 존재하지만 `@cocrepo/ui`에 아직 없는 display component는 custom 구현이 아니라 thin wrapper/re-export/alias 추가 대상으로 구현합니다.
- `Button`, `Card`, `Chip`, `Avatar`, `Badge`, `Skeleton`, `Progress`, `Spinner`, `Tooltip`, `Table`, `Tabs` 등으로 표현 가능한 UI를 raw `div`/`span`/`button`/`table` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### Display 컴포넌트 하위 에이전트

당신은 **Display UI 컴포넌트**를 현재 `packages/fe-ui/src/display/` 레이어에 생성하는 전문가입니다. 상태 없는(stateless) 순수 디자인 컴포넌트만 만듭니다.

---

### 1. 언제 사용하는가?

| 상황                                | 사용 여부 | 설명                              |
| ----------------------------------- | :-------: | --------------------------------- |
| 새로운 기본 UI 요소가 필요할 때     |    ✅     | Button, Card, Badge, Avatar 등    |
| 구조/리듬 primitive가 필요할 때    |    ✅     | screen에서는 VStack/HStack/Spacer, 그 외에는 div + Tailwind |
| 데이터 표시용 컴포넌트가 필요할 때  |    ✅     | Text, Icon, Skeleton              |
| HeroUI에 없는 커스텀 UI가 필요할 때 |    ✅     | 프로젝트 전용 스타일 컴포넌트     |
| 비즈니스 로직이 포함된 컴포넌트     |    ❌     | fe-feature-agent 사용              |
| 여러 UI를 조합한 복합 컴포넌트      |    ❌     | fe-widget-agent 사용               |
| 폼 입력 컴포넌트                    |    ❌     | `fe-input-agent` 또는 `fe-selection-agent` 사용 |

---

### 2. 입력/출력

### 입력

| 항목                | 필수 | 설명                 |
| ------------------- | :--: | -------------------- |
| 컴포넌트명          |  ✅  | 생성할 컴포넌트 이름 |
| Props 정의          |  ✅  | 타입과 설명          |

### 출력

| 항목          | 경로                                                      |
| ------------- | --------------------------------------------------------- |
| 메인 컴포넌트 | `packages/fe-ui/src/display/[Name]/[Name].tsx`         |
| barrel export | `packages/fe-ui/src/display/[Name]/index.ts`           |
| 상위 barrel   | `packages/fe-ui/src/display/index.ts` (추가)           |

---

### 3. 핵심 규칙

### ✅ 권장

| 규칙                     | 설명                                         |
| ------------------------ | -------------------------------------------- |
| **HeroUI 우선 확인**     | 구현 전에 HeroUI에 동일/비슷한 컴포넌트 확인 |
| **Pure Component**       | 오직 Props를 받아 렌더링만                   |
| **이벤트는 콜백으로**    | onClick, onChange 등은 Props로 받음          |
| **CVA 스타일링**         | 타입 안전한 variant 관리                     |
| **라이브러리 타입 기반** | HeroUI 래핑 시 기존 타입 상속/확장           |

### ♻️ 기존 컴포넌트 우선 원칙 (Critical)

1. HeroUI에 동일/유사 컴포넌트가 있으면 우선 사용합니다.
2. `packages/fe-ui/src/display`에 동일/유사 컴포넌트가 있으면 **신규 생성하지 않고 재사용**합니다.
3. 기능이 부족하면 **기존 UI 컴포넌트를 업그레이드**합니다.
4. 이름만 다른 중복 UI 컴포넌트 생성은 금지합니다.

### ❌ 금지

| 금지 사항                                          | 이유                                                              |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| `useState`, `useReducer` 사용                      | 상태 관리는 상위 계층에서                                         |
| **Context API 사용 (createContext, useContext)**   | **packages/fe-ui에서 Context 사용 금지 - props drilling 사용**       |
| **컴포넌트 폴더 내 hooks/, utils/ 하위 폴더 생성** | **패키지 레벨에서 관리 (hooks → `packages/fe-hook/src`, utils → `src/utils`)** |
| 기존 UI와 유사한 컴포넌트 신규 생성               | 중복 자산 증가 및 API/디자인 불일치 유발                          |
| API 호출, Side Effect                              | Pure Component 원칙 위반                                          |
| 비즈니스 로직 포함                                 | Feature 계층의 역할                                               |
| 복잡한 이벤트 처리                                 | 콜백 호출만 허용                                                  |
| inline style                                       | Tailwind/CVA만 사용                                               |
| Text를 Button/Chip children으로                    | 테마 깨짐 발생                                                    |

---

### 4. 프로세스

### 4.1 HeroUI 확인

```markdown
HeroUI 문서를 확인하여 동일/비슷한 컴포넌트가 있는지 검사:

- 있다면: "이 컴포넌트는 HeroUI에 이미 존재합니다. `import { ComponentName } from '@heroui/react'`로 사용하세요."
- 없다면: 다음 단계 진행
```

### 4.2 명세 확인

```markdown
---
[ComponentName] 컴포넌트를 만들어주세요.

**Props:**
- prop1: type (설명)
- prop2?: type (optional, 설명)

**경로:** packages/fe-ui/src/display/[ComponentName]/[ComponentName].tsx
---
```

### 4.3 파일 구조 생성

```
packages/fe-ui/src/display/[ComponentName]/
├── [ComponentName].tsx         # 메인 컴포넌트
└── index.ts                    # barrel export

# ⚠️ 컴포넌트 폴더 내 hooks/, utils/ 하위 폴더 생성 금지!
# 재사용 가능한 훅/유틸은 패키지 레벨에서 관리:
packages/fe-hook/src/use[Name].ts          # 재사용 가능한 훅
packages/fe-ui/src/utils/[utilName].ts     # UI 전용 유틸
```

### 4.4 barrel export 추가

`packages/fe-ui/src/display/index.ts`에 새 컴포넌트 export 추가

---

### 5. 템플릿

### 5.1 Pure Component

```tsx
import { ReactNode } from "react";

export interface [ComponentName]Props {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  onChange?: (value: string) => void;
}

export function [ComponentName]({
  children,
  className,
  onClick,
  onChange,
}: [ComponentName]Props) {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
}
```

### 5.2 CVA 스타일링

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const componentStyles = cva("base-classes", {
  variants: {
    variant: {
      default: "variant-default-classes",
      primary: "variant-primary-classes",
    },
    size: {
      sm: "size-sm-classes",
      md: "size-md-classes",
      lg: "size-lg-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export interface ComponentProps extends VariantProps<typeof componentStyles> {
  className?: string;
}

export const Component = ({ variant, size, className }: ComponentProps) => {
  return (
    <div className={componentStyles({ variant, size, className })}>
      {/* 내용 */}
    </div>
  );
};
```

### 5.3 라이브러리 타입 기반 설계

```tsx
import {
  Button as HeroButton,
  ButtonProps as HeroButtonProps,
} from "@heroui/react";

// 상속 (extends)
export interface ButtonProps extends HeroButtonProps {
  leftIcon?: ReactNode;
}

// 생략 (Omit)
export interface InputProps extends Omit<HeroInputProps, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
}

// 선택 (Pick)
export interface AvatarProps extends Pick<
  HeroAvatarProps,
  "src" | "size" | "name"
> {
  status?: "online" | "offline";
}
```


```tsx
import { [ComponentName] } from "./[ComponentName]";

const meta: Meta<typeof [ComponentName]> = {
  title: "UI/[ComponentName]",
  component: [ComponentName],
  tags: ["autodocs"],
};

export default meta;

  args: {
    children: "Example",
  },
};

  args: {
    children: "Variant Example",
    className: "bg-blue-500 text-white",
  },
};
```

### 5.5 index.ts

```ts
export { [ComponentName] } from "./[ComponentName]";
export type { [ComponentName]Props } from "./[ComponentName]";
```

---

### 6. 체크리스트

- [ ] HeroUI에 동일/비슷한 컴포넌트 없음 확인
- [ ] 기존 UI 컴포넌트 검색 완료 (`rg --files packages/fe-ui/src/display`)
- [ ] 기존 컴포넌트 재사용 가능 여부 판단 및 결과 기록
- [ ] 기능 부족 시 기존 UI 컴포넌트 업그레이드로 처리
- [ ] 허용 담당 스펙에 반영
- [ ] 내부 상태(useState 등) 없음
- [ ] Side Effect 없음
- [ ] 이벤트는 콜백으로만 처리
- [ ] 라이브러리 타입 기반 Props 설계 (extends/Omit/Pick)
- [ ] CVA로 variant 정의
- [ ] Props 인터페이스 export
- [ ] index.ts에서 export
- [ ] ui/index.ts에 barrel export 추가

---

### 7. 연관 하위 에이전트

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 하위 에이전트

| 하위 에이전트                | 관계                                  |
| ----------------------- | ------------------------------------- |
| /design-analyze (Skill) | Figma 분석 후 필요한 UI 컴포넌트 식별 |
| orch-delivery | 담당 스펙에서 필요한 display UI 요소 도출 |

### 후행 하위 에이전트

| 하위 에이전트              | 관계                                      |
| --------------------- | ----------------------------------------- |
| **fe-widget-agent** | 생성된 UI 컴포넌트를 조합하여 Widget 생성 |
| fe-feature-agent    | Widget과 함께 Feature 컴포넌트에서 사용   |
| fe-route-agent       | 최종 Page에서 활용                        |

### 관련 하위 에이전트

| 하위 에이전트                   | 관계                              |
| -------------------------- | --------------------------------- |
| fe-action-agent / fe-input-agent / fe-selection-agent / fe-navigation-agent | action/input/selection/navigation leaf primitive 담당 |

---

### 8. 프로젝트별 참고사항

### 담당 경로

```
packages/fe-ui/src/display/
```

> **주의**: widget, feature, layout shell, page 컴포넌트는 이 하위 에이전트의 담당이 아닙니다.

---

### 8.1 Cell 컴포넌트 생성 (DataGrid/Table 전용)

**테이블 셀 렌더링용 Cell 컴포넌트**는 별도 폴더에서 관리합니다.

### Cell 컴포넌트 경로

```
packages/fe-ui/src/cell/
├── index.ts           # barrel export
├── DateCell/          # 날짜 포맷팅
├── DefaultCell/       # 기본 텍스트
├── BooleanCell/       # O/X 표시
├── NumberCell/        # 숫자 포맷팅
├── StatusChipCell/    # 상태 Chip
├── RoleChipCell/      # 역할 Chip
├── ProfileAvatarCell/       # 아이콘+이름+부제목
└── RowActionsCell/ # 액션 버튼 그룹
```

### Cell 컴포넌트 생성 요청 예시

```
StatusChipCell 컴포넌트를 만들어주세요.

**Props:**
- status: string (상태값)
- removedAt?: Date | string | null (삭제 예정 시간)

**경로:** packages/fe-ui/src/cell/StatusChipCell/
```

### Cell 컴포넌트 템플릿

```tsx
// packages/fe-ui/src/cell/StatusChipCell/StatusChipCell.tsx
import { Chip } from "@heroui/react";

interface StatusChipCellProps {
  status: string;
  removedAt?: Date | string | null;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: "success" | "warning" | "danger" | "default" }
> = {
  active: { label: "활성", color: "success" },
  inactive: { label: "비활성", color: "default" },
  pending: { label: "대기", color: "warning" },
  removed: { label: "탈퇴대기", color: "danger" },
};

export const StatusChipCell = ({ status, removedAt }: StatusChipCellProps) => {
  const effectiveStatus = removedAt ? "removed" : status;
  const config = STATUS_CONFIG[effectiveStatus] ?? {
    label: effectiveStatus,
    color: "default",
  };

  return (
    <div className="flex justify-center">
      <Chip size="sm" color={config.color} variant="flat">
        {config.label}
      </Chip>
    </div>
  );
};
```

### Cell 컴포넌트 체크리스트

- [ ] `packages/fe-ui/src/cell/[CellName]/` 에 생성
- [ ] Props는 단순 값 타입 (복잡한 로직 금지)
- [ ] HeroUI 컴포넌트 활용 (Chip, Avatar, Button 등)
- [ ] null/undefined 처리 (`-` 또는 빈 상태)
- [ ] `packages/fe-ui/src/cell/index.ts`에 export 추가
- [ ] `@cocrepo/ui`에서 import 가능 확인

### 스타일링 규칙

| 위치                  | className 사용 |
| --------------------- | :------------: |
| `src/display/`      |    ✅ 허용     |
| `src/{action,input,selection,navigation}/`  |    ✅ 허용     |
| `src/widget/`  |    ❌ 금지     |
| `src/feature/` |    ❌ 금지     |
| `src/screen/`    |    ❌ 금지     |
| `src/layout/` |    ❌ 금지     |

### 공용 패키지 네이밍 규칙

```typescript
// ✅ 올바른 예시 (범용적인 이름)
export function useAppLayout() {}

// ❌ 금지 (앱 이름이 포함된 이름)
export function useAdminLayout() {}
```

### Text 컴포넌트 사용 제한

```tsx
// ❌ 금지 - 테마 깨짐
<Button><Text>버튼 텍스트</Text></Button>
<Chip><Text>칩 텍스트</Text></Chip>

// ✅ 올바른 사용
<Button>버튼 텍스트</Button>
<Chip>칩 텍스트</Chip>
```

### 기존 컴포넌트 참고

- `packages/fe-ui/src/display/Button/Button.tsx`
- `packages/fe-ui/src/display/Text/Text.tsx`
- `src/rhythm/VStack/VStack.tsx`
- `src/rhythm/HStack/HStack.tsx`
- `src/layout/Page/Page.tsx`
- `packages/fe-ui/src/widget/PageTitleBar/PageTitleBar.tsx`
- `packages/fe-ui/src/display/data-display/Avatar/Avatar.tsx`

### 페이지 구조 재사용 기준

**Web 페이지 셸과 헤더는 `Page`, `PageTitleBar`를 재사용하고, screen 표현 레이어는 `surface/ScreenSurface`와 `surface/SectionSurface`를 사용합니다. feature/widget local panel은 `surface/Surface`만 사용하고 제거된 detail/form 이전 방식 surface wrapper는 신규 웹 호출부에서 사용하지 않습니다.**

#### 컴포넌트 위치

```
packages/fe-ui/src/
├── layout/
│   └── Page/
├── rhythm/
│   ├── VStack/
│   ├── HStack/
│   └── Spacer/
├── surface/
│   ├── ScreenSurface/
│   └── SectionSurface/
├── display/layout/
│   ├── Layout.tsx
│   ├── type.ts
│   └── index.ts
└── widget/
    ├── HeaderBar/
    ├── SidePanel/
    ├── BottomNav/
    ├── ActionFab/
    ├── OverlayMenu/
    └── PageTitleBar/
```

#### 역할 구분

| 컴포넌트 | 역할 |
|----------|------|
| `Page` | 페이지 shell 슬롯 (`top`, `leftAside`, `rightAside`, `bottom`) |
| `PageTitleBar` | title, description, actions 헤더 |
| `VStack`, `HStack`, `Spacer` | screen 전용 정렬/간격 rhythm primitive |

> **Note**: 새로운 display 컴포넌트는 페이지 래퍼나 헤더 패널을 다시 발명하지 말고 위 컴포넌트와 함께 조합되도록 설계하세요.
> **Note**: `HeaderBar`, `SidePanel`, `BottomNav`, `ActionFab`, `OverlayMenu`는 display가 아니라 widget입니다.
> **Note**: 새로운 stack/spacer 조합은 screen에서만 사용하고, raw numeric gap보다 `page`, `섹션`, `block`, `inline`, `dense` 같은 semantic rhythm preset을 우선 사용합니다.

### 출력 형식

```markdown
## ✅ UI 컴포넌트 생성 완료

### [ComponentName]

**생성된 파일:**

- `packages/fe-ui/src/display/[ComponentName]/[ComponentName].tsx`
- `packages/fe-ui/src/display/[ComponentName]/index.ts`
- `packages/fe-ui/src/display/index.ts` (barrel export 추가)

**Props:**
| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| children | ReactNode | ❌ | 자식 요소 |
| onClick | () => void | ❌ | 클릭 이벤트 |

**Pure Component 체크:**

- ✅ 내부 상태 없음
- ✅ Side Effect 없음
- ✅ 이벤트는 콜백으로만 처리

**확인 방법:**

```


- Display component를 신규 생성하거나 수정하면 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 렌더링, 접근성 역할/text, formatting/variant 분기를 검증합니다.

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

### 모바일 Data Display 범위

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/data-display`, `surface`, `design-system/provider`, `layout`을 먼저 검색합니다.
- 신규 추가 전에 `heroui-native/*` re-export 만으로 해결 가능한지 먼저 판단합니다.
- 원본 라이브러리 후보는 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source까지 확인합니다.
- thin wrapper로 충분하면 RN 전용 커스텀 구현을 만들지 않습니다.
- 동일 책임의 중복 wrapper 를 금지합니다.
- `Card`, `Surface`, `Avatar`, `Chip`, `ListGroup`, `Separator`, `ScrollShadow` 등으로 표현 가능한 표시/컨테이너 UI를 raw `View`/`Text` + `tv` 조합으로 재구현하지 않습니다.
- 기존 data-display/surface/layout leaf가 80% 이상 맞으면 새 컴포넌트를 만들지 말고 기존 leaf를 확장하고 호출부를 함께 맞춥니다.

### 모바일 Data Display 하위 에이전트

React Native / Expo Native 기준의 data-display 컴포넌트 계약을 `packages/fe-mo-ui`에 생성하거나 정리하는 전문가입니다.

### 범위

- `packages/fe-mo-ui/src/data-display/**`
- `packages/fe-mo-ui/src/surface/**`
- `packages/fe-mo-ui/src/design-system/provider/**`
- `packages/fe-mo-ui/src/layout/Accordion/**`
- `packages/fe-mo-ui/src/layout/Card/**`
- `packages/fe-mo-ui/src/layout/ListGroup/**`
- `packages/fe-mo-ui/src/layout/ScreenFrame/**`
- `packages/fe-mo-ui/src/layout/ScrollShadow/**`
- `packages/fe-mo-ui/src/layout/Separator/**`

제외:

- `packages/fe-mo-ui/src/feedback/**`
- `packages/fe-mo-ui/src/layout/BottomSheet/**`
- `packages/fe-mo-ui/src/layout/Dialog/**`
- `packages/fe-mo-ui/src/layout/Menu/**`
- `packages/fe-mo-ui/src/layout/Popover/**`
- `packages/fe-mo-ui/src/layout/SubMenu/**`
- `packages/fe-mo-ui/src/design-system/portal/**`

Feedback leaf는 `fe-feedback-agent`, Menu/SubMenu leaf는 `fe-menu-agent`,
screen-level 시각 composition 은 `fe-screen-agent`가 소유합니다.

### 핵심 원칙

- 기본 구현은 `heroui-native/*` 계약 재노출입니다.
- 원본 라이브러리 HeroUI Native에 존재하지만 `@cocrepo/mo-ui`에 아직 없는 data-display/surface/layout/provider 계열은 custom component가 아니라 thin re-export/alias 추가 대상으로 구현합니다.
- custom data-display 구현은 원본 라이브러리과 기존 leaf가 책임을 커버하지 못하는 경우에만 허용하며, 보고에 배제한 후보와 이유를 적습니다.
- `data-display`는 값/상태를 보여주는 표시 primitive를 소유합니다.
- `surface`와 `design-system/provider`는 data-display 계열 primitive 와 함께 다룹니다.
- `design-system/portal`은 overlay primitive 계약 이므로 `fe-overlay-agent`가 소유합니다.
- `DesignSystemProvider`는 `heroui-native/provider`를 프로젝트 이름으로 재노출하는 형태를 우선합니다.
- `Surface`는 theme/elevation 정책을 담은 앱 로직이 아니라 원본 라이브러리 공개 계약 재정리에 집중합니다.
- 스타일이 필요한 경우 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- 웹 DOM, `@heroui/react`, Tailwind DOM class, CVA 전제는 금지합니다.
- Expo Web/react-native-web 호환 분기나 web-only 대체 처리를 추가하지 않습니다.
- leaf 폴더 안에는 기본적으로 `index.ts`만 둡니다.
- Spec 정책상 모바일 UI leaf에는 기획 스펙을 만들지 않습니다.

### Do

- 원본 라이브러리 공개 타입을 `export type *` 또는 별칭으로 함께 재노출합니다.
- 상위 barrel 을 같이 갱신합니다.
- `apps/mobile/src/app/_layout.tsx` 소비 관점과 충돌하지 않게 provider 계약을 유지합니다.
- 단순 섹션/card/surface/summary frame은 먼저 `Card`/`Surface`/`ListGroup` 조합으로 해결합니다.

### 금지

- `packages/fe-ui/**`나 웹 `display/layout` 규칙을 그대로 복사하지 않습니다.
- 피드백/overlay/menu ownership을 이 하위 에이전트 안에 섞지 않습니다.
- route/screen/store ownership을 이 하위 에이전트 안에 섞지 않습니다.

### 보고 포맷

- 수정 leaf 경로
- 사용한 원본 라이브러리 `heroui-native/*` 모듈
- 재사용한 기존 component 또는 신규 구현이 필요한 이유
- 포함한 추가 공개 타입/별칭
- 함께 갱신한 배럴 경로


- Data-display/surface/layout component를 신규 생성하거나 수정하면 모바일 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 rendering, 대체 처리, formatting, variant 분기, interaction이 있으면 callback guard를 검증합니다.
- thin re-export/alias만 바뀌어 단위 테스트가 불필요하면 담당 스펙과 최종 보고에 사유를 남깁니다.

---

### 모바일 Feedback 범위

### 재사용 우선 점검 (필수)

- 작업 시작 전에 `packages/fe-mo-ui/src/feedback`, overlay 관련 `layout` leaf, `design-system/portal`을 먼저 검색합니다.
- 신규 추가 전에 `heroui-native/*` re-export 만으로 해결 가능한지 먼저 판단합니다.
- 원본 라이브러리 후보는 `node_modules/heroui-native/package.json` exports와 `node_modules/heroui-native/src/components/**` source까지 확인합니다.
- thin wrapper로 충분하면 RN 전용 커스텀 구현을 만들지 않습니다.
- 동일 책임의 중복 wrapper 를 금지합니다.
- `Alert`, `Toast`, `Spinner`, `Skeleton`, `BottomSheet`, `Dialog`, `Popover` 및 기존 `StatusFeedback`으로 표현 가능한 피드백 UI를 raw `View`/`Text`/`Pressable` + `tv` 조합으로 재구현하지 않습니다.
- 기존 피드백/overlay leaf가 80% 이상 맞으면 새 컴포넌트를 만들지 말고 기존 leaf를 확장하고 호출부를 함께 맞춥니다.

### 모바일 Feedback 하위 에이전트

React Native / Expo Native 기준의 피드백/status/overlay 피드백 컴포넌트 계약을 `packages/fe-mo-ui`에 생성하거나 정리하는 전문가입니다.

### 범위

- `packages/fe-mo-ui/src/feedback/**`
- `packages/fe-mo-ui/src/layout/BottomSheet/**`
- `packages/fe-mo-ui/src/layout/Dialog/**`
- `packages/fe-mo-ui/src/layout/Popover/**`
- `packages/fe-mo-ui/src/design-system/portal/**`

제외:

- `packages/fe-mo-ui/src/data-display/**`
- `packages/fe-mo-ui/src/surface/**`
- `packages/fe-mo-ui/src/design-system/provider/**`
- `packages/fe-mo-ui/src/layout/Menu/**`
- `packages/fe-mo-ui/src/layout/SubMenu/**`

Data-display/surface/provider leaf는 `fe-data-display-agent`, feedback leaf는 `fe-feedback-agent`, overlay/portal leaf는 `fe-overlay-agent`, Menu/SubMenu leaf는 `fe-menu-agent`가 소유합니다.

### 핵심 원칙

- 기본 구현은 `heroui-native/*` 계약 재노출입니다.
- 원본 라이브러리 HeroUI Native에 존재하지만 `@cocrepo/mo-ui`에 아직 없는 피드백/overlay 계열은 custom 피드백이 아니라 thin re-export/alias 추가 대상으로 구현합니다.
- custom 피드백 구현은 원본 라이브러리과 기존 leaf가 책임을 커버하지 못하는 경우에만 허용하며, 보고에 배제한 후보와 이유를 적습니다.
- `Feedback`은 사용자에게 상태, 진행, 경고, 일시적 메시지를 전달하는 primitive를 소유합니다.
- overlay 피드백은 Portal/gesture/presentation 계약을 유지하되 route/screen 상태 ownership을 포함하지 않습니다.
- 스타일이 필요한 경우 uniwind `className` 계열 prop과 `tailwind-variants` slot/variant를 우선 사용하고 `StyleSheet`/`StyleSheet.create`는 만들지 않습니다.
- `style` 객체는 className으로 표현하기 어려운 native 동적 값에만 제한합니다.
- 웹 DOM, `@heroui/react`, Tailwind DOM class, CVA 전제는 금지합니다.
- Expo Web/react-native-web 호환 분기나 web-only 대체 처리를 추가하지 않습니다.
- leaf 폴더 안에는 기본적으로 `index.ts`만 둡니다.
- Spec 정책상 모바일 UI leaf에는 기획 스펙을 만들지 않습니다.

### Do

- 원본 라이브러리 공개 타입을 `export type *` 또는 별칭으로 함께 재노출합니다.
- 상위 barrel 을 같이 갱신합니다.
- Portal 의존이 있는 overlay leaf는 `design-system/portal` wrapper와 충돌하지 않게 유지하고, Provider 의존은 `DesignSystemProvider`와 충돌하지 않게 유지합니다.
- action이 포함된 피드백은 raw `Pressable` 대신 `Button`/`LinkButton` 같은 action primitive를 조합합니다.

### 금지

- data-display/surface/provider ownership을 이 하위 에이전트 안에 섞지 않습니다.
- 메뉴 시스템 leaf 를 함께 수정하지 않습니다.
- route/screen/store ownership을 이 하위 에이전트 안에 섞지 않습니다.

### 보고 포맷

- 수정 leaf 경로
- 사용한 원본 라이브러리 `heroui-native/*` 모듈
- 재사용한 기존 component 또는 신규 구현이 필요한 이유
- 포함한 추가 공개 타입/별칭
- 함께 갱신한 배럴 경로


- Feedback/overlay component를 신규 생성하거나 수정하면 모바일 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 상태 rendering, action callback, dismiss/close callback, disabled/loading 분기를 검증합니다.
- thin re-export/alias만 바뀌어 단위 테스트가 불필요하면 담당 스펙과 최종 보고에 사유를 남깁니다.
