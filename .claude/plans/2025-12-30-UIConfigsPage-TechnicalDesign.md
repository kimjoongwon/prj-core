# UIConfigsPage 기술 설계

**작성일:** 2025-01-05 (업데이트)
**기획 문서:** [CASL-Permission-System.md](./2025-12-30-CASL-Permission-System.md) 섹션 8.2
**담당:** technical-designer
**페이지 경로:** `apps/admin/app/(admin)/settings/ui-configs/page.tsx`

---

## 1. 컴포넌트 분석

### 1.1 기존 컴포넌트 재사용

| 컴포넌트 | 유형 | 경로 | 용도 |
|----------|------|------|------|
| Text | ui | @cocrepo/ui | 텍스트 래퍼 |
| Button | inputs (HeroUI) | @heroui/react | 저장/초기화 버튼 |
| Card, CardBody, CardHeader | surfaces (HeroUI) | @heroui/react | 컨테이너 |
| Tabs, Tab | inputs (HeroUI) | @heroui/react | GLOBAL/ROLE 범위 선택 |
| Select, SelectItem | inputs (HeroUI) | @heroui/react | 역할/엔티티 선택 |
| Checkbox | inputs (HeroUI) | @heroui/react | 필드 표시/숨김 토글 |
| Input | inputs (HeroUI) | @heroui/react | 너비 입력 |
| Chip | data-display (HeroUI) | @heroui/react | 상태 표시 |
| Spinner | feedback (HeroUI) | @heroui/react | 로딩 표시 |
| Tooltip | feedback (HeroUI) | @heroui/react | 도움말 표시 |

**참고:** dnd-kit 라이브러리가 이미 설치되어 있음
- `@dnd-kit/core@^6.3.1`
- `@dnd-kit/sortable@^10.0.0`
- `@dnd-kit/utilities@^3.2.2`

**참조 컴포넌트:**
- `packages/ui/src/components/ui/data-display/SortableMedia/SortableMedia.tsx` - dnd-kit 사용 패턴
- `apps/admin/app/(admin)/settings/abilities/page.tsx` - MobX Store 패턴, 페이지 구조

### 1.2 신규 컴포넌트 필요

| 컴포넌트명 | 유형 | 설명 | 담당 에이전트 |
|-----------|------|------|--------------|
| DeviceToggleGroup | ui | D/T/M 디바이스 토글 그룹 | ui-component-builder |
| DraggableSortableList | ui | 드래그 가능한 정렬 목록 (dnd-kit 래퍼) | ui-component-builder |
| ColumnSettingsTable | widget | 컬럼 설정 테이블 | widget-builder |
| UnsavedChangesIndicator | widget | 저장되지 않은 변경사항 알림 | widget-builder |
| UIConfigsPage | page | UI 설정 관리 페이지 | page-builder |

---

## 2. 에이전트 실행 계획

### Phase 1: UI 컴포넌트 (병렬 실행 가능)

1. **ui-component-builder**: DeviceToggleGroup
2. **ui-component-builder**: DraggableSortableList

### Phase 2: Widget 컴포넌트 (Phase 1 완료 후)

3. **widget-builder**: ColumnSettingsTable
4. **widget-builder**: UnsavedChangesIndicator

### Phase 3: 페이지 (Phase 2 완료 후)

5. **page-builder**: UIConfigsPage + UIConfigsPageStore
6. **page-reviewer**: 검증 (필수)

---

## 3. 에이전트별 상세 지시사항

### 3.1 ui-component-builder: DeviceToggleGroup

**파일 경로:** `packages/ui/src/components/ui/data-display/DeviceToggleGroup/`

**요구사항:**
- Desktop(D), Tablet(T), Mobile(M) 세 가지 디바이스 타입 토글
- 각 디바이스별 독립적 on/off 상태
- 작은 버튼 형태의 토글 그룹
- 선택된 상태는 primary 색상, 미선택은 default

