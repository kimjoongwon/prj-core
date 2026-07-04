import type { Meta, StoryObj } from "@storybook/react";
import { RolePolicyAssignmentForm } from "../../form/RolePolicyAssignmentForm";
import { Button } from "../../input/Button/Button";
import { RoleEditScreen } from "./RoleEditScreen";

const policies = [
	{
		id: "policy-user-operator",
		name: "USER_OPERATOR_POLICY",
		displayName: "사용자 운영 정책",
		description: "사용자 조회와 프로필 수정 Ability를 묶은 정책입니다.",
		isSystem: true,
		abilityCount: 2,
	},
	{
		id: "policy-audit-reader",
		name: "AUDIT_READER_POLICY",
		displayName: "감사 로그 조회 정책",
		description: "감사 로그 조회 Ability를 묶은 정책입니다.",
		isSystem: false,
		abilityCount: 1,
	},
];

const defaultState = {
	name: "OPERATIONS_ADMIN",
	displayName: "운영 관리자",
	description: "문의/사용자/감사 화면 운영을 담당하는 관리자 역할입니다.",
	isSystem: false,
	errors: {},
};

const policyAssignmentState = {
	policyAssignments: [
		{
			policyId: "policy-user-operator",
			isActive: true,
			priority: 0,
		},
	],
};

const meta = {
	title: "screen/RoleEditScreen",
	component: RoleEditScreen,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "Role 수정",
		description: "route가 전달한 역할 상태로 Role을 편집합니다.",
		state: defaultState,
		actions: <Button color="primary">저장</Button>,
	},
} satisfies Meta<typeof RoleEditScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Edit: Story = {};

export const Create: Story = {
	args: {
		title: "Role 등록",
		description: "새로운 Role을 등록합니다.",
		state: {
			...defaultState,
			name: "",
			displayName: "",
			description: "",
		},
	},
};

export const Detail: Story = {
	args: {
		title: "Role 상세",
		description: "Role 정보를 읽기 전용으로 확인합니다.",
		readOnly: true,
		actions: <Button variant="flat">수정</Button>,
		children: (
			<RolePolicyAssignmentForm
				state={policyAssignmentState}
				policies={policies}
				readOnly
			/>
		),
	},
};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};
