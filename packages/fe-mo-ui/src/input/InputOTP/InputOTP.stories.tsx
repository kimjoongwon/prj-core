import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
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
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack>
					<Typography className="font-extrabold" type="h5">InputOTP</Typography>
					<Typography color="muted" type="body-sm">
						휴대폰 인증, 초대 코드 같은 짧은 보안 입력을 확인합니다.
					</Typography>
				</VStack>
				<InputOTP
					description="문자로 받은 6자리 인증번호를 입력합니다."
					helperText="인증번호는 3분 동안 유효합니다."
					label="인증번호"
					path="code"
					state={state}
				/>
			</VStack>
		</ScrollView>
	),
};
