import { StyleSheet } from "react-native";

export const sizes = {
	sm: {
		height: 44,
		paddingHorizontal: 16,
		fontSize: 16,
		labelFontSize: 12,
	},
	md: {
		height: 48,
		paddingHorizontal: 18,
		fontSize: 16,
		labelFontSize: 12,
	},
	lg: {
		height: 52,
		paddingHorizontal: 20,
		fontSize: 17,
		labelFontSize: 13,
	},
};

export const baseContainerStyles = StyleSheet.create({
	base: {
		borderRadius: 8,
		flexDirection: "row",
		alignItems: "center",
	},
	disabled: {
		opacity: 0.5,
	},
});

export const variantStyles = StyleSheet.create({
	flat: {
		borderWidth: 0,
	},
	bordered: {
		borderWidth: 1,
		backgroundColor: "transparent",
	},
	borderedFocused: {
		borderWidth: 2,
	},
	underlined: {
		backgroundColor: "transparent",
		borderRadius: 0,
		borderBottomWidth: 1,
		paddingHorizontal: 0,
	},
	underlinedFocused: {
		borderBottomWidth: 2,
	},
	faded: {
		borderWidth: 1,
	},
});

export const labelStyles = StyleSheet.create({
	base: {
		fontWeight: "500",
	},
	outside: {
		marginBottom: 4,
	},
	insideAbsolute: {
		position: "absolute",
	},
});

export const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	inputWrapper: {
		position: "relative",
	},
	contentContainer: {
		marginHorizontal: 4,
	},
	clearButton: {
		padding: 4,
	},
	requiredStar: {
		color: "#f31260",
	},
	description: {
		fontSize: 12,
		color: "#71717a",
		marginTop: 4,
	},
	errorMessage: {
		fontSize: 12,
		color: "#f31260",
		marginTop: 4,
	},
	outsideLeftContainer: {
		flexDirection: "row",
		alignItems: "flex-start",
		width: "100%",
	},
	outsideLeftLabelContainer: {
		width: 100,
		marginRight: 12,
		paddingTop: 8,
	},
	outsideLeftInputContainer: {
		flex: 1,
	},
});
