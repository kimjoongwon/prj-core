import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, Text, View } from "react-native";
import { Slider } from "./index";

const state = observable({
	intensity: 68,
});

const meta = {
	title: "selection/Slider",
	component: Slider,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Slider</Text>
				<Text className="text-sm leading-5 text-muted">
					강도, 거리, 비율처럼 연속적인 수치를 조절합니다.
				</Text>
			</View>
			<Slider
				maxValue={100}
				minValue={0}
				path="intensity"
				state={state}
				step={1}
			/>
		</ScrollView>
	),
};
