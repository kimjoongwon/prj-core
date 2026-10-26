import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { SpaceSelectionList } from "./index";
import { useStorybookState } from "../../storybook";

function createSpaceSelectionListStoryState() {
	return makeAutoObservable(
		{ selectedSpaceId: "gangnam", selectSpace(spaceId: string) { this.selectedSpaceId = spaceId; } },
		{},
		{ autoBind: true, name: "SpaceSelectionListStoryState" },
	);
}

const spaces = [
	{
		address: "서울특별시 강남구 샘플로 123",
		id: "gangnam",
		name: "강남 리포머 센터",
	},
	{
		address: "서울특별시 마포구 샘플로 45",
		id: "hongdae",
		name: "홍대 밸런스 스튜디오",
	},
	{
		address: "서울특별시 성동구 샘플로 88",
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
	render: () => <SpaceSelectionListStory />,
};

const SpaceSelectionListStory = observer(function SpaceSelectionListStory() {
		const state = useLocalObservable(createSpaceSelectionListStoryState);
		useStorybookState(() => ({ selectedSpaceId: state.selectedSpaceId }));
		return (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					SpaceSelectionList
				</Typography>
				<Typography color="muted" type="body-sm">
					사용자가 이용할 지점을 리스트에서 선택합니다.
				</Typography>
			</View>
			<SpaceSelectionList
				onSelectSpace={(space) => state.selectSpace(space.id)}
				selectedSpaceId={state.selectedSpaceId}
				spaces={spaces}
			/>
		</ScrollView>
		);
});

export const Empty: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<SpaceSelectionList spaces={[]} />
		</ScrollView>
	),
};
