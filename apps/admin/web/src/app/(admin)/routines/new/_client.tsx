"use client";
import {
	type CreateRoutineActivityItemDto,
	type ExerciseDto,
	useCreateRoutine,
	useGetExercises,
} from "@cocrepo/api";
import {
	addToast,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
} from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface RoutineActivityFormItem {
	taskId: string;
	exerciseName: string;
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

/**
 * 루틴 등록 페이지 - 클라이언트 컴포넌트
 */
function RoutineNewPageClient() {
	const router = useRouter();
	const emptyActivitiesWarningModal = useDisclosure();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		name: "",
		label: "",
		exerciseQuery: "",
		activities: [] as RoutineActivityFormItem[],
		errors: {} as Record<string, string>,
	}));

	const { data: exercisesResponse, isLoading: isExercisesLoading } =
		useGetExercises({
			take: 30,
			skip: 0,
			search: state.exerciseQuery.trim() || undefined,
			spaceScope: "INCLUDE_ANCESTORS",
		});
	const candidateExercises = (exercisesResponse?.data ?? []) as ExerciseDto[];

	// 등록 Mutation
	const { mutate: createRoutine, isPending } = useCreateRoutine({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "루틴 등록 성공",
					description: "루틴이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const routineId = response?.data?.id;
				if (routineId) {
					router.push(`/routines/${routineId}` as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "루틴 등록 실패",
					description: error.message || "루틴 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/** 취소 버튼 클릭 핸들러 - 목록으로 이동 */
	const onClickCancelButton = () => {
		router.push("/routines" as Route);
	};

	/** 루틴명 변경 핸들러 */
	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	/** 라벨 변경 핸들러 */
	const onChangeLabel = (value: string) => {
		state.label = value;
		delete state.errors.label;
	};

	/** 저장 버튼 클릭 핸들러 - 유효성 검증 후 API 호출 */
	const submitRoutine = () => {
		createRoutine({
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

		if (state.activities.length === 0) {
			emptyActivitiesWarningModal.onOpen();
			return;
		}

		submitRoutine();
	};

	const onChangeExerciseQuery = (value: string) => {
		state.exerciseQuery = value;
	};

	const onClickAddActivity = (exercise: ExerciseDto) => {
		if (
			state.activities.some((activity) => activity.taskId === exercise.taskId)
		) {
			addToast({
				title: "중복 운동",
				description: "이미 추가된 운동입니다.",
				color: "warning",
			});
			return;
		}

		state.activities.push({
			taskId: exercise.taskId,
			exerciseName: exercise.name,
			repetitions: String(exercise.count || 1),
			restTime: "0",
			notes: "",
		});
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
	};

	return (
        <section><div className="flex items-start justify-between gap-4"><div><h1>{"루틴 등록"}</h1><p>{"새로운 운동 루틴을 등록합니다."}</p></div><div>{<div className="flex gap-2">
                                    <Button variant="flat" onPress={onClickCancelButton} isDisabled={isPending}>취소
                                                            </Button>
                                    <Button color="primary" onPress={onClickSaveButton} isLoading={isPending}>저장
                                                            </Button>
                                </div>}</div></div>
            <section><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2"><div><h2>{"기본 정보"}</h2></div></div></div>
                <div className="flex flex-col gap-4">
                    <Input
                        label="루틴 이름"
                        placeholder="예: 풀바디 루틴 A"
                        value={state.name}
                        onValueChange={onChangeName}
                        isRequired
                        isInvalid={!!state.errors.name}
                        errorMessage={state.errors.name}
                        maxLength={100} />
                    <Input
                        label="단축 라벨"
                        placeholder="예: FULL-A"
                        value={state.label}
                        onValueChange={onChangeLabel}
                        isRequired
                        isInvalid={!!state.errors.label}
                        errorMessage={state.errors.label}
                        maxLength={50} />
                </div>
            </section>
            <section><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2"><div><h2>{"활동 구성"}</h2></div></div></div>
                <div className="flex flex-col gap-4">
                    <Input
                        label="운동 검색"
                        placeholder="운동 이름으로 검색하세요."
                        value={state.exerciseQuery}
                        onValueChange={onChangeExerciseQuery}
                        description="현재 Space + 상위 Space 운동이 조회됩니다." />
                    <div className="rounded-lg border border-default-200 p-3">
                        <div className="mb-2 text-sm text-default-500">후보 운동</div>
                        {isExercisesLoading ? (<div className="flex items-center gap-2 text-sm text-default-500">
                            <Spinner size="sm" />
                            <span>운동 목록을 불러오는 중...</span>
                        </div>) : candidateExercises.length === 0 ? (<p className="text-sm text-default-500">검색 결과가 없습니다.</p>) : (<div className="flex flex-col gap-2">
                            {candidateExercises.map(exercise => (<div
                                key={exercise.taskId}
                                className="flex items-center justify-between rounded-md bg-content2 px-3 py-2">
                                <div>
                                    <p className="font-medium">{exercise.name}</p>
                                    <p className="text-xs text-default-500">기본 반복 {exercise.count}회
                                                                                    </p>
                                </div>
                                <Button size="sm" variant="flat" onPress={() => onClickAddActivity(exercise)}>추가
                                                                            </Button>
                            </div>))}
                        </div>)}
                    </div>
                    <div className="rounded-lg border border-default-200 p-3">
                        <div className="mb-2 text-sm text-default-500">추가된 활동</div>
                        {state.activities.length === 0 ? (<p className="text-sm text-default-500">아직 추가된 활동이 없습니다.
                                                        </p>) : (<div className="flex flex-col gap-3">
                            {state.activities.map(
                                (activity, index) => (<div key={activity.taskId} className="rounded-md bg-content2 p-3">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="font-medium">
                                            {index + 1}. {activity.exerciseName}
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="danger"
                                            onPress={() => onClickRemoveActivity(activity.taskId)}>제거
                                                                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                        <Input
                                            type="number"
                                            label="반복 횟수"
                                            value={activity.repetitions}
                                            onValueChange={value => onChangeActivityField(activity.taskId, "repetitions", value)}
                                            min={1} />
                                        <Input
                                            type="number"
                                            label="휴식 시간(초)"
                                            value={activity.restTime}
                                            onValueChange={value => onChangeActivityField(activity.taskId, "restTime", value)}
                                            min={0} />
                                        <Input
                                            label="메모"
                                            value={activity.notes}
                                            onValueChange={value => onChangeActivityField(activity.taskId, "notes", value)}
                                            placeholder="필요 시 메모를 입력하세요." />
                                    </div>
                                </div>),
                            )}
                        </div>)}
                    </div>
                </div>
            </section>
            <Modal
                isOpen={emptyActivitiesWarningModal.isOpen}
                onClose={emptyActivitiesWarningModal.onClose}>
                <ModalContent>
                    <ModalHeader>활동 없이 저장</ModalHeader>
                    <ModalBody>
                        <p>활동이 0개인 루틴입니다. 이대로 저장하시겠습니까?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="flat"
                            onPress={emptyActivitiesWarningModal.onClose}
                            isDisabled={isPending}>취소
                                                    </Button>
                        <Button
                            color="warning"
                            onPress={() => {
                                emptyActivitiesWarningModal.onClose();
                                submitRoutine();
                            }}
                            isLoading={isPending}>저장 진행
                                                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </section>
    );
}

export default observer(RoutineNewPageClient);
