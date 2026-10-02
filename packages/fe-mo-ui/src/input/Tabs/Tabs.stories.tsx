import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { Tabs } from "./index";

const state = observable({
	tab: "available",
});

const meta = {
	title: "input/Tabs",
	component: Tabs,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Text className="text-lg font-extrabold text-foreground">Tabs</Text>
					<Text className="text-sm leading-5 text-muted">
						예약 가능, 내 예약, 대기 목록 같은 같은 화면 내 관점을 전환합니다.
					</Text>
				</VStack>
				<Tabs
					options={[
						{ text: "예약 가능", value: "available" },
						{ text: "내 예약", value: "mine" },
						{ text: "대기", value: "waitlist" },
					]}
					path="tab"
					state={state}
				/>
			</VStack>
		</ScrollView>
	),
};
