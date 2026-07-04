import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Switch } from "./index";

const state = observable({
	notify: true,
});

const meta = {
	title: "input/Switch",
	component: Switch,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Switch</Text>
				<Text className="text-sm leading-5 text-muted">
					알림 수신 같은 즉시 반영되는 boolean 설정입니다.
				</Text>
			</View>
			<Switch path="notify" state={state}>
				수업 시작 전 알림 받기
			</Switch>
		</ScrollView>
	),
};
