import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta = {
	title: "Ui/feedback/Alert",
	component: Alert,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"HeroUI Alert 컴포넌트의 feedback wrapper입니다. compound API를 그대로 유지합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: "select",
			options: ["default", "accent", "success", "warning", "danger"],
			description: "Alert 상태",
		},
		children: { control: "text", description: "Alert 표시 텍스트" },
	},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		status: "default",
		children: "기본 알림 메시지입니다.",
		className: "w-80",
	},
};

export const States: Story = {
	args: {
		children: null,
	},
	render: () => (
		<div className="w-96 space-y-3">
			<Alert status="default" className="w-full">
				기본 상태의 알림입니다.
			</Alert>
			<Alert status="accent" className="w-full">
				강조 상태의 알림입니다.
			</Alert>
			<Alert status="success" className="w-full">
				성공 상태의 알림입니다.
			</Alert>
			<Alert status="warning" className="w-full">
				경고 상태의 알림입니다.
			</Alert>
			<Alert status="danger" className="w-full">
				위험 상태의 알림입니다.
			</Alert>
		</div>
	),
};

export const Composition: Story = {
	args: {
		children: null,
	},
	render: () => (
		<Alert status="success" className="w-80">
			<Alert.Content className="space-y-1">
				<Alert.Title>업데이트 완료</Alert.Title>
				<Alert.Description>
					새로 생성된 피드백 wrapper는 HeroUI의 compound API를 그대로
					보존합니다.
				</Alert.Description>
			</Alert.Content>
		</Alert>
	),
};
