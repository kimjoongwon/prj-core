import type { Meta, StoryObj } from "@storybook/react";
import { HStack, VStack } from "../../rhythm";
import { Container, type ContainerWidth } from "./Container";

const meta = {
	title: "layout/Container",
	component: Container,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"콘텐츠 폭을 역할 단위로 제한하고 중앙 정렬하는 구조 primitive입니다. 세로 리듬은 소유하지 않고 자식은 VStack/HStack으로 조합합니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		width: {
			control: "select",
			options: ["narrow", "content", "page", "wide", "full"],
			description: "폭 역할 (기본: page)",
		},
		containerQuery: {
			control: "boolean",
			description: "이 컨테이너 폭을 기준으로 하는 container query 활성화",
		},
		className: {
			control: "text",
			description: "폭 외 여백 등 조합용 추가 CSS 클래스",
		},
		children: {
			control: "text",
			description: "컨테이너 내부 콘텐츠",
		},
	},
	args: {
		width: "page",
	},
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const widthLabels: Record<ContainerWidth, string> = {
	narrow: "narrow — 읽기 전용 폼·본문 (max-w-[40rem])",
	content: "content — 본문 중심 콘텐츠 (max-w-4xl)",
	page: "page — 페이지 기본 (max-w-7xl)",
	wide: "wide — 넓은 대시보드 (max-w-[96rem])",
	full: "full — 전체 폭 (max-w-none)",
};

export const 기본: Story = {
	args: {
		children: "컨테이너 콘텐츠",
	},
	parameters: {
		docs: {
			description: {
				story: "기본 폭 역할은 page(max-w-7xl)이고 항상 중앙 정렬됩니다.",
			},
		},
	},
};

export const 폭역할별: Story = {
	args: { children: "" },
	render: () => (
		<VStack gap="page">
			{(Object.keys(widthLabels) as ContainerWidth[]).map((width) => (
				<Container key={width} width={width}>
					<div className="rounded-lg border border-dashed border-border bg-surface p-3 text-sm">
						{widthLabels[width]}
					</div>
				</Container>
			))}
		</VStack>
	),
	parameters: {
		layout: "padded",
		docs: {
			description: {
				story: "폭 역할 5종의 최대 폭을 나란히 비교합니다.",
			},
		},
	},
};

export const 세로리듬조합: Story = {
	args: { children: "" },
	render: () => (
		<Container width="content" className="py-8">
			<VStack gap="page">
				<header className="rounded-lg bg-surface-secondary p-4">
					<h2 className="text-lg font-bold">제목 블록</h2>
					<p className="text-muted text-sm">
						Container는 폭만 소유하고 세로 간격은 VStack gap이 소유합니다.
					</p>
				</header>
				<HStack gap="section">
					<div className="flex-1 rounded-lg bg-surface-tertiary p-4 text-sm">
						본문 블록
					</div>
					<div className="flex-1 rounded-lg bg-surface-tertiary p-4 text-sm">
						보조 블록
					</div>
				</HStack>
			</VStack>
		</Container>
	),
	parameters: {
		layout: "padded",
		docs: {
			description: {
				story:
					"폭은 Container width, 세로 리듬은 VStack/HStack 조합으로 분리해 사용합니다.",
			},
		},
	},
};

export const 컨테이너쿼리: Story = {
	args: { children: "" },
	render: () => (
		<VStack gap="page">
			{(["narrow", "content"] as const).map((width) => (
				<Container key={width} containerQuery width={width}>
					<div className="flex flex-col gap-3 @md:flex-row @md:gap-6">
						<div className="flex-1 rounded-lg border border-border bg-surface p-4 text-sm">
							{width} 컨테이너 — 좁을 때 세로, @md(28rem) 이상에서 가로로 전환
						</div>
						<div className="flex-1 rounded-lg border border-border bg-surface p-4 text-sm">
							@container 기준 자식
						</div>
					</div>
				</Container>
			))}
		</VStack>
	),
	parameters: {
		layout: "padded",
		docs: {
			description: {
				story:
					"containerQuery를 켜면 자식이 뷰포트가 아니라 이 컨테이너의 폭을 기준으로 반응합니다.",
			},
		},
	},
};
