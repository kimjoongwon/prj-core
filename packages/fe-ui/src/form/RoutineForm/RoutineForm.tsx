"use client";

import { Card, Spinner } from "@heroui/react";
import { ImageIcon, PlayCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";
import { DraggableSortableList, DragHandle } from "../../data-display";
import { Chip } from "../../data-display/Chip/Chip";
import {
	getContentLanguageLabel,
	toContentLanguageCode,
} from "../../data-display/content-language";
import { Alert } from "../../feedback/Alert/Alert";
import { Button } from "../../input/Button/Button";
import { TextField } from "../../input/TextField";
import { Section } from "../../layout";
export type RoutineFormField =
	| "name"
	| "label"
	| "exerciseQuery"
	| "activities";
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
export interface RoutineFormState {
	name: string;
	label: string;
	exerciseQuery: string;
	activities: RoutineActivityFormItem[];
	errors: Partial<Record<RoutineFormField, string>>;
}
export interface RoutineFormProps {
	state: RoutineFormState;
	contentLanguageCode?: string | null;
	candidateTasks?: RoutineTaskCandidate[];
	activities?: RoutineActivityFormItem[];
	isTasksLoading?: boolean;
	readOnly?: boolean;
}
const RoutineMediaThumbnail = ({
	title,
	imageAssetUrl,
	videoAssetUrl,
	className,
}: {
	title: string;
	imageAssetUrl?: string;
	videoAssetUrl?: string;
	className?: string;
}) => {
	const mediaClassName = `relative overflow-hidden rounded-xl bg-surface-secondary ${className ?? ""}`;
	if (imageAssetUrl) {
		return (
			<Card className={mediaClassName}>
				<img
					src={imageAssetUrl}
					alt={title}
					className="h-full w-full object-cover"
					loading="lazy"
				/>
			</Card>
		);
	}
	if (videoAssetUrl) {
		return (
			<Card className={mediaClassName}>
				<video
					src={videoAssetUrl}
					className="h-full w-full object-cover"
					muted
					playsInline
					preload="metadata"
				/>
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<PlayCircle className="h-8 w-8 text-white/90" />
				</div>
			</Card>
		);
	}
	return (
		<Card
			className={`flex items-center justify-center rounded-xl border border-dashed border-border bg-surface-secondary text-muted ${className ?? ""}`}
		>
			<div className="flex flex-col items-center gap-2">
				<ImageIcon className="h-7 w-7" />
				<span className="text-xs">미리보기 없음</span>
			</div>
		</Card>
	);
};
const CandidateTaskCard = observer(
	({
		task,
		onClickAdd,
	}: {
		task: RoutineTaskCandidate;
		onClickAdd: (taskId: string) => void;
	}) => {
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
	},
);
const ActivityCard = observer(
	({
		activity,
		index,
		isEditable,
		onChangeActivityInput,
		onClickRemoveActivityButton,
		dragHandle,
	}: {
		activity: RoutineActivityFormItem;
		index: number;
		isEditable: boolean;
		onChangeActivityInput: (
			taskId: string,
			field: "repetitions" | "restTime" | "notes",
			value: string,
		) => void;
		onClickRemoveActivityButton: (taskId: string) => void;
		dragHandle?: ComponentProps<typeof DragHandle>;
	}) => {
		return (
			<div className="rounded-2xl border border-border bg-surface p-4">
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="flex items-start gap-3 md:w-44 md:flex-col md:items-center">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
							{index + 1}
						</div>
						{isEditable && dragHandle ? (
							<DragHandle {...dragHandle} className="mt-1" />
						) : null}
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
									{isEditable
										? "드래그해서 루틴 순서를 조정할 수 있습니다."
										: `루틴 순서 ${index + 1}`}
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
								{isEditable ? (
									<Button
										size="sm"
										variant="flat"
										color="danger"
										onPress={() => onClickRemoveActivityButton(activity.taskId)}
									>
										제거
									</Button>
								) : null}
							</div>
						</div>
						{!activity.isSchedulable ? (
							<p className="mb-3 text-sm text-warning">
								영상이 없어 Program 생성에 사용할 수 없는 운동입니다.
							</p>
						) : null}
						<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
							<TextField
								type="number"
								label="반복 횟수"
								value={activity.repetitions}
								onValueChange={(value: string) =>
									onChangeActivityInput(activity.taskId, "repetitions", value)
								}
								isReadOnly={!isEditable}
								isDisabled={!isEditable}
								min={1}
							/>
							<TextField
								type="number"
								label="휴식 시간(초)"
								value={activity.restTime}
								onValueChange={(value: string) =>
									onChangeActivityInput(activity.taskId, "restTime", value)
								}
								isReadOnly={!isEditable}
								isDisabled={!isEditable}
								min={0}
							/>
							<TextField
								label="메모"
								value={activity.notes}
								onValueChange={(value: string) =>
									onChangeActivityInput(activity.taskId, "notes", value)
								}
								isReadOnly={!isEditable}
								isDisabled={!isEditable}
								placeholder="필요 시 메모를 입력하세요."
							/>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

/**
 * Routine aggregate의 편집 가능한 기본 정보와 활동 구성을 담당합니다.
 * route는 API와 submit만 소유하고, Form은 전달받은 observable state를 편집합니다.
 */
export const RoutineForm = observer(
	({
		state,
		contentLanguageCode,
		candidateTasks = [],
		activities,
		isTasksLoading = false,
		readOnly = false,
	}: RoutineFormProps) => {
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const languageLabel = getContentLanguageLabel(contentLanguageCode);
		const visibleActivities = activities ?? state.activities;
		const addActivity = (taskId: string) => {
			if (readOnly) {
				return;
			}
			const task = candidateTasks.find((item) => item.id === taskId);
			if (!task?.isSchedulable) {
				state.errors.activities =
					"영상이 등록된 운동만 루틴에 추가할 수 있습니다.";
				return;
			}
			if (state.activities.some((activity) => activity.taskId === task.id)) {
				state.errors.activities = "이미 추가된 운동입니다.";
				return;
			}
			state.activities.push({
				taskId: task.id,
				exerciseName: task.exerciseName,
				isSchedulable: task.isSchedulable,
				imageFileId: task.imageFileId,
				videoFileId: task.videoFileId,
				imageAssetUrl: task.imageAssetUrl,
				videoAssetUrl: task.videoAssetUrl,
				repetitions: String(task.exerciseCount || 1),
				restTime: "0",
				notes: "",
			});
			delete state.errors.activities;
		};
		const changeActivityInput = (
			taskId: string,
			field: "repetitions" | "restTime" | "notes",
			value: string,
		) => {
			if (readOnly) {
				return;
			}
			const activity = state.activities.find((item) => item.taskId === taskId);
			if (!activity) {
				return;
			}
			activity[field] = value;
		};
		const removeActivity = (taskId: string) => {
			if (readOnly) {
				return;
			}
			state.activities = state.activities.filter(
				(activity) => activity.taskId !== taskId,
			);
			delete state.errors.activities;
		};
		const reorderActivities = (fromIndex: number, toIndex: number) => {
			if (readOnly) {
				return;
			}
			const nextActivities = state.activities.slice();
			const [movedActivity] = nextActivities.splice(fromIndex, 1);
			if (!movedActivity) {
				return;
			}
			nextActivities.splice(toIndex, 0, movedActivity);
			state.activities = nextActivities;
		};
		return (
			<div className="flex flex-col gap-6">
				<Section>
					<Section.Header title="기본 정보" />
					<Section.Body>
						<div className="flex flex-col gap-4">
							<Alert
								status={languageCode ? "accent" : "warning"}
								title="현재 Space 콘텐츠 언어"
								actions={
									<Chip
										size="sm"
										variant="flat"
										color={languageCode ? "primary" : "warning"}
									>
										{languageLabel}
									</Chip>
								}
							/>
							<TextField
								label="루틴 이름"
								placeholder="예: 풀바디 루틴 A"
								state={state}
								path="name"
								isReadOnly={readOnly}
								isDisabled={readOnly}
								isRequired
								isInvalid={Boolean(state.errors.name)}
								errorMessage={state.errors.name}
								maxLength={100}
								onValueChange={() => {
									if (state.errors.name) {
										delete state.errors.name;
									}
								}}
							/>
							<TextField
								label="단축 라벨"
								placeholder="예: FULL-A"
								state={state}
								path="label"
								isReadOnly={readOnly}
								isDisabled={readOnly}
								isRequired
								isInvalid={Boolean(state.errors.label)}
								errorMessage={state.errors.label}
								maxLength={50}
								onValueChange={() => {
									if (state.errors.label) {
										delete state.errors.label;
									}
								}}
							/>
						</div>
					</Section.Body>
				</Section>
				<Section>
					<Section.Header title="활동 구성" />
					<Section.Body>
						<div className="flex flex-col gap-4">
							{!readOnly ? (
								<>
									<TextField
										label="운동 검색"
										placeholder="운동 이름으로 검색하세요."
										state={state}
										path="exerciseQuery"
										isReadOnly={readOnly}
										isDisabled={readOnly}
										description="현재 Space + 상위 Space 운동 중 비디오가 연결된 운동만 후보로 표시합니다."
									/>
									<div className="rounded-2xl border border-border p-4">
										<div className="mb-3">
											<p className="font-medium">후보 운동</p>
											<p className="text-sm text-muted">
												이미지는 썸네일, 비디오는 편성 가능 여부 기준으로
												사용합니다.
											</p>
										</div>
										{isTasksLoading ? (
											<div className="flex items-center gap-2 text-sm text-muted">
												<Spinner size="sm" />
												<span>운동 목록을 불러오는 중...</span>
											</div>
										) : candidateTasks.length === 0 ? (
											<p className="text-sm text-muted">
												조건에 맞는 스케줄 가능 운동이 없습니다.
											</p>
										) : (
											<div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
												{candidateTasks.map((task) => (
													<CandidateTaskCard
														key={task.id}
														task={task}
														onClickAdd={addActivity}
													/>
												))}
											</div>
										)}
									</div>
								</>
							) : null}
							<div className="rounded-2xl border border-border p-4">
								<div className="mb-3 flex items-center justify-between gap-3">
									<div>
										<p className="font-medium">추가된 활동</p>
										<p className="text-sm text-muted">
											{!readOnly
												? "드래그로 순서를 바꾸면 저장 순서에도 그대로 반영됩니다."
												: "루틴에 연결된 활동입니다."}
										</p>
									</div>
									<Chip size="sm" variant="flat" color="primary">
										{visibleActivities.length}개
									</Chip>
								</div>
								{state.errors.activities ? (
									<p className="mb-3 text-sm text-danger">
										{state.errors.activities}
									</p>
								) : null}
								{visibleActivities.length === 0 ? (
									<p className="text-sm text-muted">
										아직 추가된 활동이 없습니다.
									</p>
								) : !readOnly ? (
									<DraggableSortableList
										items={visibleActivities.map((activity, index) => ({
											...activity,
											id: `${activity.taskId}:${index}`,
										}))}
										onReorder={reorderActivities}
										renderItem={(activity, index, dragHandleProps) => (
											<ActivityCard
												activity={activity}
												index={index}
												isEditable={!readOnly}
												onChangeActivityInput={changeActivityInput}
												onClickRemoveActivityButton={removeActivity}
												dragHandle={dragHandleProps}
											/>
										)}
										className="gap-3"
									/>
								) : (
									<div className="flex flex-col gap-3">
										{visibleActivities.map((activity, index) => (
											<ActivityCard
												key={`${activity.taskId}:${index}`}
												activity={activity}
												index={index}
												isEditable={false}
												onChangeActivityInput={changeActivityInput}
												onClickRemoveActivityButton={removeActivity}
											/>
										))}
									</div>
								)}
							</div>
						</div>
					</Section.Body>
				</Section>
			</div>
		);
	},
);
