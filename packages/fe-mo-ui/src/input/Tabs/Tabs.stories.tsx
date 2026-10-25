import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
import { Tabs } from "./index";

const createTabsStoryState = () =>
	makeAutoObservable(
		{ tab: "available" },
		{},
		{ autoBind: true, name: "TabsStoryState" },
	);

const meta = {
	title: "input/Tabs",
	component: Tabs,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Typography className="font-extrabold" type="h5">
						Tabs
					</Typography>
					<Typography color="muted" type="body-sm">
						예약 가능, 내 예약, 대기 목록 같은 같은 화면 내 관점을 전환합니다.
					</Typography>
				</VStack>
				<Tabs
					options={[
						{ text: "예약 가능", value: "available" },
						{ text: "내 예약", value: "mine" },
						{ text: "대기", value: "waitlist" },
					]}
					defaultValue="available"
				/>
			</VStack>
		</ScrollView>
	),
};

export const ExternalState: Story = {
	render: () => {
		const state = useLocalObservable(createTabsStoryState);
		return (
			<Tabs
				options={[
					{ text: "예약 가능", value: "available" },
					{ text: "내 예약", value: "mine" },
				]}
				path="tab"
				state={state}
			/>
		);
	},
};
