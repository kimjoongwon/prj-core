import type { Meta, StoryObj } from "@storybook/react";
import { createPlanningStory } from "../../storybook/planning";
import type { UserDetailScreenProps } from "./UserDetailScreen";
import { UserDetailScreen } from "./UserDetailScreen";
import { userDetailApiScenarios } from "./UserDetailScreen.msw";

const defaultArgs: UserDetailScreenProps = {
	onClickBackButton: (..._args: never[]) => undefined,
	user: {
		createdAt: "2026-04-14T09:00:00.000Z",
		email: "hong@example.com",
		id: "storybook-user",
		isActive: true,
		lastLoginAt: "2026-06-26T08:30:00.000Z",
		name: "홍길동",
		phone: "010-1234-5678",
		removedAt: null,
		updatedAt: "2026-06-26T08:30:00.000Z",
	},
	userId: "storybook-user",
};

const meta = {
	component: UserDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof UserDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = createPlanningStory<UserDetailScreenProps>({
	args: defaultArgs,
	render: (args) => <UserDetailScreen {...args} />,
	scenario: {
		id: "user-detail.default",
		title: "사용자 상세 기본 상태",
		description: "개인 Policy 할당 제거 이후 사용자 기본 정보만 검토합니다.",
		routePath: "/users/storybook-user",
		owner: "admin-web / fe-ui",
		status: "ready-for-review",
		context: {
			realm: "admin",
			role: "SPACE_MANAGER",
			tenantId: "storybook-tenant",
			spaceId: "storybook-space",
			abilities: ["read:user"],
			locale: "ko-KR",
			viewport: "desktop",
		},
		api: userDetailApiScenarios.default,
		acceptance: [
			{ label: "사용자 기본 정보가 보인다" },
			{ label: "개인 Policy 할당 UI는 보이지 않는다" },
			{ label: "user policy API를 호출하지 않는다" },
		],
	},
}) as Story;

export const Loading: Story = {
	args: {
		...defaultArgs,
		isLoading: true,
	},
};
