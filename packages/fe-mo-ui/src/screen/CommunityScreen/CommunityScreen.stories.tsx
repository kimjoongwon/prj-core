import type { Meta, StoryObj } from "@storybook/react-native";
import { CommunityScreen } from "./CommunityScreen";

const meta = {
	title: "screen/CommunityScreen",
	component: CommunityScreen,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof CommunityScreen>;

export default meta;

type Story = StoryObj;

export const Ready: Story = {
	render: () => (
		<CommunityScreen
			composer={{
				isOpen: false,
				text: "",
				title: "",
			}}
			posts={[
				{
					authorName: "민지 회원",
					createdAtLabel: "방금 전",
					id: "community-post-1",
					isMine: true,
					text: "오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?",
					title: "저녁 수업 후 스트레칭",
				},
				{
					authorName: "운영팀",
					createdAtLabel: "어제",
					id: "community-post-2",
					isPinned: true,
					text: "이번 주 토요일 오전 수업은 지점 점검으로 30분 늦게 시작합니다.",
					title: "토요일 오전 수업 안내",
				},
			]}
			status="ready"
		/>
	),
};

export const Empty: Story = {
	render: () => (
		<CommunityScreen
			composer={{
				isOpen: false,
				text: "",
				title: "",
			}}
			posts={[]}
			status="empty"
		/>
	),
};

export const Loading: Story = {
	render: () => (
		<CommunityScreen
			composer={{
				isOpen: false,
				text: "",
				title: "",
			}}
			posts={[]}
			status="loading"
		/>
	),
};

export const Error: Story = {
	render: () => (
		<CommunityScreen
			composer={{
				isOpen: false,
				text: "",
				title: "",
			}}
			errorDescription="커뮤니티 글을 불러오지 못했습니다."
			posts={[]}
			status="error"
		/>
	),
};

export const ComposerOpen: Story = {
	render: () => (
		<CommunityScreen
			composer={{
				isOpen: true,
				text: "오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?",
				title: "저녁 수업 후 스트레칭",
			}}
			posts={[
				{
					authorName: "민지 회원",
					createdAtLabel: "방금 전",
					id: "community-post-1",
					isMine: true,
					text: "오늘 저녁 수업 끝나고 스트레칭 같이 하실 분 계신가요?",
					title: "저녁 수업 후 스트레칭",
				},
			]}
			status="ready"
		/>
	),
};

export const SubmitPending: Story = {
	render: () => (
		<CommunityScreen
			composer={{
				isOpen: true,
				isSubmitting: true,
				text: "함께 운동해요.",
				title: "새 글",
			}}
			posts={[]}
			status="empty"
		/>
	),
};
