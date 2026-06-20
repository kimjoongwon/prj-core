import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Checkbox } from "./index";

const state = observable({
	terms: true,
});

const meta = {
	title: "selection/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Checkbox</Text>
				<Text className="text-sm leading-5 text-muted">
					약관 동의나 다중 선택처럼 참/거짓 값을 입력합니다.
				</Text>
			</View>
			<Checkbox path="terms" state={state}>
				예약 취소 정책을 확인했습니다.
			</Checkbox>
		</ScrollView>
	),
};
