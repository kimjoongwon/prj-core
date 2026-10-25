import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { SpaceListItemInfo } from "../../widget/SpaceListItem";
import { SpaceSelectScreen } from "./SpaceSelectScreen";
import { useStorybookState } from "../../storybook";

function createSpaceSelectStoryState() {
	return makeAutoObservable(
		{ selectedSpaceId: "gangnam", selectSpace(spaceId: string) { this.selectedSpaceId = spaceId; } },
		{},
		{ autoBind: true, name: "SpaceSelectScreenStoryState" },
	);
}

const spaces: SpaceListItemInfo[] = [
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
	title: "screen/SpaceSelectScreen",
	component: SpaceSelectScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SpaceSelectScreen>;

export default meta;

type Story = StoryObj;

export const Ready: Story = {
	render: () => <SpaceSelectStory />,
};

const SpaceSelectStory = observer(function SpaceSelectStory() {
		const state = useLocalObservable(createSpaceSelectStoryState);
		useStorybookState(() => ({ selectedSpaceId: state.selectedSpaceId }));
		return (
		<SpaceSelectScreen
			onSelectSpace={(space) => state.selectSpace(space.id)}
			selectedSpaceId={state.selectedSpaceId}
			spaces={spaces}
			status="ready"
		/>
		);
});

export const Loading: Story = {
	render: () => <SpaceSelectScreen status="loading" />,
};

export const Error: Story = {
	render: () => (
		<SpaceSelectScreen
			errorDescription="네트워크 연결을 확인한 뒤 다시 시도해 주세요."
			onPressRetry={() => undefined}
			status="error"
		/>
	),
};
