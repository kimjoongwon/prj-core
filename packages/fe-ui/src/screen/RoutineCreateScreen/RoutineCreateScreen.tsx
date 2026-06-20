"use client";

import {
	Button,
	ContentLanguageNotice,
	DraggableSortableList,
	DragHandle,
	Input,
	MediaThumbnail,
	PageTitleBar,
	SectionSurface,
	useT,
	VStack,
} from "@cocrepo/ui";
import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";
import { Chip } from "../../data-display/Chip/Chip";
export interface RoutineActivityFormItem {
	taskId: string;
	exerciseName: string;
	isSchedulable: boolean;
	imageFileId?: string;
	videoFileId?: string;
	imageAssetUrl?: string;
	videoAssetUrl?: string;
	repetitions: string;
	restTime: string;
	notes: string;
}
export interface RoutineTaskCandidate {
	id: string;
	exerciseName: string;
	exerciseCount: number;
	isSchedulable: boolean;
	imageFileId?: string;
	videoFileId?: string;
	imageAssetUrl?: string;
	videoAssetUrl?: string;
}
export interface RoutineCreateScreenProps {
	name: string;
	label: string;
	contentLanguageCode?: string | null;
	exerciseQuery: string;
	activities: RoutineActivityFormItem[];
	candidateTasks: RoutineTaskCandidate[];
	nameError?: string;
	labelError?: string;
	activitiesError?: string;
	isTasksLoading: boolean;
	isSubmitting: boolean;
	isEmptyActivitiesWarningOpen: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeLabelInput: (value: string) => void;
	onChangeExerciseQueryInput: (value: string) => void;
	onClickAddActivityButton: (taskId: string) => void;
	onChangeActivityInput: (
		taskId: string,
		field: "repetitions" | "restTime" | "notes",
		value: string,
	) => void;
	onClickRemoveActivityButton: (taskId: string) => void;
	onReorderActivities: (fromIndex: number, toIndex: number) => void;
	onClickCancelButton: () => void;
	onClickSaveButton: () => void;
	onCloseEmptyActivitiesWarningModal: () => void;
	onClickConfirmEmptyActivitiesWarningButton: () => void;
}
function RoutineMediaThumbnail({
	title,
	imageAssetUrl,
	videoAssetUrl,
	className,
}: {
	title: string;
	imageAssetUrl?: string;
	videoAssetUrl?: string;
	className?: string;
}) {
	return (
		<MediaThumbnail
			imageUrl={imageAssetUrl}
			videoUrl={!imageAssetUrl ? videoAssetUrl : undefined}
			title={title}
			className={className}
		/>
	);
}
const CandidateTaskCard = observer(function CandidateTaskCard({
	task,
	onClickAdd,
}: {
	task: RoutineTaskCandidate;
	onClickAdd: (taskId: string) => void;
}) {
	const t = useT();
	return (
		<div className="rounded-2xl border border-border bg-surface p-3">
			<div className="flex gap-3">
				<RoutineMediaThumbnail
					title={task.exerciseName}
					imageAssetUrl={task.imageAssetUrl}
					videoAssetUrl={task.videoAssetUrl}
					className="aspect-video w-28 shrink-0"
				/>
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<p className="line-clamp-2 font-medium">{task.exerciseName}</p>
							<p className="mt-1 text-xs text-muted">
								{t("기본 반복")} {task.exerciseCount}
								{t("회")}
							</p>
						</div>
						<Chip
							size="sm"
							variant="flat"
							color={task.isSchedulable ? "success" : "warning"}
						>
							{task.isSchedulable ? t("가능") : t("불가")}
						</Chip>
					</div>
					<div className="mt-3 flex justify-end">
						<Button
							size="sm"
							variant="flat"
							color="primary"
							onPress={() => onClickAdd(task.id)}
						>
							{t("추가")}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
});
const ActivityCard = observer(function ActivityCard({
	activity,
	index,
	onChangeActivityInput,
	onClickRemoveActivityButton,
	dragHandle,
}: {
	activity: RoutineActivityFormItem;
	index: number;
	onChangeActivityInput: (
		taskId: string,
		field: "repetitions" | "restTime" | "notes",
		value: string,
	) => void;
	onClickRemoveActivityButton: (taskId: string) => void;
	dragHandle: ComponentProps<typeof DragHandle>;
}) {
	const t = useT();
	return (
		<div className="rounded-2xl border border-border bg-surface p-4">
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex items-start gap-3 md:w-44 md:flex-col md:items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
						{index + 1}
					</div>
					<DragHandle {...dragHandle} className="mt-1" />
					<RoutineMediaThumbnail
						title={activity.exerciseName}
						imageAssetUrl={activity.imageAssetUrl}
						videoAssetUrl={activity.videoAssetUrl}
						className="aspect-video w-full max-w-40"
					/>
				</div>
				<div className="flex-1">
					<div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
						<div>
							<p className="font-medium">{activity.exerciseName}</p>
							<p className="mt-1 text-sm text-muted">
								{t("드래그해서 루틴 순서를 조정할 수 있습니다.")}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Chip
								color={activity.isSchedulable ? "success" : "warning"}
								size="sm"
								variant="flat"
							>
								{activity.isSchedulable ? t("비디오 연결") : t("비디오 필요")}
							</Chip>
							<Button
								size="sm"
								variant="flat"
								color="danger"
								onPress={() => onClickRemoveActivityButton(activity.taskId)}
							>
								{t("제거")}
							</Button>
						</div>
					</div>
					{!activity.isSchedulable ? (
						<p className="mb-3 text-sm text-warning">
							{t("영상이 없어 Program 생성에 사용할 수 없는 운동입니다.")}
						</p>
					) : null}
					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						<Input
							type="number"
							label="반복 횟수"
							value={activity.repetitions}
							onValueChange={(value: string) =>
								onChangeActivityInput(activity.taskId, "repetitions", value)
							}
							min={1}
						/>
						<Input
							type="number"
							label="휴식 시간(초)"
							value={activity.restTime}
							onValueChange={(value: string) =>
								onChangeActivityInput(activity.taskId, "restTime", value)
							}
							min={0}
						/>
						<Input
							label="메모"
							value={activity.notes}
							onValueChange={(value: string) =>
								onChangeActivityInput(activity.taskId, "notes", value)
							}
							placeholder="필요 시 메모를 입력하세요."
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
export const RoutineActivitySection = observer(function RoutineActivitySection({
	exerciseQuery,
	candidateTasks,
	activities,
	activitiesError,
	isTasksLoading,
	onChangeExerciseQueryInput,
	onClickAddActivityButton,
	onChangeActivityInput,
	onClickRemoveActivityButton,
	onReorderActivities,
}: Pick<
	RoutineCreateScreenProps,
	| "exerciseQuery"
	| "candidateTasks"
	| "activities"
	| "activitiesError"
	| "isTasksLoading"
	| "onChangeExerciseQueryInput"
	| "onClickAddActivityButton"
	| "onChangeActivityInput"
	| "onClickRemoveActivityButton"
	| "onReorderActivities"
>) {
	const t = useT();
	return (
		<SectionSurface top={<PageTitleBar level={2} title="활동 구성" />}>
			<div className="flex flex-col gap-4">
				<Input
					label="운동 검색"
					placeholder="운동 이름으로 검색하세요."
					value={exerciseQuery}
					onValueChange={onChangeExerciseQueryInput}
					description="현재 Space + 상위 Space 운동 중 비디오가 연결된 운동만 후보로 표시합니다."
				/>
				<div className="rounded-2xl border border-border p-4">
					<div className="mb-3 flex items-center justify-between gap-3">
						<div>
							<p className="font-medium">{t("후보 운동")}</p>
							<p className="text-sm text-muted">
								{t(
									"이미지는 썸네일, 비디오는 편성 가능 여부 기준으로 사용합니다.",
								)}
							</p>
						</div>
					</div>
					{isTasksLoading ? (
						<div className="flex items-center gap-2 text-sm text-muted">
							<Spinner size="sm" />
							<span>{t("운동 목록을 불러오는 중...")}</span>
						</div>
					) : candidateTasks.length === 0 ? (
						<p className="text-sm text-muted">
							{t("조건에 맞는 스케줄 가능 운동이 없습니다.")}
						</p>
					) : (
						<div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
							{candidateTasks.map((task, index) => (
								<CandidateTaskCard
									key={`${task.id}:${index}`}
									task={task}
									onClickAdd={onClickAddActivityButton}
								/>
							))}
						</div>
					)}
				</div>
				<div className="rounded-2xl border border-border p-4">
					<div className="mb-3 flex items-center justify-between gap-3">
						<div>
							<p className="font-medium">{t("추가된 활동")}</p>
							<p className="text-sm text-muted">
								{t("드래그로 순서를 바꾸면 저장 순서에도 그대로 반영됩니다.")}
							</p>
						</div>
						<Chip size="sm" variant="flat" color="primary">
							{activities.length}
							{t("개")}
						</Chip>
					</div>
					{activitiesError ? (
						<p className="mb-3 text-sm text-danger">{activitiesError}</p>
					) : null}
					{activities.length === 0 ? (
						<p className="text-sm text-muted">
							{t("아직 추가된 활동이 없습니다.")}
						</p>
					) : (
						<DraggableSortableList
							items={activities.map((activity, index) => ({
								...activity,
								id: `${activity.taskId}:${index}`,
							}))}
							onReorder={onReorderActivities}
							renderItem={(activity, index, dragHandleProps) => (
								<ActivityCard
									activity={activity}
									index={index}
									onChangeActivityInput={onChangeActivityInput}
									onClickRemoveActivityButton={onClickRemoveActivityButton}
									dragHandle={dragHandleProps}
								/>
							)}
							className="gap-3"
						/>
					)}
				</div>
			</div>
		</SectionSurface>
	);
});
export const RoutineCreateScreen = observer(
	({
		name,
		label,
		contentLanguageCode,
		exerciseQuery,
		activities,
		candidateTasks,
		nameError,
		labelError,
		activitiesError,
		isTasksLoading,
		isSubmitting,
		isEmptyActivitiesWarningOpen,
		onChangeNameInput,
		onChangeLabelInput,
		onChangeExerciseQueryInput,
		onClickAddActivityButton,
		onChangeActivityInput,
		onClickRemoveActivityButton,
		onReorderActivities,
		onClickCancelButton,
		onClickSaveButton,
		onCloseEmptyActivitiesWarningModal,
		onClickConfirmEmptyActivitiesWarningButton,
	}: RoutineCreateScreenProps) => {
		const t = useT();
		const emptyActivitiesWarningState = useOverlayState({
			isOpen: isEmptyActivitiesWarningOpen,
			onOpenChange: (open) => {
				if (!open) {
					onCloseEmptyActivitiesWarningModal();
				}
			},
		});
		const pageActions = (
			<div className="flex gap-2">
				<Button
					variant="flat"
					onPress={onClickCancelButton}
					isDisabled={isSubmitting}
				>
					취소
				</Button>
				<Button
					color="primary"
					onPress={onClickSaveButton}
					isLoading={isSubmitting}
				>
					저장
				</Button>
			</div>
		);
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="루틴 등록"
					description="새로운 운동 루틴을 등록합니다."
					actions={pageActions}
				/>

				<SectionSurface>
					<SectionSurface top={<PageTitleBar level={2} title="기본 정보" />}>
						<div className="flex flex-col gap-4">
							<ContentLanguageNotice
								contentLanguageCode={contentLanguageCode}
							/>
							<Input
								label="루틴 이름"
								placeholder="예: 풀바디 루틴 A"
								value={name}
								onValueChange={onChangeNameInput}
								isRequired
								isInvalid={Boolean(nameError)}
								errorMessage={nameError}
								maxLength={100}
							/>
							<Input
								label="단축 라벨"
								placeholder="예: FULL-A"
								value={label}
								onValueChange={onChangeLabelInput}
								isRequired
								isInvalid={Boolean(labelError)}
								errorMessage={labelError}
								maxLength={50}
							/>
						</div>
					</SectionSurface>
					<RoutineActivitySection
						exerciseQuery={exerciseQuery}
						candidateTasks={candidateTasks}
						activities={activities}
						activitiesError={activitiesError}
						isTasksLoading={isTasksLoading}
						onChangeExerciseQueryInput={onChangeExerciseQueryInput}
						onClickAddActivityButton={onClickAddActivityButton}
						onChangeActivityInput={onChangeActivityInput}
						onClickRemoveActivityButton={onClickRemoveActivityButton}
						onReorderActivities={onReorderActivities}
					/>
				</SectionSurface>
				<Modal state={emptyActivitiesWarningState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>{t("활동 없이 저장")}</Modal.Header>
								<Modal.Body>
									<p>
										{t("활동이 0개인 루틴입니다. 이대로 저장하시겠습니까?")}
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={onCloseEmptyActivitiesWarningModal}
										isDisabled={isSubmitting}
									>
										취소
									</Button>
									<Button
										color="warning"
										onPress={onClickConfirmEmptyActivitiesWarningButton}
										isLoading={isSubmitting}
									>
										{t("저장 진행")}
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
