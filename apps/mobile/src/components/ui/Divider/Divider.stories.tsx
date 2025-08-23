import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Divider } from "@/components/ui/Divider";
import type { DividerProps } from "@/components/ui/Divider/Divider";

const meta: Meta<DividerProps> = {
	title: "components/ui/Divider",
	component: Divider,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"구분선을 표시하는 컴포넌트입니다. 텍스트가 포함된 구분선도 지원합니다.",
			},
		},
	},
	argTypes: {
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
			description: "구분선의 방향",
		},
		variant: {
			control: { type: "select" },
			options: ["default", "subtle", "strong"],
			description: "구분선의 스타일 변형",
		},
		thickness: {
			control: { type: "number", min: 1, max: 10 },
			description: "구분선의 두께",
		},
		margin: {
			control: { type: "number", min: 0, max: 50 },
			description: "구분선의 마진",
		},
	},
};

export default meta;
type Story = StoryObj<DividerProps>;

export const 기본: Story = {
	args: {},
	render: (args) => (
		<View style={{ width: 300, height: 100, justifyContent: "center" }}>
			<Divider {...args} />
		</View>
	),
};

export const 텍스트포함: Story = {
	args: {
		children: "또는",
	},
	render: (args) => (
		<View style={{ width: 300, height: 100, justifyContent: "center" }}>
			<Divider {...args} />
		</View>
	),
};

export const 세로구분선: Story = {
	args: {
		orientation: "vertical",
	},
	render: (args) => (
		<View
			style={{
				width: 300,
				height: 100,
				flexDirection: "row",
				alignItems: "center",
			}}
		>
			<View style={{ flex: 1, height: 50, backgroundColor: "#f0f0f0" }} />
			<Divider {...args} />
			<View style={{ flex: 1, height: 50, backgroundColor: "#f0f0f0" }} />
		</View>
	),
};

export const 두꺼운선: Story = {
	args: {
		thickness: 3,
	},
	render: (args) => (
		<View style={{ width: 300, height: 100, justifyContent: "center" }}>
			<Divider {...args} />
		</View>
	),
};

export const 색상변경: Story = {
	args: {
		color: "#2196f3",
	},
	render: (args) => (
		<View style={{ width: 300, height: 100, justifyContent: "center" }}>
			<Divider {...args} />
		</View>
	),
};

export const Subtle변형: Story = {
	args: {
		variant: "subtle",
	},
	render: (args) => (
		<View style={{ width: 300, height: 100, justifyContent: "center" }}>
			<Divider {...args} />
		</View>
	),
};

export const Strong변형: Story = {
	args: {
		variant: "strong",
	},
	render: (args) => (
		<View style={{ width: 300, height: 100, justifyContent: "center" }}>
			<Divider {...args} />
		</View>
	),
};

export const 다크모드테스트: Story = {
	args: {
		children: "다크모드 대응",
	},
	render: (args) => (
		<View
			style={{
				width: 300,
				height: 200,
				justifyContent: "space-around",
				padding: 20,
			}}
		>
			<Divider {...args} variant="subtle" />
			<Divider {...args} variant="default" />
			<Divider {...args} variant="strong" />
		</View>
	),
};

export const 플레이그라운드: Story = {
	args: {
		orientation: "horizontal",
		variant: "default",
		thickness: 1,
		margin: 16,
	},
	render: (args) => (
		<View style={{ width: 300, height: 100, justifyContent: "center" }}>
			<Divider {...args} />
		</View>
	),
};
