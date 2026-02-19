# Permission UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/permission/

## 역할

CASL 기반 권한 제어를 위한 조건부 렌더링 컴포넌트 모음. 권한 유무에 따라 children을 표시하거나 숨긴다.

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
- `AppAction`, `AppSubject` from `@cocrepo/store`

## HeroUI 매핑

VisibilityCell만 HeroUI 사용: `import { Button, Chip, Popover, PopoverContent, PopoverTrigger, Tooltip } from '@heroui/react'`

나머지는 순수 구현.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
