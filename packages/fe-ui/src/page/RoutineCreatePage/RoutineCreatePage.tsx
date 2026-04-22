"use client";

import {
	DragHandle,
	DraggableSortableList,
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	MediaThumbnail,
	PageTitleBar,
} from "@cocrepo/ui";
import {
	Button,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

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

export interface RoutineCreatePageProps {
	name: string;
	label: string;
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

function CandidateTaskCard({
	task,
	onClickAdd,
}: {
	task: RoutineTaskCandidate;
	onClickAdd: (taskId: string) => void;
}) {
	return (
		<div className="rounded-2xl border border-default-200 bg-content1 p-3">
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
							<p className="mt-1 text-xs text-default-500">
								기본 반복 {task.exerciseCount}회
							</p>
						</div>
						<Chip
							size="sm"
							variant="flat"
							color={task.isSchedulable ? "success" : "warning"}
						>
							{task.isSchedulable ? "가능" : "불가"}
						</Chip>
					</div>
					<div className="mt-3 flex justify-end">
						<Button
							size="sm"
							variant="flat"
							color="primary"
							onPress={() => onClickAdd(task.id)}
						>
							추가
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function ActivityCard({
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
	return (
		<div className="rounded-2xl border border-default-200 bg-content1 p-4">
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="flex items-start gap-3 md:w-44 md:flex-col md:items-center">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
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
							<p className="mt-1 text-sm text-default-500">
								드래그해서 루틴 순서를 조정할 수 있습니다.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Chip
								color={activity.isSchedulable ? "success" : "warning"}
								size="sm"
								variant="flat"
							>
								{activity.isSchedulable ? "비디오 연결" : "비디오 필요"}
							</Chip>
							<Button
								size="sm"
								variant="flat"
								color="danger"
								onPress={() => onClickRemoveActivityButton(activity.taskId)}
							>
								제거
							</Button>
						</div>
					</div>
					{!activity.isSchedulable ? (
						<p className="mb-3 text-sm text-warning">
							영상이 없어 Program 생성에 사용할 수 없는 운동입니다.
						</p>
					) : null}
					<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
						<Input
							type="number"
							label="반복 횟수"
							value={activity.repetitions}
							onValueChange={(value) =>
								onChangeActivityInput(activity.taskId, "repetitions", value)
							}
							min={1}
						/>
						<Input
							type="number"
							label="휴식 시간(초)"
							value={activity.restTime}
							onValueChange={(value) =>
								onChangeActivityInput(activity.taskId, "restTime", value)
							}
							min={0}
						/>
						<Input
							label="메모"
							value={activity.notes}
							onValueChange={(value) =>
								onChangeActivityInput(activity.taskId, "notes", value)
							}
							placeholder="필요 시 메모를 입력하세요."
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export function RoutineActivitySection({
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
	RoutineCreatePageProps,
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
	return (
		<FormSectionCard>
			<FormSection top={<PageTitleBar level={2} title="활동 구성" />}>
				<div className="flex flex-col gap-4">
					<Input
						label="운동 검색"
						placeholder="운동 이름으로 검색하세요."
						value={exerciseQuery}
						onValueChange={onChangeExerciseQueryInput}
						description="현재 Space + 상위 Space 운동 중 비디오가 연결된 운동만 후보로 표시합니다."
					/>
					<div className="rounded-2xl border border-default-200 p-4">
						<div className="mb-3 flex items-center justify-between gap-3">
							<div>
								<p className="font-medium">후보 운동</p>
								<p className="text-sm text-default-500">
									이미지는 썸네일, 비디오는 편성 가능 여부 기준으로 사용합니다.
								</p>
							</div>
						</div>
						{isTasksLoading ? (
							<div className="flex items-center gap-2 text-sm text-default-500">
								<Spinner size="sm" />
								<span>운동 목록을 불러오는 중...</span>
							</div>
						) : candidateTasks.length === 0 ? (
							<p className="text-sm text-default-500">
								조건에 맞는 스케줄 가능 운동이 없습니다.
							</p>
						) : (
							<div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
								{candidateTasks.map((task) => (
									<CandidateTaskCard
										key={task.id}
										task={task}
										onClickAdd={onClickAddActivityButton}
									/>
								))}
							</div>
						)}
					</div>
					<div className="rounded-2xl border border-default-200 p-4">
						<div className="mb-3 flex items-center justify-between gap-3">
							<div>
								<p className="font-medium">추가된 활동</p>
								<p className="text-sm text-default-500">
									드래그로 순서를 바꾸면 저장 순서에도 그대로 반영됩니다.
								</p>
							</div>
							<Chip size="sm" variant="flat" color="primary">
								{activities.length}개
							</Chip>
						</div>
						{activitiesError ? (
							<p className="mb-3 text-sm text-danger">{activitiesError}</p>
						) : null}
						{activities.length === 0 ? (
							<p className="text-sm text-default-500">
								아직 추가된 활동이 없습니다.
							</p>
						) : (
							<DraggableSortableList
								items={activities.map((activity) => ({
									...activity,
									id: activity.taskId,
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
			</FormSection>
		</FormSectionCard>
	);
}

export const RoutineCreatePage = observer(
	({
		name,
		label,
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
	}: RoutineCreatePageProps) => {
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
			<FormPage
				top={
					<PageTitleBar
						title="루틴 등록"
						description="새로운 운동 루틴을 등록합니다."
						actions={pageActions}
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<FormSection top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="flex flex-col gap-4">
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
						</FormSection>
					</FormSectionCard>
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
				</FormPageSurface>
				<Modal
					isOpen={isEmptyActivitiesWarningOpen}
					onClose={onCloseEmptyActivitiesWarningModal}
				>
					<ModalContent>
						<ModalHeader>활동 없이 저장</ModalHeader>
						<ModalBody>
							<p>활동이 0개인 루틴입니다. 이대로 저장하시겠습니까?</p>
						</ModalBody>
						<ModalFooter>
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
								저장 진행
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</FormPage>
		);
	},
);
