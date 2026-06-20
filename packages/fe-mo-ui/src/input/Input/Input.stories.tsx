import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { Input } from "./index";

const state = observable({
	name: "김온유",
});

const meta = {
	title: "input/Input",
	component: Input,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<VStack gap="dense">
				<Text variant="heading">Input</Text>
				<Text tone="muted">
					MobX form state와 연결되는 기본 텍스트 입력입니다.
				</Text>
			</VStack>
			<Input
				description="예약자 확인에 사용할 이름입니다."
				helperText="한글 또는 영문 이름을 입력해 주세요."
				label="예약자 이름"
				path="name"
				placeholder="이름을 입력하세요"
				state={state}
			/>
			<Input
				errorMessage="휴대폰 번호 형식이 올바르지 않습니다."
				label="휴대폰 번호"
				path="name"
				placeholder="010-0000-0000"
				state={state}
			/>
		</ScrollView>
	),
};
