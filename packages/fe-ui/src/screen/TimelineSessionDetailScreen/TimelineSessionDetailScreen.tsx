"use client";

import {
	DateTimeCell,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Modal, Table, useOverlayState } from "@heroui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import type { MouseEvent } from "react";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
export interface TimelineSessionDetailScreenSession {
	name?: string | null;
	type?: string | null;
	typeLabel?: string;
	typeColor?: "primary" | "secondary" | "success";
	recurringDayLabel?: string;
	repeatCycleLabel?: string;
	startDateTime?: string | null;
	endDateTime?: string | null;
	description?: string | null;
	timelineName?: string | null;
	timelineHref?: Route;
	createdAt?: string | null;
}
export interface TimelineSessionDetailScreenProgramRow {
	id: string;
	href: Route;
	name: string;
	routineName: string;
	activityCountLabel: string;
	previewText: string;
	instructorName: string;
	isConnectionResolved: boolean;
	capacityLabel: string;
	levelLabel: string;
}
export interface TimelineSessionDetailScreenProps {
	title: string;
	descriptionText?: string;
	session?: TimelineSessionDetailScreenSession;
	programs: TimelineSessionDetailScreenProgramRow[];
	totalPrograms: number;
	resolvedPrograms: number;
	unresolvedPrograms: number;
	isDeleteSessionModalOpen: boolean;
	isDeleteProgramModalOpen: boolean;
	deleteProgramTargetName?: string;
	isDeleteSessionPending: boolean;
	isDeleteProgramPending: boolean;
	onClickEditButton: () => void;
	onClickDeleteSessionButton: () => void;
	onClickDeleteSessionConfirmButton: () => void;
	onClickDeleteSessionCancelButton: () => void;
	onClickCreateProgramButton: () => void;
	onClickEditProgramButton: (programId: string) => void;
	onClickDeleteProgramButton: (programId: string) => void;
	onClickDeleteProgramConfirmButton: () => void;
	onClickDeleteProgramCancelButton: () => void;
}
export const TimelineSessionDetailScreen = observer(
	({
		title,
		descriptionText,
		session,
		programs,
		totalPrograms,
		resolvedPrograms,
		unresolvedPrograms,
		isDeleteSessionModalOpen,
		isDeleteProgramModalOpen,
		deleteProgramTargetName,
		isDeleteSessionPending,
		isDeleteProgramPending,
		onClickEditButton,
		onClickDeleteSessionButton,
		onClickDeleteSessionConfirmButton,
		onClickDeleteSessionCancelButton,
		onClickCreateProgramButton,
		onClickEditProgramButton,
		onClickDeleteProgramButton,
		onClickDeleteProgramConfirmButton,
		onClickDeleteProgramCancelButton,
	}: TimelineSessionDetailScreenProps) => {
		const deleteSessionModalState = useOverlayState({
			isOpen: isDeleteSessionModalOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClickDeleteSessionCancelButton();
				}
			},
		});
		const deleteProgramModalState = useOverlayState({
			isOpen: isDeleteProgramModalOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClickDeleteProgramCancelButton();
				}
			},
		});
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title={title}
					description={descriptionText}
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<Pencil className="h-4 w-4" />}
								onPress={onClickEditButton}
							>
								수정
							</Button>
							<Button
								color="danger"
								variant="flat"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={onClickDeleteSessionButton}
							>
								삭제
							</Button>
						</div>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack gap={4}>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="기본 정보" />
									</Section.Header>
									<Section.Body>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											<div>
												<label className="text-sm text-muted">세션명</label>
												<p className="mt-1">{session?.name ?? "-"}</p>
											</div>
											<div>
												<label className="text-sm text-muted">유형</label>
												<div className="mt-1">
													{session?.typeLabel && session.typeColor ? (
														<Chip
															color={session.typeColor}
															variant="flat"
															size="sm"
														>
															{session.typeLabel}
														</Chip>
													) : (
														"-"
													)}
												</div>
											</div>
											{session?.type === "RECURRING" ? (
												<>
													<div>
														<label className="text-sm text-muted">
															반복 요일
														</label>
														<p className="mt-1">
															{session.recurringDayLabel ?? "-"}
														</p>
													</div>
													<div>
														<label className="text-sm text-muted">
															반복 주기
														</label>
														<p className="mt-1">
															{session.repeatCycleLabel ?? "-"}
														</p>
													</div>
												</>
											) : null}
											{session?.startDateTime ? (
												<div>
													<label className="text-sm text-muted">
														시작 일시
													</label>
													<div className="mt-1">
														<DateTimeCell value={session.startDateTime} />
													</div>
												</div>
											) : null}
											{session?.endDateTime ? (
												<div>
													<label className="text-sm text-muted">
														종료 일시
													</label>
													<div className="mt-1">
														<DateTimeCell value={session.endDateTime} />
													</div>
												</div>
											) : null}
											<div>
												<label className="text-sm text-muted">설명</label>
												<p className="mt-1">{session?.description || "-"}</p>
											</div>
											<div>
												<label className="text-sm text-muted">타임라인</label>
												<div className="mt-1">
													{session?.timelineHref && session.timelineName ? (
														<Link
															href={session.timelineHref}
															className="text-accent hover:underline"
														>
															{session.timelineName}
														</Link>
													) : (
														(session?.timelineName ?? "-")
													)}
												</div>
											</div>
											<div>
												<label className="text-sm text-muted">등록일</label>
												<div className="mt-1">
													{session?.createdAt ? (
														<DateTimeCell value={session.createdAt} />
													) : (
														"-"
													)}
												</div>
											</div>
										</div>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar
											level={2}
											title="프로그램 연결 허브"
											actions={
												<Button
													color="primary"
													size="sm"
													startContent={<Plus className="h-4 w-4" />}
													onPress={onClickCreateProgramButton}
												>
													프로그램 등록
												</Button>
											}
										/>
									</Section.Header>
									<Section.Body>
										<div className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">전체 프로그램</p>
												<p className="mt-1 text-lg font-semibold">
													{totalPrograms}개
												</p>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">강사 연결 정상</p>
												<p className="mt-1 text-lg font-semibold text-success">
													{resolvedPrograms}개
												</p>
											</div>
											<div className="rounded-lg bg-surface-secondary p-3">
												<p className="text-xs text-muted">확인 필요</p>
												<p className="mt-1 text-lg font-semibold text-warning">
													{unresolvedPrograms}개
												</p>
											</div>
										</div>
										<Table aria-label="프로그램 목록">
											<Table.Content>
												<Table.Header>
													<Table.Column>프로그램명</Table.Column>
													<Table.Column>루틴명</Table.Column>
													<Table.Column className="text-center">
														운동 수
													</Table.Column>
													<Table.Column>대표 운동</Table.Column>
													<Table.Column>강사</Table.Column>
													<Table.Column className="text-center">
														연결 상태
													</Table.Column>
													<Table.Column className="text-center">
														정원
													</Table.Column>
													<Table.Column>난이도</Table.Column>
													<Table.Column className="text-center">
														액션
													</Table.Column>
												</Table.Header>
												<Table.Body items={programs}>
													{(program) => (
														<Table.Row key={program.id}>
															<Table.Cell>
																<Link
																	href={program.href}
																	className="text-left text-accent hover:underline"
																	onClick={(
																		event: MouseEvent<HTMLAnchorElement>,
																	) => {
																		event.stopPropagation();
																	}}
																>
																	{program.name}
																</Link>
															</Table.Cell>
															<Table.Cell>{program.routineName}</Table.Cell>
															<Table.Cell>
																{program.activityCountLabel}
															</Table.Cell>
															<Table.Cell>{program.previewText}</Table.Cell>
															<Table.Cell>{program.instructorName}</Table.Cell>
															<Table.Cell>
																{program.isConnectionResolved ? (
																	<Chip
																		color="success"
																		variant="flat"
																		size="sm"
																	>
																		정상
																	</Chip>
																) : (
																	<Chip
																		color="warning"
																		variant="flat"
																		size="sm"
																	>
																		확인필요
																	</Chip>
																)}
															</Table.Cell>
															<Table.Cell>{program.capacityLabel}</Table.Cell>
															<Table.Cell>{program.levelLabel}</Table.Cell>
															<Table.Cell>
																<div className="flex justify-center gap-1">
																	<Button
																		size="sm"
																		variant="light"
																		isIconOnly
																		onPress={() =>
																			onClickEditProgramButton(program.id)
																		}
																	>
																		<Pencil className="h-4 w-4" />
																	</Button>
																	<Button
																		size="sm"
																		color="danger"
																		variant="light"
																		isIconOnly
																		onPress={() =>
																			onClickDeleteProgramButton(program.id)
																		}
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																</div>
															</Table.Cell>
														</Table.Row>
													)}
												</Table.Body>
											</Table.Content>
										</Table>
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
				<Modal state={deleteSessionModalState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>세션 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{session?.name}</strong>세션을 삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										프로그램이 연결된 세션은 삭제할 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={onClickDeleteSessionCancelButton}
										isDisabled={isDeleteSessionPending}
									>
										취소
									</Button>
									<Button
										color="danger"
										onPress={onClickDeleteSessionConfirmButton}
									>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
				<Modal state={deleteProgramModalState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>프로그램 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{deleteProgramTargetName}</strong>프로그램을
										삭제하시겠습니까?
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={onClickDeleteProgramCancelButton}
										isDisabled={isDeleteProgramPending}
									>
										취소
									</Button>
									<Button
										color="danger"
										onPress={onClickDeleteProgramConfirmButton}
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
