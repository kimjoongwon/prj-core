"use client";

import {
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
} from "../../detail";
import { DateTimeCell } from "../../cell";
import { PageTitleBar } from "../../widget";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import type { Route } from "next";

const formatExerciseDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainSeconds = seconds % 60;
	return minutes > 0 ? `${minutes}분 ${remainSeconds}초` : `${remainSeconds}초`;
};

export interface TimelineSessionProgramDetailPageExecutionItem {
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

export interface TimelineSessionProgramDetailPageData {
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
	executionPlan: TimelineSessionProgramDetailPageExecutionItem[];
}

export interface TimelineSessionProgramDetailPageProps {
	program?: TimelineSessionProgramDetailPageData;
	isLoading: boolean;
	isNotFound: boolean;
	isDeleteModalOpen: boolean;
	isDeletePending: boolean;
	onClickEditButton: () => void;
	onClickDeleteButton: () => void;
	onClickDeleteConfirmButton: () => void;
	onClickDeleteCancelButton: () => void;
}

export const TimelineSessionProgramDetailPage = observer(
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
	}: TimelineSessionProgramDetailPageProps) => {
		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="프로그램 상세" description="로딩 중..." />}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<Spinner size="lg" />
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (isNotFound || !program) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="프로그램 상세"
							description="프로그램을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8 text-default-500">
								프로그램을 찾을 수 없습니다.
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
				}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="text-sm text-default-500">
										프로그램 이름
									</label>
									<p className="mt-1">{program.name ?? "-"}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">루틴</label>
									<div className="mt-1">
										{program.routineHref && program.routineName ? (
											<Link
												href={program.routineHref}
												className="text-primary hover:underline"
											>
												{program.routineName}
											</Link>
										) : (
											(program.routineName ?? "-")
										)}
									</div>
								</div>
								<div>
									<label className="text-sm text-default-500">강사</label>
									<p className="mt-1">{program.instructorLabel ?? "-"}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">정원</label>
									<p className="mt-1">{program.capacityLabel ?? "-"}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">난이도</label>
									<p className="mt-1">{program.levelLabel ?? "-"}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">운동 수</label>
									<p className="mt-1">
										{program.activityCountLabel ??
											`${program.executionPlan.length}개`}
									</p>
								</div>
								<div>
									<label className="text-sm text-default-500">세션</label>
									<div className="mt-1">
										{program.sessionHref && program.sessionName ? (
											<Link
												href={program.sessionHref}
												className="text-primary hover:underline"
											>
												{program.sessionName}
											</Link>
										) : (
											(program.sessionName ?? "-")
										)}
									</div>
								</div>
								<div>
									<label className="text-sm text-default-500">등록일</label>
									<div className="mt-1">
										{program.createdAt ? (
											<DateTimeCell value={program.createdAt} />
										) : (
											"-"
										)}
									</div>
								</div>
							</div>
						</DetailSection>
					</DetailSectionCard>
					<DetailSectionCard>
						<DetailSection top={<PageTitleBar level={2} title="실행 운동" />}>
							{program.executionPlan.length === 0 ? (
								<p className="text-default-500 text-sm">
									저장된 실행 운동 계획이 없습니다.
								</p>
							) : (
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
									{program.executionPlan.map((activity) => (
										<div
											key={activity.id}
											className="rounded-lg bg-content2 p-4"
										>
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-sm text-default-500">
														{activity.order}번 운동
													</p>
													<p className="font-semibold">
														{activity.exerciseName}
													</p>
												</div>
												<p className="text-default-500 text-sm">
													Task {activity.taskId.slice(-6)}
												</p>
											</div>
											<div className="mt-3 grid grid-cols-2 gap-3 text-sm">
												<div>
													<label className="text-default-500">반복</label>
													<p className="mt-1">{activity.repetitions}회</p>
												</div>
												<div>
													<label className="text-default-500">휴식</label>
													<p className="mt-1">{activity.restTime}초</p>
												</div>
												<div>
													<label className="text-default-500">기본 시간</label>
													<p className="mt-1">
														{formatExerciseDuration(activity.exerciseDuration)}
													</p>
												</div>
												<div>
													<label className="text-default-500">기본 횟수</label>
													<p className="mt-1">{activity.exerciseCount}회</p>
												</div>
											</div>
											<div className="mt-3 text-sm">
												<label className="text-default-500">설명</label>
												<p className="mt-1">
													{activity.exerciseDescription ||
														activity.notes ||
														"-"}
												</p>
											</div>
											<div className="mt-3 grid grid-cols-1 gap-2 text-sm">
												<div>
													<label className="text-default-500">
														이미지 자산
													</label>
													<div className="mt-1">
														{activity.imageFileId && activity.imageAssetHref ? (
															<Link
																href={activity.imageAssetHref}
																className="font-mono text-primary text-sm hover:underline"
															>
																{activity.imageFileId}
															</Link>
														) : (
															"-"
														)}
													</div>
												</div>
												<div>
													<label className="text-default-500">영상 자산</label>
													<div className="mt-1">
														{activity.videoFileId && activity.videoAssetHref ? (
															<Link
																href={activity.videoAssetHref}
																className="font-mono text-primary text-sm hover:underline"
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
						</DetailSection>
					</DetailSectionCard>
				</DetailPageSurface>
				<Modal isOpen={isDeleteModalOpen} onClose={onClickDeleteCancelButton}>
					<ModalContent>
						<ModalHeader>프로그램 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{program.name}</strong>프로그램을 삭제하시겠습니까?
							</p>
						</ModalBody>
						<ModalFooter>
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
						</ModalFooter>
					</ModalContent>
				</Modal>
			</DetailPage>
		);
	},
);
