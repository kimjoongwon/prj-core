"use client";

import {
	type PolicyResponseDto,
	useGetPolicies,
} from "@cocrepo/api/core/policies";
import {
	getGetUserPoliciesQueryKey,
	type PolicyAssignmentResponseDto,
	useGetUserPolicies,
	useSyncUserPolicies,
} from "@cocrepo/api/core/policy-assignments";
import { useGetUserById } from "@cocrepo/api/core/users";
import {
	UserDetailPage,
	type UserDetailPagePolicy,
	type UserDetailPagePolicyAssignment,
	type UserDetailPageUser,
} from "@cocrepo/ui";
import { addToast } from "@cocrepo/ui/heroui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default observer(function UserDetailPageRoute() {
	const { userId } = useParams<{ userId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isEditingPolicies, setIsEditingPolicies] = useState(false);
	const [selectedPolicyAssignments, setSelectedPolicyAssignments] = useState<
		UserDetailPagePolicyAssignment[]
	>([]);
	const [hasChanges, setHasChanges] = useState(false);
	const { data: userResponse, isLoading } = useGetUserById(userId);
	const user = userResponse?.data as UserDetailPageUser | undefined;
	const { data: policiesResponse, isLoading: isLoadingPolicies } =
		useGetPolicies();
	const { data: userPoliciesResponse, isLoading: isLoadingUserPolicies } =
		useGetUserPolicies(userId);
	const policies = (policiesResponse?.data ?? []).map(mapPolicy);
	const policyAssignments = (userPoliciesResponse?.data ?? []).map(
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
	const { mutate: syncUserPolicies, isPending: isSavingPolicies } =
		useSyncUserPolicies({
			mutation: {
				onSuccess: () => {
					setIsEditingPolicies(false);
					setHasChanges(false);
					queryClient.invalidateQueries({
						queryKey: getGetUserPoliciesQueryKey(userId),
					});
					addToast({
						title: "정책 할당 저장",
						description: "사용자 정책 할당이 저장되었습니다.",
						color: "success",
					});
				},
			},
		});

	const onClickBackButton = () => {
		router.push("/users" as Route);
	};

	const onClickEditPoliciesButton = () => {
		setSelectedPolicyAssignments(policyAssignments);
		setIsEditingPolicies(true);
		setHasChanges(false);
	};

	const onClickCancelEditPoliciesButton = () => {
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
			return [...current, { policyId, isActive: true, priority: 10 }];
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

	const onClickSavePoliciesButton = () => {
		syncUserPolicies({
			userId,
			data: { userPolicies: selectedPolicyAssignments },
		});
	};

	return (
		<UserDetailPage
			userId={userId}
			user={user}
			policies={policies}
			assignedPolicyIds={assignedPolicyIds}
			selectedPolicyIds={activeSelectedPolicyIds}
			policyAssignments={policyAssignments}
			selectedPolicyAssignments={activePolicyAssignments}
			isLoading={isLoading}
			isLoadingPolicies={isLoadingPolicies || isLoadingUserPolicies}
			isEditingPolicies={isEditingPolicies}
			hasChanges={hasChanges}
			isSavingPolicies={isSavingPolicies}
			onClickBackButton={onClickBackButton}
			onClickEditPoliciesButton={onClickEditPoliciesButton}
			onClickCancelEditPoliciesButton={onClickCancelEditPoliciesButton}
			onTogglePolicy={onTogglePolicy}
			onChangePolicyAssignmentActive={onChangePolicyAssignmentActive}
			onChangePolicyAssignmentPriority={onChangePolicyAssignmentPriority}
			onClickSavePoliciesButton={onClickSavePoliciesButton}
		/>
	);
});

function mapPolicy(policy: PolicyResponseDto): UserDetailPagePolicy {
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
): UserDetailPagePolicyAssignment {
	return {
		policyId: assignment.policyId,
		isActive: assignment.isActive,
		priority: assignment.priority,
	};
}
