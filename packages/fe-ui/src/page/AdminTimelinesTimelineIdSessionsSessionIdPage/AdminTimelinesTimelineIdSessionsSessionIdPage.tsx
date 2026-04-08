"use client";

import {
	DateTimeCell,
	DetailPage,
	DetailPageSurface,
	PageTitleBar,
	DetailSection,
	DetailSectionCard,
	VStack,
} from "@cocrepo/ui";
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
import Link from "next/link";
import type { Route } from "next";

export interface AdminTimelinesTimelineIdSessionsSessionIdPageSession {
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

export interface AdminTimelinesTimelineIdSessionsSessionIdPageProgramRow {
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

export interface AdminTimelinesTimelineIdSessionsSessionIdPageProps {
	title: string;
	descriptionText?: string;
	session?: AdminTimelinesTimelineIdSessionsSessionIdPageSession;
	programs: AdminTimelinesTimelineIdSessionsSessionIdPageProgramRow[];
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

export const AdminTimelinesTimelineIdSessionsSessionIdPage = observer(
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
	}: AdminTimelinesTimelineIdSessionsSessionIdPageProps) => {
		return (
			<DetailPage
				top={
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
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="text-sm text-default-500">세션명</label>
										<p className="mt-1">{session?.name ?? "-"}</p>
									</div>
									<div>
										<label className="text-sm text-default-500">유형</label>
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
												<label className="text-sm text-default-500">
													반복 요일
												</label>
												<p className="mt-1">
													{session.recurringDayLabel ?? "-"}
												</p>
											</div>
											<div>
												<label className="text-sm text-default-500">
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
											<label className="text-sm text-default-500">시작 일시</label>
											<div className="mt-1">
												<DateTimeCell value={session.startDateTime} />
											</div>
										</div>
									) : null}
									{session?.endDateTime ? (
										<div>
											<label className="text-sm text-default-500">종료 일시</label>
											<div className="mt-1">
												<DateTimeCell value={session.endDateTime} />
											</div>
										</div>
									) : null}
									<div>
										<label className="text-sm text-default-500">설명</label>
										<p className="mt-1">{session?.description || "-"}</p>
									</div>
									<div>
										<label className="text-sm text-default-500">타임라인</label>
										<div className="mt-1">
											{session?.timelineHref && session.timelineName ? (
												<Link
													href={session.timelineHref}
													className="text-primary hover:underline"
												>
													{session.timelineName}
												</Link>
											) : (
												(session?.timelineName ?? "-")
											)}
										</div>
									</div>
									<div>
										<label className="text-sm text-default-500">등록일</label>
										<div className="mt-1">
											{session?.createdAt ? (
												<DateTimeCell value={session.createdAt} />
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
								}
							>
								<div className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">전체 프로그램</p>
										<p className="mt-1 text-lg font-semibold">{totalPrograms}개</p>
									</div>
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">강사 연결 정상</p>
										<p className="mt-1 text-lg font-semibold text-success">
											{resolvedPrograms}개
										</p>
									</div>
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">확인 필요</p>
										<p className="mt-1 text-lg font-semibold text-warning">
											{unresolvedPrograms}개
										</p>
									</div>
								</div>
								<Table
									aria-label="프로그램 목록"
								>
									<TableHeader>
										<TableColumn>프로그램명</TableColumn>
										<TableColumn>루틴명</TableColumn>
										<TableColumn align="center">운동 수</TableColumn>
										<TableColumn>대표 운동</TableColumn>
										<TableColumn>강사</TableColumn>
										<TableColumn align="center">연결 상태</TableColumn>
										<TableColumn align="center">정원</TableColumn>
										<TableColumn>난이도</TableColumn>
										<TableColumn align="center">액션</TableColumn>
									</TableHeader>
									<TableBody
										items={programs}
										emptyContent="등록된 프로그램이 없습니다. 프로그램을 등록해 주세요."
									>
										{(program) => (
											<TableRow key={program.id}>
												<TableCell>
													<Link
														href={program.href}
														className="text-left text-primary hover:underline"
														onClick={(event) => {
															event.stopPropagation();
														}}
													>
														{program.name}
													</Link>
												</TableCell>
												<TableCell>{program.routineName}</TableCell>
												<TableCell>{program.activityCountLabel}</TableCell>
												<TableCell>{program.previewText}</TableCell>
												<TableCell>{program.instructorName}</TableCell>
												<TableCell>
													{program.isConnectionResolved ? (
														<Chip color="success" variant="flat" size="sm">
															정상
														</Chip>
													) : (
														<Chip color="warning" variant="flat" size="sm">
															확인필요
														</Chip>
													)}
												</TableCell>
												<TableCell>{program.capacityLabel}</TableCell>
												<TableCell>{program.levelLabel}</TableCell>
												<TableCell>
													<div className="flex justify-center gap-1">
														<Button
															size="sm"
															variant="light"
															isIconOnly
															onPress={() => onClickEditProgramButton(program.id)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button
															size="sm"
															color="danger"
															variant="light"
															isIconOnly
															onPress={() => onClickDeleteProgramButton(program.id)}
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
					isOpen={isDeleteSessionModalOpen}
					onClose={onClickDeleteSessionCancelButton}
				>
					<ModalContent>
						<ModalHeader>세션 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{session?.name}</strong>세션을 삭제하시겠습니까?
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
				<Modal
					isOpen={isDeleteProgramModalOpen}
					onClose={onClickDeleteProgramCancelButton}
				>
					<ModalContent>
						<ModalHeader>프로그램 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{deleteProgramTargetName}</strong>프로그램을 삭제하시겠습니까?
							</p>
						</ModalBody>
						<ModalFooter>
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
								isLoading={isDeleteProgramPending}
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
