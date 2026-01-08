---
name: 위젯-컴포넌트-빌더
description: 재사용 가능한 작은 UI 조각 Widget 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep
---

# Widget 컴포넌트 빌더

**재사용 가능한 작은 UI 조각**을 `packages/ui/src/components/widget`에 생성합니다.

---

## 1. Widget이란?

| 구분 | 설명 | 예시 |
|------|------|------|
| **정의** | UI 컴포넌트를 조합하여 만든 재사용 가능한 복합 단위 | StatusBadge, AvatarGroup, PriceTag |
| **특징** | 비즈니스 로직 없이 순수 UI만 담당 | 여러 Feature/Page에서 사용 |
| **위치** | `packages/ui/src/components/widget/` | |

---

## 2. 컴포넌트 계층 구조와 개발 순서 (Critical)

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

**개발 원칙:**
- **항상 Pure UI → Widget → Feature 순서로 개발**
- Widget 개발 시 필요한 Pure UI가 없으면 **먼저 Pure UI 생성 요청**
- **최대한 Widget으로 자원화** - Feature에서 재사용 가능하도록 설계
- Widget은 **순수 UI 조합** - Store/API 연결 없이 props만으로 동작

| 항목 | UI 컴포넌트 | Widget | Feature |
|------|------------|--------|----------|
| **크기** | 최소 단위 (Pure) | 작음~중간 (UI 조합) | 중간~큼 (복합 UI) |
| **의존성** | 없음 (독립) | UI 컴포넌트만 사용 | widget/UI 조합 |
| **비즈니스** | 무관 | 무관 | 비즈니스 기능 담당 |
| **위치** | `components/ui/` | `components/widget/` | `components/feature/` |
| **예시** | Button, Input, Chip | NavTreePanel, TabBar | SideNav, BottomTab |

### 네이밍 규칙 (Critical)

**Widget 네이밍: `[기능][UI형태]`** - "무엇을 보여주는가"

| 패턴 | 설명 | 예시 |
|------|------|------|
| `[기능]Panel` | 패널 형태의 UI | NavTreePanel, FilterPanel |
| `[기능]Bar` | 막대 형태의 UI | TabBar, ToolBar, SearchBar |
| `[기능]List` | 목록 형태의 UI | MenuList, ItemList |
| `[기능]Card` | 카드 형태의 UI | UserCard, StatCard |
| `[기능]Badge` | 뱃지 형태의 UI | StatusBadge, CountBadge |

**Widget → Feature 분리 예시:**

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

---

## 3. 폴더 구조

```
packages/ui/src/components/widget/
├── StatusBadge/
│   ├── StatusBadge.tsx
│   └── index.ts
├── AvatarGroup/
│   ├── AvatarGroup.tsx
│   └── index.ts
├── PriceTag/
│   ├── PriceTag.tsx
│   └── index.ts
└── index.ts               # barrel export
```

---

## 4. 컴포넌트 템플릿

```tsx
// packages/ui/src/components/widget/StatusBadge/StatusBadge.tsx
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

```ts
// packages/ui/src/components/widget/StatusBadge/index.ts
export { StatusBadge } from "./StatusBadge";
export type { StatusBadgeProps } from "./StatusBadge";
```

---

## 5. 핵심 규칙

| 규칙 | 설명 |
|------|------|
| **UI 컴포넌트 조합** | `components/ui/` 폴더의 Pure UI만 사용 |
| **단일 책임** | 하나의 명확한 역할만 수행 |
| **Pure UI** | 상태/API 호출 금지, props로만 동작 |
| **displayName** | 디버깅을 위해 displayName 설정 |

### Text 컴포넌트 사용 제한 (Critical)

**Text 컴포넌트를 Button, Chip 등 단독으로 텍스트를 받는 컴포넌트의 children으로 사용하면 안 됩니다.**

```tsx
// ❌ 금지 - 테마 깨짐
<Button><Text>버튼</Text></Button>
<Chip><Text>칩</Text></Chip>

// ✅ 올바른 사용
<Button>버튼</Button>
<Chip>칩</Chip>
```

### memo 사용 규칙

| 상황 | memo 필요 여부 | 이유 |
|------|:-------------:|------|
| `observer` 사용 시 | ❌ 불필요 | observer가 내부적으로 memo 처리 |
| 순수 함수 컴포넌트 | ⚠️ 선택적 | 성능 이슈 있을 때만 추가 |

```tsx
// ✅ observer 사용 시 - memo 불필요
export const MyWidget = observer<Props>(({ value }) => {
  return <Chip>{value}</Chip>;
});

