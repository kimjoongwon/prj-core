"use client";

import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { ArrowLeft, Edit, Key, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget/PageTitleBar";
export interface AbilityDetailScreenAbility {
	id: string;
	name: string;
	description?: string;
	inverted: boolean;
	reason?: string;
	subjectLabel: string;
	actionLabel: string;
	fields: string[];
	conditions?: unknown;
	createdAt: string;
	updatedAt?: string;
}
type AbilityDetailScreenLoadingProps = {
	mode: "loading";
};
type AbilityDetailScreenNotFoundProps = {
	mode: "not_found";
	onClickBackButton: () => void;
};
type AbilityDetailScreenReadyProps = {
	mode: "ready";
	ability: AbilityDetailScreenAbility;
	isDeleteModalOpen: boolean;
	isDeleting: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onOpenDeleteModal: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
};
export type AbilityDetailScreenProps =
	| AbilityDetailScreenLoadingProps
	| AbilityDetailScreenNotFoundProps
	| AbilityDetailScreenReadyProps;
export const AbilityDetailScreen = observer(
	(props: AbilityDetailScreenProps) => {
		if (props.mode === "loading") {
			return (
				<VStack fullWidth>
					<PageTitleBar title="권한 상세" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center gap-2 p-8">
									<Spinner size="sm" />
									<span className="text-muted">로딩 중...</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (props.mode === "not_found") {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title="권한 상세"
						description="권한을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">권한을 찾을 수 없습니다.</p>
									<Button variant="flat" onPress={props.onClickBackButton}>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		const { ability } = props;
		const deleteModalState = useOverlayState({
			isOpen: props.isDeleteModalOpen,
			onOpenChange: (open) => {
				if (!open) {
					props.onCloseDeleteModal();
				}
			},
		});
		return (
			<VStack fullWidth>
				<PageTitleBar
					title="권한 상세"
					description="권한 정보를 확인하고 수정하거나 삭제할 수 있습니다."
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={props.onClickBackButton}
							>
								목록으로
							</Button>
							<Button
								color="primary"
								startContent={<Edit className="h-4 w-4" />}
								onPress={props.onClickEditButton}
							>
								수정
							</Button>
							<Button
								color="danger"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={props.onOpenDeleteModal}
							>
								삭제
							</Button>
						</div>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<Section>
									<Section.Body>
										<h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<label className="text-sm text-muted">권한 이름</label>
												<p className="mt-1 font-mono">{ability.name}</p>
											</div>
											<div>
												<label className="text-sm text-muted">유형</label>
												<div className="mt-1">
													<Chip
														size="sm"
														color={ability.inverted ? "danger" : "success"}
														variant="flat"
													>
														{ability.inverted ? "거부(cannot)" : "허용(can)"}
													</Chip>
												</div>
											</div>
											{ability.description ? (
												<div className="md:col-span-2">
													<label className="text-sm text-muted">설명</label>
													<p className="mt-1">{ability.description}</p>
												</div>
											) : null}
											{ability.inverted && ability.reason ? (
												<div className="md:col-span-2">
													<label className="text-sm text-muted">
														거부 사유
													</label>
													<p className="mt-1 text-danger">{ability.reason}</p>
												</div>
											) : null}
										</div>
									</Section.Body>
								</Section>
								<Section>
									<Section.Body>
										<h3 className="mb-4 text-lg font-semibold">CASL 정보</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<label className="text-sm text-muted">Subject</label>
												<p className="mt-1">{ability.subjectLabel || "-"}</p>
											</div>
											<div>
												<label className="text-sm text-muted">Action</label>
												<p className="mt-1">{ability.actionLabel || "-"}</p>
											</div>
											<div className="md:col-span-2">
												<label className="text-sm text-muted">Fields</label>
												<div className="mt-1">
													{ability.fields.length === 0 ? (
														<Chip size="sm" variant="flat">
															전체 필드
														</Chip>
													) : (
														<div className="flex flex-wrap gap-2">
															{ability.fields.map((field) => (
																<Chip
																	key={`${ability.id}-${field}`}
																	size="sm"
																	variant="flat"
																>
																	{field}
																</Chip>
															))}
														</div>
													)}
												</div>
											</div>
											{ability.conditions ? (
												<div className="md:col-span-2">
													<label className="text-sm text-muted">
														Conditions (JSON)
													</label>
													<pre className="mt-1 overflow-x-auto rounded-lg bg-surface-secondary p-4 text-xs">
														{JSON.stringify(ability.conditions, null, 2)}
													</pre>
												</div>
											) : null}
										</div>
									</Section.Body>
								</Section>
								<Section>
									<Section.Body>
										<h3 className="mb-4 text-lg font-semibold">메타 정보</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<label className="text-sm text-muted">생성일</label>
												<p className="mt-1">
													{new Date(ability.createdAt).toLocaleString("ko-KR")}
												</p>
											</div>
											{ability.updatedAt ? (
												<div>
													<label className="text-sm text-muted">수정일</label>
													<p className="mt-1">
														{new Date(ability.updatedAt).toLocaleString(
															"ko-KR",
														)}
													</p>
												</div>
											) : null}
										</div>
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
				<Modal state={deleteModalState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header className="flex items-center gap-2">
									<Key className="h-5 w-5 text-danger" />
									권한 삭제
								</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{ability.name}</strong>권한을 삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-muted">
										이 작업은 되돌릴 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button variant="flat" onPress={props.onCloseDeleteModal}>
										취소
									</Button>
									<Button
										color="danger"
										onPress={props.onClickDeleteConfirm}
										isLoading={props.isDeleting}
									>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			</VStack>
		);
	},
);
AbilityDetailScreen.displayName = "AbilityDetailScreen";
