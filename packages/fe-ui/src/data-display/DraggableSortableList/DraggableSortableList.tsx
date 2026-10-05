"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	type DraggableAttributes,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@heroui/react";
import { GripVertical } from "lucide-react";
import type { ReactNode } from "react";

/**
 * 드래그 핸들에 전달되는 Props
 */
export interface DragHandleProps {
	/** dnd-kit의 드래그 속성 */
	attributes: DraggableAttributes;
	/** dnd-kit의 이벤트 리스너 */
	listeners: SyntheticListenerMap | undefined;
	/** 노드 참조 설정 함수 */
	setNodeRef: (node: HTMLElement | null) => void;
	/** 현재 드래그 중인지 여부 */
	isDragging: boolean;
}

/**
 * DraggableSortableList 컴포넌트 Props
 */
export interface DraggableSortableListProps<T extends { id: string }> {
	/** 정렬할 아이템 목록 (각 아이템은 고유한 id를 가져야 함) */
	items: T[];
	/** 순서 변경 시 호출되는 콜백 */
	onReorder: (fromIndex: number, toIndex: number) => void;
	/** 각 아이템을 렌더링하는 함수 */
	renderItem: (
		item: T,
		index: number,
		dragHandleProps: DragHandleProps,
	) => ReactNode;
	/** 드래그 비활성화 여부 */
	disabled?: boolean;
	/** 컨테이너에 적용할 추가 클래스 */
	className?: string;
}

/**
 * 드래그 핸들 버튼 Props
 */
export interface DragHandleButtonProps {
	/** dnd-kit의 드래그 속성 */
	attributes: DraggableAttributes;
	/** dnd-kit의 이벤트 리스너 */
	listeners: SyntheticListenerMap | undefined;
	/** 비활성화 여부 */
	disabled?: boolean;
	/** 추가 클래스 */
	className?: string;
}

/**
 * 드래그 핸들 버튼 컴포넌트
 * 아이템을 드래그하기 위한 핸들 UI를 제공합니다.
 */
export function DragHandle({
	attributes,
	listeners,
	disabled,
	className,
}: DragHandleButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"cursor-grab rounded p-1 hover:bg-default active:cursor-grabbing",
				disabled && "cursor-not-allowed opacity-50",
				className,
			)}
			{...attributes}
			{...listeners}
			disabled={disabled}
		>
			<GripVertical className="h-4 w-4 text-muted" />
		</button>
	);
}

/**
 * 내부 SortableItem 컴포넌트 Props
 */
interface SortableItemProps<T extends { id: string }> {
	item: T;
	index: number;
	disabled?: boolean;
	renderItem: (
		item: T,
		index: number,
		dragHandleProps: DragHandleProps,
	) => ReactNode;
}

/**
 * 개별 정렬 가능한 아이템 컴포넌트
 */
function SortableItem<T extends { id: string }>({
	item,
	index,
	disabled,
	renderItem,
}: SortableItemProps<T>) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: item.id,
		disabled,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 1 : 0,
		opacity: isDragging ? 0.5 : 1,
	};

	const dragHandleProps: DragHandleProps = {
		attributes,
		listeners,
		setNodeRef,
		isDragging,
	};

	return (
		<div ref={setNodeRef} style={style} className="touch-none">
			{renderItem(item, index, dragHandleProps)}
		</div>
	);
}

/**
 * 드래그 앤 드롭으로 정렬 가능한 목록 컴포넌트
 *
 * @example
 * ```tsx
 * <DraggableSortableList
 *   items={items}
 *   onReorder={(from, to) => handleReorder(from, to)}
 *   renderItem={(item, index, dragHandleProps) => (
 *     <div className="flex items-center gap-2 p-2 border rounded">
 *       <DragHandle {...dragHandleProps} />
 *       <span>{item.name}</span>
 *     </div>
 *   )}
 * />
 * ```
 */
export function DraggableSortableList<T extends { id: string }>({
	items,
	onReorder,
	renderItem,
	disabled = false,
	className,
}: DraggableSortableListProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over.id);

			if (oldIndex !== -1 && newIndex !== -1) {
				onReorder(oldIndex, newIndex);
			}
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items.map((item) => item.id)}
				strategy={verticalListSortingStrategy}
			>
				<div className={cn("flex flex-col gap-2", className)}>
					{items.map((item, index) => (
						<SortableItem
							key={item.id}
							item={item}
							index={index}
							disabled={disabled}
							renderItem={renderItem}
						/>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
