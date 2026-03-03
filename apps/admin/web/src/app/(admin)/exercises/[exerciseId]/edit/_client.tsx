"use client";
import {
	type ExerciseDto,
	useGetExercise,
	useUpdateExercise,
} from "@cocrepo/api";
import { addToast, Button, Input, Spinner, Textarea } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ExerciseEditPageClientProps {
	exerciseId: string;
}

/**
 * 운동 종목 수정 페이지 - 클라이언트 컴포넌트
 */
function ExerciseEditPageClient({ exerciseId }: ExerciseEditPageClientProps) {
	const router = useRouter();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		name: "",
		durationMin: 0,
		durationSec: 0,
		count: 1,
		description: "",
		errors: {} as Record<string, string>,
		isInitialized: false,
	}));

	// API 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetExercise(exerciseId);
	const exercise = response?.data as ExerciseDto | undefined;

	// 초기 데이터 로딩
	useEffect(() => {
		if (exercise && !state.isInitialized) {
			state.name = exercise.name;
			state.durationMin = Math.floor(exercise.duration / 60);
			state.durationSec = exercise.duration % 60;
			state.count = exercise.count;
			state.description = exercise.description || "";
			state.isInitialized = true;
		}
	}, [exercise, state]);

	// 수정 Mutation
	const { mutate: updateExercise, isPending } = useUpdateExercise({
		mutation: {
			onSuccess: () => {
				addToast({
					title: "운동 수정 성공",
					description: "운동 종목이 성공적으로 수정되었습니다.",
					color: "success",
				});
				router.push(`/exercises/${exerciseId}` as Route);
			},
			onError: (error) => {
				addToast({
					title: "운동 수정 실패",
					description: error.message || "운동 수정 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/** 취소 버튼 클릭 핸들러 - 상세 페이지로 이동 */
	const onClickCancelButton = () => {
		router.push(`/exercises/${exerciseId}` as Route);
	};

	/** 운동명 변경 핸들러 */
	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	/** 지속시간 분 변경 핸들러 */
	const onChangeDurationMin = (value: string) => {
		state.durationMin = Number(value) || 0;
		delete state.errors.duration;
	};

	/** 지속시간 초 변경 핸들러 */
	const onChangeDurationSec = (value: string) => {
		state.durationSec = Number(value) || 0;
		delete state.errors.duration;
	};

	/** 반복횟수 변경 핸들러 */
	const onChangeCount = (value: string) => {
		state.count = Number(value) || 1;
		delete state.errors.count;
	};

	/** 설명 변경 핸들러 */
	const onChangeDescription = (value: string) => {
		state.description = value;
	};

	/** 저장 버튼 클릭 핸들러 - 유효성 검증 후 API 호출 */
	const onClickSaveButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "운동명을 입력해주세요.";
		}

		const duration = state.durationMin * 60 + state.durationSec;
		if (duration < 1) {
			errors.duration = "지속시간은 1초 이상이어야 합니다.";
		}

		if (state.count < 1) {
			errors.count = "반복횟수는 1회 이상이어야 합니다.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		updateExercise({
			exerciseId,
			data: {
				name: state.name.trim(),
				duration,
				count: state.count,
				description: state.description.trim() || undefined,
			},
		});
	};

	// 로딩 상태
	if (isLoading) {
		return (
            <section><div className="flex items-start justify-between gap-4"><div><h1>{"운동 수정"}</h1><p>{"로딩 중..."}</p></div></div>
                <div className="flex items-center justify-center p-8 gap-2">
                    <Spinner size="sm" />
                    <span className="text-default-500">로딩 중...</span>
                </div>
            </section>
        );
	}

	// 데이터 없음
	if (!exercise) {
		return (
            <section><div className="flex items-start justify-between gap-4"><div><h1>{"운동 수정"}</h1><p>{"운동 종목을 찾을 수 없습니다."}</p></div></div>
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <p className="text-default-500">운동 종목을 찾을 수 없습니다.</p>
                    <Button variant="flat" onPress={onClickCancelButton}>목록으로
                                            </Button>
                </div>
            </section>
        );
	}

	return (
        <section><div className="flex items-start justify-between gap-4"><div><h1>{"운동 수정"}</h1>{`${exercise.name} 운동을 수정합니다.` && <p>{`${exercise.name} 운동을 수정합니다.`}</p>}</div><div>{<div className="flex gap-2">
                                    <Button variant="flat" onPress={onClickCancelButton} isDisabled={isPending}>취소
                                                            </Button>
                                    <Button color="primary" onPress={onClickSaveButton} isLoading={isPending}>저장
                                                            </Button>
                                </div>}</div></div>
            <section><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2"><div><h2>{"기본 정보"}</h2></div></div></div>
                <div className="flex flex-col gap-4">
                    <Input
                        label="운동명"
                        placeholder="운동 이름을 입력하세요"
                        value={state.name}
                        onValueChange={onChangeName}
                        isRequired
                        isInvalid={!!state.errors.name}
                        errorMessage={state.errors.name} />
                    <div>
                        <label className="block text-sm font-medium text-default-700 mb-1">지속시간 <span className="text-danger">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="분"
                                value={String(state.durationMin)}
                                onValueChange={onChangeDurationMin}
                                min={0}
                                endContent={<span className="text-default-400 text-sm">분</span>}
                                className="max-w-32" />
                            <Input
                                type="number"
                                placeholder="초"
                                value={String(state.durationSec)}
                                onValueChange={onChangeDurationSec}
                                min={0}
                                max={59}
                                endContent={<span className="text-default-400 text-sm">초</span>}
                                className="max-w-32" />
                        </div>
                        {state.errors.duration && (<p className="mt-1 text-sm text-danger">
                            {state.errors.duration}
                        </p>)}
                    </div>
                    <Input
                        label="반복횟수"
                        type="number"
                        placeholder="반복 횟수"
                        value={String(state.count)}
                        onValueChange={onChangeCount}
                        isRequired
                        min={1}
                        isInvalid={!!state.errors.count}
                        errorMessage={state.errors.count}
                        endContent={<span className="text-default-400 text-sm">회</span>} />
                    <Textarea
                        label="설명"
                        placeholder="운동 설명, 수행 방법 등을 입력하세요 (선택)"
                        value={state.description}
                        onValueChange={onChangeDescription}
                        maxLength={500}
                        minRows={3} />
                </div>
            </section>
        </section>
    );
}

export default observer(ExerciseEditPageClient);
