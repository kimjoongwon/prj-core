"use client";

import {
	DateTimeCell,
	DetailPage,
	DetailPageSurface,
	MediaThumbnail,
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
	Spinner,
} from "@cocrepo/ui/heroui";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoutineDetailPageActivity {
	id: string;
	order: number;
	repetitions: number;
	restTime: number;
	notes?: string | null;
	exerciseName?: string | null;
	imageAssetUrl?: string;
	videoAssetUrl?: string;
}

export interface RoutineDetailPageProgram {
	id: string;
	name: string;
}

export interface RoutineDetailPageRoutine {
	id: string;
	name: string;
	label: string;
	createdAt: string;
	updatedAt: string;
	activities?: RoutineDetailPageActivity[];
	programs?: RoutineDetailPageProgram[];
}

export interface RoutineDetailPageProps {
	routine?: RoutineDetailPageRoutine;
	isLoading: boolean;
	errorTitle?: string;
	errorDescription?: string;
	showRetryButton: boolean;
	isDeleteModalOpen: boolean;
	isDeleting: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
	onClickRetryButton: () => void;
	onClickOpenDeleteModal: () => void;
	onCloseDeleteModal: () => void;
	onClickDeleteConfirm: () => void;
}

export const RoutineDetailPage = observer(
	({
		routine,
		isLoading,
		errorTitle,
		errorDescription,
		showRetryButton,
		isDeleteModalOpen,
		isDeleting,
		onClickBackButton,
		onClickEditButton,
		onClickRetryButton,
		onClickOpenDeleteModal,
		onCloseDeleteModal,
		onClickDeleteConfirm,
	}: RoutineDetailPageProps) => {
		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="루틴 상세" description="로딩 중..." />}
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

		if (errorTitle) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="루틴 상세"
							description={errorDescription || "잠시 후 다시 시도해주세요."}
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">{errorTitle}</p>
								<div className="flex gap-2">
									{showRetryButton ? (
										<Button variant="flat" onPress={onClickRetryButton}>
											다시 시도
										</Button>
									) : null}
									<Button
										variant="flat"
										startContent={<ArrowLeft className="size-4" />}
										onPress={onClickBackButton}
									>
										목록으로
									</Button>
								</div>
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (!routine) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="루틴 상세"
							description="루틴을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">루틴을 찾을 수 없습니다.</p>
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

		const activities = routine.activities ?? [];
		const programs = routine.programs ?? [];
		const resolvedActivities = activities.filter((activity) =>
			Boolean(activity.exerciseName),
		).length;
		const unresolvedActivities = activities.length - resolvedActivities;

		const pageActions = (
			<div className="flex gap-2">
				<Button
					variant="flat"
					startContent={<ArrowLeft className="size-4" />}
					onPress={onClickBackButton}
				>
					목록으로
				</Button>
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
					onPress={onClickOpenDeleteModal}
				>
					삭제
				</Button>
			</div>
		);

		return (
			<DetailPage
				top={
					<PageTitleBar
						title={routine.name || "루틴 상세"}
						description="루틴의 상세 정보입니다."
						actions={pageActions}
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="text-sm text-default-500">루틴명</label>
										<p className="mt-1 font-medium">{routine.name}</p>
									</div>
									<div>
										<label className="text-sm text-default-500">라벨</label>
										<p className="mt-1">{routine.label}</p>
									</div>
									<div>
										<label className="text-sm text-default-500">운동 수</label>
										<p className="mt-1">{activities.length}개</p>
									</div>
									<div>
										<label className="text-sm text-default-500">
											연결 상태
										</label>
										<div className="mt-1">
											{activities.length === 0 ? (
												<Chip size="sm" variant="flat" color="warning">
													활동 없음
												</Chip>
											) : unresolvedActivities > 0 ? (
												<Chip size="sm" variant="flat" color="warning">
													확인 필요
												</Chip>
											) : (
												<Chip size="sm" variant="flat" color="success">
													정상
												</Chip>
											)}
										</div>
									</div>
									<div>
										<label className="text-sm text-default-500">등록일</label>
										<div className="mt-1">
											<DateTimeCell value={routine.createdAt} />
										</div>
									</div>
									<div>
										<label className="text-sm text-default-500">수정일</label>
										<div className="mt-1">
											<DateTimeCell value={routine.updatedAt} />
										</div>
									</div>
								</div>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="연결 요약" />}>
								<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">전체 활동</p>
										<p className="mt-1 text-lg font-semibold">
											{activities.length}개
										</p>
									</div>
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">연결 정상</p>
										<p className="mt-1 text-lg font-semibold text-success">
											{resolvedActivities}개
										</p>
									</div>
									<div className="rounded-lg bg-content2 p-3">
										<p className="text-xs text-default-500">사용 중 프로그램</p>
										<p className="mt-1 text-lg font-semibold">
											{programs.length}개
										</p>
									</div>
								</div>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="운동 구성" />}>
								{activities.length === 0 ? (
									<p className="text-sm text-default-500">
										등록된 활동이 없습니다.
									</p>
								) : (
									<div className="flex flex-col gap-3">
										{activities.map((activity, index) => {
											const isResolved = Boolean(activity.exerciseName);
											return (
												<div
													key={activity.id}
													className="rounded-2xl border border-default-200 bg-content1 p-4"
												>
													<div className="flex flex-col gap-4 md:flex-row">
														<div className="flex items-start gap-3 md:w-48 md:flex-col md:items-center">
															<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
																{index + 1}
															</div>
															<MediaThumbnail
																imageUrl={activity.imageAssetUrl}
																videoUrl={
																	!activity.imageAssetUrl
																		? activity.videoAssetUrl
																		: undefined
																}
																title={
																	activity.exerciseName ?? "알 수 없는 운동"
																}
																className="aspect-video w-full max-w-40"
															/>
														</div>
														<div className="flex-1">
															<div className="flex items-start justify-between gap-3">
																<div>
																	<p className="font-medium">
																		{activity.exerciseName ?? "알 수 없는 운동"}
																	</p>
																	<p className="mt-1 text-sm text-default-500">
																		루틴 순서 {activity.order}
																	</p>
																</div>
																<Chip
																	size="sm"
																	variant="flat"
																	color={isResolved ? "success" : "warning"}
																>
																	{isResolved ? "정상" : "확인필요"}
																</Chip>
															</div>
															<div className="mt-3 flex flex-wrap gap-4 text-sm text-default-500">
																<span>반복 횟수: {activity.repetitions}회</span>
																<span>
																	휴식 시간:{" "}
																	{activity.restTime > 0
																		? `${activity.restTime}초`
																		: "없음"}
																</span>
															</div>
															{activity.notes ? (
																<p className="mt-2 text-sm text-default-400">
																	메모: {activity.notes}
																</p>
															) : null}
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection
								top={<PageTitleBar level={2} title="사용 중인 프로그램" />}
							>
								{programs.length === 0 ? (
									<p className="text-sm text-default-500">
										현재 이 루틴을 사용하는 프로그램이 없습니다.
									</p>
								) : (
									<div className="flex flex-col gap-2">
										{programs.map((program) => (
											<div
												key={program.id}
												className="flex items-center justify-between rounded-lg bg-content2 p-3"
											>
												<p className="font-medium">{program.name}</p>
											</div>
										))}
									</div>
								)}
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
				<Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
					<ModalContent>
						<ModalHeader>루틴 삭제</ModalHeader>
						<ModalBody>
							<p>
								<strong>{routine.name}</strong> 루틴을 삭제하시겠습니까?
							</p>
							{programs.length > 0 ? (
								<p className="mt-2 text-sm text-warning">
									현재 {programs.length}개의 프로그램에서 사용 중입니다.
								</p>
							) : null}
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
			</DetailPage>
		);
	},
);
