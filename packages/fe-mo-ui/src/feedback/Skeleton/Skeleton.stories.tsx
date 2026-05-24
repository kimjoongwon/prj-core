import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, Text, View } from "react-native";
import { Skeleton } from "./index";

const meta = {
	title: "feedback/Skeleton",
	component: Skeleton,
	args: {
		className: "h-12 w-64 rounded-lg",
		isLoading: true,
		variant: "shimmer",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["shimmer", "pulse", "none"],
		},
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CardLoading: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Skeleton</Text>
				<Text className="text-sm leading-5 text-muted">
					목록과 카드가 로딩 중일 때 실제 레이아웃과 비슷한 자리를 잡습니다.
				</Text>
			</View>
			<View className="gap-3 rounded-lg border border-border bg-surface p-4">
				<Skeleton className="h-32 w-full rounded-lg" />
				<Skeleton className="h-5 w-3/4 rounded-lg" />
				<Skeleton className="h-4 w-full rounded-lg" variant="pulse" />
				<Skeleton className="h-4 w-1/2 rounded-lg" variant="pulse" />
			</View>
		</ScrollView>
	),
};