**Props 인터페이스:**
```typescript
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface DeviceToggleGroupProps {
  /** 현재 활성화된 디바이스 목록 */
  value: DeviceType[];
  /** 변경 핸들러 */
  onChange: (devices: DeviceType[]) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md';
}
```

**구현 힌트:**
```tsx
import { cn } from "@cocrepo/ui/lib/utils";
import { Monitor, Tablet, Smartphone } from "lucide-react";

const DEVICE_CONFIG = [
  { key: 'desktop' as const, label: 'D', icon: Monitor },
  { key: 'tablet' as const, label: 'T', icon: Tablet },
  { key: 'mobile' as const, label: 'M', icon: Smartphone },
];

export function DeviceToggleGroup({
  value,
  onChange,
  disabled = false,
  size = 'sm'
}: DeviceToggleGroupProps) {
  const handleToggle = (device: DeviceType) => {
    if (disabled) return;
    const newValue = value.includes(device)
      ? value.filter(d => d !== device)
      : [...value, device];
    onChange(newValue);
  };

  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';

  return (
    <div className="flex gap-0.5">
      {DEVICE_CONFIG.map(({ key, label }) => {
        const isActive = value.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleToggle(key)}
            disabled={disabled}
            className={cn(
              sizeClasses,
              "rounded font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-default-100 text-default-500 hover:bg-default-200",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-label={`${key} ${isActive ? '활성화됨' : '비활성화됨'}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
```

**사용 예시:**
```tsx
<DeviceToggleGroup
  value={['desktop', 'tablet']}
  onChange={(devices) => console.log(devices)}
/>
// 렌더링: [D] [T] [ ] (D, T 활성화, M 비활성화)
```

---

### 3.2 ui-component-builder: DraggableSortableList

**파일 경로:** `packages/ui/src/components/ui/data-display/DraggableSortableList/`

**요구사항:**
- dnd-kit을 활용한 드래그 앤 드롭 정렬 목록
- 재사용 가능한 범용 컴포넌트
- 드래그 핸들 아이콘 포함
- 순서 변경 시 콜백 호출
- 테이블 행(tr) 또는 div 형태 모두 지원

**Props 인터페이스:**
```typescript
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export interface DragHandleProps {
  /** 드래그 핸들에 적용할 속성들 */
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  /** 드래그 참조 설정 함수 */
  setNodeRef: (node: HTMLElement | null) => void;
  /** 드래그 중 여부 */
  isDragging: boolean;
}

export interface DraggableSortableListProps<T extends { id: string }> {
  /** 아이템 목록 */
  items: T[];
  /** 순서 변경 핸들러 (fromIndex, toIndex) */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** 아이템 렌더링 함수 */
  renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => ReactNode;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 컨테이너 태그 (기본: div) */
  as?: 'div' | 'tbody';
  /** 컨테이너 클래스명 */
  className?: string;
}
```

**구현 힌트:**
```tsx
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// 내부 SortableItem 컴포넌트
function SortableItem<T extends { id: string }>({
  item,
  index,
  renderItem,
  disabled,
}: {
  item: T;
  index: number;
  renderItem: DraggableSortableListProps<T>['renderItem'];
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const dragHandleProps: DragHandleProps = {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  };

  // renderItem이 반환하는 요소에 style 적용
  return (
    <div style={style}>
      {renderItem(item, index, dragHandleProps)}
    </div>
  );
}

export function DraggableSortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  disabled = false,
  as: Container = 'div',
  className,
}: DraggableSortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <Container className={className}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              renderItem={renderItem}
              disabled={disabled}
            />
          ))}
        </Container>
      </SortableContext>
    </DndContext>
  );
}

