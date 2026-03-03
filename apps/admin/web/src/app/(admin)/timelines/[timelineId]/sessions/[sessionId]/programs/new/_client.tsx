"use client";

import { type RoutineDto, type UserDto, useCreateProgram, useGetRoutines, useGetSessionById, useGetUsers, } from "@cocrepo/api";
import {
	Page, PageTitleBar, ProgramPickerModal, Section, VStack } from "@cocrepo/ui";
import {
	addToast,
	Button,
	Input,
	Select,
	SelectItem,
	useDisclosure,
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
	const routinePickerModal = useDisclosure();
	const instructorPickerModal = useDisclosure();

	const state = useLocalObservable(() => ({
		name: "",
		routineId: "",
		routineQuery: "",
		instructorId: "",
		instructorQuery: "",
		capacity: "",
		level: "",
		errors: {} as Record<string, string>,
	}));

	const { data: sessionResponse } = useGetSessionById(timelineId, sessionId);
	const session = sessionResponse?.data;

	const { data: routinesResponse } = useGetRoutines({
		take: 50,
		skip: 0,
		spaceScope: "INCLUDE_ANCESTORS",
	});
	const routines = (routinesResponse?.data ?? []) as RoutineDto[];

	const { data: instructorsResponse } = useGetUsers({
		take: 50,
		skip: 0,
		roles: ["MANAGE", "FULL_ACCESS"],
		status: "active",
	});
	const instructors = (instructorsResponse?.data ?? []) as UserDto[];

	const { mutate: createProgram, isPending } = useCreateProgram();

	const onClickCancelButton = () => {
		router.push(`/timelines/${timelineId}/sessions/${sessionId}` as Route);
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

	const onChangeRoutineQuery = (value: string) => {
		state.routineQuery = value;
	};

	const onChangeInstructorQuery = (value: string) => {
		state.instructorQuery = value;
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
			errors.routineId = "루틴을 선택해주세요.";
		}

		if (!state.instructorId.trim()) {
			errors.instructorId = "강사를 선택해주세요.";
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

	const descriptionText = [session?.name, session?.timeline?.name]
		.filter(Boolean)
		.join(" · ");

	const selectedRoutine = routines.find(
		(routine) => routine.id === state.routineId,
	);
	const selectedInstructor = instructors.find(
		(instructor) => instructor.id === state.instructorId,
	);

	const routineQuery = state.routineQuery.trim().toLowerCase();
	const instructorQuery = state.instructorQuery.trim().toLowerCase();

	const filteredRoutines = routineQuery
		? routines.filter((routine) =>
				routine.name.toLowerCase().includes(routineQuery),
			)
		: routines;
	const filteredInstructors = instructorQuery
		? instructors.filter((instructor) =>
				instructor.name.toLowerCase().includes(instructorQuery),
			)
		: instructors;

	const routineOptions =
		selectedRoutine &&
		!filteredRoutines.some((routine) => routine.id === selectedRoutine.id)
			? [selectedRoutine, ...filteredRoutines]
			: filteredRoutines;
	const instructorOptions =
		selectedInstructor &&
		!filteredInstructors.some(
			(instructor) => instructor.id === selectedInstructor.id,
		)
			? [selectedInstructor, ...filteredInstructors]
			: filteredInstructors;

	const routinePickerOptions = routineOptions.map((routine) => ({
		id: routine.id,
		name: routine.name,
		subtitle: `라벨: ${routine.label ?? "-"} · 활동 ${routine.activities?.length ?? 0}개`,
	}));

	const instructorPickerOptions = instructorOptions.map((instructor) => ({
		id: instructor.id,
		name: instructor.name,
		subtitle: `이메일: ${instructor.email ?? "-"}`,
	}));

	const cancelButton = (
		<Button variant="flat" onPress={onClickCancelButton}>
			취소
		</Button>
	);

	return (
		<Page
			top={
				<PageTitleBar
					title="프로그램 등록"
					description={descriptionText}
					actions={cancelButton}
				/>
			}
		>
			<Section
				top={<PageTitleBar level={2} title="기본 정보" />}
			>
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
					<div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
						<Input
							label="루틴"
							labelPlacement="outside"
							value={selectedRoutine?.name ?? ""}
							placeholder="루틴을 선택하세요"
							isReadOnly
							isRequired
							isInvalid={!!state.errors.routineId}
							errorMessage={state.errors.routineId}
							description="모달에서 루틴을 선택하세요."
						/>
						<Button variant="flat" onPress={routinePickerModal.onOpen}>
							루틴 선택
						</Button>
					</div>
					<div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
						<Input
							label="강사"
							labelPlacement="outside"
							value={selectedInstructor?.name ?? ""}
							placeholder="강사를 선택하세요"
							isReadOnly
							isRequired
							isInvalid={!!state.errors.instructorId}
							errorMessage={state.errors.instructorId}
							description="모달에서 강사를 선택하세요."
						/>
						<Button variant="flat" onPress={instructorPickerModal.onOpen}>
							강사 선택
						</Button>
					</div>
					<div className="rounded-lg bg-content2 p-3 text-sm text-default-600">
						<p className="font-medium text-default-700">연결 요약</p>
						<p className="mt-1">루틴: {selectedRoutine?.name ?? "-"}</p>
						<p>강사: {selectedInstructor?.name ?? "-"}</p>
					</div>
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
							<SelectItem key={opt.value}>{opt.label}</SelectItem>
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
			</Section>
			<ProgramPickerModal
				isOpen={routinePickerModal.isOpen}
				onClose={routinePickerModal.onClose}
				title="루틴 선택"
				searchLabel="루틴 검색"
				searchPlaceholder="루틴 이름으로 검색하세요."
				searchValue={state.routineQuery}
				onSearchValueChange={onChangeRoutineQuery}
				options={routinePickerOptions}
				onSelect={onChangeRoutineId}
				selectedId={state.routineId}
			/>
			<ProgramPickerModal
				isOpen={instructorPickerModal.isOpen}
				onClose={instructorPickerModal.onClose}
				title="강사 선택"
				searchLabel="강사 검색"
				searchPlaceholder="강사 이름으로 검색하세요."
				searchValue={state.instructorQuery}
				onSearchValueChange={onChangeInstructorQuery}
				options={instructorPickerOptions}
				onSelect={onChangeInstructorId}
				selectedId={state.instructorId}
			/>
		</Page>
	);
}

export default observer(ProgramNewPageClient);
