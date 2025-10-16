import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

type CheckboxState = {
	checkbox?: boolean;
	default?: boolean;
	primary?: boolean;
	secondary?: boolean;
	success?: boolean;
	warning?: boolean;
	danger?: boolean;
	small?: boolean;
	medium?: boolean;
	large?: boolean;
	normal?: boolean;
	selected?: boolean;
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
};

const meta = {
	title: "inputs/Checkbox",
	component: Checkbox<CheckboxState>,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		children: {
			control: "text",
			description: "체크박스 라벨 텍스트",
		},
		isDisabled: {
			control: "boolean",
			description: "체크박스 비활성화 상태",
		},
		isRequired: {
			control: "boolean",
			description: "필수 입력 여부",
		},
		isInvalid: {
			control: "boolean",
			description: "유효성 검사 실패 상태",
		},
		color: {
			control: "select",
			options: [
				"default",
				"primary",
				"secondary",
				"success",
				"warning",
				"danger",
			],
			description: "체크박스 색상 테마",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
			description: "체크박스 크기",
		},
		radius: {
			control: "select",
			options: ["none", "sm", "md", "lg", "full"],
			description: "체크박스 모서리 둥근 정도",
		},
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	args: {
		children: "체크박스",
		state: { checkbox: false },
		path: "checkbox",
	},
};

export const 선택됨: Story = {
	args: {
		children: "선택된 체크박스",
		state: { checkbox: true },
		path: "checkbox",
	},
};

export const 비활성화: Story = {
	args: {
		children: "비활성화된 체크박스",
		isDisabled: true,
		state: { checkbox: false },
		path: "checkbox",
	},
};

export const 필수입력: Story = {
	args: {
		children: "필수 체크박스",
		isRequired: true,
		state: { checkbox: false },
		path: "checkbox",
	},
};

export const 오류상태: Story = {
	args: {
		children: "오류 상태 체크박스",
		isInvalid: true,
		state: { checkbox: false },
		path: "checkbox",
	},
};

export const 다양한색상: Story = {
	args: {
		path: "default",
		state: { default: false },
		children: "색상 예시",
	},
	render: () => (
		<div className="flex flex-col gap-4">
			<Checkbox color="default" state={{ default: false }} path="default">
				기본
			</Checkbox>
			<Checkbox color="primary" state={{ primary: false }} path="primary">
				주요
			</Checkbox>
			<Checkbox color="secondary" state={{ secondary: false }} path="secondary">
				보조
			</Checkbox>
			<Checkbox color="success" state={{ success: false }} path="success">
				성공
			</Checkbox>
			<Checkbox color="warning" state={{ warning: false }} path="warning">
				경고
			</Checkbox>
			<Checkbox color="danger" state={{ danger: false }} path="danger">
				위험
			</Checkbox>
		</div>
	),
};

export const 다양한크기: Story = {
	args: {
		path: "small",
		state: { small: false },
		children: "크기 예시",
	},
	render: () => (
		<div className="flex flex-col gap-4">
			<Checkbox size="sm" state={{ small: false }} path="small">
				작은 크기
			</Checkbox>
			<Checkbox size="md" state={{ medium: false }} path="medium">
				보통 크기
			</Checkbox>
			<Checkbox size="lg" state={{ large: false }} path="large">
				큰 크기
			</Checkbox>
		</div>
	),
};

export const 다양한상태: Story = {
	args: {
		path: "normal",
		state: { normal: false },
		children: "상태 예시",
	},
	render: () => (
		<div className="flex flex-col gap-4">
			<Checkbox state={{ normal: false }} path="normal">
				일반 상태
			</Checkbox>
			<Checkbox state={{ selected: true }} path="selected">
				선택됨
			</Checkbox>
			<Checkbox isDisabled state={{ disabled: false }} path="disabled">
				비활성화
			</Checkbox>
			<Checkbox isRequired state={{ required: false }} path="required">
				필수 입력
			</Checkbox>
			<Checkbox isInvalid state={{ invalid: false }} path="invalid">
				오류 상태
			</Checkbox>
		</div>
	),
};
