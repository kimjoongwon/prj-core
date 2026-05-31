"use client";

import {
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Save, ShieldCheck } from "lucide-react";
import { observer } from "mobx-react-lite";
import {
	Button,
	Checkbox,
	Chip,
	Input,
	Spinner,
	Switch,
} from "../../design-system/primitives";

export interface UserDetailPageUser {
	id: string;
	email?: string | null;
	name?: string | null;
	phone?: string | null;
	isActive?: boolean;
	removedAt?: string | null;
	lastLoginAt?: string | null;
	createdAt?: string | Date | null;
	updatedAt?: string | Date | null;
}

export interface UserDetailPagePolicy {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem?: boolean;
	abilityCount?: number | null;
}

export interface UserDetailPagePolicyAssignment {
	policyId: string;
	isActive: boolean;
	priority: number;
}

export interface UserDetailPageProps {
	userId: string;
	user?: UserDetailPageUser;
	policies?: UserDetailPagePolicy[];
	assignedPolicyIds?: string[];
	selectedPolicyIds?: string[];
	policyAssignments?: UserDetailPagePolicyAssignment[];
	selectedPolicyAssignments?: UserDetailPagePolicyAssignment[];
	isLoading?: boolean;
	isLoadingPolicies?: boolean;
	isEditingPolicies?: boolean;
	hasChanges?: boolean;
	isSavingPolicies?: boolean;
	onClickBackButton: () => void;
	onClickEditPoliciesButton?: () => void;
	onClickCancelEditPoliciesButton?: () => void;
	onTogglePolicy?: (policyId: string) => void;
	onChangePolicyAssignmentActive?: (
		policyId: string,
		isActive: boolean,
	) => void;
	onChangePolicyAssignmentPriority?: (
		policyId: string,
		priority: string,
	) => void;
	onClickSavePoliciesButton?: () => void;
}

function formatDate(value?: string | Date | null) {
	if (!value) {
		return "-";
	}
	return new Date(value).toLocaleString("ko-KR");
}

function getPolicyLabel(policy: UserDetailPagePolicy) {
	return policy.displayName || policy.name;
}

