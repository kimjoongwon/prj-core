import type { Meta, StoryObj } from "@storybook/react-native";
import { observable } from "mobx";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
import { Switch } from "./index";

const state = observable({
	notify: true,
});

const meta = {
	title: "input/Switch",
	component: Switch,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Typography className="font-extrabold" type="h5">
						Switch
					</Typography>
					<Typography color="muted" type="body-sm">
						알림 수신 같은 즉시 반영되는 boolean 설정입니다.
					</Typography>
				</VStack>
				<Switch path="notify" state={state}>
					수업 시작 전 알림 받기
				</Switch>
			</VStack>
		</ScrollView>
	),
};
