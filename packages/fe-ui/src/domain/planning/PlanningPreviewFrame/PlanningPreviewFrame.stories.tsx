import type { PlanningScenario } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { PlanningPreviewFrame } from "./PlanningPreviewFrame";

const readyScenario = {
	id: "planning-preview.ready",
	title: "사용자 상세 기본 상태",
	description: "기획 검수자가 로그인과 Space context를 함께 확인합니다.",
	routePath: "/users/301",
	owner: "admin-web / fe-ui",
	status: "ready-for-review",
	context: {
		realm: "admin",
		authState: "authenticated",
		account: {
			id: "501",
			name: "기획 담당자",
			email: "planner@example.com",
			role: "SPACE_MANAGER",
		},
		role: "SPACE_MANAGER",
		tenantId: "101",
		tenantName: "강남 테넌트",
		spaceId: "201",
		fitnessCenterName: "F45 강남1호",
		spaces: [
			{
				tenantId: "101",
				tenantName: "강남 테넌트",
				spaceId: "201",
				fitnessCenterName: "F45 강남1호",
			},
		],
		abilities: ["read:user", "update:user"],
		locale: "ko-KR",
		viewport: "desktop",
	},
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
} satisfies PlanningScenario;

const multipleSpacesScenario = {
	...readyScenario,
	id: "planning-preview.multiple-spaces",
	title: "여러 Space 선택 상태",
	context: {
		...readyScenario.context,
		tenantId: "101",
		spaceId: "201",
		spaces: [
			{
				tenantId: "101",
				tenantName: "강남 테넌트",
				spaceId: "201",
				fitnessCenterName: "F45 강남1호",
			},
			{
				tenantId: "102",
				tenantName: "홍대 테넌트",
				spaceId: "202",
				fitnessCenterName: "스포애니 홍대",
			},
		],
	},
} satisfies PlanningScenario;

const minimalScenario = {
	id: "planning-preview.minimal",
	title: "최소 기획 시나리오",
	context: {
		realm: "none",
		viewport: "desktop",
	},
} satisfies PlanningScenario;

const meta = {
	title: "domain/planning/PlanningPreviewFrame",
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
				실제 screen story가 이 영역 전체 너비에 렌더링됩니다. 넓은 화면은
				가로 스크롤로 확인합니다.
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