// 드래그 핸들 컴포넌트 (export for reuse)
export function DragHandle({
  attributes,
  listeners,
  disabled
}: {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-grab active:cursor-grabbing p-1 rounded hover:bg-default-100",
        disabled && "cursor-not-allowed opacity-50"
      )}
      {...attributes}
      {...listeners}
      disabled={disabled}
    >
      <GripVertical className="h-4 w-4 text-default-400" />
    </button>
  );
}
```

**참고:** SortableMedia 컴포넌트(`packages/ui/src/components/ui/data-display/SortableMedia/SortableMedia.tsx`)의 useSortable 사용 패턴 참조

---

### 3.3 widget-builder: ColumnSettingsTable

**파일 경로:** `packages/ui/src/components/widget/ColumnSettingsTable/`

**요구사항:**
- 테이블 컬럼 설정을 편집하는 위젯
- DraggableSortableList를 활용한 순서 변경
- 각 행: 드래그 핸들 | 컬럼명 | 표시 체크박스 | 너비 입력 | 정렬 순서 | 디바이스 토글
- 변경 시 부모에게 콜백

**Props 인터페이스:**
```typescript
import type { DeviceType } from "../ui/DeviceToggleGroup";

export interface ColumnConfig {
  /** 필드 식별자 */
  id: string;
  /** 필드명 */
  field: string;
  /** 표시 라벨 */
  label: string;
  /** 표시 여부 */
  visible: boolean;
  /** 너비 (px) */
  width: number;
  /** 정렬 순서 */
  sortOrder: number;
  /** 디바이스별 표시 설정 */
  responsive: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
}

export interface ColumnSettingsTableProps {
  /** 엔티티 라벨 (예: "User") */
  entityLabel: string;
  /** 컬럼 설정 목록 */
  columns: ColumnConfig[];
  /** 설정 변경 핸들러 */
  onChange: (columns: ColumnConfig[]) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
}
```

**구현 구조:**
```tsx
import { Card, CardBody, CardHeader, Checkbox, Input } from "@heroui/react";
import { Text } from "@cocrepo/ui";
import { DraggableSortableList, DragHandle } from "../ui/DraggableSortableList";
import { DeviceToggleGroup, type DeviceType } from "../ui/DeviceToggleGroup";
import { arrayMove } from "@dnd-kit/sortable";

