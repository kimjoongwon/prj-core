import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../../rhythm";
import { TextField } from "./index";

const state = observable({
	email: "hello@example.com",
});

const meta = {
	title: "input/TextField",
	component: TextField,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<VStack>
				<Text variant="heading">TextField</Text>
				<Text tone="muted">
					MobX form state와 연결되는 기본 텍스트 입력입니다.
				</Text>
			</VStack>
			<TextField
				description="예약 알림과 영수증을 받을 이메일입니다."
				isRequired
				label="이메일"
				path="email"
				placeholder="hello@example.com"
				state={state}
			/>
			<TextField
				errorMessage="이메일 형식이 올바르지 않습니다."
				isInvalid
				label="이메일"
				path="email"
				placeholder="hello@example.com"
				state={state}
			/>
		</ScrollView>
	),
};
