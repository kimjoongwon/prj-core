import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { Select } from "./index";

const state = observable({
	reservationType: "group",
});

const meta = {
	title: "input/Select",
	component: Select,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Text className="text-lg font-extrabold text-foreground">
						Select
					</Text>
					<Text className="text-sm leading-5 text-muted">
						좁은 화면에서 옵션 목록을 popover로 선택합니다.
					</Text>
				</VStack>
				<Select
					listLabel="예약 유형"
					options={[
						{ label: "그룹 클래스", value: "group" },
						{ label: "개인 레슨", value: "private" },
						{ label: "상담 예약", value: "consulting" },
					]}
					path="reservationType"
					placeholder="예약 유형 선택"
					state={state}
				/>
			</VStack>
		</ScrollView>
	),
};
