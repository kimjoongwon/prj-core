import type { Meta, StoryObj } from "@storybook/react";
import type { ToolbarProps } from "./Toolbar";
import { Toolbar } from "./Toolbar";

const meta = {
	title: "Layouts/Toolbar",
	component: Toolbar,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "HeroUI Toolbar의 레이아웃 래퍼입니다.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Toolbar>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = (
	<>
		<button type="button" className="rounded-md border px-3 py-1">
			저장
		</button>
		<button type="button" className="rounded-md border px-3 py-1">
			초기화
		</button>
		<button type="button" className="rounded-md border px-3 py-1">
			삭제
		</button>
	</>
);

const renderDefaultToolbar = (args: ToolbarProps) => (
	<Toolbar {...args}>{items}</Toolbar>
);

export const Default: Story = {
	render: renderDefaultToolbar,
	args: {
		orientation: "horizontal",
	},
	parameters: {
		docs: {
			description: {
				story: "기본 가로 툴바입니다.",
			},
		},
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<DividerSection title="가로" />
			<Toolbar {...{ orientation: "horizontal" }}>{items}</Toolbar>
			<DividerSection title="세로" />
			<Toolbar {...{ orientation: "vertical" }}>{items}</Toolbar>
			<DividerSection title="붙임" />
			<Toolbar {...{ orientation: "horizontal", isAttached: true }}>
				{items}
			</Toolbar>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "대표 토글 조합을 한 번에 확인합니다.",
			},
		},
	},
};

const DividerSection = ({ title }: { title: string }) => (
	<div className="text-xs text-default-400 font-medium">{title}</div>
);

export const Horizontal: Story = Default;

export const Vertical: Story = {
	render: renderDefaultToolbar,
	args: {
		orientation: "vertical",
	},
	parameters: {
		docs: {
			description: {
				story: "세로 정렬 툴바 구성입니다.",
			},
		},
	},
};

export const Attached: Story = {
	render: renderDefaultToolbar,
	args: {
		orientation: "horizontal",
		isAttached: true,
	},
	parameters: {
		docs: {
			description: {
				story: "버튼이 붙은 형태로 렌더링합니다.",
			},
		},
	},
};

export const Composition: Story = {
	render: (args) => <Toolbar.Root {...args}>{items}</Toolbar.Root>,
	args: {
		orientation: "horizontal",
	},
	parameters: {
		docs: {
			description: {
				story: "HeroUI Compound API의 Toolbar.Root 사용 예시입니다.",
			},
		},
	},
};

export const RootOnly: Story = Composition;
