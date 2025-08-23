export * from "./ThemeProvider";

import { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DarkModeSwitch } from "@/components/ui/DarkModeSwitch";
import { ThemeProvider } from "./ThemeProvider";

interface ProvidersProps extends PropsWithChildren {
	// 테스트나 Storybook에서 SafeArea를 비활성화할 수 있는 옵션
	disableSafeArea?: boolean;
}

export function Providers({
	children,
	disableSafeArea = false,
}: ProvidersProps): ReactNode {
	const renderWithDarkModeSwitch = (content: ReactNode) => (
		<View style={styles.container}>
			{content}
			{__DEV__ && (
				<View style={styles.darkModeSwitchContainer}>
					<DarkModeSwitch />
				</View>
			)}
		</View>
	);

	if (disableSafeArea) {
		return <ThemeProvider>{renderWithDarkModeSwitch(children)}</ThemeProvider>;
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<ThemeProvider>{renderWithDarkModeSwitch(children)}</ThemeProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	darkModeSwitchContainer: {
		position: "absolute",
		bottom: 100, // 하단 탭 바보다 위에 배치
		left: 20,
		zIndex: 9999,
	},
});
