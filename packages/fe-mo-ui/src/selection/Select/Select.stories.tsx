import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Select } from "./index";

const state = observable({
	course: "reformer-8",
});

const meta = {
	title: "selection/Select",
	component: Select,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Select</Text>
				<Text className="text-sm leading-5 text-muted">
					좁은 화면에서 옵션 목록을 popover로 선택합니다.
				</Text>
			</View>
			<Select
				listLabel="수강권"
				options={[
					{ label: "리포머 8회권", value: "reformer-8" },
					{ label: "매트 필라테스 4회권", value: "mat-4" },
					{ label: "체험권", value: "trial" },
				]}
				path="course"
				placeholder="수강권 선택"
				state={state}
			/>
		</ScrollView>
	),
};
