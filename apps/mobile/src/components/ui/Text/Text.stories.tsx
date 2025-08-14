import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { Text } from "./Text";
import type { TextProps } from "./Text";

const meta: Meta<TextProps> = {
	title: "components/Text",
	component: Text,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "테마를 지원하는 타이포그래피 컴포넌트입니다.",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"body1",
				"body2",
				"caption",
				"overline",
			],
			description: "Text의 타이포그래피 스타일",
		},
		color: {
			control: { type: "select" },
			options: [
				"foreground",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
				"default",
			],
			description: "Text의 색상",
		},
	},
};

export default meta;
type Story = StoryObj<TextProps>;

export const 기본: Story = {
	args: {
		children: "기본 텍스트입니다",
	},
	render: (args) => <Text {...args} />,
};

export const 헤딩1: Story = {
	args: {
		variant: "h1",
		children: "헤딩 1 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 헤딩2: Story = {
	args: {
		variant: "h2",
		children: "헤딩 2 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 헤딩3: Story = {
	args: {
		variant: "h3",
		children: "헤딩 3 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 본문1: Story = {
	args: {
		variant: "body1",
		children: "본문 1 텍스트입니다. 일반적인 본문에 사용됩니다.",
	},
	render: (args) => <Text {...args} />,
};

export const 본문2: Story = {
	args: {
		variant: "body2",
		children: "본문 2 텍스트입니다. 보조적인 본문에 사용됩니다.",
	},
	render: (args) => <Text {...args} />,
};

export const 캡션: Story = {
	args: {
		variant: "caption",
		children: "캡션 텍스트입니다. 작은 설명에 사용됩니다.",
	},
	render: (args) => <Text {...args} />,
};

export const 오버라인: Story = {
	args: {
		variant: "overline",
		children: "오버라인 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 주요색상: Story = {
	args: {
		color: "primary",
		children: "주요 색상 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 보조색상: Story = {
	args: {
		color: "secondary",
		children: "보조 색상 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 성공색상: Story = {
	args: {
		color: "success",
		children: "성공 색상 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 경고색상: Story = {
	args: {
		color: "warning",
		children: "경고 색상 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 위험색상: Story = {
	args: {
		color: "danger",
		children: "위험 색상 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 기본색상: Story = {
	args: {
		color: "default",
		children: "기본 색상 텍스트",
	},
	render: (args) => <Text {...args} />,
};

export const 타이포그래피계층: Story = {
	render: () => (
		<View style={{ gap: 8 }}>
			<Text variant="h1">헤딩 1 - 가장 큰 제목</Text>
			<Text variant="h2">헤딩 2 - 큰 제목</Text>
			<Text variant="h3">헤딩 3 - 중간 제목</Text>
			<Text variant="h4">헤딩 4 - 작은 제목</Text>
			<Text variant="h5">헤딩 5 - 더 작은 제목</Text>
			<Text variant="h6">헤딩 6 - 가장 작은 제목</Text>
			<Text variant="body1">본문 1 - 일반 본문 텍스트</Text>
			<Text variant="body2">본문 2 - 보조 본문 텍스트</Text>
			<Text variant="caption">캡션 - 작은 설명 텍스트</Text>
			<Text variant="overline">오버라인 - 라벨 텍스트</Text>
		</View>
	),
};

export const 색상팔레트: Story = {
	render: () => (
		<View style={{ gap: 8 }}>
			<Text color="foreground">기본 전경 색상</Text>
			<Text color="primary">주요 색상</Text>
			<Text color="secondary">보조 색상</Text>
			<Text color="success">성공 색상</Text>
			<Text color="warning">경고 색상</Text>
			<Text color="danger">위험 색상</Text>
			<Text color="default">기본 색상</Text>
		</View>
	),
};

export const 플레이그라운드: Story = {
	args: {
		variant: "body1",
		color: "foreground",
		children: "플레이그라운드 텍스트",
	},
	render: (args) => <Text {...args} />,
};
