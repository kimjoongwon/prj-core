import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Typography } from "./index";

const meta = {
	title: "data-display/Typography",
	component: Typography,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<View className="w-[320px] gap-3 rounded-xl border border-border bg-surface p-4">
			<Typography.Heading type="h3">Typography</Typography.Heading>
			<Typography.Paragraph color="muted">
				HeroUI Native의 공식 텍스트 primitive를 그대로 노출합니다.
			</Typography.Paragraph>
		</View>
	),
};

export const Variants: Story = {
	render: () => (
		<View className="w-[320px] gap-3 rounded-xl border border-border bg-surface p-4">
			<Typography type="h1">Heading 1</Typography>
			<Typography type="h3">Heading 3</Typography>
			<Typography type="body">Body text</Typography>
			<Typography type="body-sm" color="muted">
				Body small muted
			</Typography>
			<Typography type="body-xs" weight="bold">
				Body extra small bold
			</Typography>
			<Typography.Code>const ui = "native";</Typography.Code>
		</View>
	),
};

export const Composition: Story = {
	render: () => (
		<View className="w-[320px] gap-3 rounded-xl border border-border bg-surface p-4">
			<Typography.Heading type="h4">예약 안내</Typography.Heading>
			<Typography.Paragraph color="muted">
				긴 문장은 Paragraph로, 짧은 상태 값은 Code로 분리해 읽기 쉽게
				구성합니다.
			</Typography.Paragraph>
			<Typography.Code>status: confirmed</Typography.Code>
			<Typography truncate>
				아주 긴 한 줄 텍스트는 truncate를 사용해 레이아웃을 안정적으로
				유지합니다.
			</Typography>
		</View>
	),
};
