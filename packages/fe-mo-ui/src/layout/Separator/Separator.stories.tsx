import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Separator } from "./index";

const meta = {
	title: "layout/Separator",
	component: Separator,
	args: {
		orientation: "horizontal",
		variant: "thin",
	},
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
		},
		variant: {
			control: "select",
			options: ["thin", "thick"],
		},
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Examples: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					Separator
				</Typography>
				<Typography color="muted" type="body-sm">
					관련 정보 사이에 낮은 강도의 구분선을 넣습니다.
				</Typography>
			</View>
			<View className="gap-3 rounded-lg border border-border bg-surface p-4">
				<Typography type="body-sm" weight="bold">예약 정보</Typography>
				<Separator />
				<Typography color="muted" type="body-sm">5월 23일 09:30</Typography>
				<View className="h-8 flex-row items-center gap-3">
					<Typography type="body-sm">Studio A</Typography>
					<Separator orientation="vertical" />
					<Typography type="body-sm">Hana coach</Typography>
				</View>
				<Separator variant="thick" />
			</View>
		</ScrollView>
	),
};
