import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { SpaceSelectionList } from "./index";

const spaces = [
	{
		address: "서울특별시 강남구 테헤란로 123",
		id: "gangnam",
		name: "강남 리포머 센터",
	},
	{
		address: "서울특별시 마포구 양화로 45",
		id: "hongdae",
		name: "홍대 밸런스 스튜디오",
	},
	{
		address: "서울특별시 성동구 왕십리로 88",
		id: "seongsu",
		name: "성수 모션 랩",
	},
];

const meta = {
	title: "widget/SpaceSelectionList",
	component: SpaceSelectionList,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SpaceSelectionList>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">
					SpaceSelectionList
				</Text>
				<Text className="text-sm leading-5 text-muted">
					사용자가 이용할 지점을 리스트에서 선택합니다.
				</Text>
			</View>
			<SpaceSelectionList
				onSelectSpace={() => undefined}
				selectedSpaceId="gangnam"
				spaces={spaces}
			/>
		</ScrollView>
	),
};

export const Empty: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<SpaceSelectionList spaces={[]} />
		</ScrollView>
	),
};
