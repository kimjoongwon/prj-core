import type { Meta, StoryObj } from "@storybook/react";
import type { RoleDetailScreenProps } from "./RoleDetailScreen";
import { RoleDetailScreen } from "./RoleDetailScreen";

const noop = (..._args: unknown[]) => undefined;

const defaultArgs: RoleDetailScreenProps = {
	role: {
		id: "role-operations-admin",
		name: "operations-admin",
		displayName: "운영 관리자",
		description: "문의/사용자/감사 화면 운영을 담당하는 관리자 역할입니다.",
		isSystem: false,
		removedAt: null,
		createdAt: "2026-04-14T09:00:00.000Z",
		updatedAt: "2026-04-18T11:30:00.000Z",
	},
	policies: [
		{
			id: "policy-user-operator",
			name: "user_operator",
			displayName: "사용자 운영 정책",
			description: "사용자 조회와 프로필 수정 Ability를 묶은 정책입니다.",
			isSystem: true,
			abilityCount: 2,
		},
		{
			id: "policy-audit-reader",
			name: "audit_reader",
			displayName: "감사 로그 조회 정책",
			description: "감사 로그 조회 Ability를 묶은 정책입니다.",
			isSystem: false,
			abilityCount: 1,
		},
	],
	assignedPolicyIds: ["policy-user-operator"],
	selectedPolicyIds: ["policy-user-operator"],
	policyAssignments: [
		{
			policyId: "policy-user-operator",
			isActive: true,
			priority: 0,
		},
	],
	selectedPolicyAssignments: [
		{
			policyId: "policy-user-operator",
			isActive: true,
			priority: 0,
		},
	],
	isLoading: false,
	isLoadingPolicies: false,
	isEditingPolicies: false,
	hasChanges: false,
	isDeleteModalOpen: false,
	isSavePoliciesModalOpen: false,
	isDeleting: false,
	isSavingPolicies: false,
	onClickBackButton: noop,
	onClickEditButton: noop,
	onClickOpenDeleteModal: noop,
	onCloseDeleteModal: noop,
	onClickDeleteConfirm: noop,
	onClickEditPoliciesButton: noop,
	onClickCancelEditPoliciesButton: noop,
	onTogglePolicy: noop,
	onChangePolicyAssignmentActive: noop,
	onChangePolicyAssignmentPriority: noop,
	onClickOpenSavePoliciesModal: noop,
	onClickConfirmSavePoliciesButton: noop,
};

const meta = {
	title: "screen/RoleDetailScreen",
	component: RoleDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs,
} satisfies Meta<typeof RoleDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: {
		...defaultArgs,
		isLoading: true,
	},
};

export const Busy: Story = {
	args: {
		...defaultArgs,
		isEditingPolicies: true,
		hasChanges: true,
		isSavePoliciesModalOpen: true,
		isSavingPolicies: true,
		selectedPolicyIds: ["policy-user-operator", "policy-audit-reader"],
		selectedPolicyAssignments: [
			{
				policyId: "policy-user-operator",
				isActive: true,
				priority: 0,
			},
			{
				policyId: "policy-audit-reader",
				isActive: true,
				priority: 5,
			},
		],
	},
};

export const EmptyState: Story = {
	args: {
		...defaultArgs,
		role: undefined,
		policies: [],
		assignedPolicyIds: [],
		selectedPolicyIds: [],
		policyAssignments: [],
		selectedPolicyAssignments: [],
		hasChanges: false,
	},
};
