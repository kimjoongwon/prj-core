import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
import { RadioGroup } from "./index";

const state = observable({
	channel: "sms",
});

const meta = {
	title: "input/RadioGroup",
	component: RadioGroup,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Typography className="font-extrabold" type="h5">
						RadioGroup
					</Typography>
					<Typography color="muted" type="body-sm">
						상호 배타적인 옵션 중 하나를 고릅니다.
					</Typography>
				</VStack>
				<RadioGroup
					options={[
						{ text: "SMS", value: "sms" },
						{ text: "앱 푸시", value: "push" },
						{ text: "이메일", value: "email" },
					]}
					path="channel"
					state={state}
				/>
			</VStack>
		</ScrollView>
	),
};
