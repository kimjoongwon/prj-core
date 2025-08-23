import { StyleSheet } from "react-native";

export const sizes = {
	sm: {
		height: 56,
		paddingHorizontal: 12,
		paddingVertical: 8,
		imageSize: 32,
		titleFontSize: 14,
		descriptionFontSize: 12,
	},
	md: {
		height: 72,
		paddingHorizontal: 16,
		paddingVertical: 12,
		imageSize: 48,
		titleFontSize: 16,
		descriptionFontSize: 14,
	},
	lg: {
		height: 88,
		paddingHorizontal: 20,
		paddingVertical: 16,
		imageSize: 64,
		titleFontSize: 18,
		descriptionFontSize: 15,
	},
};

export const styles = StyleSheet.create({
	// Base Styles
	container: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 1.5,
	},
	contentWrapper: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		minHeight: 0, // flex가 제대로 작동하도록
	},

	// Image Styles
	imageContainer: {
		borderRadius: 8,
		overflow: "hidden",
		marginRight: 12,
		flexShrink: 0, // 이미지 크기 고정
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 8,
	},

	// Content Styles
	textContainer: {
		flex: 1,
		justifyContent: "center",
		minHeight: 0, // flex 텍스트 컨테이너가 제대로 축소되도록
		minWidth: 0, // 텍스트 오버플로우 방지
	},
	title: {
		fontWeight: "600",
		lineHeight: 20,
		flexShrink: 1, // 긴 제목이 다른 요소를 밀지 않도록
	},
	description: {
		opacity: 0.8,
		lineHeight: 18,
		flexShrink: 1, // 긴 설명이 다른 요소를 밀지 않도록
	},
	// Variant Styles
	cardVariant: {
		backgroundColor: "transparent",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 3,
	},
	simpleVariant: {
		borderWidth: 0,
		borderRadius: 0,
		paddingHorizontal: 0,
	},
	// Start/End Content
	startContent: {
		marginRight: 12,
		flexShrink: 0, // 시작 콘텐츠 크기 고정
	},
	endContent: {
		marginLeft: 12,
		flexShrink: 0, // 끝 콘텐츠 크기 고정
	},
});
