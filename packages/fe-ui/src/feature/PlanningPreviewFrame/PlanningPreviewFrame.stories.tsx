import type { PlanningScenario } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { PlanningPreviewFrame } from "./PlanningPreviewFrame";

const readyScenario = {
	id: "planning-preview.ready",
	title: "사용자 상세 기본 상태",
	description: "기획 검수자가 로그인과 Space context를 함께 확인합니다.",
	routePath: "/users/storybook-user",
	owner: "admin-web / fe-ui",
	status: "ready-for-review",
	context: {
		realm: "admin",
		authState: "authenticated",
		account: {
			id: "storybook-reviewer",
			name: "기획 담당자",
			email: "planner@example.com",
			role: "SPACE_MANAGER",
		},
		role: "SPACE_MANAGER",
		tenantId: "tenant-gangnam",
		tenantName: "강남 테넌트",
		spaceId: "space-gangnam",
		groundName: "강남 스페이스",
		spaces: [
			{
				tenantId: "tenant-gangnam",
				tenantName: "강남 테넌트",
				spaceId: "space-gangnam",
				groundName: "강남 스페이스",
			},
		],
		abilities: ["read:user", "update:user"],
		locale: "ko-KR",
		viewport: "desktop",
	},
	api: {
		name: "user-detail-ready",
		mode: "msw",
		requests: [
			{
				method: "GET",
				path: "/admin/users/storybook-user",
				status: 200,
				description: "사용자 상세 정보를 반환합니다.",
			},
		],
	},
	notes: ["개인 Policy 할당 제거 이후 정보 구조를 검토합니다."],
} satisfies PlanningScenario;

const loggedOutScenario = {
	...readyScenario,
	id: "planning-preview.logged-out",
	title: "로그아웃 상태",
	status: "draft",
	context: {
		realm: "admin",
		authState: "anonymous",
		role: "anonymous",
		locale: "ko-KR",
		viewport: "desktop",
	},
	api: {
		name: "none",
		mode: "none",
	},
	notes: ["실제 로그인으로 이동하지 않고 Storybook 안에서만 상태를 바꿉니다."],
} satisfies PlanningScenario;

const multipleSpacesScenario = {
	...readyScenario,
	id: "planning-preview.multiple-spaces",
	title: "여러 Space 선택 상태",
	context: {
		...readyScenario.context,
		tenantId: "tenant-gangnam",
		spaceId: "space-gangnam",
		spaces: [
			{
				tenantId: "tenant-gangnam",
				tenantName: "강남 테넌트",
				spaceId: "space-gangnam",
				groundName: "강남 스페이스",
			},
			{
				tenantId: "tenant-hongdae",
				tenantName: "홍대 테넌트",
				spaceId: "space-hongdae",
				groundName: "홍대 스페이스",
			},
		],
	},
	notes: ["selector 선택은 프레임 내부 mock 상태만 바꿉니다."],
} satisfies PlanningScenario;

const minimalScenario = {
	id: "planning-preview.minimal",
	title: "최소 기획 시나리오",
	context: {
		realm: "none",
		viewport: "desktop",
	},
	api: {
		name: "none",
		mode: "none",
	},
	notes: [],
} satisfies PlanningScenario;

const meta = {
	title: "feature/PlanningPreviewFrame",
	component: PlanningPreviewFrame,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof PlanningPreviewFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

function PreviewCard({ title = "Preview" }: { title?: string }) {
	return (
		<div className="grid gap-3 rounded-lg border border-border bg-surface p-5">
			<p className="text-xs font-semibold uppercase text-primary">Screen</p>
			<h3 className="text-xl font-semibold text-foreground">{title}</h3>
			<p className="max-w-2xl text-sm text-muted">
				실제 screen story가 이 영역에 렌더링됩니다. 상단 mock session과 오른쪽
				기획 패널을 함께 보며 검수합니다.
			</p>
		</div>
	);
}

export const Ready: Story = {
	args: {
		scenario: readyScenario,
	},
	parameters: {
		planning: readyScenario,
	},
	render: (args) => (
		<PlanningPreviewFrame {...args}>
			<PreviewCard title="사용자 상세 화면" />
		</PlanningPreviewFrame>
	),
};

export const LoggedOut: Story = {
	args: {
		scenario: loggedOutScenario,
	},
	parameters: {
		planning: loggedOutScenario,
	},
	render: (args) => (
		<PlanningPreviewFrame {...args}>
			<PreviewCard title="로그아웃 상태 Preview" />
		</PlanningPreviewFrame>
	),
};

export const MultipleSpaces: Story = {
	args: {
		scenario: multipleSpacesScenario,
	},
	parameters: {
		planning: multipleSpacesScenario,
	},
	render: (args) => (
		<PlanningPreviewFrame {...args}>
			<PreviewCard title="여러 Space 선택 Preview" />
		</PlanningPreviewFrame>
	),
};

export const Minimal: Story = {
	args: {
		scenario: minimalScenario,
	},
	parameters: {
		planning: minimalScenario,
	},
	render: (args) => (
		<PlanningPreviewFrame {...args}>
			<PreviewCard title="최소 입력 Preview" />
		</PlanningPreviewFrame>
	),
};
