import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Button } from "../Button";

export interface SNSButtonsProps {
	onGooglePress?: () => void;
	onApplePress?: () => void;
	onKakaoPress?: () => void;
	style?: ViewStyle;
	showGoogle?: boolean;
	showApple?: boolean;
	showKakao?: boolean;
}

export const SNSButtons: React.FC<SNSButtonsProps> = ({
	onGooglePress,
	onApplePress,
	onKakaoPress,
	style,
	showGoogle = true,
	showApple = true,
	showKakao = true,
}) => {
	return (
		<View style={[styles.container, style]}>
			{showGoogle && (
				<Button
					variant="bordered"
					size="lg"
					onPress={onGooglePress}
					style={styles.button}
				>
					Google로 로그인
				</Button>
			)}
			
			{showApple && (
				<Button
					variant="solid"
					color="default"
					size="lg"
					onPress={onApplePress}
					style={[styles.button, styles.appleButton]}
				>
					Apple로 로그인
				</Button>
			)}
			
			{showKakao && (
				<Button
					variant="solid"
					size="lg"
					onPress={onKakaoPress}
					style={[styles.button, styles.kakaoButton]}
				>
					카카오로 로그인
				</Button>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
		width: "100%",
	},
	button: {
		width: "100%",
	},
	appleButton: {
		backgroundColor: "#000000",
	},
	kakaoButton: {
		backgroundColor: "#FEE500",
	},
});

export default SNSButtons;