"use client";

import {
	DetailPage,
	DetailPageSurface,
	PageTitleBar,
	DetailSection,
	DetailSectionCard,
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
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import {
	ArrowLeft,
	Edit,
	Save,
	ShieldCheck,
	ShieldX,
	Trash2,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

export interface AdminRolesRoleIdPageGrantItem {
	abilityId: string;
	isActive: boolean;
	priority: number;
}

export interface AdminRolesRoleIdPageAbility {
	id: string;
	name: string;
	description?: string;
	subjectId: string;
	actionId: string;
	fields: string[];
	inverted: boolean;
	reason?: string;
	subject?: { id: string; name: string; displayName?: string };
	action?: { id: string; name: string; displayName?: string };
}

export interface AdminRolesRoleIdPageRole {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem: boolean;
	removedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface AdminRolesRoleIdPageChangeSummary {
	added: number;
	removed: number;
	kept: number;
}

export interface AdminRolesRoleIdPageProps {
	role?: AdminRolesRoleIdPageRole;
	grantedAbilities: AdminRolesRoleIdPageAbility[];
	allAbilities: AdminRolesRoleIdPageAbility[];
	selectedGrantItems: Record<string, AdminRolesRoleIdPageGrantItem>;
	changeSummary: AdminRolesRoleIdPageChangeSummary;
	isLoading: boolean;
	isLoadingAbilities: boolean;
	isLoadingAllAbilities: boolean;
	isEditingGrants: boolean;
	hasChanges: boolean;
	isDeleteModalOpen: boolean;
	isSaveModalOpen: boolean;
	isDeleting: boolean;
	isSavingGrants: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickOpenDeleteModal: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
	onClickEditGrantsButton: () => void;
	onClickCancelEditGrantsButton: () => void;
	onToggleAbilityCheckbox: (abilityId: string) => void;
	onToggleGrantActiveSwitch: (abilityId: string, isActive: boolean) => void;
	onChangeGrantPriorityInput: (abilityId: string, priority: number) => void;
	onClickOpenSaveGrantsModal: () => void;
	onCloseSaveGrantsModal: () => void;
	onClickConfirmSaveGrantsButton: () => void;
}

const getAbilityLabel = (
	value?: { displayName?: string; name?: string } | null,
	fallback?: string,
) => String(value?.displayName || value?.name || fallback || "-");

export const AdminRolesRoleIdPage = observer(
	({
		role,
		grantedAbilities,
		allAbilities,
		selectedGrantItems,
		changeSummary,
		isLoading,
		isLoadingAbilities,
		isLoadingAllAbilities,
		isEditingGrants,
		hasChanges,
		isDeleteModalOpen,
		isSaveModalOpen,
		isDeleting,
		isSavingGrants,
		onClickBackButton,
		onClickEditButton,
		onClickOpenDeleteModal,
		onCloseDeleteModal,
		onClickDeleteConfirm,
		onClickEditGrantsButton,
		onClickCancelEditGrantsButton,
		onToggleAbilityCheckbox,
		onToggleGrantActiveSwitch,
		onChangeGrantPriorityInput,
		onClickOpenSaveGrantsModal,
		onCloseSaveGrantsModal,
		onClickConfirmSaveGrantsButton,
	}: AdminRolesRoleIdPageProps) => {
		if (isLoading) {
			return (
				<DetailPage top={<PageTitleBar title="역할 상세" description="로딩 중..." />}>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
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

		const pageActions: ReactNode = (
			<div className="flex gap-2">
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={onClickBackButton}
				>
					목록으로
				</Button>
				{!role.isSystem ? (
					<>
						<Button
							variant="flat"
							color="primary"
							startContent={<Edit className="h-4 w-4" />}
							onPress={onClickEditButton}
						>
							수정
						</Button>
						<Button
							variant="flat"
							color="danger"
							startContent={<Trash2 className="h-4 w-4" />}
							onPress={onClickOpenDeleteModal}
						>
							삭제
						</Button>
					</>
				) : null}
			</div>
		);

		return (
			<DetailPage
				top={
					<PageTitleBar
						title="역할 상세"
						description={`${role.displayName || role.name} 역할의 상세 정보입니다.`}
						actions={pageActions}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						{role.isSystem ? (
							<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
								<p className="text-sm text-warning-700 dark:text-warning-400">
									<strong>시스템 역할:</strong> 이 역할은 시스템에서 기본 제공하는
									역할로, 수정하거나 삭제할 수 없습니다.
								</p>
							</div>
						) : null}
						<DetailSectionCard>
							<DetailSection>
								<h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
								<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<dt className="mb-1 text-sm text-default-500">역할 식별자</dt>
										<dd className="flex items-center gap-2">
											<span className="font-mono">{role.name}</span>
											{role.isSystem ? (
												<Chip size="sm" color="warning" variant="flat">
													시스템
												</Chip>
											) : null}
										</dd>
									</div>
									<div>
										<dt className="mb-1 text-sm text-default-500">표시명</dt>
										<dd>{role.displayName || "-"}</dd>
									</div>
									<div className="md:col-span-2">
										<dt className="mb-1 text-sm text-default-500">설명</dt>
										<dd className="text-default-600">{role.description || "-"}</dd>
									</div>
								</dl>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection>
								<div className="mb-4 flex items-center justify-between">
									<h3 className="text-lg font-semibold">권한 목록</h3>
									{!isEditingGrants ? (
										<Button
											size="sm"
											variant="flat"
											color="primary"
											startContent={<Edit className="h-3.5 w-3.5" />}
											onPress={onClickEditGrantsButton}
										>
											권한 편집
										</Button>
									) : (
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="flat"
												onPress={onClickCancelEditGrantsButton}
											>
												취소
											</Button>
											<Button
												size="sm"
												color="primary"
												startContent={<Save className="h-3.5 w-3.5" />}
												isDisabled={!hasChanges}
												onPress={onClickOpenSaveGrantsModal}
											>
												저장
											</Button>
										</div>
									)}
								</div>
								{isEditingGrants ? (
									isLoadingAllAbilities ? (
										<div className="flex items-center justify-center p-8">
											<Spinner size="sm" />
											<span className="ml-2 text-default-500">
												전체 권한 로딩 중...
											</span>
										</div>
									) : allAbilities.length === 0 ? (
										<div className="py-8 text-center text-default-500">
											등록된 권한 정의가 없습니다.
										</div>
									) : (
										<Table aria-label="권한 배치 할당" removeWrapper>
											<TableHeader>
												<TableColumn width={50}>선택</TableColumn>
												<TableColumn>대상 (Subject)</TableColumn>
												<TableColumn>액션 (Action)</TableColumn>
												<TableColumn>유형</TableColumn>
												<TableColumn width={80}>활성</TableColumn>
												<TableColumn width={100}>우선순위</TableColumn>
											</TableHeader>
											<TableBody>
												{allAbilities.map((ability) => {
													const grantItem = selectedGrantItems[ability.id];
													const isSelected = Boolean(grantItem);
													return (
														<TableRow key={ability.id}>
															<TableCell>
																<Checkbox
																	isSelected={isSelected}
																	onValueChange={() =>
																		onToggleAbilityCheckbox(ability.id)
																	}
																/>
															</TableCell>
															<TableCell>
																<span className="font-medium">
																	{getAbilityLabel(
																		ability.subject,
																		ability.subjectId,
																	)}
																</span>
															</TableCell>
															<TableCell>
																<span className="font-mono text-sm">
																	{getAbilityLabel(
																		ability.action,
																		ability.actionId,
																	)}
																</span>
															</TableCell>
															<TableCell>
																{ability.inverted ? (
																	<Chip
																		size="sm"
																		color="danger"
																		variant="flat"
																		startContent={<ShieldX className="h-3 w-3" />}
																	>
																		거부
																	</Chip>
																) : (
																	<Chip
																		size="sm"
																		color="success"
																		variant="flat"
																		startContent={
																			<ShieldCheck className="h-3 w-3" />
																		}
																	>
																		허용
																	</Chip>
																)}
															</TableCell>
															<TableCell>
																{isSelected ? (
																	<Switch
																		size="sm"
																		isSelected={grantItem.isActive}
																		onValueChange={(value) =>
																			onToggleGrantActiveSwitch(
																				ability.id,
																				value,
																			)
																		}
																	/>
																) : null}
															</TableCell>
															<TableCell>
																{isSelected ? (
																	<Input
																		type="number"
																		size="sm"
																		min={0}
																		max={100}
																		value={String(grantItem.priority)}
																		onValueChange={(value) =>
																			onChangeGrantPriorityInput(
																				ability.id,
																				Number(value) || 0,
																			)
																		}
																		className="w-20"
																	/>
																) : null}
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									)
								) : isLoadingAbilities ? (
									<div className="flex items-center justify-center p-8">
										<Spinner size="sm" />
										<span className="ml-2 text-default-500">권한 로딩 중...</span>
									</div>
								) : grantedAbilities.length === 0 ? (
									<div className="py-8 text-center text-default-500">
										등록된 권한이 없습니다.
									</div>
								) : (
									<Table aria-label="역할 권한 목록" removeWrapper>
										<TableHeader>
											<TableColumn>대상 (Subject)</TableColumn>
											<TableColumn>액션 (Action)</TableColumn>
											<TableColumn>필드</TableColumn>
											<TableColumn>유형</TableColumn>
										</TableHeader>
										<TableBody>
											{grantedAbilities.map((ability) => (
												<TableRow key={ability.id}>
													<TableCell>
														<span className="font-medium">
															{getAbilityLabel(
																ability.subject,
																ability.subjectId,
															)}
														</span>
													</TableCell>
													<TableCell>
														<span className="font-mono text-sm">
															{getAbilityLabel(ability.action, ability.actionId)}
														</span>
													</TableCell>
													<TableCell>
														{ability.fields.length > 0 ? (
															<div className="flex flex-wrap gap-1">
																{ability.fields.slice(0, 3).map((field) => (
																	<Chip key={field} size="sm" variant="flat">
																		{field}
																	</Chip>
																))}
																{ability.fields.length > 3 ? (
																	<Chip
																		size="sm"
																		variant="flat"
																		color="default"
																	>
																		+{ability.fields.length - 3}
																	</Chip>
																) : null}
															</div>
														) : (
															<span className="text-default-400">전체</span>
														)}
													</TableCell>
													<TableCell>
														{ability.inverted ? (
															<Chip
																size="sm"
																color="danger"
																variant="flat"
																startContent={<ShieldX className="h-3 w-3" />}
															>
																거부
															</Chip>
														) : (
															<Chip
																size="sm"
																color="success"
																variant="flat"
																startContent={<ShieldCheck className="h-3 w-3" />}
															>
																허용
															</Chip>
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection>
								<h3 className="mb-4 text-lg font-semibold">추가 정보</h3>
								<dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<dt className="mb-1 text-sm text-default-500">상태</dt>
										<dd>
											<Chip
												size="sm"
												color={role.removedAt ? "danger" : "success"}
												variant="flat"
											>
												{role.removedAt ? "삭제됨" : "활성"}
											</Chip>
										</dd>
									</div>
									<div>
										<dt className="mb-1 text-sm text-default-500">생성일</dt>
										<dd>{new Date(role.createdAt).toLocaleString("ko-KR")}</dd>
									</div>
									<div>
										<dt className="mb-1 text-sm text-default-500">수정일</dt>
										<dd>{new Date(role.updatedAt).toLocaleString("ko-KR")}</dd>
									</div>
								</dl>
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				<Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
					<ModalContent>
						<ModalHeader>역할 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{role.displayName || role.name}</strong> 역할을
								삭제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-danger">
								이 작업은 되돌릴 수 없습니다.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="flat"
								onPress={onCloseDeleteModal}
								isDisabled={isDeleting}
							>
								취소
							</Button>
							<Button
								color="danger"
								onPress={onClickDeleteConfirm}
								isLoading={isDeleting}
							>
								삭제
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<Modal isOpen={isSaveModalOpen} onClose={onCloseSaveGrantsModal}>
					<ModalContent>
						<ModalHeader>권한 변경 확인</ModalHeader>
						<ModalBody>
							<p>권한 변경사항을 저장하시겠습니까?</p>
							<div className="mt-3 flex flex-col gap-2 rounded-lg bg-default-100 p-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-default-600">추가</span>
									<Chip size="sm" color="success" variant="flat">
										+{changeSummary.added}개
									</Chip>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-default-600">제거</span>
									<Chip size="sm" color="danger" variant="flat">
										-{changeSummary.removed}개
									</Chip>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-default-600">유지</span>
									<Chip size="sm" variant="flat">
										{changeSummary.kept}개
									</Chip>
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="flat"
								onPress={onCloseSaveGrantsModal}
								isDisabled={isSavingGrants}
							>
								취소
							</Button>
							<Button
								color="primary"
								onPress={onClickConfirmSaveGrantsButton}
								isLoading={isSavingGrants}
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
