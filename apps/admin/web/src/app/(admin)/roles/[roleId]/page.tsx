"use client";

import {
	type PolicyResponseDto,
	useGetPolicies,
} from "@cocrepo/api/core/policies";
import {
	getGetRolePoliciesQueryKey,
	type PolicyAssignmentResponseDto,
	useGetRolePolicies,
	useSyncRolePolicies,
} from "@cocrepo/api/core/policy-assignments";
import { useDeleteRole, useGetRoleById } from "@cocrepo/api/core/roles";
import {
	RoleDetailPage,
	type RoleDetailPagePolicy,
	type RoleDetailPagePolicyAssignment,
	type RoleDetailPageRole,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const AdminRolesRoleDetailRoute = observer(() => {
	const { roleId } = useParams<{ roleId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isSavePoliciesModalOpen, setIsSavePoliciesModalOpen] = useState(false);
	const [isEditingPolicies, setIsEditingPolicies] = useState(false);
	const [selectedPolicyAssignments, setSelectedPolicyAssignments] = useState<
		RoleDetailPagePolicyAssignment[]
	>([]);
	const [hasChanges, setHasChanges] = useState(false);
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data as RoleDetailPageRole | undefined;
	const { data: policiesResponse, isLoading: isLoadingPolicies } =
		useGetPolicies();
	const { data: rolePoliciesResponse, isLoading: isLoadingRolePolicies } =
		useGetRolePolicies(roleId);
	const policies = (policiesResponse?.data ?? []).map(mapPolicy);
	const policyAssignments = (rolePoliciesResponse?.data ?? []).map(
		mapPolicyAssignment,
	);
	const activePolicyAssignments = isEditingPolicies
		? selectedPolicyAssignments
		: policyAssignments;
	const assignedPolicyIds = policyAssignments.map(
		(assignment) => assignment.policyId,
	);
	const activeSelectedPolicyIds = activePolicyAssignments.map(
		(assignment) => assignment.policyId,
	);
	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				setIsDeleteModalOpen(false);
				toast.success("역할 삭제 성공", {
					description: "역할이 삭제되었습니다.",
				});
				router.push("/roles" as Route);
			},
		},
	});
	const { mutate: syncRolePolicies, isPending: isSavingPolicies } =
		useSyncRolePolicies({
			mutation: {
				onSuccess: () => {
					setIsSavePoliciesModalOpen(false);
					setIsEditingPolicies(false);
					setHasChanges(false);
					queryClient.invalidateQueries({
						queryKey: getGetRolePoliciesQueryKey(roleId),
					});
					toast.success("정책 할당 저장", {
						description: "역할 정책 할당이 저장되었습니다.",
					});
				},
			},
		});

	const onClickBackButton = () => {
		router.push("/roles" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/roles/${roleId}/edit` as Route);
	};

	const onClickEditPoliciesButton = () => {
		setSelectedPolicyAssignments(policyAssignments);
		setIsEditingPolicies(true);
		setHasChanges(false);
	};

	const onClickCancelEditPoliciesButton = () => {
		setIsSavePoliciesModalOpen(false);
		setIsEditingPolicies(false);
		setHasChanges(false);
	};

	const onTogglePolicy = (policyId: string) => {
		setSelectedPolicyAssignments((current) => {
			const exists = current.some(
				(assignment) => assignment.policyId === policyId,
			);
			if (exists) {
				return current.filter((assignment) => assignment.policyId !== policyId);
			}
			return [...current, { policyId, isActive: true, priority: 0 }];
		});
		setHasChanges(true);
	};

	const onChangePolicyAssignmentActive = (
		policyId: string,
		isActive: boolean,
	) => {
		setSelectedPolicyAssignments((current) =>
			current.map((assignment) =>
				assignment.policyId === policyId
					? { ...assignment, isActive }
					: assignment,
			),
		);
		setHasChanges(true);
	};

	const onChangePolicyAssignmentPriority = (
		policyId: string,
		priority: string,
	) => {
		setSelectedPolicyAssignments((current) =>
			current.map((assignment) =>
				assignment.policyId === policyId
					? { ...assignment, priority: Number(priority || 0) }
					: assignment,
			),
		);
		setHasChanges(true);
	};

	const onClickConfirmSavePoliciesButton = () => {
		syncRolePolicies({
			roleId,
			data: { rolePolicies: selectedPolicyAssignments },
		});
	};

	return (
		<RoleDetailPage
			role={role}
			policies={policies}
			assignedPolicyIds={assignedPolicyIds}
			selectedPolicyIds={activeSelectedPolicyIds}
			policyAssignments={policyAssignments}
			selectedPolicyAssignments={activePolicyAssignments}
			isLoading={isLoading}
			isLoadingPolicies={isLoadingPolicies || isLoadingRolePolicies}
			isEditingPolicies={isEditingPolicies}
			hasChanges={hasChanges}
			isDeleteModalOpen={isDeleteModalOpen}
			isSavePoliciesModalOpen={isSavePoliciesModalOpen}
			isDeleting={isDeleting}
			isSavingPolicies={isSavingPolicies}
			onClickBackButton={onClickBackButton}
			onClickEditButton={onClickEditButton}
			onClickOpenDeleteModal={() => {
				setIsDeleteModalOpen(true);
			}}
			onCloseDeleteModal={() => {
				setIsDeleteModalOpen(false);
			}}
			onClickDeleteConfirm={() => {
				deleteRole({ id: roleId });
			}}
			onClickEditPoliciesButton={onClickEditPoliciesButton}
			onClickCancelEditPoliciesButton={onClickCancelEditPoliciesButton}
			onTogglePolicy={onTogglePolicy}
			onChangePolicyAssignmentActive={onChangePolicyAssignmentActive}
			onChangePolicyAssignmentPriority={onChangePolicyAssignmentPriority}
			onClickOpenSavePoliciesModal={() => {
				setIsSavePoliciesModalOpen(true);
			}}
			onClickConfirmSavePoliciesButton={onClickConfirmSavePoliciesButton}
		/>
	);
});

function mapPolicy(policy: PolicyResponseDto): RoleDetailPagePolicy {
	return {
		id: policy.id,
		name: policy.name,
		displayName: policy.displayName,
		description: policy.description,
		isSystem: policy.isSystem,
		abilityCount: policy.policyAbilities?.length ?? 0,
	};
}

function mapPolicyAssignment(
	assignment: PolicyAssignmentResponseDto,
): RoleDetailPagePolicyAssignment {
	return {
		policyId: assignment.policyId,
		isActive: assignment.isActive,
		priority: assignment.priority,
	};
}

export default AdminRolesRoleDetailRoute;
