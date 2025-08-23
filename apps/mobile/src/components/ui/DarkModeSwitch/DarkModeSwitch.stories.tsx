import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DarkModeSwitch } from "./DarkModeSwitch";

const meta: Meta<typeof DarkModeSwitch> = {
	title: "UI/DarkModeSwitch",
	component: DarkModeSwitch,
	decorators: [
		(Story) => (
			<ThemeProvider>
				<Story />
			</ThemeProvider>
		),
	],
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"다크/라이트 모드를 전환할 수 있는 토글 스위치 컴포넌트입니다. 스토리북에서만 자동으로 표시되며, 앱에서는 수동으로 배치해야 합니다.",
			},
		},
	},
	argTypes: {
		style: {
			description: "추가적인 스타일 설정을 위한 ViewStyle 객체",
			control: { type: "object" },
		},
	},
} satisfies Meta<typeof DarkModeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithCustomStyle: Story = {
	args: {
		style: {
			top: 20,
			right: 20,
		},
	},
	parameters: {
		docs: {
			description: {
				story: "커스텀 스타일을 적용한 DarkModeSwitch입니다.",
			},
		},
	},
};
