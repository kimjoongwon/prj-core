"use client";

import {
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Checkbox } from "../../selection/Checkbox/Checkbox";
import { Chip } from "../../data-display/Chip/Chip";
import { Modal, Spinner } from "@heroui/react";

export interface PolicyDetailPagePolicy {
	id: string;
	spaceId?: string | null;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem?: boolean;
	abilityIds?: string[];
	createdAt?: string | Date | null;
	updatedAt?: string | Date | null;
}

export interface PolicyDetailPageAbility {
	id: string;
	name: string;
	description?: string | null;
	subject?: { name?: string; displayName?: string | null };
	action?: { name?: string; displayName?: string | null };
}

export interface PolicyDetailPageProps {
	policy?: PolicyDetailPagePolicy;
	abilities: PolicyDetailPageAbility[];
	selectedAbilityIds: string[];
	isLoading: boolean;
	isLoadingAbilities: boolean;
	isEditingAbilities: boolean;
	hasChanges: boolean;
	isDeleteModalOpen: boolean;
	isDeleting: boolean;
	isSavingAbilities: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickOpenDeleteModal: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
	onClickEditAbilitiesButton: () => void;
	onClickCancelEditAbilitiesButton: () => void;
	onToggleAbility: (abilityId: string) => void;
	onClickSaveAbilitiesButton: () => void;
}

function formatDate(value?: string | Date | null) {
	if (!value) {
		return "-";
	}
	return new Date(value).toLocaleString("ko-KR");
}

function getAbilityLabel(ability: PolicyDetailPageAbility) {
	const subject =
		ability.subject?.displayName || ability.subject?.name || "Subject";
	const action =
		ability.action?.displayName || ability.action?.name || "Action";
	return `${subject} / ${action}`;
}

export const PolicyDetailPage = observer((props: PolicyDetailPageProps) => {
	const selectedSet = new Set(props.selectedAbilityIds);

	if (props.isLoading) {
		return (
			<DetailPage
				top={
					<PageTitleBar
						title="정책 상세"
						description="정책을 불러오는 중입니다."
					/>
				}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex items-center justify-center gap-2 p-8">
							<Spinner size="sm" />
							<span className="text-muted">로딩 중...</span>
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	}

	if (!props.policy) {
		return (
			<DetailPage
				top={
					<PageTitleBar
						title="정책 상세"
						description="정책을 찾을 수 없습니다."
					/>
				}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-muted">정책을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={props.onClickBackButton}>
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
					title={`정책 상세: ${props.policy.displayName || props.policy.name}`}
					description={
						props.policy.description ||
						"정책에 연결된 Ability와 공간 범위를 확인합니다."
					}
					actions={
						<div className="flex flex-wrap gap-2">
							<Button
								variant="light"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={props.onClickBackButton}
							>
								목록으로
							</Button>
							<Button
								variant="flat"
								startContent={<Edit className="h-4 w-4" />}
								onPress={props.onClickEditButton}
							>
								수정
							</Button>
							<Button
								color="danger"
								variant="flat"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={props.onClickOpenDeleteModal}
							>
								삭제
							</Button>
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
								<Info label="정책 ID" value={props.policy.id} />
								<Info label="Space ID" value={props.policy.spaceId || "-"} />
								<Info label="이름" value={props.policy.name} />
								<Info label="표시명" value={props.policy.displayName || "-"} />
								<Info
									label="유형"
									value={props.policy.isSystem ? "시스템 정책" : "공간 정책"}
								/>
								<Info
									label="수정일"
									value={formatDate(props.policy.updatedAt)}
								/>
							</div>
						</DetailSection>
					</DetailSectionCard>

					<DetailSectionCard>
						<DetailSection
							top={
								<PageTitleBar
									level={2}
									title="연결 Ability"
									description="이 정책에 포함할 CASL Ability를 선택합니다."
									actions={
										props.isEditingAbilities ? (
											<div className="flex gap-2">
												<Button
													variant="flat"
													onPress={props.onClickCancelEditAbilitiesButton}
												>
													취소
												</Button>
												<Button
													color="primary"
													startContent={<Save className="h-4 w-4" />}
													isDisabled={!props.hasChanges}
													isLoading={props.isSavingAbilities}
													onPress={props.onClickSaveAbilitiesButton}
												>
													저장
												</Button>
											</div>
										) : (
											<Button
												color="primary"
												variant="flat"
												startContent={<Edit className="h-4 w-4" />}
												onPress={props.onClickEditAbilitiesButton}
											>
												Ability 편집
											</Button>
										)
									}
								/>
							}
						>
							{props.isLoadingAbilities ? (
								<div className="flex items-center justify-center gap-2 p-8">
									<Spinner size="sm" />
									<span className="text-muted">
										Ability를 불러오는 중...
									</span>
								</div>
							) : (
								<div className="grid gap-3">
									<Chip className="w-fit" color="primary" variant="flat">
										선택 {props.selectedAbilityIds.length}
									</Chip>
									{props.abilities.map((ability) => {
										const isSelected = selectedSet.has(ability.id);
										return (
											<div
												key={ability.id}
												className="rounded-xl border border-border bg-background/60 p-4"
											>
												<div className="flex items-start justify-between gap-4">
													<div>
														<div className="flex flex-wrap items-center gap-2">
															<p className="font-semibold">{ability.name}</p>
															<Chip
																size="sm"
																color={isSelected ? "success" : "default"}
																variant="flat"
															>
																{isSelected ? "연결됨" : "미연결"}
															</Chip>
														</div>
														<p className="mt-1 text-sm text-muted">
															{getAbilityLabel(ability)}
														</p>
														<p className="mt-1 text-xs text-muted">
															{ability.description || "설명 없음"}
														</p>
													</div>
													{props.isEditingAbilities ? (
														<Checkbox
															isSelected={isSelected}
															onValueChange={() =>
																props.onToggleAbility(ability.id)
															}
														/>
													) : null}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</DetailSection>
					</DetailSectionCard>
				</VStack>
			</DetailPageSurface>

			<Modal
				isOpen={props.isDeleteModalOpen}
				onOpenChange={props.onCloseDeleteModal}
			>
				<Modal.Backdrop><Modal.Container><Modal.Dialog>
					<Modal.Header>정책 삭제</Modal.Header>
					<Modal.Body>이 정책을 삭제하시겠습니까?</Modal.Body>
					<Modal.Footer>
						<Button variant="flat" onPress={props.onCloseDeleteModal}>
							취소
						</Button>
						<Button
							color="danger"
							isLoading={props.isDeleting}
							onPress={props.onClickDeleteConfirm}
						>
							삭제
						</Button>
					</Modal.Footer>
				</Modal.Dialog></Modal.Container></Modal.Backdrop>
			</Modal>
		</DetailPage>
	);
});

function Info({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-border bg-background/60 p-3">
			<p className="text-xs text-muted">{label}</p>
			<p className="mt-1 break-all text-sm font-medium">{value}</p>
		</div>
	);
}

PolicyDetailPage.displayName = "PolicyDetailPage";
