import type { Meta, StoryObj } from "@storybook/react-native";
import type { SpaceListItemInfo } from "../../widget/SpaceListItem";
import { SpaceSelectScreen } from "./SpaceSelectScreen";

const spaces: SpaceListItemInfo[] = [
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
	title: "screen/SpaceSelectScreen",
	component: SpaceSelectScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SpaceSelectScreen>;

export default meta;

type Story = StoryObj;

export const Ready: Story = {
	render: () => (
		<SpaceSelectScreen
			onSelectSpace={() => undefined}
			selectedSpaceId="gangnam"
			spaces={spaces}
			status="ready"
		/>
	),
};

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
