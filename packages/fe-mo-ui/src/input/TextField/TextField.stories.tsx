import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
import { TextField } from "./index";

const createTextFieldStoryState = () =>
	makeAutoObservable(
		{ email: "hello@example.com" },
		{},
		{ autoBind: true, name: "TextFieldStoryState" },
	);

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
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack>
					<Typography className="font-extrabold" type="h5">
						TextField
					</Typography>
					<Typography color="muted" type="body-sm">
						MobX form state와 연결되는 기본 텍스트 입력입니다.
					</Typography>
				</VStack>
				<TextField
					description="예약 알림과 영수증을 받을 이메일입니다."
					isRequired
					label="이메일"
					defaultValue="hello@example.com"
					placeholder="hello@example.com"
				/>
				<TextField
					errorMessage="이메일 형식이 올바르지 않습니다."
					isInvalid
					label="이메일"
					defaultValue="hello@example.com"
					placeholder="hello@example.com"
				/>
			</VStack>
		</ScrollView>
	),
};

export const ExternalState: Story = {
	render: () => {
		const state = useLocalObservable(createTextFieldStoryState);
		return (
			<TextField
				label="이메일"
				path="email"
				state={state}
				placeholder="hello@example.com"
			/>
		);
	},
};
