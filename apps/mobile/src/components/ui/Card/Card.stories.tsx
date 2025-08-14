import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { Text } from "../Text";
import { Card } from "./Card";
import type { CardProps } from "./Card";

const meta: Meta<CardProps> = {
	title: "components/Card",
	component: Card,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "content1 배경을 사용하는 간단한 카드 컨테이너 컴포넌트입니다.",
			},
		},
	},
	argTypes: {
		padding: {
			control: { type: "select" },
			options: ["sm", "md", "lg"],
			description: "Card의 내부 패딩",
		},
	},
	decorators: [
		(Story) => (
			<View style={{ padding: 16 }}>
				<Story />
			</View>
		),
	],
};

export default meta;
type Story = StoryObj<CardProps>;

export const Default: Story = {
	args: {
		padding: "md",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>기본 Card</Text>
		</Card>
	),
};

export const SmallPadding: Story = {
	args: {
		padding: "sm",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>작은 패딩</Text>
		</Card>
	),
};

export const LargePadding: Story = {
	args: {
		padding: "lg",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>큰 패딩</Text>
		</Card>
	),
};

export const WithContent: Story = {
	args: {
		padding: "md",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
				카드 제목
			</Text>
			<Text style={{ fontSize: 14, lineHeight: 20, color: "#666" }}>
				content1 배경을 사용하는 간단한 Card 컴포넌트입니다.
			</Text>
		</Card>
	),
};

export const PaddingComparison: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Card padding="sm">
				<Text style={{ fontSize: 14 }}>작은 패딩 (sm)</Text>
			</Card>
			<Card padding="md">
				<Text style={{ fontSize: 14 }}>기본 패딩 (md)</Text>
			</Card>
			<Card padding="lg">
				<Text style={{ fontSize: 14 }}>큰 패딩 (lg)</Text>
			</Card>
		</View>
	),
	args: {},
};