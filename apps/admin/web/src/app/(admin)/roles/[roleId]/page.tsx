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
import {
	type RoleDto,
	useDeleteRole,
	useGetRoleById,
} from "@cocrepo/api/core/roles";
import {
	Button,
	PageTitleBar,
	RoleEditScreen,
	type RoleFormState,
	type RolePolicyAssignment,
	RolePolicyAssignmentForm,
	type RolePolicyAssignmentFormState,
	type RolePolicyOption,
	Section,
} from "@cocrepo/ui";
import { Modal, toast, useOverlayState } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Save, ShieldCheck, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

const AdminRolesRoleDetailRoute = observer(() => {
	const { roleId } = useParams<{ roleId: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const deleteModal = useOverlayState();
	const savePoliciesModal = useOverlayState();
	const [isEditingPolicies, setIsEditingPolicies] = useState(false);
	const policyAssignmentState =
		useLocalObservable<RolePolicyAssignmentFormState>(() => ({
			policyAssignments: [],
		}));
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data as RoleDto | undefined;
	const { data: policiesResponse, isLoading: isLoadingPolicies } =
		useGetPolicies();
	const { data: rolePoliciesResponse, isLoading: isLoadingRolePolicies } =
		useGetRolePolicies(roleId);
	const policies = (policiesResponse?.data ?? []).map(mapPolicy);
	const policyAssignments = (rolePoliciesResponse?.data ?? []).map(
		mapPolicyAssignment,
	);
	const policyAssignmentsKey = serializePolicyAssignments(policyAssignments);
	const hasPolicyChanges =
		isEditingPolicies &&
		!isEqualPolicyAssignments(
			policyAssignmentState.policyAssignments,
			policyAssignments,
		);
	const addedPolicyCount = policyAssignmentState.policyAssignments.filter(
		(assignment) =>
			!policyAssignments.some(
				(baseline) => baseline.policyId === assignment.policyId,
			),
	).length;
	const removedPolicyCount = policyAssignments.filter(
		(assignment) =>
			!policyAssignmentState.policyAssignments.some(
				(current) => current.policyId === assignment.policyId,
			),
	).length;
	const roleFormState = role ? mapRoleFormState(role) : undefined;

	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				deleteModal.close();
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
					savePoliciesModal.close();
					setIsEditingPolicies(false);
					queryClient.invalidateQueries({
						queryKey: getGetRolePoliciesQueryKey(roleId),
					});
					toast.success("정책 할당 저장", {
						description: "역할 정책 할당이 저장되었습니다.",
					});
				},
			},
		});

	useEffect(() => {
		if (isEditingPolicies) {
			return;
		}
		policyAssignmentState.policyAssignments =
			clonePolicyAssignments(policyAssignments);
	}, [isEditingPolicies, policyAssignmentsKey, policyAssignmentState]);

	const startPolicyEdit = () => {
		policyAssignmentState.policyAssignments =
			clonePolicyAssignments(policyAssignments);
		setIsEditingPolicies(true);
	};

	const cancelPolicyEdit = () => {
		savePoliciesModal.close();
		policyAssignmentState.policyAssignments =
			clonePolicyAssignments(policyAssignments);
		setIsEditingPolicies(false);
	};

	const savePolicyAssignments = () => {
		syncRolePolicies({
			roleId,
			data: {
				rolePolicies: policyAssignmentState.policyAssignments.map(
					(assignment) => ({
						policyId: assignment.policyId,
						isActive: assignment.isActive,
						priority: assignment.priority,
					}),
				),
			},
		});
	};

	return (
		<>
			<RoleEditScreen
				title="Role 상세"
				description={
					role
						? `${role.displayName || role.name} Role의 상세 정보입니다.`
						: "Role을 찾을 수 없습니다."
				}
				state={roleFormState}
				readOnly
				isLoading={isLoading}
				notFound={!isLoading && !role}
				notFoundAction={
					<Button
						variant="flat"
						onPress={() => {
							router.push("/roles" as Route);
						}}
					>
						목록으로
					</Button>
				}
				actions={
					<div className="flex flex-wrap gap-2">
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={() => {
								router.push("/roles" as Route);
							}}
						>
							목록으로
						</Button>
						{role && !role.isSystem ? (
							<>
								<Button
									variant="flat"
									color="primary"
									startContent={<Edit className="h-4 w-4" />}
									onPress={() => {
										router.push(`/roles/${roleId}/edit` as Route);
									}}
								>
									수정
								</Button>
								<Button
									variant="flat"
									color="danger"
									startContent={<Trash2 className="h-4 w-4" />}
									onPress={deleteModal.open}
								>
									삭제
								</Button>
							</>
						) : null}
					</div>
				}
			>
				{role ? (
					<SectionLike title="추가 정보">
						<dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							<Info label="Role ID" value={role.id} />
							<Info
								label="상태"
								value={role.removedAt ? "삭제됨" : "사용 중"}
							/>
							<Info label="생성일" value={formatDate(role.createdAt)} />
							<Info label="수정일" value={formatDate(role.updatedAt)} />
						</dl>
					</SectionLike>
				) : null}
				<Section>
					<Section.Header>
						<PageTitleBar
							level={2}
							title="정책 할당"
							description="현재 Role에 연결된 Policy assignment를 관리합니다."
							actions={
								isEditingPolicies ? (
									<div className="flex gap-2">
										<Button variant="flat" onPress={cancelPolicyEdit}>
											취소
										</Button>
										<Button
											color="primary"
											startContent={<Save className="h-4 w-4" />}
											isDisabled={!hasPolicyChanges}
											isLoading={isSavingPolicies}
											onPress={savePoliciesModal.open}
										>
											저장
										</Button>
									</div>
								) : (
									<Button
										color="primary"
										variant="flat"
										startContent={<ShieldCheck className="h-4 w-4" />}
										isDisabled={!role || role.isSystem}
										onPress={startPolicyEdit}
									>
										정책 편집
									</Button>
								)
							}
						/>
					</Section.Header>
					<Section.Body>
						<RolePolicyAssignmentForm
							state={policyAssignmentState}
							policies={policies}
							baselinePolicyAssignments={policyAssignments}
							readOnly={!isEditingPolicies}
							isLoading={isLoadingPolicies || isLoadingRolePolicies}
						/>
					</Section.Body>
				</Section>
			</RoleEditScreen>
			{role ? (
				<Modal state={deleteModal}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>Role 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{role.displayName || role.name}</strong> Role을
										삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										이 작업은 되돌릴 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={deleteModal.close}
										isDisabled={isDeleting}
									>
										취소
									</Button>
									<Button
										color="danger"
										onPress={() => {
											deleteRole({ id: roleId });
										}}
										isLoading={isDeleting}
									>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			) : null}
			<Modal state={savePoliciesModal}>
				<Modal.Backdrop>
					<Modal.Container>
						<Modal.Dialog>
							<Modal.Header>정책 할당 저장</Modal.Header>
							<Modal.Body>
								추가 {addedPolicyCount}개, 해제 {removedPolicyCount}개 변경을
								저장합니다.
							</Modal.Body>
							<Modal.Footer>
								<Button variant="flat" onPress={savePoliciesModal.close}>
									취소
								</Button>
								<Button
									color="primary"
									isLoading={isSavingPolicies}
									onPress={savePolicyAssignments}
								>
									저장
								</Button>
							</Modal.Footer>
						</Modal.Dialog>
					</Modal.Container>
				</Modal.Backdrop>
			</Modal>
		</>
	);
});

