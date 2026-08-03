import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../input/Button/Button";
import { PolicyEditScreen } from "./PolicyEditScreen";

const abilities = [
	{
		id: "ability-user-read",
		label: "사용자 조회",
		description: "사용자 목록과 상세 정보를 조회합니다.",
	},
	{
		id: "ability-user-write",
		label: "사용자 변경",
		description: "사용자 정보를 생성하거나 수정합니다.",
	},
	{
		id: "ability-policy-read",
		label: "정책 조회",
		description: "권한 정책을 조회합니다.",
	},
];

const defaultState = {
	name: "USER_MANAGER_POLICY",
	displayName: "사용자 관리자 정책",
	description: "사용자 관리 화면을 사용할 수 있는 정책입니다.",
	abilityIds: ["ability-user-read", "ability-user-write"],
};

const meta = {
	title: "screen/PolicyEditScreen",
	component: PolicyEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "Policy 수정",
		description: "route가 전달한 정책과 Ability 목록으로 Policy를 편집합니다.",
		state: defaultState,
		abilities,
		actions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof PolicyEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "Policy 등록",
		description: "새로운 Policy를 등록합니다.",
		state: {
			...defaultState,
			name: "",
			displayName: "",
			description: "",
			abilityIds: [],
		},
	},
};

export const Detail: Story = {
	args: {
		title: "Policy 상세",
		description: "Policy 정보를 읽기 전용으로 확인합니다.",
		readOnly: true,
		actions: <Button variant="flat">수정</Button>,
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
