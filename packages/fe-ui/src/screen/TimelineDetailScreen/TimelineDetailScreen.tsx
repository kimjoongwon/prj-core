"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { DateTimeCell } from "../../cell";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Modal, Table, useOverlayState } from "@heroui/react";
import { SectionSurface } from "../../surface";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget";
export interface TimelineDetailScreenTimeline {
	name?: string | null;
	description?: string | null;
	createdAt?: string | null;
}
export interface TimelineDetailScreenSessionRow {
	id: string;
	name: string;
	typeLabel: string;
	typeColor: "primary" | "secondary" | "success";
	programCount: number;
	isConnected: boolean;
	startDateTime?: string | null;
	recurringDayLabel: string;
	repeatCycleLabel: string;
	createdAt: string;
}
export interface TimelineDetailScreenProps {
	title: string;
	timeline?: TimelineDetailScreenTimeline;
	sessions: TimelineDetailScreenSessionRow[];
	totalSessions: number;
	connectedSessions: number;
	unconnectedSessions: number;
	isDeleteTimelineModalOpen: boolean;
	isDeleteSessionModalOpen: boolean;
	deleteSessionTargetName?: string;
	isDeleteTimelinePending: boolean;
	isDeleteSessionPending: boolean;
	onClickEditButton: () => void;
	onClickDeleteTimelineButton: () => void;
	onClickDeleteTimelineConfirmButton: () => void;
	onClickDeleteTimelineCancelButton: () => void;
	onClickCreateSessionButton: () => void;
	onClickSessionNameButton: (sessionId: string) => void;
	onClickCreateProgramButton: (sessionId: string) => void;
	onClickDeleteSessionButton: (sessionId: string) => void;
	onClickDeleteSessionConfirmButton: () => void;
	onClickDeleteSessionCancelButton: () => void;
}
export const TimelineDetailScreen = observer(
	({
		title,
		timeline,
		sessions,
		totalSessions,
		connectedSessions,
		unconnectedSessions,
		isDeleteTimelineModalOpen,
		isDeleteSessionModalOpen,
		deleteSessionTargetName,
		isDeleteTimelinePending,
		isDeleteSessionPending,
		onClickEditButton,
		onClickDeleteTimelineButton,
		onClickDeleteTimelineConfirmButton,
		onClickDeleteTimelineCancelButton,
		onClickCreateSessionButton,
		onClickSessionNameButton,
		onClickCreateProgramButton,
		onClickDeleteSessionButton,
		onClickDeleteSessionConfirmButton,
		onClickDeleteSessionCancelButton,
	}: TimelineDetailScreenProps) => {
		const deleteTimelineModalState = useOverlayState({
			isOpen: isDeleteTimelineModalOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClickDeleteTimelineCancelButton();
				}
			},
		});
		const deleteSessionModalState = useOverlayState({
			isOpen: isDeleteSessionModalOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClickDeleteSessionCancelButton();
				}
			},
		});
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title={title}
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
								onPress={onClickDeleteTimelineButton}
							>
								삭제
							</Button>
						</div>
					}
				/>

				<SectionSurface>
					<VStack gap={4}>
						<SectionSurface top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="text-sm text-muted">타임라인명</label>
									<p className="mt-1">{timeline?.name ?? "-"}</p>
								</div>
								<div>
									<label className="text-sm text-muted">설명</label>
									<p className="mt-1">{timeline?.description || "-"}</p>
								</div>
								<div>
									<label className="text-sm text-muted">등록일</label>
									<div className="mt-1">
										{timeline?.createdAt ? (
											<DateTimeCell value={timeline.createdAt} />
										) : (
											"-"
										)}
									</div>
								</div>
							</div>
						</SectionSurface>
						<SectionSurface
							top={
								<PageTitleBar
									level={2}
									title="세션 목록"
									actions={
										<Button
											color="primary"
											size="sm"
											startContent={<Plus className="h-4 w-4" />}
											onPress={onClickCreateSessionButton}
										>
											세션 등록
										</Button>
									}
								/>
							}
						>
							<div className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
								<div className="rounded-lg bg-surface-secondary p-3">
									<p className="text-xs text-muted">전체 세션</p>
									<p className="mt-1 text-lg font-semibold">
										{totalSessions}개
									</p>
								</div>
								<div className="rounded-lg bg-surface-secondary p-3">
									<p className="text-xs text-muted">연결된 세션</p>
									<p className="mt-1 text-lg font-semibold text-success">
										{connectedSessions}개
									</p>
								</div>
								<div className="rounded-lg bg-surface-secondary p-3">
									<p className="text-xs text-muted">미연결 세션</p>
									<p className="mt-1 text-lg font-semibold text-warning">
										{unconnectedSessions}개
									</p>
								</div>
							</div>
							<Table aria-label="세션 목록">
								<Table.Content>
									<Table.Header>
										<Table.Column>세션명</Table.Column>
										<Table.Column className="text-center">유형</Table.Column>
										<Table.Column className="text-center">
											프로그램
										</Table.Column>
										<Table.Column className="text-center">
											연결 상태
										</Table.Column>
										<Table.Column>시작 일시</Table.Column>
										<Table.Column className="text-center">
											반복 요일
										</Table.Column>
										<Table.Column className="text-center">
											반복 주기
										</Table.Column>
										<Table.Column>등록일</Table.Column>
										<Table.Column className="text-center">액션</Table.Column>
									</Table.Header>
									<Table.Body items={sessions}>
										{(session) => (
											<Table.Row key={session.id}>
												<Table.Cell>
													<button
														type="button"
														className="text-left text-accent hover:underline"
														onClick={() => onClickSessionNameButton(session.id)}
													>
														{session.name}
													</button>
												</Table.Cell>
												<Table.Cell>
													<Chip
														color={session.typeColor}
														variant="flat"
														size="sm"
													>
														{session.typeLabel}
													</Chip>
												</Table.Cell>
												<Table.Cell>{session.programCount}개</Table.Cell>
												<Table.Cell>
													{session.isConnected ? (
														<Chip color="success" variant="flat" size="sm">
															연결됨
														</Chip>
													) : (
														<Chip color="warning" variant="flat" size="sm">
															미연결
														</Chip>
													)}
												</Table.Cell>
												<Table.Cell>
													{session.startDateTime ? (
														<DateTimeCell value={session.startDateTime} />
													) : (
														"-"
													)}
												</Table.Cell>
												<Table.Cell>{session.recurringDayLabel}</Table.Cell>
												<Table.Cell>{session.repeatCycleLabel}</Table.Cell>
												<Table.Cell>
													<DateTimeCell value={session.createdAt} />
												</Table.Cell>
												<Table.Cell>
													<div className="flex justify-center gap-1">
														<Button
															size="sm"
															variant="light"
															onPress={() =>
																onClickCreateProgramButton(session.id)
															}
														>
															프로그램 등록
														</Button>
														<Button
															size="sm"
															color="danger"
															variant="light"
															isIconOnly
															onPress={() =>
																onClickDeleteSessionButton(session.id)
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
						</SectionSurface>
					</VStack>
				</SectionSurface>
				<Modal state={deleteTimelineModalState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>타임라인 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{timeline?.name}</strong>타임라인을
										삭제하시겠습니까?
									</p>
									<p className="mt-2 text-sm text-danger">
										세션이 있는 타임라인은 삭제할 수 없습니다.
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={onClickDeleteTimelineCancelButton}
										isDisabled={isDeleteTimelinePending}
									>
										취소
									</Button>
									<Button
										color="danger"
										onPress={onClickDeleteTimelineConfirmButton}
									>
										삭제
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
				<Modal state={deleteSessionModalState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>세션 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{deleteSessionTargetName}</strong>세션을
										삭제하시겠습니까?
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
			</VStack>
		);
	},
);
