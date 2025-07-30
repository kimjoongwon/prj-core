import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";

const meta = {
	title: "ui/Container",
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
		className: "p-4 bg-blue-100 rounded-lg border-2 border-blue-300",
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
		className: "gap-4 p-4 bg-gray-50 rounded-lg",
		children: (
			<>
				<div className="p-2 bg-blue-200 rounded">아이템 1</div>
				<div className="p-2 bg-green-200 rounded">아이템 2</div>
				<div className="p-2 bg-yellow-200 rounded">아이템 3</div>
			</>
		),
	},
	render: (args) => <Container {...args} />,
	parameters: {
		docs: {
			description: {
				story:
					"여러 자식 요소가 있는 컴테이너입니다.",
			},
		},
	},
};

export const 반응형: Story = {
	args: {
		className: "w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg",
		children: (
			<>
				<h2 className="text-xl font-bold mb-4">카드 제목</h2>
				<p className="text-gray-600 mb-4">
					다양한 화면 크기에 잘 맞는 반응형 컴테이너의 예시입니다.
				</p>
				<button
					type="button"
					className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					액션 버튼
				</button>
			</>
		),
	},
	render: (args) => <Container {...args} />,
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
		className: "gap-4 p-6 max-w-sm bg-white border rounded-lg shadow",
		children: (
			<>
				<h3 className="text-lg font-semibold">연락처 폼</h3>
				<input
					type="text"
					placeholder="이름"
					className="w-full p-2 border rounded"
				/>
				<input
					type="email"
					placeholder="이메일"
					className="w-full p-2 border rounded"
				/>
				<textarea
					placeholder="메시지"
					rows={3}
					className="w-full p-2 border rounded resize-none"
				/>
				<button
					type="button"
					className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
				>
					메시지 보내기
				</button>
			</>
		),
	},
	render: (args) => <Container {...args} />,
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
		className: "p-4 border-2 border-dashed border-gray-300",
	},
	parameters: {
		docs: {
			description: {
				story: "다양한 컴테이너 설정을 테스트할 수 있는 플레이그라운드입니다.",
			},
		},
	},
};
