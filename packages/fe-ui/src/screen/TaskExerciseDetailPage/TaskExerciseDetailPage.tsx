"use client";

import {
	DateTimeCell,
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import Link from "next/link";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Modal, Spinner, useOverlayState } from "@heroui/react";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainSeconds = seconds % 60;
	return minutes > 0 ? `${minutes}분 ${remainSeconds}초` : `${remainSeconds}초`;
};

export interface TaskExerciseDetailPageExercise {
	name: string;
	duration: number;
	count: number;
	description?: string | null;
	imageFileId?: string | null;
	imageAssetHref?: Route;
	videoFileId?: string | null;
	videoAssetHref?: Route;
	createdAt: string;
	updatedAt?: string | null;
	spaceId?: string | null;
}

export interface TaskExerciseDetailPageRoutine {
	id: string;
	name: string;
	label?: string | null;
	createdAt: string;
}

export interface TaskExerciseDetailPageProps {
	taskId: string;
	exercise?: TaskExerciseDetailPageExercise;
	routines: TaskExerciseDetailPageRoutine[];
	isSchedulable: boolean;
	isLoading: boolean;
	isNotFound: boolean;
	isDeleteModalOpen: boolean;
	isDeletePending: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickDeleteButton: () => void;
	onClickDeleteConfirmButton: () => void;
	onClickDeleteCancelButton: () => void;
}

export const TaskExerciseDetailPage = observer(
	({
		taskId,
		exercise,
		routines,
		isSchedulable,
		isLoading,
		isNotFound,
		isDeleteModalOpen,
		isDeletePending,
		onClickBackButton,
		onClickEditButton,
		onClickDeleteButton,
			onClickDeleteConfirmButton,
			onClickDeleteCancelButton,
		}: TaskExerciseDetailPageProps) => {
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
				<DetailPage
					top={<PageTitleBar title="운동 정보" description="로딩 중..." />}
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

		if (isNotFound || !exercise) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="운동 정보"
							description="운동 detail을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-muted">
									운동 detail을 찾을 수 없습니다.
								</p>
								<Button
									variant="flat"
									startContent={<ArrowLeft className="size-4" />}
									onPress={onClickBackButton}
								>
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
						title={exercise.name ?? "운동 정보"}
						description="태스크에 연결된 운동 detail입니다."
						actions={
							<div className="flex gap-2">
								<Button
									variant="flat"
									startContent={<Pencil className="size-4" />}
									onPress={onClickEditButton}
								>
									수정
								</Button>
								<Button
									color="danger"
									variant="flat"
									startContent={<Trash2 className="size-4" />}
									onPress={onClickDeleteButton}
									isDisabled={routines.length > 0}
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
										<label className="text-sm text-muted">운동명</label>
										<p className="mt-1 font-medium">{exercise.name}</p>
									</div>
									<div>
										<label className="text-sm text-muted">지속시간</label>
										<p className="mt-1">{formatDuration(exercise.duration)}</p>
									</div>
									<div>
										<label className="text-sm text-muted">반복횟수</label>
										<p className="mt-1">{exercise.count}회</p>
									</div>
									<div>
										<label className="text-sm text-muted">
											스케줄 가능
										</label>
										<div className="mt-1">
											<Chip
												color={isSchedulable ? "success" : "warning"}
												size="sm"
											>
												{isSchedulable ? "가능" : "불가"}
											</Chip>
										</div>
									</div>
									<div>
										<label className="text-sm text-muted">설명</label>
										<p className="mt-1">{exercise.description || "-"}</p>
									</div>
									<div>
										<label className="text-sm text-muted">
											이미지 파일
										</label>
										<div className="mt-1">
											{exercise.imageFileId && exercise.imageAssetHref ? (
												<Link
													href={exercise.imageAssetHref}
													className="font-mono text-accent text-sm hover:underline"
												>
													{exercise.imageFileId}
												</Link>
											) : (
												"-"
											)}
										</div>
									</div>
									<div>
										<label className="text-sm text-muted">
											영상 파일
										</label>
										<div className="mt-1">
											{exercise.videoFileId && exercise.videoAssetHref ? (
												<Link
													href={exercise.videoAssetHref}
													className="font-mono text-accent text-sm hover:underline"
												>
													{exercise.videoFileId}
												</Link>
											) : (
												"-"
											)}
										</div>
									</div>
									<div>
										<label className="text-sm text-muted">등록일</label>
										<div className="mt-1">
											<DateTimeCell value={exercise.createdAt} />
										</div>
									</div>
									<div>
										<label className="text-sm text-muted">수정일</label>
										<div className="mt-1">
											<DateTimeCell value={exercise.updatedAt ?? "-"} />
										</div>
									</div>
								</div>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection
								top={<PageTitleBar level={2} title="태스크 정보" />}
							>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="text-sm text-muted">Task ID</label>
										<p className="mt-1 font-mono text-sm">{taskId}</p>
									</div>
									<div>
										<label className="text-sm text-muted">Space ID</label>
										<p className="mt-1 font-mono text-sm">
											{exercise.spaceId ?? "-"}
										</p>
									</div>
								</div>
							</DetailSection>
						</DetailSectionCard>
						{routines.length > 0 ? (
							<DetailSectionCard>
								<DetailSection
									top={<PageTitleBar level={2} title="연관 루틴" />}
								>
									<div className="flex flex-col gap-2">
										{routines.map((routine, index) => (
											<div
												key={`${routine.id}:${index}`}
												className="flex items-center justify-between rounded-lg bg-surface-secondary p-3"
											>
												<div>
													<p className="font-medium">{routine.name}</p>
													<p className="text-sm text-muted">
														{routine.label || "-"}
													</p>
												</div>
												<div className="text-sm text-muted">
													<DateTimeCell value={routine.createdAt} />
												</div>
											</div>
										))}
									</div>
								</DetailSection>
							</DetailSectionCard>
						) : null}
					</VStack>
				</DetailPageSurface>
				<Modal state={deleteModalState}>
					<Modal.Backdrop><Modal.Container><Modal.Dialog>
						<Modal.Header>태스크 삭제</Modal.Header>
						<Modal.Body>
							<p>
								<strong>{exercise.name}</strong> 운동 detail이 포함된 태스크를
								삭제하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-danger">
								이 작업은 되돌릴 수 없습니다.
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
					</Modal.Dialog></Modal.Container></Modal.Backdrop>
				</Modal>
			</DetailPage>
		);
	},
);
