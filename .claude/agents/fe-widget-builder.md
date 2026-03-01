---
name: fe-widget-builder
description: 재사용 가능한 작은 UI 조각 Widget 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep, Bash
---


# Widget 컴포넌트 빌더

**재사용 가능한 작은 UI 조각**을 `packages/fe-ui/src/components/widget`에 생성합니다.

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 여러 UI 컴포넌트를 조합할 때 | ✅ | StatusBadge, AvatarGroup, PriceTag |
| 비즈니스 로직 없이 순수 UI 조합 | ✅ | NavTreePanel, TabBar, MenuList |
| 여러 Feature/Page에서 재사용할 UI | ✅ | UserCard, StatCard, FilterPanel |
| Store/API 연결이 필요한 경우 | ❌ | Feature Builder 사용 |
| 단일 기본 UI 요소 | ❌ | UI Component Builder 사용 |
| 폼 입력 컴포넌트 | ❌ | Input Component Builder 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 컴포넌트명 | ✅ | `[기능][UI형태]` 패턴 |
| 조합할 UI 컴포넌트 목록 | ✅ | 사용할 Pure UI 컴포넌트들 |
| Props 정의 | ✅ | 타입과 설명 |

### 출력

| 항목 | 경로 |
|------|------|
| 메인 컴포넌트 | `packages/fe-ui/src/components/widget/[Name]/[Name].tsx` |
| barrel export | `packages/fe-ui/src/components/widget/[Name]/index.ts` |
| 상위 barrel | `packages/fe-ui/src/components/widget/index.ts` (추가) |

---

## 3. 핵심 규칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **UI 컴포넌트만 조합** | `components/ui/` 폴더의 Pure UI만 사용 |
| **단일 책임** | 하나의 명확한 역할만 수행 |
| **Pure UI 유지** | 상태/API 호출 금지, props로만 동작 |
| **displayName 설정** | 디버깅을 위해 필수 |
| **라이브러리 타입 기반** | extends/Omit/Pick 활용 |
| **레이아웃 컴포넌트 사용** | HStack, VStack 등으로 배치 |

### ♻️ 기존 컴포넌트 우선 원칙 (Critical)

1. `packages/fe-ui/src/components/widget`에서 동일/유사 Widget을 먼저 검색합니다.
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

---

## 4. 프로세스

### 4.1 필요한 Pure UI 확인

```markdown
Widget 개발 시 필요한 Pure UI가 없으면 **먼저 UI Component Builder에게 생성 요청**
```

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
packages/fe-ui/src/components/widget/[Name]/
├── [Name].tsx     # 메인 컴포넌트
└── index.ts       # barrel export

# ⚠️ 컴포넌트 폴더 내 hooks/, utils/ 하위 폴더 생성 금지!
# 재사용 가능한 훅/유틸은 패키지 레벨에서 관리:
packages/fe-ui/src/hooks/use[Name].ts       # 재사용 가능한 훅
packages/fe-ui/src/utils/[utilName].ts      # 재사용 가능한 유틸
```

### 4.4 barrel export 추가

`packages/fe-ui/src/components/widget/index.ts`에 새 컴포넌트 export 추가

---

## 5. 템플릿

### 5.1 기본 Widget

```tsx
// packages/fe-ui/src/components/widget/StatusBadge/StatusBadge.tsx
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
<HStack gap={2} align="center">
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

## 6. 체크리스트

- [ ] 기존 Widget 컴포넌트 검색 완료 (`rg --files packages/fe-ui/src/components/widget`)
- [ ] 기존 Widget 재사용 가능 여부 판단 및 결과 기록
- [ ] 기능 부족 시 기존 Widget 업그레이드로 처리 (신규 복제 금지)
- [ ] `packages/fe-ui/src/components/widget/[Name]/` 에 생성
- [ ] 필요한 Pure UI가 없으면 UI Component Builder에게 요청
- [ ] 단일 책임 원칙 확인
- [ ] 커스텀 className 사용하지 않음 (HeroUI/레이아웃 컴포넌트만)
- [ ] **라이브러리 타입 기반 Props 설계** (extends/Omit/Pick)
- [ ] observer 사용 시 memo 제외 확인
- [ ] Props 인터페이스 export
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] widget/index.ts에 barrel export 추가

---

## 7. 연관 에이전트

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 에이전트

| 에이전트 | 관계 |
|----------|------|
| req-widget-planner | Widget 기획서(index.spec.md) 기반 구현 |
| **fe-ui-component-builder** | Widget이 사용할 Pure UI 컴포넌트 생성 |
| fe-input-component-builder | Widget에서 사용할 Input 컴포넌트 생성 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-feature-builder** | Widget에 Store/API 연결하여 Feature 생성 |
| fe-page-builder | Feature와 함께 Page에서 활용 |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| fe-store-builder | Feature에서 Widget에 주입할 Store 생성 |

---

## 8. 프로젝트별 참고사항

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

### UI 컴포넌트 참조 가능 카테고리

`components/ui/` 내의 다음 카테고리 컴포넌트를 조합:

- **data-display**: Avatar, Chip, Icon, Text, User 등
- **inputs**: Button, Input, Checkbox, Select 등
- **feedback**: Message, Skeleton, Placeholder 등
- **surfaces**: Container, HStack, VStack, Spacer 등

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
