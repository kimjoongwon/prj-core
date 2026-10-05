import type { DataGridTableConfig } from "@cocrepo/type";
import type { Key } from "../Table/rowKeys";

export type DataGridSelectionMode = "single" | "multiple" | undefined;

export function getSelectionMode<T extends { id: Key }>(
	config: DataGridTableConfig<T>,
): DataGridSelectionMode {
	if (config.selection?.mode === "multiple") {
		return "multiple";
	}
	if (config.selection?.mode === "single") {
		return "single";
	}
	return undefined;
}

export function getControlledSelectedKeys<T extends { id: Key }>(
	selectedKeys: string[] | undefined,
	config: DataGridTableConfig<T>,
) {
	return selectedKeys ?? config.selection?.selectedKeys;
}

export function getNextRowSelectedKeys(
	currentKeys: Set<string>,
	rowKey: string,
	selectionMode: "single" | "multiple",
	isSelected: boolean,
) {
	if (selectionMode === "single") {
		return isSelected ? new Set<string>([rowKey]) : new Set<string>();
	}

	const nextKeys = new Set(currentKeys);
	if (isSelected) {
		nextKeys.add(rowKey);
	} else {
		nextKeys.delete(rowKey);
	}
	return nextKeys;
}

export function getNextVisibleRowSelectedKeys(
	currentKeys: Set<string>,
	visibleRowKeys: string[],
	isSelected: boolean,
) {
	const nextKeys = new Set(currentKeys);

	for (const rowKey of visibleRowKeys) {
		if (isSelected) {
			nextKeys.add(rowKey);
		} else {
			nextKeys.delete(rowKey);
		}
	}

	return nextKeys;
}
