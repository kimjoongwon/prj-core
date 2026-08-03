"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { Checkbox } from "../../input/Checkbox/Checkbox";
import { Switch } from "../../input/Switch/Switch";
import { TextField } from "../../input/TextField/TextField";

export interface AssignablePolicy {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	abilityCount?: number | null;
}

export interface RoleAssignmentValue {
	policyId: string;
	isActive: boolean;
	priority: number;
}

export interface RoleAssignmentFormState {
	assignments: RoleAssignmentValue[];
}

export interface RoleAssignmentFormProps {
	state: RoleAssignmentFormState;
	policies: AssignablePolicy[];
	baselineAssignments?: RoleAssignmentValue[];
	readOnly?: boolean;
	isLoading?: boolean;
	emptyMessage?: string;
}

function getPolicyLabel(policy: AssignablePolicy) {
	return policy.displayName || policy.name;
}

function setAssignments(
	state: RoleAssignmentFormState,
	nextAssignments: RoleAssignmentValue[],
) {
	state.assignments = nextAssignments;
}

/**
 * Role aggregate의 Policy assignment 편집 필드 조합입니다.
 * route는 readOnly와 저장 액션만 결정하고, form은 assignment state만 수정합니다.
 */
export const RoleAssignmentForm = observer(
	({
		state,
		policies,
		baselineAssignments = state.assignments,
		readOnly = false,
		isLoading = false,
		emptyMessage = "사용 가능한 정책이 없습니다.",
	}: RoleAssignmentFormProps) => {
		const selectedAssignmentMap = new Map(
			state.assignments.map((assignment) => [assignment.policyId, assignment]),
		);
		const selectedPolicyIds = state.assignments.map(
			(assignment) => assignment.policyId,
		);
		const selectedSet = new Set(selectedPolicyIds);
		const baselineSet = new Set(
			baselineAssignments.map((assignment) => assignment.policyId),
		);
		const addedCount = selectedPolicyIds.filter(
			(policyId) => !baselineSet.has(policyId),
		).length;
		const removedCount = baselineAssignments.filter(
			(assignment) => !selectedSet.has(assignment.policyId),
		).length;

		const togglePolicy = (policyId: string) => {
			if (readOnly) {
				return;
			}
			if (selectedSet.has(policyId)) {
				setAssignments(
					state,
					state.assignments.filter(
						(assignment) => assignment.policyId !== policyId,
					),
				);
				return;
			}
			setAssignments(state, [
				...state.assignments,
				{ policyId, isActive: true, priority: 0 },
			]);
		};

		const updateAssignment = (
			policyId: string,
			patch: Partial<Omit<RoleAssignmentValue, "policyId">>,
		) => {
			if (readOnly) {
				return;
			}
			setAssignments(
				state,
				state.assignments.map((assignment) =>
					assignment.policyId === policyId
						? { ...assignment, ...patch }
						: assignment,
				),
			);
		};

		if (isLoading) {
			return (
				<div className="flex items-center justify-center p-8 text-sm text-muted">
					정책을 불러오는 중...
				</div>
			);
		}

		return (
			<div className="grid gap-3">
				<div className="flex flex-wrap gap-2">
					<Chip color="primary" variant="flat">
						할당 {selectedPolicyIds.length}
					</Chip>
					{readOnly ? null : (
						<Chip color="success" variant="flat">
							추가 {addedCount}
						</Chip>
					)}
					{readOnly ? null : (
						<Chip color="warning" variant="flat">
							해제 {removedCount}
						</Chip>
					)}
				</div>
				{policies.length > 0 ? (
					policies.map((policy) => {
						const isSelected = selectedSet.has(policy.id);
						const assignment = selectedAssignmentMap.get(policy.id);

						return (
							<div
								key={policy.id}
								className="rounded-xl border border-border bg-background p-4"
							>
								<div className="flex items-start justify-between gap-4">
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<p className="font-semibold">{getPolicyLabel(policy)}</p>
											<Chip
												size="sm"
												color={isSelected ? "success" : "default"}
												variant="flat"
											>
												{isSelected ? "할당됨" : "미할당"}
											</Chip>
											{assignment ? (
												<Chip
													size="sm"
													color={assignment.isActive ? "primary" : "default"}
													variant="flat"
												>
													{assignment.isActive ? "활성" : "비활성"}
												</Chip>
											) : null}
										</div>
										<p className="mt-1 text-sm text-muted">
											{policy.description || policy.name}
										</p>
										<p className="mt-2 text-xs text-muted">
											우선순위 {assignment?.priority ?? 0} · Ability{" "}
											{policy.abilityCount ?? 0}개
										</p>
										{!readOnly && assignment ? (
											<div className="mt-3 flex flex-wrap items-center gap-3">
												<TextField
													className="w-32"
													label="우선순위"
													type="number"
													size="sm"
													value={`${assignment.priority}`}
													onValueChange={(value) => {
														updateAssignment(policy.id, {
															priority: Number(value || 0),
														});
													}}
												/>
												<Switch
													size="sm"
													isSelected={assignment.isActive}
													onValueChange={(value) => {
														updateAssignment(policy.id, {
															isActive: value,
														});
													}}
												>
													활성
												</Switch>
											</div>
										) : null}
									</div>
									{readOnly ? null : (
										<Checkbox
											isSelected={isSelected}
											onValueChange={() => {
												togglePolicy(policy.id);
											}}
										/>
									)}
								</div>
							</div>
						);
					})
				) : (
					<div className="rounded-xl border border-border bg-background p-6 text-center text-sm text-muted">
						{emptyMessage}
					</div>
				)}
			</div>
		);
	},
);
