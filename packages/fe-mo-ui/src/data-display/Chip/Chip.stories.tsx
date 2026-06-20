import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../Text";
import { Chip } from "./index";

const meta = {
	title: "data-display/Chip",
	component: Chip,
	args: {
		children: "예약 가능",
		color: "accent",
		size: "md",
		variant: "primary",
	},
	argTypes: {
		color: {
			control: "select",
			options: ["accent", "default", "success", "warning", "danger"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
		variant: {
			control: "select",
			options: ["primary", "secondary", "tertiary", "soft"],
		},
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Chip</Text>
				<Text className="text-sm leading-5 text-muted">
					상태, 레벨, 필터 토큰처럼 짧은 메타 정보를 표시합니다.
				</Text>
			</View>
			<View className="flex-row flex-wrap gap-2">
				<Chip color="accent">추천</Chip>
				<Chip color="success" variant="soft">
					예약 가능
				</Chip>
				<Chip color="warning" variant="secondary">
					마감 임박
				</Chip>
				<Chip color="danger" variant="tertiary">
					취소 불가
				</Chip>
				<Chip color="default" size="sm">
					All level
				</Chip>
			</View>
		</ScrollView>
	),
};
