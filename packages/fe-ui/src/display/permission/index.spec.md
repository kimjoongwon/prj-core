# Permission UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/permission/

## 역할

CASL 기반 권한 제어를 위한 조건부 렌더링 컴포넌트 모음. 권한 유무에 따라 children을 표시하거나 숨긴다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ Can / Cannot — 조건부 렌더링 컴포넌트 ]

권한 있음 (Can)                   권한 없음 (Cannot)
┌─────────────────────────┐       ┌─────────────────────────┐
│  ┌───────────────────┐  │       │  (children 렌더링 안 됨) │
│  │  children 렌더링  │  │       │                         │
│  └───────────────────┘  │       │  ┌───────────────────┐  │
│                         │       │  │  fallback 렌더링   │  │
│  fallback: 미표시        │       │  └───────────────────┘  │
└─────────────────────────┘       └─────────────────────────┘

action="create"  subject="entity:user"
─────────────────────────────────────────────────────────────
  권한 있음 → <Can> 내부 UI 노출
  권한 없음 → fallback(예: 비활성 버튼 또는 null) 노출

[ CanMenu — 메뉴 접근 권한 ]

menu="dashboard"                  menu="settings/general"
┌───────────────────────┐         ┌───────────────────────┐
│  [대시보드] 메뉴 노출  │         │  접근 불가 → 숨김      │
└───────────────────────┘         └───────────────────────┘

[ CanFeature — 기능 사용 권한 ]

feature="export"                  feature="bulk-edit"
┌───────────────────────┐         ┌───────────────────────┐
│  [내보내기] 버튼 노출  │         │  권한 없음 → 숨김      │
└───────────────────────┘         └───────────────────────┘

[ VisibilityCell — 가시성 상태 표시 ]

읽기 전용 (editable: false)
┌──────────────────────────────────────┐
│  필드명: 이메일                      │
│  역할명: 일반 사용자                  │
│                                      │
│  ┌──────────┐                        │
│  │  전체공개 │  ← Chip (green)        │
│  └──────────┘                        │
└──────────────────────────────────────┘

편집 가능 (editable: true) — Popover 열림 상태
┌──────────────────────────────────────┐
│  필드명: 이메일                      │
│  역할명: 일반 사용자                  │
│                                      │
│  ┌──────────┐                        │
│  │  전체공개 │▼  ← 클릭 가능 Chip     │
│  └──────────┘                        │
│       ↓ Popover                      │
│  ┌────────────────────┐              │
│  │  ○ 전체공개 (full)  │              │
│  │  ○ 마스킹 (masked) │              │
│  │  ● 숨김  (hidden)  │              │
│  └────────────────────┘              │
└──────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| `Can` — 권한 있음 | children 그대로 렌더링, fallback 숨김 |
| `Can` — 권한 없음 | children 숨김, fallback 렌더링 (없으면 null) |
| `Cannot` — 권한 없음 | children 그대로 렌더링, fallback 숨김 |
| `CanMenu` — 접근 가능 | 메뉴 children 노출 |
| `CanMenu` — 접근 불가 | 메뉴 children 숨김 |
| `VisibilityCell` — `full` | 초록 Chip "전체공개" |
| `VisibilityCell` — `masked` | 노란 Chip "마스킹" |
| `VisibilityCell` — `hidden` | 빨간 Chip "숨김" |
| `VisibilityCell` — `editable: true` | Chip 클릭 시 Popover로 상태 변경 UI 노출 |

## 하위 컴포넌트

### Can

권한이 있을 때만 children을 렌더링.

```typescript
interface CanProps {
  action: AppAction;       // read, create, update, delete, view 등
  subject: AppSubject;     // entity:user, menu:dashboard 등
  field?: string;          // 특정 필드 권한 (선택)
  children: ReactNode;
  fallback?: ReactNode;
}
```

### Cannot

권한이 없을 때만 children을 렌더링 (Can의 반대).

```typescript
interface CannotProps {
  action: AppAction;
  subject: AppSubject;
  field?: string;
  children: ReactNode;
  fallback?: ReactNode;
}
```

### CanMenu

메뉴 접근 권한이 있을 때만 children을 렌더링.

```typescript
interface CanMenuProps {
  menu: string;            // 예: "dashboard", "settings/general"
  children: ReactNode;
  fallback?: ReactNode;
}
```

### CanFeature

기능 사용 권한이 있을 때만 children을 렌더링.

```typescript
interface CanFeatureProps {
  feature: string;         // 예: "export", "bulk-edit"
  children: ReactNode;
  fallback?: ReactNode;
}
```

### VisibilityCell

가시성 상태(full/masked/hidden)를 Chip으로 표시. 편집 가능 모드에서 Popover로 상태 변경 UI 제공.

```typescript
type VisibilityStatus = "full" | "masked" | "hidden";

interface VisibilityCellProps {
  status: VisibilityStatus;
  fieldName?: string;
  roleName?: string;
  editable?: boolean;
  onStatusChange?: (status: VisibilityStatus) => void;
}
```

## 외부 의존성

- `useCan`, `useCannot`, `useMenuPermission`, `useFeaturePermission` from `@cocrepo/store`
- `AppAction`, `AppSubject` from `@cocrepo/type`

## HeroUI 매핑

VisibilityCell만 HeroUI 사용: `import { Button, Chip, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@heroui/react'`

나머지는 순수 구현.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 권한 타입(AppAction/AppSubject) 의존을 @cocrepo/store에서 @cocrepo/type으로 분리 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
