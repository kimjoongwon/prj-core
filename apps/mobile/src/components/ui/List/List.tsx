import React from "react";
import { ScrollView, View, type ViewStyle } from "react-native";

export interface ListProps<T> {
	data: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	horizontal?: boolean;
	style?: ViewStyle;
	contentContainerStyle?: ViewStyle;
	placeholder?: React.ReactNode;
	gap?: number;
	itemStyle?: ViewStyle;
	showsHorizontalScrollIndicator?: boolean;
	showsVerticalScrollIndicator?: boolean;
}

export const List = <T extends object>(props: ListProps<T>) => {
	const {
		data,
		renderItem,
		horizontal = false,
		style,
		contentContainerStyle,
		placeholder,
		gap = 8,
		itemStyle,
		showsHorizontalScrollIndicator = false,
		showsVerticalScrollIndicator = false,
	} = props;

	if (data.length === 0) {
		return placeholder ? <View style={style}>{placeholder}</View> : null;
	}

	const containerStyle: ViewStyle = {
		...contentContainerStyle,
		...(horizontal
			? { flexDirection: "row", gap: gap }
			: { flexDirection: "column", gap: gap }),
	};

	return (
		<ScrollView
			style={style}
			contentContainerStyle={containerStyle}
			horizontal={horizontal}
			showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
			showsVerticalScrollIndicator={showsVerticalScrollIndicator}
		>
			{data.map((item, index) => (
				<View key={index} style={itemStyle}>
					{renderItem(item, index)}
				</View>
			))}
		</ScrollView>
	);
};
