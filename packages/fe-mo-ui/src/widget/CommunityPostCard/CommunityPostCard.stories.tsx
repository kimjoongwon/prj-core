import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView } from "react-native";
import { CommunityPostCard } from "./index";

const meta = {
	title: "widget/CommunityPostCard",
	component: CommunityPostCard,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof CommunityPostCard>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<CommunityPostCard
				authorName="민지 회원"
				createdAtLabel="방금 전"
				isMine
				text="오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?"
				title="저녁 수업 후 스트레칭"
			/>
			<CommunityPostCard
				authorName="운영팀"
				createdAtLabel="어제"
				isPinned
				text="이번 주 토요일 오전 수업은 지점 점검으로 30분 늦게 시작합니다."
				title="토요일 오전 수업 안내"
			/>
		</ScrollView>
	),
};
