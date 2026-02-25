"use client";

import { useCreateExercise } from "@cocrepo/api";
import { PageSurface, SectionSurface } from "@cocrepo/ui";
import { addToast, Button, Input, Textarea } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

/**
 * 운동 종목 등록 페이지 - 클라이언트 컴포넌트
 */
function ExerciseNewPageClient() {
	const router = useRouter();

	// 로컬 상태
	const state = useLocalObservable(() => ({
		name: "",
		durationMin: 0,
		durationSec: 0,
		count: 1,
		description: "",
		errors: {} as Record<string, string>,
	}));

	// 등록 Mutation
	const { mutate: createExercise, isPending } = useCreateExercise({
		mutation: {
			onSuccess: (response) => {
				addToast({
					title: "운동 등록 성공",
					description: "운동 종목이 성공적으로 등록되었습니다.",
					color: "success",
				});
				const exerciseId = response?.data?.id;
				if (exerciseId) {
					router.push(`/exercises/${exerciseId}` as Route);
				}
			},
			onError: (error) => {
				addToast({
					title: "운동 등록 실패",
					description: error.message || "운동 등록 중 오류가 발생했습니다.",
					color: "danger",
				});
			},
		},
	});

	/** 취소 버튼 클릭 핸들러 - 목록으로 이동 */
	const onClickCancelButton = () => {
		router.push("/exercises" as Route);
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

		createExercise({
			data: {
				name: state.name.trim(),
				duration,
				count: state.count,
				description: state.description.trim() || undefined,
				spaceId: "",
			},
		});
	};

	return (
		<PageSurface
			title="운동 등록"
			description="새로운 운동 종목을 등록합니다."
			actions={
				<div className="flex gap-2">
					<Button
						variant="flat"
						onPress={onClickCancelButton}
						isDisabled={isPending}
					>
						취소
					</Button>
					<Button
						color="primary"
						onPress={onClickSaveButton}
						isLoading={isPending}
					>
						저장
					</Button>
				</div>
			}
		>
			<SectionSurface title="기본 정보">
				<div className="flex flex-col gap-4">
					<Input
						label="운동명"
						placeholder="운동 이름을 입력하세요"
						value={state.name}
						onValueChange={onChangeName}
						isRequired
						isInvalid={!!state.errors.name}
						errorMessage={state.errors.name}
					/>

					<div>
						<label className="block text-sm font-medium text-default-700 mb-1">
							지속시간 <span className="text-danger">*</span>
						</label>
						<div className="flex items-center gap-2">
							<Input
								type="number"
								placeholder="분"
								value={String(state.durationMin)}
								onValueChange={onChangeDurationMin}
								min={0}
								endContent={
									<span className="text-default-400 text-sm">분</span>
								}
								className="max-w-32"
							/>
							<Input
								type="number"
								placeholder="초"
								value={String(state.durationSec)}
								onValueChange={onChangeDurationSec}
								min={0}
								max={59}
								endContent={
									<span className="text-default-400 text-sm">초</span>
								}
								className="max-w-32"
							/>
						</div>
						{state.errors.duration && (
							<p className="mt-1 text-sm text-danger">
								{state.errors.duration}
							</p>
						)}
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
						endContent={<span className="text-default-400 text-sm">회</span>}
					/>

					<Textarea
						label="설명"
						placeholder="운동 설명, 수행 방법 등을 입력하세요 (선택)"
						value={state.description}
						onValueChange={onChangeDescription}
						maxLength={500}
						minRows={3}
					/>
				</div>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(ExerciseNewPageClient);
