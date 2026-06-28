"use client";

import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "../../action/Button/Button";
import { DateTimeCell } from "../../cell";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget";

const formatExerciseDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainSeconds = seconds % 60;
	return minutes > 0 ? `${minutes}분 ${remainSeconds}초` : `${remainSeconds}초`;
};
export interface TimelineSessionProgramDetailScreenExecutionItem {
	id: string;
	taskId: string;
	order: number;
	repetitions: number;
	restTime: number;
	exerciseName: string;
	exerciseDescription?: string | null;
	exerciseDuration: number;
	exerciseCount: number;
	notes?: string | null;
	imageFileId?: string | null;
	imageAssetHref?: Route;
	videoFileId?: string | null;
	videoAssetHref?: Route;
}
export interface TimelineSessionProgramDetailScreenData {
	name?: string | null;
	descriptionText?: string;
	routineName?: string | null;
	routineHref?: Route;
	instructorLabel?: string | null;
	capacityLabel?: string;
	levelLabel?: string | null;
	activityCountLabel?: string;
	sessionName?: string | null;
	sessionHref?: Route;
	createdAt?: string | null;
	executionPlan: TimelineSessionProgramDetailScreenExecutionItem[];
}
export interface TimelineSessionProgramDetailScreenProps {
	program?: TimelineSessionProgramDetailScreenData;
	isLoading: boolean;
	isNotFound: boolean;
	isDeleteModalOpen: boolean;
	isDeletePending: boolean;
	onClickEditButton: () => void;
	onClickDeleteButton: () => void;
	onClickDeleteConfirmButton: () => void;
	onClickDeleteCancelButton: () => void;
}
export const TimelineSessionProgramDetailScreen = observer(
	({
		program,
		isLoading,
		isNotFound,
		isDeleteModalOpen,
		isDeletePending,
		onClickEditButton,
		onClickDeleteButton,
		onClickDeleteConfirmButton,
		onClickDeleteCancelButton,
	}: TimelineSessionProgramDetailScreenProps) => {
		const deleteModalState = useOverlayState({
			isOpen: isDeleteModalOpen,
			onOpenChange: (open) => {
				if (!open) {
					onClickDeleteCancelButton();
				}
			},
		});
		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar title="프로그램 상세" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8">
									<Spinner size="lg" />
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound || !program) {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title="프로그램 상세"
						description="프로그램을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8 text-muted">
									프로그램을 찾을 수 없습니다.
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack fullWidth>
				<PageTitleBar
					title={program.name ?? "프로그램 상세"}
					description={program.descriptionText || undefined}
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
								onPress={onClickDeleteButton}
							>
								삭제
							</Button>
						</div>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<Section>
								<Section.Header>
									<PageTitleBar level={2} title="기본 정보" />
								</Section.Header>
								<Section.Body>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<label className="text-sm text-muted">
												프로그램 이름
											</label>
											<p className="mt-1">{program.name ?? "-"}</p>
										</div>
										<div>
											<label className="text-sm text-muted">루틴</label>
											<div className="mt-1">
												{program.routineHref && program.routineName ? (
													<Link
														href={program.routineHref}
														className="text-accent hover:underline"
													>
														{program.routineName}
													</Link>
												) : (
													(program.routineName ?? "-")
												)}
											</div>
										</div>
										<div>
											<label className="text-sm text-muted">강사</label>
											<p className="mt-1">{program.instructorLabel ?? "-"}</p>
										</div>
										<div>
											<label className="text-sm text-muted">정원</label>
											<p className="mt-1">{program.capacityLabel ?? "-"}</p>
										</div>
										<div>
											<label className="text-sm text-muted">난이도</label>
											<p className="mt-1">{program.levelLabel ?? "-"}</p>
										</div>
										<div>
											<label className="text-sm text-muted">운동 수</label>
											<p className="mt-1">
												{program.activityCountLabel ??
													`${program.executionPlan.length}개`}
											</p>
										</div>
										<div>
											<label className="text-sm text-muted">세션</label>
											<div className="mt-1">
												{program.sessionHref && program.sessionName ? (
													<Link
														href={program.sessionHref}
														className="text-accent hover:underline"
													>
														{program.sessionName}
													</Link>
												) : (
													(program.sessionName ?? "-")
												)}
											</div>
										</div>
										<div>
											<label className="text-sm text-muted">등록일</label>
											<div className="mt-1">
												{program.createdAt ? (
													<DateTimeCell value={program.createdAt} />
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
									<PageTitleBar level={2} title="실행 운동" />
								</Section.Header>
								<Section.Body>
									{program.executionPlan.length === 0 ? (
										<p className="text-muted text-sm">
											저장된 실행 운동 계획이 없습니다.
										</p>
									) : (
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
											{program.executionPlan.map((activity) => (
												<div
													key={activity.id}
													className="rounded-lg bg-surface-secondary p-4"
												>
													<div className="flex items-start justify-between gap-3">
														<div>
															<p className="text-sm text-muted">
																{activity.order}번 운동
															</p>
															<p className="font-semibold">
																{activity.exerciseName}
															</p>
														</div>
														<p className="text-muted text-sm">
															Task {activity.taskId.slice(-6)}
														</p>
													</div>
													<div className="mt-3 grid grid-cols-2 gap-3 text-sm">
														<div>
															<label className="text-muted">반복</label>
															<p className="mt-1">{activity.repetitions}회</p>
														</div>
														<div>
															<label className="text-muted">휴식</label>
															<p className="mt-1">{activity.restTime}초</p>
														</div>
														<div>
															<label className="text-muted">기본 시간</label>
															<p className="mt-1">
																{formatExerciseDuration(
																	activity.exerciseDuration,
																)}
															</p>
														</div>
														<div>
															<label className="text-muted">기본 횟수</label>
															<p className="mt-1">{activity.exerciseCount}회</p>
														</div>
													</div>
													<div className="mt-3 text-sm">
														<label className="text-muted">설명</label>
														<p className="mt-1">
															{activity.exerciseDescription ||
																activity.notes ||
																"-"}
														</p>
													</div>
													<div className="mt-3 grid grid-cols-1 gap-2 text-sm">
														<div>
															<label className="text-muted">이미지 자산</label>
															<div className="mt-1">
																{activity.imageFileId &&
																activity.imageAssetHref ? (
																	<Link
																		href={activity.imageAssetHref}
																		className="font-mono text-accent text-sm hover:underline"
																	>
																		{activity.imageFileId}
																	</Link>
																) : (
																	"-"
																)}
															</div>
														</div>
														<div>
															<label className="text-muted">영상 자산</label>
															<div className="mt-1">
																{activity.videoFileId &&
																activity.videoAssetHref ? (
																	<Link
																		href={activity.videoAssetHref}
																		className="font-mono text-accent text-sm hover:underline"
																	>
																		{activity.videoFileId}
																	</Link>
																) : (
																	"-"
																)}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</Section.Body>
							</Section>
						</Section.Body>
					</Section>
				</SectionSurface>
				<Modal state={deleteModalState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>프로그램 삭제</Modal.Header>
								<Modal.Body>
									<p>
										<strong>{program.name}</strong>프로그램을 삭제하시겠습니까?
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={onClickDeleteCancelButton}
										isDisabled={isDeletePending}
									>
										취소
									</Button>
									<Button
										color="danger"
										onPress={onClickDeleteConfirmButton}
										isLoading={isDeletePending}
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
