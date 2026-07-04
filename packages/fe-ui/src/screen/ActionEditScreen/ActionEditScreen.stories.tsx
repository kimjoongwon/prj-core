import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { ActionEditScreen } from "./ActionEditScreen";

const defaultState = {
	name: "read:masked:email",
	description: "이메일 마스킹 값을 조회할 수 있습니다.",
	displayName: "이메일 마스킹 읽기",
	group: "visibility",
	order: 10,
	errors: {},
};

const meta = {
	title: "screen/ActionEditScreen",
	component: ActionEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "Action 수정",
		description: "route가 전달한 액션과 상태로 Action을 편집합니다.",
		state: defaultState,
		actions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof ActionEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "Action 등록",
		description: "새로운 Action을 등록합니다.",
		state: { ...defaultState, name: "", displayName: "", description: "" },
	},
};

export const Detail: Story = {
	args: {
		title: "Action 상세",
		description: "Action 정보를 읽기 전용으로 확인합니다.",
		readOnly: true,
		actions: <Button variant="flat">수정</Button>,
	},
};

export const Loading: Story = {
	args: { isLoading: true },
};
