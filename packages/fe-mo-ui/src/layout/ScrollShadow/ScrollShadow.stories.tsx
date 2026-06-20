import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View, type ViewProps } from "react-native";
import { Text } from "../../data-display/Text";
import { ScrollShadow } from "./index";

const StoryGradient = ({
	style,
}: {
	colors: unknown;
	end?: unknown;
	locations?: unknown;
	start?: unknown;
	style?: ViewProps["style"];
}) => <View className="bg-background/85" pointerEvents="none" style={style} />;

const meta = {
	title: "layout/ScrollShadow",
	component: ScrollShadow,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ScrollShadow>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<View className="flex-1 gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					ScrollShadow
				</Text>
				<Text className="text-sm leading-5 text-muted">
					스크롤 가능한 영역의 위아래에 그라데이션 그림자를 더합니다.
				</Text>
			</View>
			<ScrollShadow
				LinearGradientComponent={StoryGradient}
				className="h-72 rounded-lg border border-border bg-surface"
				size={36}
				visibility="both"
			>
				<ScrollView contentContainerClassName="gap-3 p-4">
					{[
						"Morning Reformer",
						"Core Balance",
						"Evening Barre",
						"Tower Flow",
						"Stretch Recovery",
						"Private Session",
					].map((name) => (
						<View
							className="rounded-lg border border-border bg-surface-secondary p-3"
							key={name}
						>
							<Text className="text-sm font-bold text-foreground">{name}</Text>
							<Text className="text-xs leading-5 text-muted">
								예약 가능한 수업 정보를 확인합니다.
							</Text>
						</View>
					))}
				</ScrollView>
			</ScrollShadow>
		</View>
	),
};