export function ColumnSettingsTable({
  entityLabel,
  columns,
  onChange,
  disabled = false,
}: ColumnSettingsTableProps) {
  // 순서 변경 핸들러
  const handleReorder = (fromIndex: number, toIndex: number) => {
    const reordered = arrayMove(columns, fromIndex, toIndex).map((col, idx) => ({
      ...col,
      sortOrder: idx + 1,
    }));
    onChange(reordered);
  };

  // 필드 업데이트 핸들러
  const handleUpdateColumn = (id: string, updates: Partial<ColumnConfig>) => {
    const updated = columns.map((col) =>
      col.id === id ? { ...col, ...updates } : col
    );
    onChange(updated);
  };

  // 디바이스 토글 핸들러
  const handleDeviceChange = (id: string, devices: DeviceType[]) => {
    handleUpdateColumn(id, {
      responsive: {
        desktop: devices.includes('desktop'),
        tablet: devices.includes('tablet'),
        mobile: devices.includes('mobile'),
      },
    });
  };

  // responsive를 DeviceType[]로 변환
  const getActiveDevices = (responsive: ColumnConfig['responsive']): DeviceType[] => {
    const devices: DeviceType[] = [];
    if (responsive.desktop) devices.push('desktop');
    if (responsive.tablet) devices.push('tablet');
    if (responsive.mobile) devices.push('mobile');
    return devices;
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="px-6 pb-0 pt-4">
        <Text className="font-semibold">{entityLabel} 테이블 컬럼 설정</Text>
      </CardHeader>
      <CardBody className="px-6 py-4">
        {/* 헤더 행 */}
        <div className="grid grid-cols-[40px_1fr_60px_100px_60px_120px] gap-2 border-b border-default-200 pb-2 mb-2">
          <div /> {/* 드래그 핸들 공간 */}
          <Text className="text-sm font-medium text-default-500">컬럼명</Text>
          <Text className="text-sm font-medium text-default-500 text-center">표시</Text>
          <Text className="text-sm font-medium text-default-500">너비</Text>
          <Text className="text-sm font-medium text-default-500 text-center">정렬</Text>
          <Text className="text-sm font-medium text-default-500 text-center">디바이스</Text>
        </div>

        {/* 드래그 가능한 행 목록 */}
        <DraggableSortableList
          items={columns}
          onReorder={handleReorder}
          disabled={disabled}
          renderItem={(column, index, dragHandleProps) => (
            <div
              ref={dragHandleProps.setNodeRef}
              className={cn(
                "grid grid-cols-[40px_1fr_60px_100px_60px_120px] gap-2 items-center py-2 border-b border-default-100 last:border-0",
                dragHandleProps.isDragging && "bg-default-50"
              )}
            >
              {/* 드래그 핸들 */}
              <DragHandle
                attributes={dragHandleProps.attributes}
                listeners={dragHandleProps.listeners}
                disabled={disabled}
              />

              {/* 컬럼명 */}
              <Text className="font-medium">{column.label}</Text>

              {/* 표시 체크박스 */}
              <div className="flex justify-center">
                <Checkbox
                  isSelected={column.visible}
                  onValueChange={(visible) =>
                    handleUpdateColumn(column.id, { visible })
                  }
                  isDisabled={disabled}
                  size="sm"
                  aria-label={`${column.label} 표시`}
                />
              </div>

              {/* 너비 입력 */}
              <Input
                type="number"
                size="sm"
                value={String(column.width)}
                onValueChange={(value) =>
                  handleUpdateColumn(column.id, { width: parseInt(value) || 100 })
                }
                isDisabled={disabled}
                endContent={<Text className="text-xs text-default-400">px</Text>}
                classNames={{ input: "text-right" }}
              />

              {/* 정렬 순서 */}
              <Text className="text-center text-default-500">{column.sortOrder}</Text>

              {/* 디바이스 토글 */}
              <DeviceToggleGroup
                value={getActiveDevices(column.responsive)}
                onChange={(devices) => handleDeviceChange(column.id, devices)}
                disabled={disabled}
                size="sm"
              />
            </div>
          )}
        />
      </CardBody>
    </Card>
  );
}
```

---

### 3.4 widget-builder: UnsavedChangesIndicator

**파일 경로:** `packages/ui/src/components/widget/UnsavedChangesIndicator/`

**요구사항:**
- 화면 하단 고정 위치에 표시
- 변경사항 있을 때만 표시
- 초기화/저장 버튼 포함

**참고:** AbilitiesPage의 변경사항 안내 UI와 동일한 패턴 (365-381행)

**Props 인터페이스:**
```typescript
export interface UnsavedChangesIndicatorProps {
  /** 표시 여부 */
  visible: boolean;
  /** 저장 중 여부 */
  isSaving?: boolean;
  /** 저장 클릭 핸들러 */
  onSave: () => void;
  /** 초기화 클릭 핸들러 */
  onReset: () => void;
}
```

**구현:**
```tsx
import { Button, Card, CardBody } from "@heroui/react";
import { Text } from "@cocrepo/ui";

