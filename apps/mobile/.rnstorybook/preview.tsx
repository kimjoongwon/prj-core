import type { Preview } from "@storybook/react-native";
import { withThemeProvider } from "./decorators/ThemeDecorator";

const preview: Preview = {
	decorators: [withThemeProvider],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
		// React Native 환경에서 최적화된 설정
		layout: 'fullscreen',
	},
};

export default preview;
