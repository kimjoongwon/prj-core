import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "../../data-display/Typography";
import { Container } from "./Container";

const meta = {
	title: "layout/Container",
	component: Container,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"일관된 레이아웃 구조를 제공하는 유연한 컴테이너 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
			description: "추가 CSS 클래스",
		},
		children: {
			control: "text",
			description: "컴테이너 내부에 표시할 컨텐츠",
		},
	},
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		children: "컴테이너 컨텐츠",
	},
	parameters: {
		docs: {
			description: {
				story: "기본 컴테이너입니다.",
			},
		},
	},
};

export const 커스텀스타일: Story = {
	args: {
		children: "커스텀 스타일 컴테이너",
		className: "rounded-lg border-2 border-accent/30 bg-accent-soft p-4",
	},
	parameters: {
		docs: {
			description: {
				story: "커스텀 스타일이 적용된 컴테이너입니다.",
			},
		},
	},
};

export const 여러요소: Story = {
	args: {
		className: "gap-4 rounded-lg bg-surface-secondary p-4",
		children: "",
	},
	render: (args) => (
		<Container {...args}>
			<>
				<div className="rounded bg-surface-tertiary p-2">
					<Typography>아이템 1</Typography>
				</div>
				<div className="rounded bg-surface-secondary p-2">
					<Typography>아이템 2</Typography>
				</div>
				<div className="rounded bg-accent-soft p-2">
					<Typography>아이템 3</Typography>
				</div>
			</>
		</Container>
	),
	parameters: {
		docs: {
			description: {
				story: "여러 자식 요소가 있는 컴테이너입니다.",
			},
		},
	},
};

export const 반응형: Story = {
	args: {
		className:
			"mx-auto w-full max-w-md rounded-lg bg-surface p-6 shadow-surface",
		children: "",
	},
	render: (args) => (
		<Container {...args}>
			<>
				<Typography.Heading className="mb-4 text-xl" level={2} weight="bold">
					카드 제목
				</Typography.Heading>
				<Typography.Paragraph className="mb-4" color="muted">
					다양한 화면 크기에 잘 맞는 반응형 컨테이너의 예시입니다.
				</Typography.Paragraph>
				<button
					type="button"
					className="w-full rounded bg-accent px-4 py-2 text-accent-foreground hover:bg-accent-hover"
				>
					액션 버튼
				</button>
			</>
		</Container>
	),
	parameters: {
		docs: {
			description: {
				story: "반응형 카드 레이아웃에 사용되는 컴테이너입니다.",
			},
		},
	},
};

export const 폼레이아웃: Story = {
	args: {
		className:
			"gap-4 max-w-sm rounded-lg border border-border bg-surface p-6 shadow-surface",
		children: "",
	},
	render: (args) => (
		<Container {...args}>
			<>
				<Typography.Heading className="text-lg" level={3}>
					연락처 폼
				</Typography.Heading>
				<input
					type="text"
					placeholder="이름"
					className="w-full rounded border p-2"
				/>
				<input
					type="email"
					placeholder="이메일"
					className="w-full rounded border p-2"
				/>
				<textarea
					placeholder="메시지"
					rows={3}
					className="w-full resize-none rounded border p-2"
				/>
				<button
					type="button"
					className="w-full rounded bg-accent px-4 py-2 text-accent-foreground hover:bg-accent-hover"
				>
					메시지 보내기
				</button>
			</>
		</Container>
	),
	parameters: {
		docs: {
			description: {
				story: "적절한 간격이 있는 폼 레이아웃에 사용되는 컴테이너입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		children: "플레이그라운드 컴테이너",
		className: "border-2 border-dashed border-border p-4",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 컴테이너 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
