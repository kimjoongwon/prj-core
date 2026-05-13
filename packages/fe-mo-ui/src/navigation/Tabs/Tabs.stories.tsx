import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, Text, View } from "react-native";
import { Tabs } from "./index";

const state = observable({
	tab: "available",
});

const meta = {
	title: "navigation/Tabs",
	component: Tabs,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Tabs</Text>
				<Text className="text-sm leading-5 text-muted">
					예약 가능, 내 예약, 대기 목록 같은 같은 화면 내 관점을 전환합니다.
				</Text>
			</View>
			<Tabs
				options={[
					{ text: "예약 가능", value: "available" },
					{ text: "내 예약", value: "mine" },
					{ text: "대기", value: "waitlist" },
				]}
				path="tab"
				state={state}
			/>
		</ScrollView>
	),
};
