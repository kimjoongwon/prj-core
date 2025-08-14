import React from "react";
import { ViewStyle } from "react-native";

// 공통 타입 정의
export type SelectionMode = "single" | "multiple";

// 기본 아이템 인터페이스 (최소 필수 필드)
export interface BaseSearchItem {
	id: string | number;
	title: string;
	description?: string;
	image?: string | { uri: string } | number;
}

// 하위 호환성을 위한 기존 타입
export interface SearchAndSelectItem extends BaseSearchItem {
	data?: any;
}

// 제너릭 SearchAndSelect Props
export interface SearchAndSelectProps<T extends BaseSearchItem = SearchAndSelectItem> {
	items: T[];
	onValueChange: (selectedItems: T[], selectedIds: (string | number)[]) => void;
	selectionMode?: SelectionMode;
	placeholder?: string;
	searchPlaceholder?: string;
	defaultSelectedIds?: (string | number)[];
	disabled?: boolean;
	maxSelections?: number;
	style?: ViewStyle;
	renderCustomItem?: (item: T, isSelected: boolean) => React.ReactNode;
	onSearch?: (query: string, items: T[]) => T[];
}

export interface ChipProps {
	title: string;
	onRemove?: () => void;
	disabled?: boolean;
	style?: ViewStyle;
}

export interface ListItemProps {
	item: SearchAndSelectItem;
	isSelected: boolean;
	onPress: () => void;
	disabled?: boolean;
	showAnimation?: boolean;
}