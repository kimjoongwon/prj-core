import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { ResponsiveFrame } from "./index";

const FrameContent = ({ label }: { label: string }) => (
	<View className="gap-2 rounded-xl border border-border bg-surface p-4">
		<Text className="text-xs font-bold uppercase text-accent">{label}</Text>
		<Text className="text-base font-extrabold text-foreground">
			예약 카드 레이아웃
		</Text>
		<Text className="text-sm leading-5 text-muted">
			부모 너비가 고정된 상태에서 자식 레이아웃의 줄바꿈과 여백을 확인합니다.
		</Text>
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
