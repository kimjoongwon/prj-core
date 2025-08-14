import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
	View,
	FlatList,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { Text } from "../Text";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	FadeInDown,
	FadeOutUp,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/components";
import { Chip } from "../Chip";
import { ListItem } from "../ListItem";
import { SearchAndSelectProps, BaseSearchItem } from "./types";
import { styles } from "./SearchAndSelect.styles";

export const SearchAndSelect = <T extends BaseSearchItem = BaseSearchItem>(
	props: SearchAndSelectProps<T>,
): React.ReactElement => {
	const {
		items,
		onValueChange,
		selectionMode = "single",
		searchPlaceholder = "검색중..",
		defaultSelectedIds = [],
		disabled = false,
		maxSelections,
		style,
		renderCustomItem,
		onSearch,
	} = props;
	const { theme } = useTheme();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedIds, setSelectedIds] =
		useState<(string | number)[]>(defaultSelectedIds);
	const listOpacity = useSharedValue(1);

	const selectedItems = useMemo(() => {
		return items.filter((item: T) => selectedIds.includes(item.id));
	}, [items, selectedIds]);

	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) return items;

		if (onSearch) {
			return onSearch(searchQuery, items);
		}

		return items.filter(
			(item: T) =>
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [items, searchQuery, onSearch]);

	useEffect(() => {
		onValueChange(selectedItems, selectedIds);
	}, [selectedItems, selectedIds, onValueChange]);

	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);

			listOpacity.value = withTiming(0.7, { duration: 150 }, (finished) => {
				if (finished) {
					listOpacity.value = withTiming(1, { duration: 150 });
				}
			});
		},
		[listOpacity],
	);

	const handleItemSelect = useCallback(
		(item: T) => {
			if (disabled) return;

			setSelectedIds((prev) => {
				if (selectionMode === "single") {
					return prev.includes(item.id) ? [] : [item.id];
				} else {
					// Multiple selection
					if (prev.includes(item.id)) {
						return prev.filter((id) => id !== item.id);
					} else {
						if (maxSelections && prev.length >= maxSelections) {
							return prev;
						}
						return [...prev, item.id];
					}
				}
			});
		},
		[disabled, selectionMode, maxSelections],
	);

	const handleChipRemove = useCallback(
		(itemId: string | number) => {
			if (disabled) return;

			setSelectedIds((prev) => prev.filter((id) => id !== itemId));
		},
		[disabled],
	);

	const animatedListStyle = useAnimatedStyle(() => ({
		opacity: listOpacity.value,
	}));

	const renderChips = () => {
		if (selectedItems.length === 0) return null;

		return (
			<View style={styles.chipsContainer}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 8 }}
				>
					{selectedItems.map((item, index) => (
						<Animated.View
							key={`chip-${item.id}`}
							entering={FadeInDown.delay(index * 50).duration(300)}
							exiting={FadeOutUp.duration(200)}
						>
							<Chip
								isClosable
								onClose={() => handleChipRemove(item.id)}
								isDisabled={disabled}
								variant="solid"
								color="primary"
							>
								{item.title}
							</Chip>
						</Animated.View>
					))}
				</ScrollView>
			</View>
		);
	};

	const renderListItem = ({ item, index }: { item: T; index: number }) => {
		const isSelected = selectedIds.includes(item.id);

		if (renderCustomItem) {
			return (
				<Animated.View
					entering={FadeInDown.delay(index * 30).duration(300)}
					style={styles.listItemContainer}
				>
					{renderCustomItem(item, isSelected)}
				</Animated.View>
			);
		}

		return (
			<Animated.View
				entering={FadeInDown.delay(index * 30).duration(300)}
				style={styles.listItemContainer}
			>
				<ListItem
					item={item}
					isSelected={isSelected}
					onPress={() => handleItemSelect(item)}
					disabled={disabled}
					showCheckbox={true}
					variant="default"
					showAnimation={true}
				/>
			</Animated.View>
		);
	};

	const renderEmptyState = () => {
		const emptyText = searchQuery
			? "검색 결과가 없습니다."
			: "데이터가 없습니다.";

		return (
			<View style={styles.emptyContainer}>
				<Text style={[styles.emptyText, { color: theme.colors.default[500] }]}>
					{emptyText}
				</Text>
			</View>
		);
	};

	return (
		<View style={[styles.container, style]}>
			{/* Google 스타일 검색창 */}
			<View style={styles.searchContainer}>
				<View
					style={[
						styles.googleSearchContainer,
						{
							backgroundColor: theme.colors.content1.DEFAULT,
							borderColor: theme.colors.content3.DEFAULT,
							shadowColor: theme.colors.foreground,
						},
					]}
				>
					<Ionicons
						name="search"
						size={20}
						color={theme.colors.default[500]}
						style={styles.searchIcon}
					/>
					<TextInput
						value={searchQuery}
						onChangeText={handleSearch}
						placeholder={searchPlaceholder}
						placeholderTextColor={theme.colors.default[500]}
						style={[
							styles.googleSearchInput,
							{
								color: theme.colors.foreground,
								backgroundColor: "transparent",
							},
						]}
						editable={!disabled}
					/>
					<TouchableOpacity
						onPress={() => handleSearch("")}
						style={[
							styles.clearButton,
							{ opacity: searchQuery.length > 0 ? 1 : 0 },
						]}
						disabled={searchQuery.length === 0}
					>
						<Ionicons
							name="close-circle"
							size={20}
							color={theme.colors.default[500]}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{renderChips()}

			<Animated.View style={[styles.listContainer, animatedListStyle]}>
				<FlatList
					data={filteredItems}
					renderItem={renderListItem}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={renderEmptyState}
					contentContainerStyle={{
						flexGrow: 1,
					}}
				/>
			</Animated.View>
		</View>
	);
};
