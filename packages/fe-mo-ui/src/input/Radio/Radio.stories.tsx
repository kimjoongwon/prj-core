import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { HStack, VStack } from "../../rhythm";
import { PureRadio as Radio } from "./index";

const meta = {
	title: "input/Radio",
	component: Radio,
	args: {
		isSelected: true,
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="section">
				<VStack gap="block">
					<Typography className="font-extrabold" type="h5">Radio</Typography>
					<Typography color="muted" type="body-sm">
						단독 radio primitive 또는 RadioGroup 내부 indicator로 사용합니다.
					</Typography>
				</VStack>
				<VStack
					className="rounded-lg border border-border bg-surface p-4"
					gap="block"
				>
					<HStack alignItems="center" gap="block">
						<Radio isSelected />
						<Typography type="body-sm" weight="semibold">
							SMS 알림
						</Typography>
					</HStack>
					<HStack alignItems="center" gap="block">
						<Radio />
						<Typography type="body-sm" weight="semibold">앱 푸시</Typography>
					</HStack>
					<HStack alignItems="center" className="opacity-50" gap="block">
						<Radio isDisabled />
						<Typography type="body-sm" weight="semibold">이메일</Typography>
					</HStack>
				</VStack>
			</VStack>
		</ScrollView>
	),
};
