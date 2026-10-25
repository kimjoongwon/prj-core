import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
import { Checkbox } from "./index";

const createCheckboxStoryState = () =>
	makeAutoObservable(
		{ terms: true },
		{},
		{ autoBind: true, name: "CheckboxStoryState" },
	);

const meta = {
	title: "input/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Typography className="font-extrabold" type="h5">
						Checkbox
					</Typography>
					<Typography color="muted" type="body-sm">
						약관 동의나 다중 선택처럼 참/거짓 값을 입력합니다.
					</Typography>
				</VStack>
				<Checkbox defaultValue={true}>예약 취소 정책을 확인했습니다.</Checkbox>
			</VStack>
		</ScrollView>
	),
};

export const ExternalState: Story = {
	render: () => {
		const state = useLocalObservable(createCheckboxStoryState);
		return (
			<Checkbox path="terms" state={state}>
				예약 취소 정책을 확인했습니다.
			</Checkbox>
		);
	},
};
