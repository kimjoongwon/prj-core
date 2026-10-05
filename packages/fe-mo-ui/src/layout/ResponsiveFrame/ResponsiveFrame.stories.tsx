import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { ResponsiveFrame } from "./index";

const FrameContent = ({ label }: { label: string }) => (
	<View className="gap-2 rounded-xl border border-border bg-surface p-4">
		<Typography className="uppercase text-accent" type="body-xs" weight="bold">{label}</Typography>
		<Typography className="font-extrabold" type="h6">
			예약 카드 레이아웃
		</Typography>
		<Typography color="muted" type="body-sm">
			부모 너비가 고정된 상태에서 자식 레이아웃의 줄바꿈과 여백을 확인합니다.
		</Typography>
	</View>
);

const meta = {
	title: "layout/ResponsiveFrame",
	component: ResponsiveFrame,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ResponsiveFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MobileWidth: Story = {
	render: () => (
		<ScrollView contentContainerClassName="items-center gap-4 px-4 py-5">
			<ResponsiveFrame size="mo">
				<FrameContent label="mo / 375" />
			</ResponsiveFrame>
		</ScrollView>
	),
};

export const WidthVariants: Story = {
	render: () => (
		<ScrollView
			contentContainerClassName="gap-4 px-4 py-5"
			horizontal
			showsHorizontalScrollIndicator
		>
			<ResponsiveFrame size="mo">
				<FrameContent label="mo / 375" />
			</ResponsiveFrame>
			<ResponsiveFrame width={480}>
				<FrameContent label="custom / 480" />
			</ResponsiveFrame>
			<ResponsiveFrame size="pc">
				<FrameContent label="pc / 1200" />
			</ResponsiveFrame>
		</ScrollView>
	),
};
