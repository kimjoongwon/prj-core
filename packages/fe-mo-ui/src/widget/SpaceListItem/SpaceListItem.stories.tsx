import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Icon } from "../../icon";
import { SpaceListItem } from "./index";

const meta = {
	title: "widget/SpaceListItem",
	component: SpaceListItem,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SpaceListItem>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					SpaceListItem
				</Typography>
				<Typography color="muted" type="body-sm">
					예약에 사용할 지점을 선택하는 리스트 행입니다.
				</Typography>
			</View>
			<SpaceListItem
				isSelected
				onPressSpace={() => undefined}
				space={{
					address: "서울특별시 강남구 테헤란로 123",
					id: "gangnam",
					name: "강남 리포머 센터",
				}}
			/>
			<SpaceListItem
				accessory={<Icon name="arrowRight" size="sm" tone="muted" />}
				onPressSpace={() => undefined}
				space={{
					address: "서울특별시 마포구 양화로 45",
					id: "hongdae",
					name: "홍대 밸런스 스튜디오",
				}}
			/>
			<SpaceListItem
				disabled
				space={{
					address: null,
					id: "disabled",
					name: "준비 중인 지점",
				}}
			/>
		</ScrollView>
	),
};
