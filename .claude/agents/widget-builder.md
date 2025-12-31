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

## 2. 컴포넌트 계층 구조

```
UI 컴포넌트 (Pure, 작은 단위)  →  Widget  →  Feature  →  Page
   Button, Input, Chip           복합 UI     비즈니스 기능   화면
```

| 항목 | UI 컴포넌트 | Widget | Feature |
|------|------------|--------|----------|
| **크기** | 최소 단위 (Pure) | 작음~중간 (UI 조합) | 중간~큼 (복합 UI) |
| **의존성** | 없음 (독립) | UI 컴포넌트만 사용 | widget/UI 조합 |
| **비즈니스** | 무관 | 무관 | 비즈니스 기능 담당 |
| **위치** | `components/ui/` | `components/widget/` | `components/feature/` |
| **예시** | Button, Input, Chip | StatusBadge, UserCard | Navbar, UserMenu |

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

## 6. Widget 후보 예시

| 카테고리 | 컴포넌트 |
|----------|----------|
| **상태 표시** | StatusBadge, OnlineIndicator, ProgressLabel |
| **사용자** | AvatarGroup, UserChip, RoleBadge |
| **데이터** | PriceTag, DateLabel, CountBadge |
| **액션** | CopyButton, ShareButton, BookmarkToggle |

---

## 7. 체크리스트

- [ ] `packages/ui/src/components/widget/[Name]/` 에 생성
- [ ] 단일 책임 원칙 확인
- [ ] observer 사용 시 memo 제외 확인
- [ ] Props 인터페이스 export
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] widget/index.ts에 barrel export 추가
