import type { Preview } from "@storybook/react-native";
import { ScreenContainer } from "../src/components/container/ScreenContainer";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		// React Native 환경에서 최적화된 설정
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<ScreenContainer>
				<Story />
			</ScreenContainer>
		),
	],
};

export default preview;
