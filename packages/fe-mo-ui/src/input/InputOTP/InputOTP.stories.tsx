import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView, Text, View } from "react-native";
import { InputOTP } from "./index";

const state = observable({
	code: "240913",
});

const meta = {
	title: "input/InputOTP",
	component: InputOTP,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof InputOTP>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">InputOTP</Text>
				<Text className="text-sm leading-5 text-muted">
					휴대폰 인증, 초대 코드 같은 짧은 보안 입력을 확인합니다.
				</Text>
			</View>
			<InputOTP maxLength={6} path="code" state={state} />
		</ScrollView>
	),
};
