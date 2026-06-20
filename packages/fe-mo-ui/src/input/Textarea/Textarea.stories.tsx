import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { Textarea } from "./index";

const state = observable({
	memo: "어깨가 불편해서 오늘은 상체 운동 강도를 낮춰 주세요.",
});

const meta = {
	title: "input/Textarea",
	component: Textarea,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<VStack gap="dense">
				<Text variant="heading">Textarea</Text>
				<Text tone="muted">
					예약 메모처럼 여러 줄 입력이 필요한 필드입니다.
				</Text>
			</VStack>
			<Textarea
				description="현장에서 확인해야 하는 내용을 남깁니다."
				helperText="부상, 요청사항, 동행 인원 등을 간단히 적어 주세요."
				label="예약 메모"
				path="memo"
				placeholder="코치에게 전달할 내용을 입력하세요"
				state={state}
			/>
		</ScrollView>
	),
};