// ✅ 순수 함수 컴포넌트 - memo 선택적 (성능 이슈 시 추가)
export const StatusBadge = ({ status }: Props) => {
  return <Chip>{status}</Chip>;
};

// ❌ 중복 - observer와 memo 함께 사용 금지
export const MyWidget = memo(observer<Props>(({ value }) => {
  return <Chip>{value}</Chip>;
}));
```

### UI 컴포넌트 참조 가능 카테고리

`components/ui/` 내의 다음 카테고리 컴포넌트를 조합:

- **data-display**: Avatar, Chip, Icon, Text, User 등
- **inputs**: Button, Input, Checkbox, Select 등
- **feedback**: Message, Skeleton, Placeholder 등
- **surfaces**: Container, HStack, VStack, Spacer 등

---

## 6. 스타일링 규칙 (Critical)

**커스텀 className 사용 금지 - HeroUI와 기존 컴포넌트만 사용**

> **예외**: `components/ui/`와 `components/inputs/`에서만 커스텀 className이 허용됩니다. Widget 컴포넌트에서는 금지입니다.

Widget 컴포넌트 내부에서도 직접 Tailwind className을 작성하지 않습니다.

```tsx
// ❌ 금지 - 커스텀 className 직접 사용
export const StatusBadge = ({ status }: Props) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-success-50 px-2 py-1">
      <span className="text-sm font-medium text-success-700">{status}</span>
    </div>
  );
};

// ✅ 올바른 패턴 - HeroUI와 UI 컴포넌트 사용
export const StatusBadge = ({ status }: Props) => {
  const config = statusConfig[status];
  return (
    <Chip color={config.color} size="sm">
      {config.text}
    </Chip>
  );
};
```

**레이아웃 배치는 레이아웃 컴포넌트 사용**

```tsx
// ❌ 금지 - className으로 레이아웃 제어
<div className="flex items-center gap-2">
  <Avatar />
  <span className="ml-2">{name}</span>
</div>

// ✅ 올바른 패턴 - 레이아웃 컴포넌트 사용
<HStack gap={2} align="center">
  <Avatar />
  <Text>{name}</Text>
</HStack>
```

**자주 사용되는 스타일 패턴 발견 시:**
1. 기존 UI 컴포넌트에서 해당 스타일을 지원하는지 확인
2. 지원하지 않으면 **UI 컴포넌트 빌더**에게 새 컴포넌트 생성 요청
3. 생성된 컴포넌트를 Widget에서 활용

---

## 7. Widget 후보 예시

| 카테고리 | 컴포넌트 |
|----------|----------|
| **상태 표시** | StatusBadge, OnlineIndicator, ProgressLabel |
| **사용자** | AvatarGroup, UserChip, RoleBadge |
| **데이터** | PriceTag, DateLabel, CountBadge |
| **액션** | CopyButton, ShareButton, BookmarkToggle |

---

## 8. 라이브러리 타입 기반 설계 (Critical)

**라이브러리 컴포넌트를 조합할 때는 반드시 기존 라이브러리 타입을 기반으로 Props를 설계합니다.**

```tsx
// ✅ 올바른 패턴 - 라이브러리 타입 상속
import { Chip, ChipProps } from "@heroui/react";

// 상속하여 추가 props 정의
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

```tsx
// ❌ 금지 - 라이브러리 타입 무시
export interface StatusBadgeProps {
  status: "active" | "inactive";
  // Chip이 지원하는 size, variant 등 다른 props 누락
}
```

**타입 설계 원칙:**

| 패턴 | 사용 시점 | 예시 |
|------|----------|------|
| `extends Omit<LibProps, 'key'>` | 일부 props 고정 + 나머지 전달 | StatusBadge (color 고정) |
| `extends Pick<LibProps, 'key'>` | 일부 props만 노출 | 제한된 UserChip |
| `extends LibProps` | 모든 props 유지 + 추가 | 확장된 AvatarGroup |

---

## 9. 체크리스트

- [ ] `packages/ui/src/components/widget/[Name]/` 에 생성
- [ ] 단일 책임 원칙 확인
- [ ] **라이브러리 타입 기반 Props 설계** (extends/Omit/Pick)
- [ ] observer 사용 시 memo 제외 확인
- [ ] Props 인터페이스 export
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] widget/index.ts에 barrel export 추가
