"use client";

import { useCreateProgram, useGetSessionById } from "@cocrepo/api";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import {
	Button,
	Input,
	Select,
	SelectItem,
	addToast,
} from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface ProgramNewPageClientProps {
	timelineId: string;
	sessionId: string;
}

const LEVEL_OPTIONS = [
	{ value: "", label: "없음" },
	{ value: "초급", label: "초급" },
	{ value: "중급", label: "중급" },
	{ value: "고급", label: "고급" },
];

/**
 * 프로그램 등록 페이지 - 클라이언트 컴포넌트
 */
function ProgramNewPageClient({
	timelineId,
	sessionId,
}: ProgramNewPageClientProps) {
	const router = useRouter();

	const state = useLocalObservable(() => ({
		name: "",
		routineId: "",
		instructorId: "",
		capacity: "",
		level: "",
		errors: {} as Record<string, string>,
	}));

	const { data: sessionResponse } = useGetSessionById(timelineId, sessionId);
	const session = sessionResponse?.data;

	const { mutate: createProgram, isPending } = useCreateProgram();

	const onClickCancelButton = () => {
		router.push(
			`/timelines/${timelineId}/sessions/${sessionId}` as Route,
		);
	};

	const onChangeName = (value: string) => {
		state.name = value;
		delete state.errors.name;
	};

	const onChangeRoutineId = (value: string) => {
		state.routineId = value;
		delete state.errors.routineId;
	};

	const onChangeInstructorId = (value: string) => {
		state.instructorId = value;
		delete state.errors.instructorId;
	};

	const onChangeCapacity = (value: string) => {
		state.capacity = value;
		delete state.errors.capacity;
	};

	const onChangeLevel = (value: string) => {
		state.level = value;
	};

	const onClickSubmitButton = () => {
		const errors: Record<string, string> = {};

		if (!state.name.trim()) {
			errors.name = "프로그램 이름을 입력해주세요.";
		} else if (state.name.trim().length > 100) {
			errors.name = "프로그램 이름은 100자 이하로 입력해주세요.";
		}

		if (!state.routineId.trim()) {
			errors.routineId = "루틴 ID를 입력해주세요.";
		}

		if (!state.instructorId.trim()) {
			errors.instructorId = "강사 ID를 입력해주세요.";
		}

		const capacityNum = Number(state.capacity);
		if (!state.capacity || Number.isNaN(capacityNum) || capacityNum < 1) {
			errors.capacity = "정원은 1 이상의 숫자를 입력해주세요.";
		}

		if (Object.keys(errors).length > 0) {
			state.errors = errors;
			return;
		}

		createProgram(
			{
				timelineId,
				sessionId,
				data: {
					name: state.name.trim(),
					routineId: state.routineId.trim(),
					instructorId: state.instructorId.trim(),
					capacity: Number(state.capacity),
					level: state.level || undefined,
				},
			},
			{
				onSuccess: () => {
					addToast({
						title: "등록 성공",
						description: "프로그램이 등록되었습니다.",
						color: "success",
					});
					router.push(
						`/timelines/${timelineId}/sessions/${sessionId}` as Route,
					);
				},
				onError: () => {
					addToast({
						title: "등록 실패",
						description:
							"프로그램 등록 중 오류가 발생했습니다. 같은 루틴이 이미 등록되어 있지 않은지 확인해주세요.",
						color: "danger",
					});
				},
			},
		);
	};

	const descriptionText = [
		session?.name,
		session?.timeline?.name,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<PageSurface
			title="프로그램 등록"
			description={descriptionText}
			actions={
				<Button variant="flat" onPress={onClickCancelButton}>
					취소
				</Button>
			}
		>
			<SectionSurface title="기본 정보">
				<VStack gap={4}>
					<Input
						label="프로그램 이름"
						labelPlacement="outside"
						placeholder="프로그램 이름을 입력하세요."
						value={state.name}
						onValueChange={onChangeName}
						isRequired
						isInvalid={!!state.errors.name}
						errorMessage={state.errors.name}
					/>
					<Input
						label="루틴 ID"
						labelPlacement="outside"
						placeholder="루틴 ID를 입력하세요."
						value={state.routineId}
						onValueChange={onChangeRoutineId}
						isRequired
						isInvalid={!!state.errors.routineId}
						errorMessage={state.errors.routineId}
						description="연결할 루틴의 ID를 입력하세요."
					/>
					<Input
						label="강사 ID"
						labelPlacement="outside"
						placeholder="강사 사용자 ID를 입력하세요."
						value={state.instructorId}
						onValueChange={onChangeInstructorId}
						isRequired
						isInvalid={!!state.errors.instructorId}
						errorMessage={state.errors.instructorId}
						description="강사로 지정할 사용자 ID를 입력하세요."
					/>
					<Input
						label="정원"
						labelPlacement="outside"
						type="number"
						placeholder="정원을 입력하세요."
						value={state.capacity}
						onValueChange={onChangeCapacity}
						isRequired
						isInvalid={!!state.errors.capacity}
						errorMessage={state.errors.capacity}
						min={1}
					/>
					<Select
						label="난이도"
						labelPlacement="outside"
						selectedKeys={[state.level]}
						onSelectionChange={(keys) => {
							const val = Array.from(keys)[0] as string;
							onChangeLevel(val ?? "");
						}}
					>
						{LEVEL_OPTIONS.map((opt) => (
							<SelectItem key={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</Select>
					<div className="flex justify-end">
						<Button
							color="primary"
							onPress={onClickSubmitButton}
							isLoading={isPending}
							isDisabled={
								!state.name.trim() ||
								!state.routineId.trim() ||
								!state.instructorId.trim() ||
								!state.capacity
							}
						>
							등록
						</Button>
					</div>
				</VStack>
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(ProgramNewPageClient);
