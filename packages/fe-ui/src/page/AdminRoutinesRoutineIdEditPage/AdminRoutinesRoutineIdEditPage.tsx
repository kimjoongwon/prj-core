"use client";
import {
	type CreateRoutineActivityItemDto,
	getGetRoutineQueryKey,
	type RoutineDto,
	useGetRoutine,
	useUpdateRoutine,
} from "@cocrepo/api/core/routines";
import { type TaskDto, useGetTasks } from "@cocrepo/api/core/tasks";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSection,
	FormSectionCard,
} from "@cocrepo/ui";
import {
	addToast,
	Button,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

interface RoutineActivityFormItem {
	taskId: string;
	exerciseName: string;
	isSchedulable: boolean;
	repetitions: string;
	restTime: string;
	notes: string;
}

const toPositiveNumberOr = (value: string, defaultValue: number) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 1) {
		return defaultValue;
	}
	return Math.floor(parsed);
};

const toNonNegativeNumberOr = (value: string, defaultValue: number) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) {
		return defaultValue;
	}
	return Math.floor(parsed);
};

interface RoutineEditPageClientProps {
	routineId: string;
}

/**
 * 루틴 수정 페이지 - 클라이언트 컴포넌트
 */
function RoutineEditPageClient({ routineId }: RoutineEditPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const emptyActivitiesWarningModal = useDisclosure();

	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		exerciseQuery: "",
		activities: [] as RoutineActivityFormItem[],
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	const { data: response, isLoading } = useGetRoutine(routineId);
	const routine = response?.data as RoutineDto | undefined;
	const { data: tasksResponse, isLoading: isTasksLoading } = useGetTasks({
		take: 30,
		skip: 0,
		search: state.exerciseQuery.trim() || undefined,
		spaceScope: "INCLUDE_ANCESTORS",
	});
	const candidateTasks = (tasksResponse?.data ?? []) as TaskDto[];
	const schedulableCandidateTasks = candidateTasks.filter((task) =>
		Boolean(task.exercise?.videoFileId),
	);

	useEffect(() => {
		if (routine && !state.isInitialized) {
			state.name = routine.name;
			state.label = routine.label;
			state.activities = (routine.activities ?? []).map((activity) => ({
				taskId: activity.taskId,
				exerciseName:
					activity.task?.exercise?.name ?? activity.taskId.slice(-6),
				isSchedulable: Boolean(activity.task?.exercise?.videoFileId),
				repetitions: String(activity.repetitions ?? 1),
				restTime: String(activity.restTime ?? 0),
				notes: activity.notes ?? "",
			}));
			state.isInitialized = true;
		}
	}, [routine, state]);

	const { mutate: updateRoutine, isPending } = useUpdateRoutine({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "루틴 수정 성공",
					description: "루틴이 성공적으로 수정되었습니다.",
					color: "success",
				});
				queryClient.invalidateQueries({
					queryKey: getGetRoutineQueryKey(routineId),
				});
				router.push(`/routines/${routineId}` as Route);
			},
			onError: (error) => {
				addToast({
					title: "루틴 수정 실패",
					description: error.message || "루틴 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	const onClickCancelButton = () => {
		router.push(`/routines/${routineId}` as Route);
	};

	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeLabel = (value: string) => {
		state.label = value;
		delete state.errors.label;
	};

	const submitRoutine = () => {
		updateRoutine({
			routineId,
			data: {
				name: state.name.trim(),
				label: state.label.trim(),
				activities: state.activities.map((activity, index) => ({
					taskId: activity.taskId,
					order: index + 1,
					repetitions: toPositiveNumberOr(activity.repetitions, 1),
					restTime: toNonNegativeNumberOr(activity.restTime, 0),
					notes: activity.notes.trim() || undefined,
				})) as unknown as CreateRoutineActivityItemDto,
			},
		});
	};

	const onClickSaveButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "루틴 이름을 입력해주세요.";
		}

		if (!state.label.trim()) {
			errors.label = "단축 라벨을 입력해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		if (state.activities.some((activity) => !activity.isSchedulable)) {
			state.errors.activities =
				"영상이 없는 운동이 포함되어 있어 루틴을 저장할 수 없습니다.";
			return;
		}

		if (state.activities.length === 0) {
			emptyActivitiesWarningModal.onOpen();
			return;
		}

		submitRoutine();
	};

	const onChangeExerciseQuery = (value: string) => {
		state.exerciseQuery = value;
	};

	const onClickAddActivity = (task: TaskDto) => {
		const exercise = task.exercise;
		if (!exercise.videoFileId) {
			addToast({
				title: "편성 불가 운동",
				description: "영상이 등록된 운동만 루틴에 추가할 수 있습니다.",
				color: "warning",
			});
			return;
		}

		if (state.activities.some((activity) => activity.taskId === task.id)) {
			addToast({
				title: "중복 운동",
				description: "이미 추가된 운동입니다.",
				color: "warning",
			});
			return;
		}

		state.activities.push({
			taskId: task.id,
			exerciseName: exercise.name,
			isSchedulable: true,
			repetitions: String(exercise.count || 1),
			restTime: "0",
			notes: "",
		});
		delete state.errors.activities;
	};

	const onChangeActivityField = (
		taskId: string,
		field: "repetitions" | "restTime" | "notes",
		value: string,
	) => {
		const target = state.activities.find(
			(activity) => activity.taskId === taskId,
		);
		if (!target) {
			return;
		}
		target[field] = value;
	};

	const onClickRemoveActivity = (taskId: string) => {
		state.activities = state.activities.filter(
			(activity) => activity.taskId !== taskId,
		);
		delete state.errors.activities;
	};

	if (isLoading) {
		return (
			<FormPage top={<PageTitleBar title="루틴 수정" description="로딩 중..." />}>
				<FormPageSurface>
					<FormSectionCard>
						<div className="flex items-center justify-center gap-2 p-8">
							<Spinner size="sm" />
							<span className="text-default-500">로딩 중...</span>
						</div>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	}

	if (!routine) {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="루틴 수정"
						description="루틴을 찾을 수 없습니다."
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">루틴을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={onClickCancelButton}>
								목록으로
							</Button>
						</div>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	}

	const pageActions = (
		<div className="flex gap-2">
			<Button
				variant="flat"
				onPress={onClickCancelButton}
				isDisabled={isPending}
			>
				취소
			</Button>
			<Button color="primary" onPress={onClickSaveButton} isLoading={isPending}>
				저장
			</Button>
		</div>
	);

	return (
		<FormPage
			top={
				<PageTitleBar
					title="루틴 수정"
					description={`${routine.name} 루틴을 수정합니다.`}
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
								value={state.name}
								onValueChange={onChangeName}
								isRequired
								isInvalid={!!state.errors.name}
								errorMessage={state.errors.name}
								maxLength={100}
							/>
							<Input
								label="단축 라벨"
								placeholder="예: FULL-A"
								value={state.label}
								onValueChange={onChangeLabel}
								isRequired
								isInvalid={!!state.errors.label}
								errorMessage={state.errors.label}
								maxLength={50}
							/>
						</div>
					</FormSection>
				</FormSectionCard>

				<FormSectionCard>
					<FormSection top={<PageTitleBar level={2} title="활동 구성" />}>
						<div className="flex flex-col gap-4">
							<Input
								label="운동 검색"
								placeholder="운동 이름으로 검색하세요."
								value={state.exerciseQuery}
								onValueChange={onChangeExerciseQuery}
								description="현재 Space + 상위 Space 운동 중 영상이 등록된 운동만 후보로 표시합니다."
							/>
							<div className="rounded-lg border border-default-200 p-3">
								<div className="mb-2 text-sm text-default-500">
									후보 운동 (스케줄 가능만 표시)
								</div>
								{isTasksLoading ? (
									<div className="flex items-center gap-2 text-sm text-default-500">
										<Spinner size="sm" />
										<span>운동 목록을 불러오는 중...</span>
									</div>
								) : schedulableCandidateTasks.length === 0 ? (
									<p className="text-sm text-default-500">
										조건에 맞는 스케줄 가능 운동이 없습니다.
									</p>
								) : (
									<div className="flex flex-col gap-2">
										{schedulableCandidateTasks.map((task) => (
											<div
												key={task.id}
												className="flex items-center justify-between rounded-md bg-content2 px-3 py-2"
											>
												<div>
													<p className="font-medium">{task.exercise.name}</p>
													<p className="text-xs text-default-500">
														기본 반복 {task.exercise.count}회
													</p>
												</div>
												<Button
													size="sm"
													variant="flat"
													onPress={() => onClickAddActivity(task)}
												>
													추가
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
							<div className="rounded-lg border border-default-200 p-3">
								<div className="mb-2 text-sm text-default-500">추가된 활동</div>
								{state.errors.activities ? (
									<p className="mb-3 text-sm text-danger">
										{state.errors.activities}
									</p>
								) : null}
								{state.activities.length === 0 ? (
									<p className="text-sm text-default-500">
										아직 추가된 활동이 없습니다.
									</p>
								) : (
									<div className="flex flex-col gap-3">
										{state.activities.map((activity, index) => (
											<div
												key={activity.taskId}
												className="rounded-md bg-content2 p-3"
											>
												<div className="mb-3 flex items-center justify-between">
													<p className="font-medium">
														{index + 1}. {activity.exerciseName}
													</p>
													<div className="flex items-center gap-2">
														<Chip
															color={
																activity.isSchedulable ? "success" : "warning"
															}
															size="sm"
														>
															{activity.isSchedulable ? "가능" : "불가"}
														</Chip>
														<Button
															size="sm"
															variant="flat"
															color="danger"
															onPress={() =>
																onClickRemoveActivity(activity.taskId)
															}
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
															onChangeActivityField(
																activity.taskId,
																"repetitions",
																value,
															)
														}
														min={1}
													/>
													<Input
														type="number"
														label="휴식 시간(초)"
														value={activity.restTime}
														onValueChange={(value) =>
															onChangeActivityField(
																activity.taskId,
																"restTime",
																value,
															)
														}
														min={0}
													/>
													<Input
														label="메모"
														value={activity.notes}
														onValueChange={(value) =>
															onChangeActivityField(
																activity.taskId,
																"notes",
																value,
															)
														}
														placeholder="필요 시 메모를 입력하세요."
													/>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</FormSection>
				</FormSectionCard>
			</FormPageSurface>

			<Modal
				isOpen={emptyActivitiesWarningModal.isOpen}
				onClose={emptyActivitiesWarningModal.onClose}
			>
				<ModalContent>
					<ModalHeader>활동 없이 저장</ModalHeader>
					<ModalBody>
						<p>활동이 0개인 루틴입니다. 이대로 저장하시겠습니까?</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={emptyActivitiesWarningModal.onClose}
							isDisabled={isPending}
						>
							취소
						</Button>
						<Button
							color="warning"
							onPress={() => {
								emptyActivitiesWarningModal.onClose();
								submitRoutine();
							}}
							isLoading={isPending}
						>
							저장 진행
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</FormPage>
	);
}

type RoutineEditPageParams = {
	routineId: string;
};

const RoutineEditPage = observer(function RoutineEditPage() {
	const { routineId } = useParams<RoutineEditPageParams>();

	return <RoutineEditPageClient routineId={routineId} />;
});

export const AdminRoutinesRoutineIdEditPage = RoutineEditPage;

export default AdminRoutinesRoutineIdEditPage;
