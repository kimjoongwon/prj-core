import type { Preview } from "@storybook/react-native";
import { View } from "react-native";
import { ScreenContainer } from "../src/components/container/ScreenContainer";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		// React Native 환경에서 최적화된 설정 - centered를 기본으로 변경
		layout: "centered",
	},
	decorators: [
		(Story, context) => {
			const { parameters } = context;
			const layout = parameters.layout || "centered";

			if (layout === "fullscreen") {
				return (
					<ScreenContainer>
						<Story />
					</ScreenContainer>
				);
			}

			// centered 또는 padded 레이아웃의 경우 중앙 정렬
			return (
				<ScreenContainer>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							padding: layout === "padded" ? 16 : 0,
						}}
					>
						<Story />
					</View>
				</ScreenContainer>
			);
		},
	],
};

export default preview;
