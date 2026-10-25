import type { Meta, StoryObj } from "@storybook/react";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { Checkbox } from "./Checkbox";
import { Checkbox as BoundCheckbox } from "./index";

const meta = {
	title: "input/Checkbox",
	component: Checkbox,
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
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const createCheckboxStoryState = () =>
	makeAutoObservable(
		{ accepted: false },
		{},
		{ autoBind: true, name: "CheckboxStoryState" },
	);

export const 기본: Story = {
	args: {
		children: "체크박스",
	},
};

export const 선택됨: Story = {
	args: {
		children: "선택된 체크박스",
		defaultSelected: true,
	},
};

export const 비활성화: Story = {
	args: {
		children: "비활성화된 체크박스",
		isDisabled: true,
	},
};

export const 필수입력: Story = {
	args: {
		children: "필수 체크박스",
		isRequired: true,
	},
};

export const 오류상태: Story = {
	args: {
		children: "오류 상태 체크박스",
		isInvalid: true,
	},
};

export const 다양한상태: Story = {
	args: {
		children: "상태 예시",
	},
	render: () => (
		<div className="flex flex-col gap-4">
			<Checkbox>일반 상태</Checkbox>
			<Checkbox defaultSelected>선택됨</Checkbox>
			<Checkbox isDisabled>비활성화</Checkbox>
			<Checkbox isRequired>필수 입력</Checkbox>
			<Checkbox isInvalid>오류 상태</Checkbox>
		</div>
	),
};

export const ExternalState: Story = {
	args: { children: "외부 state 체크박스" },
	render: () => {
		const state = useLocalObservable(createCheckboxStoryState);
		return (
			<BoundCheckbox state={state} path="accepted">
				외부 state 체크박스
			</BoundCheckbox>
		);
	},
};
