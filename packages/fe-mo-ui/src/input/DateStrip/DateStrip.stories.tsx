import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
import { PureDateStrip as DateStrip, type DateStripOption } from "./index";

const options: DateStripOption[] = [
	{
		badge: "오늘",
		count: 6,
		dateLabel: "13",
		dayLabel: "수",
		value: "2026-05-13",
	},
	{
		count: 4,
		dateLabel: "14",
		dayLabel: "목",
		value: "2026-05-14",
	},
	{
		count: 0,
		dateLabel: "15",
		dayLabel: "금",
		isDisabled: true,
		value: "2026-05-15",
	},
	{
		count: 8,
		dateLabel: "16",
		dayLabel: "토",
		value: "2026-05-16",
	},
];

const meta = {
	title: "input/DateStrip",
	component: DateStrip,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof DateStrip>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack gap="block">
					<Typography className="font-extrabold" type="h5">
						DateStrip
					</Typography>
					<Typography color="muted" type="body-sm">
						예약 가능한 날짜와 날짜별 클래스 수를 가로 목록으로 보여줍니다.
					</Typography>
				</VStack>
				<DateStrip
					onSelect={() => undefined}
					options={options}
					selectedValue="2026-05-13"
				/>
			</VStack>
		</ScrollView>
	),
};
