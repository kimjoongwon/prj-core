import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { AbilityEditScreen } from "./AbilityEditScreen";

const subjects = [
	{ id: "subject-user", label: "사용자" },
	{ id: "subject-policy", label: "정책" },
];

const actions = [
	{ id: "action-read", label: "읽기" },
	{ id: "action-write", label: "쓰기" },
];

const defaultState = {
	name: "manage_users",
	description: "사용자 관리를 수행할 수 있습니다.",
	subjectId: "subject-user",
	actionId: "action-write",
	fields: "name, email",
	conditions: "",
	inverted: false,
	reason: "",
};

const meta = {
	title: "screen/AbilityEditScreen",
	component: AbilityEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "Ability 수정",
		description: "route가 전달한 Ability state로 CASL 권한을 편집합니다.",
		state: defaultState,
		subjects,
		actions,
		pageActions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof AbilityEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "Ability 등록",
		description: "새로운 Ability를 등록합니다.",
		state: {
			...defaultState,
			name: "",
			description: "",
			subjectId: "",
			actionId: "",
			fields: "",
		},
	},
};

export const Detail: Story = {
	args: {
		title: "Ability 상세",
		description: "Ability 정보를 읽기 전용으로 확인합니다.",
		readOnly: true,
		pageActions: <Button variant="flat">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