export function UnsavedChangesIndicator({
  visible,
  isSaving = false,
  onSave,
  onReset,
}: UnsavedChangesIndicatorProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
      <Card className="border border-primary-200 bg-primary-50 shadow-lg">
        <CardBody className="flex flex-row items-center gap-4 px-4 py-3">
          <Text className="text-primary">저장되지 않은 변경사항이 있습니다</Text>
          <div className="flex gap-2">
            <Button size="sm" variant="flat" onPress={onReset} isDisabled={isSaving}>
              <Text>초기화</Text>
            </Button>
            <Button size="sm" color="primary" onPress={onSave} isDisabled={isSaving}>
              <Text>{isSaving ? '저장 중...' : '저장'}</Text>
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
```

---

### 3.5 page-builder: UIConfigsPage

**파일 경로:** `apps/admin/app/(admin)/settings/ui-configs/page.tsx`

**Store 파일:** `apps/admin/app/(admin)/settings/ui-configs/_stores/UIConfigsPageStore.ts`

**참고:** AbilitiesPage와 AbilitiesPageStore 패턴 참조

**Store 인터페이스:**
```typescript
import { makeAutoObservable, runInAction } from 'mobx';
import type { ColumnConfig } from '@cocrepo/ui';

export type ConfigScope = 'GLOBAL' | 'ROLE';

export class UIConfigsPageStore {
  // 상태
  scope: ConfigScope = 'GLOBAL';
  selectedRoleId: string | null = null;
  selectedEntity: string = 'User';
  columns: ColumnConfig[] = [];
  originalColumns: ColumnConfig[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Computed
  get isDirty(): boolean {
    return JSON.stringify(this.columns) !== JSON.stringify(this.originalColumns);
  }

  // Actions
  setScope(scope: ConfigScope) {
    runInAction(() => {
      this.scope = scope;
      if (scope === 'GLOBAL') {
        this.selectedRoleId = null;
      }
    });
  }

  setSelectedRoleId(roleId: string | null) {
    runInAction(() => {
      this.selectedRoleId = roleId;
    });
  }

  setSelectedEntity(entity: string) {
    runInAction(() => {
      this.selectedEntity = entity;
    });
  }

  setColumns(columns: ColumnConfig[]) {
    runInAction(() => {
      this.columns = columns;
    });
  }

  setOriginalColumns(columns: ColumnConfig[]) {
    runInAction(() => {
      this.originalColumns = columns;
      this.columns = [...columns];
    });
  }

  updateColumn(id: string, updates: Partial<ColumnConfig>) {
    runInAction(() => {
      this.columns = this.columns.map((col) =>
        col.id === id ? { ...col, ...updates } : col
      );
    });
  }

  reorderColumns(fromIndex: number, toIndex: number) {
    runInAction(() => {
      const newColumns = [...this.columns];
      const [removed] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, removed);
      this.columns = newColumns.map((col, idx) => ({
        ...col,
        sortOrder: idx + 1,
      }));
    });
  }

  resetChanges() {
    runInAction(() => {
      this.columns = [...this.originalColumns];
    });
  }

  setLoading(loading: boolean) {
    runInAction(() => {
      this.isLoading = loading;
    });
  }

  setSaving(saving: boolean) {
    runInAction(() => {
      this.isSaving = saving;
    });
  }

  setError(error: string | null) {
    runInAction(() => {
      this.error = error;
    });
  }
}
```

**핸들러 네이밍 (Page 컴포넌트):**
```typescript
// 범위 선택 (탭)
const onChangeScopeTab = useCallback((key: React.Key) => {
  store.setScope(key as ConfigScope);
}, [store]);

// 역할 선택 (드롭다운)
const onSelectRoleDropdown = useCallback((roleId: string) => {
  store.setSelectedRoleId(roleId);
}, [store]);

// 엔티티 선택 (드롭다운)
const onSelectEntityDropdown = useCallback((entity: string) => {
  store.setSelectedEntity(entity);
}, [store]);

// 컬럼 설정 변경
const onChangeColumns = useCallback((columns: ColumnConfig[]) => {
  store.setColumns(columns);
}, [store]);

// 저장 버튼 클릭
const onClickSaveButton = useCallback(async () => {
  if (!store.isDirty) return;
  store.setSaving(true);
  store.setError(null);
  try {
    if (store.scope === 'GLOBAL') {
      await saveGlobalMutation.mutateAsync({ ... });
    } else {
      await saveRoleMutation.mutateAsync({ ... });
    }
    await refetchConfig();
    store.resetChanges();
  } catch (error) {
    store.setError('설정 저장에 실패했습니다.');
  } finally {
    store.setSaving(false);
  }
}, [store, saveGlobalMutation, saveRoleMutation, refetchConfig]);

// 초기화 버튼 클릭
const onClickResetButton = useCallback(() => {
  store.resetChanges();
}, [store]);
```

**API 연동:**
```typescript
import {
  useGetUIConfig,           // GET /api/v1/ui-configs/:entity/:view
  usePutUIConfigGlobal,     // PUT /api/v1/ui-configs/:entity/:view/global
  usePutUIConfigRole,       // PUT /api/v1/ui-configs/:entity/:view/role/:roleId
  useDeleteUIConfig,        // DELETE /api/v1/ui-configs/:id
} from '@cocrepo/api';

// 설정 조회
const {
  data: configData,
  isLoading,
  refetch: refetchConfig
} = useGetUIConfig(store.selectedEntity, 'table', {
  query: {
    enabled: !!store.selectedEntity,
  },
});

// 전역 설정 저장
const saveGlobalMutation = usePutUIConfigGlobal();

// 역할별 설정 저장
const saveRoleMutation = usePutUIConfigRole();
```

**엔티티/역할 목록 (상수):**
```typescript
const ENTITY_OPTIONS = [
  { value: 'User', label: '회원' },
  { value: 'Reservation', label: '예약' },
  { value: 'Ground', label: '그라운드' },
  { value: 'Content', label: '콘텐츠' },
];

const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: '최고 관리자' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'USER', label: '일반 사용자' },
];
```

**페이지 구조:**
```tsx
"use client";

