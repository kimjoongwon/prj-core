import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Button } from "../../input/Button";
import { SpaceSelectionSheet } from "./index";
import { useStorybookState } from "../../storybook";

function createSpaceSelectionSheetStoryState() {
	return makeAutoObservable(
		{
			isOpen: true,
			selectedSpaceId: "gangnam",
			toggleOpen() { this.isOpen = !this.isOpen; },
			selectSpace(spaceId: string) { this.selectedSpaceId = spaceId; this.isOpen = false; },
		},
		{},
		{ autoBind: true, name: "SpaceSelectionSheetStoryState" },
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
	title: "feature/SpaceSelectionSheet",
	component: SpaceSelectionSheet,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SpaceSelectionSheet>;

export default meta;

type Story = StoryObj;

export const Open: Story = {
	render: () => <SpaceSelectionSheetStory />,
};

const SpaceSelectionSheetStory = observer(function SpaceSelectionSheetStory() {
		const state = useLocalObservable(createSpaceSelectionSheetStoryState);
		useStorybookState(() => ({ isOpen: state.isOpen, selectedSpaceId: state.selectedSpaceId }));
		return (
		<View className="flex-1 justify-end px-4 py-5">
			<View className="gap-2 rounded-lg border border-border bg-surface p-4">
				<Typography className="font-extrabold" type="h5">
					SpaceSelectionSheet
				</Typography>
				<Typography color="muted" type="body-sm">
					아래에서 열린 상태의 지점 선택 시트를 확인합니다.
				</Typography>
				<Button onPress={state.toggleOpen} variant="secondary">
					{state.isOpen ? "지점 선택 닫기" : "지점 변경"}
				</Button>
			</View>
			<SpaceSelectionSheet
				isOpen={state.isOpen}
				onOpenChange={(isOpen) => { state.isOpen = isOpen; }}
				onSelectSpace={(space) => state.selectSpace(space.id)}
				selectedSpaceId={state.selectedSpaceId}
				spaces={spaces}
			/>
		</View>
		);
});
