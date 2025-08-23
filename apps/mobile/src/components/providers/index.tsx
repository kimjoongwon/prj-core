export * from "./ThemeProvider";

import { PropsWithChildren, ReactNode } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider } from "./ThemeProvider";

interface ProvidersProps extends PropsWithChildren {
	// 테스트나 Storybook에서 SafeArea를 비활성화할 수 있는 옵션
	disableSafeArea?: boolean;
}

export function Providers({
	children,
	disableSafeArea = false,
}: ProvidersProps): ReactNode {
	if (disableSafeArea) {
		return <ThemeProvider>{children}</ThemeProvider>;
	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }}>
				<ThemeProvider>{children}</ThemeProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
