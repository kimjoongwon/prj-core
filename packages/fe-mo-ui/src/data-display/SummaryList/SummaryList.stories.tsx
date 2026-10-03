import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../Typography";
import { SummaryList } from "./index";

const meta = {
	title: "data-display/SummaryList",
	component: SummaryList,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SummaryList>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					SummaryList
				</Typography>
				<Typography color="muted" type="body-sm">
					제출 전에 사용자가 입력한 정보를 점검합니다.
				</Typography>
			</View>
			<SummaryList
				items={[
					{ label: "이름", value: "김온유" },
					{ label: "연락처", value: "010-1234-5678" },
					{
						helperText: "필수 메모가 아직 입력되지 않았습니다.",
						label: "요청 사항",
						placeholder: "미입력",
						state: "warning",
					},
				]}
				title="예약자 정보"
			/>
		</ScrollView>
	),
};
