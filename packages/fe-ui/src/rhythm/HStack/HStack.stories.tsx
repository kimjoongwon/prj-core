import type { Meta, StoryObj } from "@storybook/react";
import { VStack } from "../VStack/VStack";
import { HStack } from "./HStack";

const meta = {
	title: "rhythm/HStack",
	component: HStack,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"자식 요소들을 기본 간격으로 가로 배치하는 수평 스택 컴포넌트입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		alignItems: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
			description: "아이템들의 세로 정렬",
		},
		justifyContent: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
			description: "아이템들의 가로 배치",
		},
		gap: {
			control: "select",
			options: [
				"flush",
				"dense",
				"inline",
				"block",
				"section",
				"page",
				"roomy",
			],
			description:
				"가로 간격 (flush=0, dense=4, inline=8, block=12, section=16, page=24, roomy=32px)",
			defaultValue: "inline",
		},
		fullWidth: {
			control: "boolean",
			description: "스택이 전체 너비를 차지할지 여부",
			defaultValue: false,
		},
		className: {
			control: "text",
			description: "추가로 적용할 CSS 클래스",
		},
	},
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

const 샘플아이템 = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div className={`rounded border bg-blue-200 p-2 ${className}`}>
		{children}
	</div>
);

export const 기본: Story = {
	args: {
		children: (
			<>
				<샘플아이템>아이템 1</샘플아이템>
				<샘플아이템>아이템 2</샘플아이템>
				<샘플아이템>아이템 3</샘플아이템>
			</>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "기본 수평 스택입니다.",
			},
		},
	},
};

export const 간격_스케일: Story = {
	args: {},
	render: () => (
		<VStack gap="page" className="w-full max-w-md">
			{(
				[
					["flush", "flush — 붙어야 하는 조합 (0px)"],
					["dense", "dense — metadata·보조 label 묶음 (4px)"],
					["inline", "inline — 버튼 행·chip (8px)"],
					["block", "block — 제목-본문 짧은 묶음 (12px)"],
					["section", "section — 섹션 내부 기본 흐름 (16px)"],
					["page", "page — 페이지 주요 블록 사이 (24px)"],
					["roomy", "roomy — empty·auth·intro 여유 (32px)"],
				] as const
			).map(([gap, label]) => (
				<div key={gap}>
					<h4 className="mb-2 font-semibold text-sm">{label}</h4>
					<HStack gap={gap} className="border border-gray-300 p-2">
						<샘플아이템>항목 A</샘플아이템>
						<샘플아이템>항목 B</샘플아이템>
					</HStack>
				</div>
			))}
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story: "시맨틱 간격 체계. 규칙은 DESIGN.md를 참고하세요.",
			},
		},
	},
};

export const 아이템_정렬: Story = {
	args: {
		alignItems: "center",
		children: (
			<>
				<샘플아이템>짧음</샘플아이템>
				<샘플아이템>중간</샘플아이템>
				<샘플아이템>김</샘플아이템>
			</>
		),
		className: "border border-gray-300 p-2 h-20",
	},
	parameters: {
		docs: {
			description: {
				story: "아이템들의 다양한 세로 정렬 옵션들입니다.",
			},
		},
	},
};

export const 콘텐츠_배치: Story = {
	args: {
		justifyContent: "center",
		fullWidth: true,
		children: (
			<>
				<샘플아이템>가</샘플아이템>
				<샘플아이템>나</샘플아이템>
				<샘플아이템>다</샘플아이템>
			</>
		),
		className: "border border-gray-300 p-2",
	},
	parameters: {
		docs: {
			description: {
				story: "아이템들의 다양한 가로 배치 옵션들입니다.",
			},
		},
	},
};

export const 내비게이션_예시: Story = {
	args: {
		justifyContent: "between",
		alignItems: "center",
		fullWidth: true,
		children: (
			<>
				<div className="font-bold text-blue-600 text-xl">로고</div>
				<div className="text-gray-600 text-sm">내비게이션 메뉴</div>
			</>
		),
		className: "p-4 bg-white border-b",
	},
	parameters: {
		docs: {
			description: {
				story:
					"반응형 헤더 디자인을 위해 HStack을 사용한 내비게이션 레이아웃 예시입니다.",
			},
		},
	},
};

export const 카드_액션_예시: Story = {
	args: {
		justifyContent: "end",
		children: (
			<>
				<div className="rounded border border-gray-300 px-4 py-2">취소</div>
				<div className="rounded bg-blue-500 px-4 py-2 text-white">
					장바구니 추가
				</div>
			</>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "HStack을 사용한 액션 버튼이 있는 카드 레이아웃 예시입니다.",
			},
		},
	},
};

export const 플레이그라운드: Story = {
	args: {
		alignItems: "center",
		justifyContent: "start",
		fullWidth: false,
		children: (
			<>
				<샘플아이템>아이템 1</샘플아이템>
				<샘플아이템>아이템 2</샘플아이템>
				<샘플아이템>아이템 3</샘플아이템>
			</>
		),
		className: "border border-gray-300 p-4",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 HStack 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
