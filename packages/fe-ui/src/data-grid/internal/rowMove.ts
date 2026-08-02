import type { DataGridRowData, DataGridRowMoveEvent } from "@cocrepo/type";
import { arrayMove } from "@dnd-kit/sortable";

export interface DataGridMoveItem<TData extends DataGridRowData> {
	id: string;
	parentId: string | null;
	depth: number;
	original: TData;
}

export interface DataGridRowMoveProjection {
	depth: number;
	parentId: string | null;
}

function isDescendant<TData extends DataGridRowData>(
	item: DataGridMoveItem<TData>,
	parentId: string,
	itemById: Map<string, DataGridMoveItem<TData>>,
) {
	let currentParentId = item.parentId;

	while (currentParentId) {
		if (currentParentId === parentId) {
			return true;
		}
		currentParentId = itemById.get(currentParentId)?.parentId ?? null;
	}

	return false;
}

/** 드래그 중인 행의 자손을 이동 후보 목록에서 제외합니다. */
export function removeDataGridRowDescendants<TData extends DataGridRowData>(
	items: DataGridMoveItem<TData>[],
	parentId: string,
) {
	const itemById = new Map(items.map((item) => [item.id, item]));

	return items.filter(
		(item) => item.id === parentId || !isDescendant(item, parentId, itemById),
	);
}

/** 세로 위치와 가로 이동량으로 행의 새 깊이와 부모를 계산합니다. */
export function getDataGridRowMoveProjection<TData extends DataGridRowData>(
	items: DataGridMoveItem<TData>[],
	activeId: string,
	overId: string,
	dragOffset: number,
	indentationWidth = 24,
): DataGridRowMoveProjection | null {
	const movableItems = removeDataGridRowDescendants(items, activeId);
	const activeIndex = movableItems.findIndex((item) => item.id === activeId);
	const overIndex = movableItems.findIndex((item) => item.id === overId);
	const activeItem = movableItems[activeIndex];

	if (!activeItem || activeIndex < 0 || overIndex < 0) {
		return null;
	}

	const movedItems = arrayMove(movableItems, activeIndex, overIndex);
	const previousItem = movedItems[overIndex - 1];
	const nextItem = movedItems[overIndex + 1];
	const dragDepth = Math.round(dragOffset / indentationWidth);
	const projectedDepth = activeItem.depth + dragDepth;
	const maxDepth = previousItem ? previousItem.depth + 1 : 0;
	const minDepth = nextItem?.depth ?? 0;
	const depth = Math.min(maxDepth, Math.max(minDepth, projectedDepth));

	if (depth === 0 || !previousItem) {
		return { depth, parentId: null };
	}

	if (depth === previousItem.depth) {
		return { depth, parentId: previousItem.parentId };
	}

	if (depth > previousItem.depth) {
		return { depth, parentId: previousItem.id };
	}

	const parentId =
		movedItems
			.slice(0, overIndex)
			.reverse()
			.find((item) => item.depth === depth)?.parentId ?? null;

	return { depth, parentId };
}

/** 투영 결과를 상위 상태가 적용할 행·부모·형제 순서 이벤트로 변환합니다. */
export function getDataGridRowMoveEvent<TData extends DataGridRowData>(
	items: DataGridMoveItem<TData>[],
	activeId: string,
	overId: string,
	projection: DataGridRowMoveProjection,
): DataGridRowMoveEvent<TData> | null {
	const activeIndex = items.findIndex((item) => item.id === activeId);
	const overIndex = items.findIndex((item) => item.id === overId);
	const activeItem = items[activeIndex];

	if (!activeItem || activeIndex < 0 || overIndex < 0) {
		return null;
	}

	const itemById = new Map(items.map((item) => [item.id, item]));
	const projectedParent = projection.parentId
		? itemById.get(projection.parentId)
		: undefined;

	if (
		projection.parentId === activeId ||
		(projectedParent && isDescendant(projectedParent, activeId, itemById)) ||
		(projection.parentId && !projectedParent)
	) {
		return null;
	}

	const adjustedItems = items.map((item) =>
		item.id === activeId
			? {
					...item,
					depth: projection.depth,
					parentId: projection.parentId,
				}
			: item,
	);
	const movedItems = arrayMove(adjustedItems, activeIndex, overIndex);
	const siblingItems = movedItems.filter(
		(item) => item.parentId === projection.parentId,
	);
	const index = siblingItems.findIndex((item) => item.id === activeId);
	const previousSiblingItems = items.filter(
		(item) => item.parentId === activeItem.parentId,
	);
	const previousIndex = previousSiblingItems.findIndex(
		(item) => item.id === activeId,
	);

	if (
		index < 0 ||
		(activeItem.parentId === projection.parentId && previousIndex === index)
	) {
		return null;
	}

	return {
		row: activeItem.original,
		parent: projectedParent?.original ?? null,
		index,
		siblings: siblingItems.map((item) => item.original),
	};
}