import { Text } from "@cocrepo/ui";
import {
  Button,
  Card,
  CardBody,
  Select,
  SelectItem,
  Spinner,
  Tab,
  Tabs,
} from "@heroui/react";
import { usePermission } from "@cocrepo/hook";
import { Save, Settings } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import { UIConfigsPageStore } from "./_stores";
import { ColumnSettingsTable, UnsavedChangesIndicator } from "@cocrepo/ui";

function UIConfigsPage() {
  const storeRef = useRef<UIConfigsPageStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new UIConfigsPageStore();
  }
  const store = storeRef.current;

  // 권한 확인
  const canManageUIConfigs = usePermission('MANAGE', 'entity:UIConfig');

  // API 훅
  // ...

  // Effects: 데이터 로드 및 스토어 업데이트
  useEffect(() => { ... }, [configData]);

  // 핸들러
  const onChangeScopeTab = useCallback(...);
  const onSelectRoleDropdown = useCallback(...);
  const onSelectEntityDropdown = useCallback(...);
  const onChangeColumns = useCallback(...);
  const onClickSaveButton = useCallback(...);
  const onClickResetButton = useCallback(...);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <Text className="text-2xl font-bold md:text-3xl">UI 설정 관리</Text>
          </div>
          <Text className="text-default-500">
            테이블 컬럼의 표시/숨김, 순서, 너비를 설정합니다
          </Text>
        </div>

        {/* 저장 버튼 */}
        {canManageUIConfigs && (
          <div className="flex gap-2">
            {store.isDirty && (
              <Button variant="flat" onPress={onClickResetButton} isDisabled={store.isSaving}>
                <Text>초기화</Text>
              </Button>
            )}
            <Button
              color="primary"
              startContent={store.isSaving ? <Spinner size="sm" color="current" /> : <Save className="h-4 w-4" />}
              onPress={onClickSaveButton}
              isDisabled={!store.isDirty || store.isSaving}
            >
              <Text>{store.isSaving ? '저장 중...' : '저장'}</Text>
            </Button>
          </div>
        )}
      </div>

      {/* 에러 표시 */}
      {store.error && (
        <div className="rounded-lg bg-danger-50 p-4">
          <Text className="text-danger">{store.error}</Text>
        </div>
      )}

      {/* 범위/역할/엔티티 선택 */}
      <Card className="border-none shadow-sm">
        <CardBody className="flex flex-col gap-4 md:flex-row md:items-center p-4">
          {/* 범위 탭 */}
          <Tabs
            selectedKey={store.scope}
            onSelectionChange={onChangeScopeTab}
            aria-label="설정 범위"
          >
            <Tab key="GLOBAL" title="전역 설정" />
            <Tab key="ROLE" title="역할별 설정" />
          </Tabs>

          {/* 역할 선택 (ROLE 범위일 때만) */}
          {store.scope === 'ROLE' && (
            <Select
              label="역할"
              placeholder="역할 선택"
              selectedKeys={store.selectedRoleId ? [store.selectedRoleId] : []}
              onSelectionChange={(keys) => {
                const selected = [...keys][0] as string;
                onSelectRoleDropdown(selected);
              }}
              className="max-w-xs"
            >
              {ROLE_OPTIONS.map((role) => (
                <SelectItem key={role.value}>{role.label}</SelectItem>
              ))}
            </Select>
          )}

          {/* 엔티티 선택 */}
          <Select
            label="엔티티"
            selectedKeys={[store.selectedEntity]}
            onSelectionChange={(keys) => {
              const selected = [...keys][0] as string;
              onSelectEntityDropdown(selected);
            }}
            className="max-w-xs"
          >
            {ENTITY_OPTIONS.map((entity) => (
              <SelectItem key={entity.value}>{entity.label}</SelectItem>
            ))}
          </Select>
        </CardBody>
      </Card>

      {/* 컬럼 설정 테이블 */}
      {store.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <ColumnSettingsTable
          entityLabel={ENTITY_OPTIONS.find(e => e.value === store.selectedEntity)?.label || store.selectedEntity}
          columns={store.columns}
          onChange={onChangeColumns}
          disabled={!canManageUIConfigs}
        />
      )}

      {/* 안내 문구 */}
      <div className="flex flex-col gap-1 text-sm text-default-400">
        <Text>[D]=Desktop  [T]=Tablet  [M]=Mobile</Text>
        <Text>* 드래그로 순서 변경, 체크박스로 표시/숨김 토글</Text>
        <Text>* 코드 기본값에서 변경된 항목만 저장됩니다</Text>
      </div>

      {/* 변경사항 표시 */}
      <UnsavedChangesIndicator
        visible={store.isDirty}
        isSaving={store.isSaving}
        onSave={onClickSaveButton}
        onReset={onClickResetButton}
      />
    </div>
  );
}

