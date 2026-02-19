# DraggableSortableList UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/DraggableSortableList/

## 역할

드래그 앤 드롭으로 아이템 순서를 변경할 수 있는 목록 컴포넌트. @dnd-kit 라이브러리 기반이다.

## Props

```typescript
interface DraggableSortableListProps<T extends { id: string }> {
  /** 정렬할 아이템 목록 (각 아이템은 고유한 id를 가져야 함) */
  items: T[];
  /** 순서 변경 시 호출되는 콜백 */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** 각 아이템을 렌더링하는 함수 */
  renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => ReactNode;
  /** 드래그 비활성화 여부 */
  disabled?: boolean;
  /** 컨테이너에 적용할 추가 클래스 */
  className?: string;
}

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  setNodeRef: (node: HTMLElement | null) => void;
  isDragging: boolean;
}

interface DragHandleButtonProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  disabled?: boolean;
  className?: string;
}
```

## 하위 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| DragHandle | 드래그 핸들 버튼 (GripVertical 아이콘) |
| SortableItem | 개별 정렬 아이템 래퍼 (내부) |

## 의존성

- `@dnd-kit/core` (DndContext, PointerSensor, KeyboardSensor)
- `@dnd-kit/sortable` (SortableContext, useSortable, verticalListSortingStrategy)
- `lucide-react` (GripVertical)

## HeroUI 매핑

유틸만 사용: `import { cn } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
