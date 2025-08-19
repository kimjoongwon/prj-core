import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { SNSButtons } from "./index";
import type { SNSButtonsProps } from "./SNSButtons";

const meta: Meta<SNSButtonsProps> = {
	title: "components/ui/SNSButtons",
	component: SNSButtons,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "소셜 로그인 버튼들을 표시하는 컴포넌트입니다.",
			},
		},
	},
	argTypes: {
		showGoogle: {
			control: { type: "boolean" },
			description: "Google 로그인 버튼 표시 여부",
		},
		showApple: {
			control: { type: "boolean" },
			description: "Apple 로그인 버튼 표시 여부",
		},
		showKakao: {
			control: { type: "boolean" },
			description: "카카오 로그인 버튼 표시 여부",
		},
	},
};

export default meta;
type Story = StoryObj<SNSButtonsProps>;

export const 기본: Story = {
	args: {},
	render: (args) => (
		<View style={{ width: 300, padding: 20 }}>
			<SNSButtons {...args} />
		</View>
	),
};

export const 구글만: Story = {
	args: {
		showGoogle: true,
		showApple: false,
		showKakao: false,
	},
	render: (args) => (
		<View style={{ width: 300, padding: 20 }}>
			<SNSButtons {...args} />
		</View>
	),
};

export const 애플만: Story = {
	args: {
		showGoogle: false,
		showApple: true,
		showKakao: false,
	},
	render: (args) => (
		<View style={{ width: 300, padding: 20 }}>
			<SNSButtons {...args} />
		</View>
	),
};

export const 카카오만: Story = {
	args: {
		showGoogle: false,
		showApple: false,
		showKakao: true,
	},
	render: (args) => (
		<View style={{ width: 300, padding: 20 }}>
			<SNSButtons {...args} />
		</View>
	),
};

export const 구글애플만: Story = {
	args: {
		showGoogle: true,
		showApple: true,
		showKakao: false,
	},
	render: (args) => (
		<View style={{ width: 300, padding: 20 }}>
			<SNSButtons {...args} />
		</View>
	),
};

export const 플레이그라운드: Story = {
	args: {
		showGoogle: true,
		showApple: true,
		showKakao: true,
	},
	render: (args) => (
		<View style={{ width: 300, padding: 20 }}>
			<SNSButtons {...args} />
		</View>
	),
};