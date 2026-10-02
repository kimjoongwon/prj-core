import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { Slider } from "./index";

const state = observable({
	intensity: 68,
});

const meta = {
	title: "input/Slider",
	component: Slider,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Text className="text-lg font-extrabold text-foreground">
						Slider
					</Text>
					<Text className="text-sm leading-5 text-muted">
						강도, 거리, 비율처럼 연속적인 수치를 조절합니다.
					</Text>
				</VStack>
				<Slider
					maxValue={100}
					minValue={0}
					path="intensity"
					state={state}
					step={1}
				/>
			</VStack>
		</ScrollView>
	),
};
