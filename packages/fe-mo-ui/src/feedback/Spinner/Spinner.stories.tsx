import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, Text, View } from "react-native";
import { Spinner } from "./index";

const meta = {
	title: "feedback/Spinner",
	component: Spinner,
	args: {
		color: "default",
		isLoading: true,
		size: "md",
	},
	argTypes: {
		color: {
			control: "select",
			options: ["default", "success", "warning", "danger"],
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Spinner</Text>
				<Text className="text-sm leading-5 text-muted">
					짧은 대기 상태나 버튼 내부 loading 상태를 표시합니다.
				</Text>
			</View>
			<View className="flex-row items-center gap-5 rounded-lg border border-border bg-surface p-4">
				<Spinner size="sm" />
				<Spinner color="success" size="md" />
				<Spinner color="warning" size="lg" />
				<Spinner color="danger" size="md" />
			</View>
		</ScrollView>
	),
};
