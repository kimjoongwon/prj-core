import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "@/components/contexts/ThemeContext";

export interface DarkModeSwitchProps {
	style?: ViewStyle;
}

export const DarkModeSwitch: React.FC<DarkModeSwitchProps> = observer(
	({ style }) => {
		const { isDark, toggleTheme, theme } = useTheme();

		return (
			<View style={[styles.container, style]}>
				<TouchableOpacity
					style={[
						styles.button,
						{
							backgroundColor: isDark
								? theme.colors.content2.DEFAULT
								: theme.colors.content1.DEFAULT,
							borderColor: theme.colors.default[300],
						},
					]}
					onPress={toggleTheme}
					activeOpacity={0.7}
				>
					<Ionicons
						name={isDark ? "sunny" : "moon"}
						size={20}
						color={
							isDark
								? theme.colors.warning.DEFAULT
								: theme.colors.primary.DEFAULT
						}
					/>
				</TouchableOpacity>
			</View>
		);
	},
);

DarkModeSwitch.displayName = "DarkModeSwitch";

const styles = StyleSheet.create({
	container: {
		// 위치 관련 스타일 제거 - 사용하는 곳에서 결정
	},
	button: {
		width: 44,
		height: 44,
		borderRadius: 22,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
});
