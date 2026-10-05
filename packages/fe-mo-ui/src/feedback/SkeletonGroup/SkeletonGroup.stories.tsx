import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { SkeletonGroup } from "./index";

const meta = {
	title: "feedback/SkeletonGroup",
	component: SkeletonGroup,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SkeletonGroup>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					SkeletonGroup
				</Typography>
				<Typography color="muted" type="body-sm">
					여러 skeleton item의 로딩 상태와 애니메이션을 한 번에 맞춥니다.
				</Typography>
			</View>
			<SkeletonGroup isLoading variant="shimmer">
				<View className="gap-3 rounded-lg border border-border bg-surface p-4">
					<View className="flex-row items-center gap-3">
						<SkeletonGroup.Item className="h-12 w-12 rounded-full" />
						<View className="flex-1 gap-2">
							<SkeletonGroup.Item className="h-4 w-32 rounded-lg" />
							<SkeletonGroup.Item className="h-3 w-48 rounded-lg" />
						</View>
					</View>
					<SkeletonGroup.Item className="h-24 w-full rounded-lg" />
				</View>
			</SkeletonGroup>
		</ScrollView>
	),
};
