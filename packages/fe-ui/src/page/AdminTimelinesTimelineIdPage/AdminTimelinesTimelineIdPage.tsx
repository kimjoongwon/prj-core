"use client";

import {
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
} from "../../detail";
import { DateTimeCell } from "../../cell";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget";
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface AdminTimelinesTimelineIdPageTimeline {
	name?: string | null;
	description?: string | null;
	createdAt?: string | null;
}

export interface AdminTimelinesTimelineIdPageSessionRow {
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

export interface AdminTimelinesTimelineIdPageProps {
	title: string;
	timeline?: AdminTimelinesTimelineIdPageTimeline;
	sessions: AdminTimelinesTimelineIdPageSessionRow[];
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

export const AdminTimelinesTimelineIdPage = observer(
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
	}: AdminTimelinesTimelineIdPageProps) => {
		return (
			<DetailPage
				top={
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
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="text-sm text-default-500">타임라인명</label>
										<p className="mt-1">{timeline?.name ?? "-"}</p>
									</div>
									<div>
										<label className="text-sm text-default-500">설명</label>
										<p className="mt-1">{timeline?.description || "-"}</p>
									</div>
									<div>
										<label className="text-sm text-default-500">등록일</label>
										<div className="mt-1">
											{timeline?.createdAt ? (
												<DateTimeCell value={timeline.createdAt} />
											) : (
												"-"
											)}
										</div>
									</div>
								</div>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection
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
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">전체 세션</p>
										<p className="mt-1 text-lg font-semibold">{totalSessions}개</p>
									</div>
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">연결된 세션</p>
										<p className="mt-1 text-lg font-semibold text-success">
											{connectedSessions}개
										</p>
									</div>
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">미연결 세션</p>
										<p className="mt-1 text-lg font-semibold text-warning">
											{unconnectedSessions}개
										</p>
									</div>
								</div>
								<Table aria-label="세션 목록">
									<TableHeader>
										<TableColumn>세션명</TableColumn>
										<TableColumn align="center">유형</TableColumn>
										<TableColumn align="center">프로그램</TableColumn>
										<TableColumn align="center">연결 상태</TableColumn>
										<TableColumn>시작 일시</TableColumn>
										<TableColumn align="center">반복 요일</TableColumn>
										<TableColumn align="center">반복 주기</TableColumn>
										<TableColumn>등록일</TableColumn>
										<TableColumn align="center">액션</TableColumn>
									</TableHeader>
									<TableBody items={sessions} emptyContent="등록된 세션이 없습니다.">
										{(session) => (
											<TableRow key={session.id}>
												<TableCell>
													<button
														type="button"
														className="text-left text-primary hover:underline"
														onClick={() => onClickSessionNameButton(session.id)}
													>
														{session.name}
													</button>
												</TableCell>
												<TableCell>
													<Chip
														color={session.typeColor}
														variant="flat"
														size="sm"
													>
														{session.typeLabel}
													</Chip>
												</TableCell>
												<TableCell>{session.programCount}개</TableCell>
												<TableCell>
													{session.isConnected ? (
														<Chip color="success" variant="flat" size="sm">
															연결됨
														</Chip>
													) : (
														<Chip color="warning" variant="flat" size="sm">
															미연결
														</Chip>
													)}
												</TableCell>
												<TableCell>
													{session.startDateTime ? (
														<DateTimeCell value={session.startDateTime} />
													) : (
														"-"
													)}
												</TableCell>
												<TableCell>{session.recurringDayLabel}</TableCell>
												<TableCell>{session.repeatCycleLabel}</TableCell>
												<TableCell>
													<DateTimeCell value={session.createdAt} />
												</TableCell>
												<TableCell>
													<div className="flex justify-center gap-1">
														<Button
															size="sm"
															variant="light"
															onPress={() => onClickCreateProgramButton(session.id)}
														>
															프로그램 등록
														</Button>
														<Button
															size="sm"
															color="danger"
															variant="light"
															isIconOnly
															onPress={() => onClickDeleteSessionButton(session.id)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				<Modal
					isOpen={isDeleteTimelineModalOpen}
					onClose={onClickDeleteTimelineCancelButton}
				>
					<ModalContent>
						<ModalHeader>타임라인 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{timeline?.name}</strong>타임라인을 삭제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-danger">
								세션이 있는 타임라인은 삭제할 수 없습니다.
							</p>
						</ModalBody>
						<ModalFooter>
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
								isLoading={isDeleteTimelinePending}
							>
								삭제
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<Modal
					isOpen={isDeleteSessionModalOpen}
					onClose={onClickDeleteSessionCancelButton}
				>
					<ModalContent>
						<ModalHeader>세션 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{deleteSessionTargetName}</strong>세션을 삭제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-danger">
								프로그램이 연결된 세션은 삭제할 수 없습니다.
							</p>
						</ModalBody>
						<ModalFooter>
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
								isLoading={isDeleteSessionPending}
							>
								삭제
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</DetailPage>
		);
	},
);
