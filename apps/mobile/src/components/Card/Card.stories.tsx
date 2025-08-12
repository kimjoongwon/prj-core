import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { Text, View } from "react-native";
import { Card } from "./Card";
import type { CardProps } from "./Card";

const meta: Meta<CardProps> = {
	title: "components/Card",
	component: Card,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "content1 배경과 default[100] 테두리를 사용하는 카드 컨테이너 컴포넌트입니다.",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["flat", "elevated", "outlined"],
			description: "Card의 시각적 스타일 변형",
		},
		radius: {
			control: { type: "select" },
			options: ["none", "sm", "md", "lg", "xl", "full"],
			description: "Card의 모서리 반지름",
		},
		padding: {
			control: { type: "select" },
			options: ["none", "sm", "md", "lg", "xl"],
			description: "Card의 내부 패딩",
		},
		shadow: {
			control: { type: "select" },
			options: [false, true, "none", "sm", "md", "lg"],
			description: "그림자 효과 설정",
		},
	},
};

export default meta;
type Story = StoryObj<CardProps>;

export const 기본: Story = {
	render: () => (
		<Card>
			<Text style={{ fontSize: 16 }}>기본 Card</Text>
		</Card>
	),
};

export const 플랫: Story = {
	args: {
		variant: "flat",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>플랫 스타일 Card</Text>
		</Card>
	),
};

export const 입체감: Story = {
	args: {
		variant: "elevated",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>입체감 있는 Card</Text>
		</Card>
	),
};

export const 테두리: Story = {
	args: {
		variant: "outlined",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>테두리가 있는 Card</Text>
		</Card>
	),
};

export const 그림자: Story = {
	args: {
		shadow: true,
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>그림자 효과 Card</Text>
		</Card>
	),
};

export const 패딩없음: Story = {
	args: {
		padding: "none",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>패딩 없는 Card</Text>
		</Card>
	),
};

export const 작은패딩: Story = {
	args: {
		padding: "sm",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>작은 패딩 Card</Text>
		</Card>
	),
};

export const 큰패딩: Story = {
	args: {
		padding: "xl",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>큰 패딩 Card</Text>
		</Card>
	),
};

export const 둥근모서리: Story = {
	args: {
		radius: "lg",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>둥근 모서리 Card</Text>
		</Card>
	),
};

export const 원형: Story = {
	args: {
		radius: "full",
		padding: "lg",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16, textAlign: "center" }}>원형 Card</Text>
		</Card>
	),
};

export const 그림자크기: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Card shadow="sm" padding="md">
				<Text style={{ fontSize: 14 }}>작은 그림자 (sm)</Text>
			</Card>
			<Card shadow="md" padding="md">
				<Text style={{ fontSize: 14 }}>중간 그림자 (md)</Text>
			</Card>
			<Card shadow="lg" padding="md">
				<Text style={{ fontSize: 14 }}>큰 그림자 (lg)</Text>
			</Card>
		</View>
	),
};

export const 일관된색상: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Card variant="flat" padding="md">
				<Text style={{ fontSize: 14 }}>content1 배경 + default[100] 테두리</Text>
			</Card>
			<Card variant="elevated" padding="md">
				<Text style={{ fontSize: 14 }}>content1 배경 + default[100] 테두리</Text>
			</Card>
			<Card variant="outlined" padding="md">
				<Text style={{ fontSize: 14 }}>content1 배경 + default[100] 테두리</Text>
			</Card>
		</View>
	),
};

export const 카드콘텐츠: Story = {
	args: {
		variant: "elevated",
		radius: "lg",
		padding: "lg",
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
				카드 제목
			</Text>
			<Text style={{ fontSize: 14, lineHeight: 20 }}>
				이것은 content1 배경과 default[100] 테두리를 사용하는 Card 컴포넌트입니다. 모든 variant에서 일관된 색상을 사용합니다.
			</Text>
		</Card>
	),
};

export const 플레이그라운드: Story = {
	args: {
		variant: "flat",
		radius: "md",
		padding: "md",
		shadow: false,
	},
	render: (args) => (
		<Card {...args}>
			<Text style={{ fontSize: 16 }}>플레이그라운드 Card</Text>
		</Card>
	),
};