export default observer(UIConfigsPage);
```

---

## 4. 파일 구조 요약

```
packages/ui/src/components/
├── ui/
│   └── data-display/
│       ├── DeviceToggleGroup/
│       │   ├── DeviceToggleGroup.tsx
│       │   └── index.ts
│       ├── DraggableSortableList/
│       │   ├── DraggableSortableList.tsx
│       │   └── index.ts
│       └── index.ts (export 추가)
└── widget/
    ├── ColumnSettingsTable/
    │   ├── ColumnSettingsTable.tsx
    │   └── index.ts
    ├── UnsavedChangesIndicator/
    │   ├── UnsavedChangesIndicator.tsx
    │   └── index.ts
    └── index.ts (export 추가)

apps/admin/app/(admin)/settings/ui-configs/
├── page.tsx
└── _stores/
    ├── UIConfigsPageStore.ts
    └── index.ts
```

---

## 5. 기술 고려사항

### 5.1 성능

| 항목 | 대응 방안 |
|------|----------|
| 드래그 앤 드롭 | dnd-kit의 useSortable 활용 (CSS Transform 기반, DOM 이동 최소화) |
| 상태 관리 | MobX observer로 세밀한 반응형 업데이트 |
| API 호출 | React Query 캐싱 활용 |
| 리렌더링 최소화 | useCallback으로 핸들러 메모이제이션 |

### 5.2 접근성

| 항목 | 대응 방안 |
|------|----------|
| 키보드 드래그 | KeyboardSensor로 키보드 드래그 지원 (Space/Enter로 시작, 화살표로 이동) |
| 스크린 리더 | aria-label, aria-describedby 적용 |
| 포커스 관리 | 드래그 완료 후 적절한 포커스 유지 |

### 5.3 반응형

| 브레이크포인트 | 레이아웃 |
|---------------|----------|
| Mobile (<640px) | 범위/엔티티 선택 세로 배치, 테이블 가로 스크롤 |
| Tablet (640-1024px) | 범위/엔티티 선택 가로 배치 |
| Desktop (>1024px) | 전체 가로 배치 |

---

## 6. page-reviewer 검증 항목

**page-reviewer가 검증해야 할 사항:**

### 네이밍 규칙
- [ ] 이벤트 핸들러가 on[Event][UI] 형태인가? (Page 컴포넌트)
- [ ] 일반 컴포넌트는 handle 접두어를 사용하는가?
- [ ] 함수가 인라인으로 선언되지 않았는가?

### 컴포넌트 규칙
- [ ] Text 컴포넌트로 모든 텍스트가 감싸져 있는가?
- [ ] observer로 Page 컴포넌트가 감싸져 있는가?
- [ ] "use client" 지시자가 있는가?

### Store 규칙
- [ ] useRef로 Store 인스턴스가 생성되는가?
- [ ] makeAutoObservable이 사용되는가?
- [ ] runInAction으로 상태 변경이 감싸지는가?

### API 연동
- [ ] @cocrepo/api에서 생성된 훅을 사용하는가?
- [ ] 직접 axios/fetch 호출이 없는가?

### dnd-kit 사용
- [ ] DndContext + SortableContext 구조가 올바른가?
- [ ] useSortable 훅이 올바르게 사용되는가?
- [ ] CSS.Transform으로 스타일이 적용되는가?

---

## 7. 체크리스트

### 프론트엔드

- [ ] DeviceToggleGroup 컴포넌트 생성
- [ ] DraggableSortableList 컴포넌트 생성
- [ ] ColumnSettingsTable 위젯 생성
- [ ] UnsavedChangesIndicator 위젯 생성
- [ ] UIConfigsPageStore 생성
- [ ] UIConfigsPage 생성
- [ ] packages/ui/src/components/ui/data-display/index.ts에 export 추가
- [ ] packages/ui/src/components/widget/index.ts에 export 추가

### 검증

- [ ] page-reviewer 실행
- [ ] TypeScript 타입 체크 통과
- [ ] Lint/Format 체크 통과
- [ ] 권한 없는 사용자의 접근 제한 확인

---

## 8. 의존 관계 다이어그램

```
DeviceToggleGroup (ui)
        │
        ▼
ColumnSettingsTable (widget) ◄─── DraggableSortableList (ui)
        │
        ▼
UIConfigsPage (page) ◄─── UnsavedChangesIndicator (widget)
        │
        ▼
page-reviewer (검증)
```

---

## 9. 참고 자료

### 기존 코드 참조

| 참조 대상 | 경로 | 참조 이유 |
|----------|------|----------|
| AbilitiesPage | `apps/admin/app/(admin)/settings/abilities/page.tsx` | MobX Store 패턴, 페이지 구조 |
| AbilitiesPageStore | `apps/admin/app/(admin)/settings/abilities/_stores/AbilitiesPageStore.ts` | Store 구현 패턴 |
| SortableMedia | `packages/ui/src/components/ui/data-display/SortableMedia/SortableMedia.tsx` | dnd-kit useSortable 사용 패턴 |

### 외부 문서

- [dnd-kit 공식 문서](https://docs.dndkit.com/)
- [MobX 공식 문서](https://mobx.js.org/)
- [HeroUI 컴포넌트](https://heroui.com/)

---

**작성자:** technical-designer (Claude Code Agent)
**업데이트:** 2025-01-05
