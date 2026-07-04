import type { PlanningScenario } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { PlanningPreviewFrame } from "../../feature/PlanningPreviewFrame";
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
	title: "screen/UserDetailScreen",
	component: UserDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof UserDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultPlanningScenario = {
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
} satisfies PlanningScenario;

export const Default: Story = {
	args: defaultArgs,
	parameters: {
		planning: defaultPlanningScenario,
	},
	render: (args) => (
		<PlanningPreviewFrame scenario={defaultPlanningScenario}>
			<UserDetailScreen {...args} />
		</PlanningPreviewFrame>
	),
};

export const Loading: Story = {
	args: {
		...defaultArgs,
		isLoading: true,
	},
};
