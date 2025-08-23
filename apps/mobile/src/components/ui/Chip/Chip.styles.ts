import { StyleSheet } from "react-native";

export const sizes = {
	sm: {
		height: 24,
		paddingHorizontal: 8,
		fontSize: 12,
		gap: 4,
		avatarSize: 16,
	},
	md: {
		height: 32,
		paddingHorizontal: 12,
		fontSize: 14,
		gap: 6,
		avatarSize: 20,
	},
	lg: {
		height: 40,
		paddingHorizontal: 16,
		fontSize: 16,
		gap: 8,
		avatarSize: 24,
	},
};

export const radiusValues = {
	none: 0,
	sm: 4,
	md: 6,
	lg: 8,
	full: 999,
};

export const styles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		overflow: "hidden",
		alignSelf: "flex-start",
	},
	chipContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	chipText: {
		fontWeight: "500",
	},
	startContent: {
		marginRight: 6,
	},
	endContent: {
		marginLeft: 6,
	},
	avatar: {
		borderRadius: 999,
		overflow: "hidden",
		marginRight: 6,
	},

	// Shadow variant
	shadowVariant: {
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},

	// Disabled state
	disabled: {
		opacity: 0.5,
	},
});
