# DraggableSortableList UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/DraggableSortableList/

## 역할

드래그 앤 드롭으로 아이템 순서를 변경할 수 있는 목록 컴포넌트. @dnd-kit 라이브러리 기반이다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ 기본 상태 ]

┌──────────────────────────────────────┐
│  ⠿  아이템 1                         │  ← 드래그 핸들(⠿) + 컨텐츠
├──────────────────────────────────────┤
│  ⠿  아이템 2                         │
├──────────────────────────────────────┤
│  ⠿  아이템 3                         │
├──────────────────────────────────────┤
│  ⠿  아이템 4                         │
└──────────────────────────────────────┘


[ 드래그 중 상태 (아이템 2 드래그) ]

┌──────────────────────────────────────┐
│  ⠿  아이템 1                         │
├──────────────────────────────────────┤
│  ⠿  아이템 3                         │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  ← 드롭 위치 인디케이터
├──────────────────────────────────────┤
│  ⠿  아이템 4                         │
└──────────────────────────────────────┘

  ┌──────────────────────────────────┐
  │  ⠿  아이템 2          (opacity: 0.5)│  ← 드래그 중인 아이템 (반투명)
  └──────────────────────────────────┘


[ disabled 상태 ]

┌──────────────────────────────────────┐
│  ░  아이템 1                         │  ← 핸들 비활성 (cursor: default)
├──────────────────────────────────────┤
│  ░  아이템 2                         │
├──────────────────────────────────────┤
│  ░  아이템 3                         │
└──────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 드래그 핸들(⠿) + 렌더링된 아이템 |
| 드래그 중 | 반투명(opacity:0.5) 부유 아이템 + 드롭 위치 표시 |
| disabled | 핸들 비활성화 (회색) |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
