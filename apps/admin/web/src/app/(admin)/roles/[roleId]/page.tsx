"use client";

import {
	type PolicyResponseDto,
	useGetPolicies,
} from "@cocrepo/api/core/policies";
import {
	getGetRoleAssignmentsQueryKey,
	type RoleAssignmentResponseDto,
	useGetRoleAssignments,
	useSyncRoleAssignments,
} from "@cocrepo/api/core/role-assignments";
import {
	type RoleDto,
	useDeleteRole,
	useGetRoleById,
} from "@cocrepo/api/core/roles";
import {
	type AssignablePolicy,
	Button,
	RoleAssignmentForm,
	type RoleAssignmentFormState,
	type RoleAssignmentValue,
	RoleEditScreen,
	type RoleFormState,
	Section,
} from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Save, ShieldCheck, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

const AdminRolesRoleDetailRoute = observer(() => {
	const { roleId } = useParams<{
		roleId: string;
	}>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isEditingPolicies, setIsEditingPolicies] = useState(false);
	const roleAssignmentState = useLocalObservable<RoleAssignmentFormState>(
		() => ({
			assignments: [],
		}),
	);
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data as RoleDto | undefined;
	const { data: policiesResponse, isLoading: isLoadingPolicies } =
		useGetPolicies();
	const { data: assignmentsResponse, isLoading: isLoadingRoleAssignments } =
		useGetRoleAssignments(roleId);
	const policies = (policiesResponse?.data ?? []).map(mapPolicy);
	const assignments = (assignmentsResponse?.data ?? []).map(mapRoleAssignment);
	const assignmentsKey = serializeRoleAssignments(assignments);
	const hasPolicyChanges =
		isEditingPolicies &&
		!isEqualRoleAssignments(roleAssignmentState.assignments, assignments);
	const roleFormState = role ? mapRoleFormState(role) : undefined;
	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				toast.success("역할 삭제 성공", {
					description: "역할이 삭제되었습니다.",
				});
				router.push("/roles" as Route);
			},
		},
	});
	const { mutate: syncRoleAssignments, isPending: isSavingPolicies } =
		useSyncRoleAssignments({
			mutation: {
				onSuccess: () => {
					setIsEditingPolicies(false);
					queryClient.invalidateQueries({
						queryKey: getGetRoleAssignmentsQueryKey(roleId),
					});
					queryClient.invalidateQueries({
						predicate: ({ queryKey }) =>
							String(queryKey[0]).includes("/api/v1/users/") &&
							String(queryKey[0]).includes("/tenants/"),
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
		roleAssignmentState.assignments = cloneRoleAssignments(assignments);
	}, [isEditingPolicies, assignmentsKey, roleAssignmentState]);
	const startPolicyEdit = () => {
		roleAssignmentState.assignments = cloneRoleAssignments(assignments);
		setIsEditingPolicies(true);
	};
	const cancelPolicyEdit = () => {
		roleAssignmentState.assignments = cloneRoleAssignments(assignments);
		setIsEditingPolicies(false);
	};
	const saveRoleAssignments = () => {
		syncRoleAssignments({
			roleId,
			data: {
				assignments: roleAssignmentState.assignments.map((assignment) => ({
					policyId: assignment.policyId,
					isActive: assignment.isActive,
					priority: assignment.priority,
				})),
			},
		});
	};
	return (
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
								isLoading={isDeleting}
								onPress={() => {
									deleteRole({
										id: roleId,
									});
								}}
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
						<Info label="상태" value={role.removedAt ? "삭제됨" : "사용 중"} />
						<Info label="생성일" value={formatDate(role.createdAt)} />
						<Info label="수정일" value={formatDate(role.updatedAt)} />
					</dl>
				</SectionLike>
			) : null}
			<Section>
				<Section.Header
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
									onPress={saveRoleAssignments}
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
				<Section.Body>
					<RoleAssignmentForm
						state={roleAssignmentState}
						policies={policies}
						baselineAssignments={assignments}
						readOnly={!isEditingPolicies}
						isLoading={isLoadingPolicies || isLoadingRoleAssignments}
					/>
				</Section.Body>
			</Section>
		</RoleEditScreen>
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
function mapPolicy(policy: PolicyResponseDto): AssignablePolicy {
	return {
		id: policy.id,
		name: policy.name,
		displayName: policy.displayName,
		description: policy.description,
		isSystem: policy.isSystem,
		abilityCount: policy.entries?.length ?? 0,
	};
}
function mapRoleAssignment(
	assignment: RoleAssignmentResponseDto,
): RoleAssignmentValue {
	return {
		policyId: assignment.policyId,
		isActive: assignment.isActive,
		priority: assignment.priority,
	};
}
function cloneRoleAssignments(assignments: RoleAssignmentValue[]) {
	return assignments.map((assignment) => ({
		...assignment,
	}));
}
function serializeRoleAssignments(assignments: RoleAssignmentValue[]) {
	return cloneRoleAssignments(assignments)
		.sort((left, right) => left.policyId.localeCompare(right.policyId))
		.map(
			(assignment) =>
				`${assignment.policyId}:${assignment.isActive}:${assignment.priority}`,
		)
		.join("|");
}
function isEqualRoleAssignments(
	left: RoleAssignmentValue[],
	right: RoleAssignmentValue[],
) {
	return serializeRoleAssignments(left) === serializeRoleAssignments(right);
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