function mapRoleFormState(role: RoleDto): RoleFormState {
	return {
		name: role.name,
		displayName: role.displayName || "",
		description: role.description || "",
		isSystem: role.isSystem,
		errors: {},
	};
}

function mapPolicy(policy: PolicyResponseDto): RolePolicyOption {
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
): RolePolicyAssignment {
	return {
		policyId: assignment.policyId,
		isActive: assignment.isActive,
		priority: assignment.priority,
	};
}

function clonePolicyAssignments(assignments: RolePolicyAssignment[]) {
	return assignments.map((assignment) => ({ ...assignment }));
}

function serializePolicyAssignments(assignments: RolePolicyAssignment[]) {
	return clonePolicyAssignments(assignments)
		.sort((left, right) => left.policyId.localeCompare(right.policyId))
		.map(
			(assignment) =>
				`${assignment.policyId}:${assignment.isActive}:${assignment.priority}`,
		)
		.join("|");
}

function isEqualPolicyAssignments(
	left: RolePolicyAssignment[],
	right: RolePolicyAssignment[],
) {
	return serializePolicyAssignments(left) === serializePolicyAssignments(right);
}

function formatDate(value?: string | Date | null) {
	if (!value) {
		return "-";
	}
	return new Date(value).toLocaleString("ko-KR");
}

function SectionLike({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section>
			<h3 className="mb-4 text-lg font-semibold">{title}</h3>
			{children}
		</section>
	);
}

function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-background/60 p-3">
			<dt className="text-xs text-muted">{label}</dt>
			<dd className="mt-1 break-all text-sm font-medium">{value}</dd>
		</div>
	);
}

export default AdminRolesRoleDetailRoute;