export const UserDetailPage = observer(
	({
		userId,
		user,
		policies = [],
		assignedPolicyIds = [],
		selectedPolicyIds = assignedPolicyIds,
		policyAssignments = [],
		selectedPolicyAssignments = policyAssignments,
		isLoading = false,
		isLoadingPolicies = false,
		isEditingPolicies = false,
		hasChanges = false,
		isSavingPolicies = false,
		onClickBackButton,
		onClickEditPoliciesButton,
		onClickCancelEditPoliciesButton,
		onTogglePolicy,
		onChangePolicyAssignmentActive,
		onChangePolicyAssignmentPriority,
		onClickSavePoliciesButton,
	}: UserDetailPageProps) => {
		const selectedSet = new Set(selectedPolicyIds);
		const selectedAssignmentMap = new Map(
			selectedPolicyAssignments.map((assignment) => [
				assignment.policyId,
				assignment,
			]),
		);
		const titleName = user?.name || user?.email || userId;

		if (isLoading) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="회원 상세"
							description="회원 정보를 불러오는 중입니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center gap-2 p-8">
								<Spinner size="sm" />
								<span className="text-default-500">로딩 중...</span>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		return (
			<DetailPage
				top={
					<PageTitleBar
						title={`회원 상세: ${titleName}`}
						description="회원 기본 정보와 사용자 직접 정책 할당을 관리합니다."
						actions={
							<Button
								variant="light"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={onClickBackButton}
							>
								목록으로
							</Button>
						}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap="section">
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									<Info label="회원 ID" value={user?.id || userId} />
									<Info label="이름" value={user?.name || "-"} />
									<Info label="이메일" value={user?.email || "-"} />
									<Info label="연락처" value={user?.phone || "-"} />
									<Info
										label="상태"
										value={
											user?.removedAt
												? "삭제됨"
												: user?.isActive === false
													? "비활성"
													: "사용 중"
										}
									/>
									<Info
										label="마지막 로그인"
										value={formatDate(user?.lastLoginAt)}
									/>
								</div>
							</DetailSection>
						</DetailSectionCard>

						<DetailSectionCard>
							<DetailSection
								top={
									<PageTitleBar
										level={2}
										title="사용자 정책 할당"
										description="역할 정책과 별도로 사용자에게 직접 적용할 정책을 선택합니다."
										actions={
											isEditingPolicies ? (
												<div className="flex gap-2">
													<Button
														variant="flat"
														onPress={onClickCancelEditPoliciesButton}
													>
														취소
													</Button>
													<Button
														color="primary"
														startContent={<Save className="h-4 w-4" />}
														isDisabled={!hasChanges}
														isLoading={isSavingPolicies}
														onPress={onClickSavePoliciesButton}
													>
														저장
													</Button>
												</div>
											) : (
												<Button
													color="primary"
													variant="flat"
													startContent={<ShieldCheck className="h-4 w-4" />}
													onPress={onClickEditPoliciesButton}
												>
													정책 편집
												</Button>
											)
										}
									/>
								}
							>
								{isLoadingPolicies ? (
									<div className="flex items-center justify-center gap-2 p-8">
										<Spinner size="sm" />
										<span className="text-default-500">
											정책을 불러오는 중...
										</span>
									</div>
								) : (
									<div className="grid gap-3">
										<div className="flex flex-wrap gap-2">
											<Chip color="primary" variant="flat">
												직접 할당 {selectedPolicyIds.length}
											</Chip>
											<Chip variant="flat">전체 정책 {policies.length}</Chip>
										</div>
										{policies.length > 0 ? (
											policies.map((policy) => {
												const isSelected = selectedSet.has(policy.id);
												const assignment = selectedAssignmentMap.get(policy.id);
												return (
													<div
														key={policy.id}
														className="rounded-xl border border-divider bg-background/60 p-4"
													>
														<div className="flex items-start justify-between gap-4">
															<div className="min-w-0">
																<div className="flex flex-wrap items-center gap-2">
																	<p className="font-semibold">
																		{getPolicyLabel(policy)}
																	</p>
																	<Chip
																		size="sm"
																		color={isSelected ? "success" : "default"}
																		variant="flat"
																	>
																		{isSelected ? "직접 할당" : "미할당"}
																	</Chip>
																	{assignment ? (
																		<Chip
																			size="sm"
																			color={
																				assignment.isActive
																					? "primary"
																					: "default"
																			}
																			variant="flat"
																		>
																			{assignment.isActive ? "활성" : "비활성"}
																		</Chip>
																	) : null}
																	<Chip size="sm" variant="flat">
																		{policy.isSystem ? "시스템" : "공간"}
																	</Chip>
																</div>
																<p className="mt-1 text-sm text-default-500">
																	{policy.description || policy.name}
																</p>
																<p className="mt-2 text-xs text-default-400">
																	우선순위 {assignment?.priority ?? 10} ·
																	Ability {policy.abilityCount ?? 0}개
																</p>
																{isEditingPolicies && assignment ? (
																	<div className="mt-3 flex flex-wrap items-center gap-3">
																		<Input
																			className="w-32"
																			label="우선순위"
																			type="number"
																			size="sm"
																			value={`${assignment.priority}`}
																			onValueChange={(value) =>
																				onChangePolicyAssignmentPriority?.(
																					policy.id,
																					value,
																				)
																			}
																		/>
																		<Switch
																			size="sm"
																			isSelected={assignment.isActive}
																			onValueChange={(value) =>
																				onChangePolicyAssignmentActive?.(
																					policy.id,
																					value,
																				)
																			}
																		>
																			활성
																		</Switch>
																	</div>
																) : null}
															</div>
															{isEditingPolicies ? (
																<Checkbox
																	isSelected={isSelected}
																	onValueChange={() =>
																		onTogglePolicy?.(policy.id)
																	}
																/>
															) : null}
														</div>
													</div>
												);
											})
										) : (
											<div className="rounded-xl border border-divider bg-background/60 p-6 text-center text-sm text-default-500">
												사용 가능한 정책이 없습니다.
											</div>
										)}
									</div>
								)}
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
			</DetailPage>
		);
	},
);

function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-divider bg-background/60 p-3">
			<p className="text-xs text-default-500">{label}</p>
			<p className="mt-1 break-all text-sm font-medium">{value}</p>
		</div>
	);
}

UserDetailPage.displayName = "UserDetailPage";
