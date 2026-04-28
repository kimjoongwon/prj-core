"use client";

import {
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Checkbox,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Switch,
} from "@heroui/react";
import { ArrowLeft, Edit, Save, ShieldCheck, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoleDetailPageRole {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem: boolean;
	removedAt?: string | null;
	createdAt?: string | Date | null;
	updatedAt?: string | Date | null;
}

export interface RoleDetailPagePolicy {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem?: boolean;
	abilityCount?: number | null;
}

export interface RoleDetailPagePolicyAssignment {
	policyId: string;
	isActive: boolean;
	priority: number;
}

export interface RoleDetailPageProps {
	role?: RoleDetailPageRole;
	policies?: RoleDetailPagePolicy[];
	assignedPolicyIds?: string[];
	selectedPolicyIds?: string[];
	policyAssignments?: RoleDetailPagePolicyAssignment[];
	selectedPolicyAssignments?: RoleDetailPagePolicyAssignment[];
	isLoading?: boolean;
	isLoadingPolicies?: boolean;
	isEditingPolicies?: boolean;
	hasChanges?: boolean;
	isDeleteModalOpen?: boolean;
	isSavePoliciesModalOpen?: boolean;
	isDeleting?: boolean;
	isSavingPolicies?: boolean;
	onClickBackButton: () => void;
	onClickEditButton?: () => void;
	onClickOpenDeleteModal?: () => void;
	onCloseDeleteModal?: () => void;
	onClickDeleteConfirm?: () => void;
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
	onClickOpenSavePoliciesModal?: () => void;
	onClickConfirmSavePoliciesButton?: () => void;
	[key: string]: unknown;
}

function formatDate(value?: string | Date | null) {
	if (!value) {
		return "-";
	}
	return new Date(value).toLocaleString("ko-KR");
}

function getPolicyLabel(policy: RoleDetailPagePolicy) {
	return policy.displayName || policy.name;
}

export const RoleDetailPage = observer(
	({
		role,
		policies = [],
		assignedPolicyIds = [],
		selectedPolicyIds = assignedPolicyIds,
		policyAssignments = [],
		selectedPolicyAssignments = policyAssignments,
		isLoading = false,
		isLoadingPolicies = false,
		isEditingPolicies = false,
		hasChanges = false,
		isDeleteModalOpen = false,
		isSavePoliciesModalOpen = false,
		isDeleting = false,
		isSavingPolicies = false,
		onClickBackButton,
		onClickEditButton,
		onClickOpenDeleteModal,
		onCloseDeleteModal,
		onClickDeleteConfirm,
		onClickEditPoliciesButton,
		onClickCancelEditPoliciesButton,
		onTogglePolicy,
		onChangePolicyAssignmentActive,
		onChangePolicyAssignmentPriority,
		onClickOpenSavePoliciesModal,
		onClickConfirmSavePoliciesButton,
	}: RoleDetailPageProps) => {
		const selectedSet = new Set(selectedPolicyIds);
		const assignedSet = new Set(assignedPolicyIds);
		const selectedAssignmentMap = new Map(
			selectedPolicyAssignments.map((assignment) => [
				assignment.policyId,
				assignment,
			]),
		);
		const addedCount = selectedPolicyIds.filter(
			(id) => !assignedSet.has(id),
		).length;
		const removedCount = assignedPolicyIds.filter(
			(id) => !selectedSet.has(id),
		).length;

		if (isLoading) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="역할 상세"
							description="역할 정보를 불러오는 중입니다."
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

		if (!role) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="역할 상세"
							description="역할을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">역할을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickBackButton}>
									목록으로
								</Button>
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
						title={`역할 상세: ${role.displayName || role.name}`}
						description={
							role.description || `${role.name} 역할의 정책 할당을 관리합니다.`
						}
						actions={
							<div className="flex flex-wrap gap-2">
								<Button
									variant="light"
									startContent={<ArrowLeft className="h-4 w-4" />}
									onPress={onClickBackButton}
								>
									목록으로
								</Button>
								{!role.isSystem && onClickEditButton ? (
									<Button
										variant="flat"
										startContent={<Edit className="h-4 w-4" />}
										onPress={onClickEditButton}
									>
										수정
									</Button>
								) : null}
								{!role.isSystem && onClickOpenDeleteModal ? (
									<Button
										color="danger"
										variant="flat"
										startContent={<Trash2 className="h-4 w-4" />}
										onPress={onClickOpenDeleteModal}
									>
										삭제
									</Button>
								) : null}
							</div>
						}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap="section">
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									<Info label="역할 ID" value={role.id} />
									<Info label="역할 이름" value={role.name} />
									<Info label="표시명" value={role.displayName || "-"} />
									<Info
										label="상태"
										value={role.removedAt ? "삭제됨" : "사용 중"}
									/>
									<Info
										label="시스템 역할"
										value={role.isSystem ? "예" : "아니오"}
									/>
									<Info label="수정일" value={formatDate(role.updatedAt)} />
								</div>
							</DetailSection>
						</DetailSectionCard>

						<DetailSectionCard>
							<DetailSection
								top={
									<PageTitleBar
										level={2}
										title="정책 할당"
										description="현재 Space의 RolePolicy를 관리합니다."
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
														onPress={onClickOpenSavePoliciesModal}
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
												할당 {selectedPolicyIds.length}
											</Chip>
											{isEditingPolicies ? (
												<Chip color="success" variant="flat">
													추가 {addedCount}
												</Chip>
											) : null}
											{isEditingPolicies ? (
												<Chip color="warning" variant="flat">
													해제 {removedCount}
												</Chip>
											) : null}
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
																		{isSelected ? "할당됨" : "미할당"}
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
																	우선순위 {assignment?.priority ?? 0} · Ability{" "}
																	{policy.abilityCount ?? 0}개
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

				<Modal isOpen={isDeleteModalOpen} onOpenChange={onCloseDeleteModal}>
					<ModalContent>
						<ModalHeader>역할 삭제</ModalHeader>
						<ModalBody>이 역할을 삭제하시겠습니까?</ModalBody>
						<ModalFooter>
							<Button variant="flat" onPress={onCloseDeleteModal}>
								취소
							</Button>
							<Button
								color="danger"
								isLoading={isDeleting}
								onPress={onClickDeleteConfirm}
							>
								삭제
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>

				<Modal
					isOpen={isSavePoliciesModalOpen}
					onOpenChange={onClickCancelEditPoliciesButton}
				>
					<ModalContent>
						<ModalHeader>정책 할당 저장</ModalHeader>
						<ModalBody>
							추가 {addedCount}개, 해제 {removedCount}개 변경을 저장합니다.
						</ModalBody>
						<ModalFooter>
							<Button variant="flat" onPress={onClickCancelEditPoliciesButton}>
								취소
							</Button>
							<Button
								color="primary"
								isLoading={isSavingPolicies}
								onPress={onClickConfirmSavePoliciesButton}
							>
								저장
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
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

RoleDetailPage.displayName = "RoleDetailPage";
