import React from "react";
import { ViewStyle, ImageSourcePropType } from "react-native";

// 기본 아이템 인터페이스 (최소 필수 필드)
export interface BaseListItem {
	id: string | number;
	title: string;
	description?: string;
	image?: string | ImageSourcePropType;
}

// 하위 호환성을 위한 기존 타입
export interface ListItemData extends BaseListItem {
	data?: any;
}

export type ListItemVariant = "default" | "card" | "simple";
export type ListItemSize = "sm" | "md" | "lg";

// 제너릭 ListItem Props
export interface ListItemProps<T extends BaseListItem = ListItemData> {
	item: T;
	variant?: ListItemVariant;
	size?: ListItemSize;
	isSelected?: boolean;
	onPress?: () => void;
	disabled?: boolean;
	showAnimation?: boolean;
	showCheckbox?: boolean;
	showImage?: boolean;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	style?: ViewStyle;
}