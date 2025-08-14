import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		marginBottom: 16,
	},
	// Google 스타일 검색창
	googleSearchContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 24,
		paddingHorizontal: 16,
		paddingVertical: 12,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
		borderWidth: 1,
	},
	searchIcon: {
		marginRight: 12,
	},
	googleSearchInput: {
		flex: 1,
		fontSize: 16,
		fontWeight: "400",
		paddingVertical: 0,
		minHeight: 24,
	},
	clearButton: {
		marginLeft: 8,
		padding: 4,
	},
	chipsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		marginBottom: 12,
		gap: 8,
	},
	listContainer: {
		flex: 1,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 32,
	},
	emptyText: {
		fontSize: 16,
		textAlign: "center",
	},
	listItemContainer: {
		marginBottom: 8,
	},
});

export const chipStyles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 16,
		borderWidth: 1,
	},
	chipText: {
		fontSize: 14,
		fontWeight: "500",
	},
	removeButton: {
		marginLeft: 6,
		width: 18,
		height: 18,
		borderRadius: 9,
		justifyContent: "center",
		alignItems: "center",
	},
	removeText: {
		fontSize: 12,
		fontWeight: "600",
	},
});

export const listItemStyles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
	},
	imageContainer: {
		width: 48,
		height: 48,
		borderRadius: 24,
		marginRight: 12,
		overflow: "hidden",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	placeholderImage: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	contentContainer: {
		flex: 1,
	},
	title: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 2,
	},
	description: {
		fontSize: 14,
		lineHeight: 20,
	},
	checkContainer: {
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 12,
		borderWidth: 2,
	},
	checkIcon: {
		fontSize: 12,
		fontWeight: "600",
	},
});