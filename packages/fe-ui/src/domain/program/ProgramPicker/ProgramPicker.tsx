"use client";

import { useGetRoutine, useGetRoutines } from "@cocrepo/api/core/routines";
import { useGetUserById, useGetUsers } from "@cocrepo/api/core/users";
import type { ModalState } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { Button } from "../../../input/Button/Button";
import { TextField } from "../../../input/TextField";
import type { ProgramPickerState } from "./ProgramPickerState";
import type { ProgramPickerOption } from "./types";

type RoutineOptionSource = {
	id: string;
	name: string;
	label: string;
	activities?: Array<{
		task?: {
			exercise?: { videoFileId?: string | null } | null;
		} | null;
	}>;
};

const toRoutineOption = (routine: RoutineOptionSource): ProgramPickerOption => {
	const hasUnschedulableActivity = routine.activities?.some(
		(activity) => !activity.task?.exercise?.videoFileId,
	);

	return {
		id: routine.id,
		name: routine.name,
		subtitle: `라벨: ${routine.label || "-"} · 활동 ${
			routine.activities?.length ?? 0
		}개 · ${hasUnschedulableActivity ? "영상 누락" : "스케줄 가능"}`,
	};
};

const toInstructorOption = (instructor: {
	id: string;
	name: string;
	email?: string | null;
}): ProgramPickerOption => ({
	id: instructor.id,
	name: instructor.name,
	subtitle: `이메일: ${instructor.email || "-"}`,
});

/** API에서 Program 후보를 검색하고 선택하는 Modal body content입니다. */
export const ProgramPicker = observer(function ProgramPicker({
	state,
}: {
	state: ModalState<ProgramPickerState>;
}) {
	const t = useT();
	const programPicker = state.contentState;
	const query = programPicker.searchValue.trim();
	const isRoutine = programPicker.kind === "routine";
	const routineListQuery = useGetRoutines(
		isRoutine
			? {
					take: 50,
					skip: 0,
					search: query || undefined,
					spaceScope: "INCLUDE_ANCESTORS",
				}
			: undefined,
		{ query: { enabled: isRoutine } },
	);
	const instructorListQuery = useGetUsers(
		!isRoutine
			? {
					take: 50,
					skip: 0,
					name: query || undefined,
					roles: ["COMPANY_MANAGER", "PLATFORM_ADMIN"],
					status: "active",
				}
			: undefined,
		{ query: { enabled: !isRoutine } },
	);
	const selectedRoutineQuery = useGetRoutine(
		isRoutine ? (programPicker.selectedId ?? "") : "",
		{ query: { enabled: isRoutine && Boolean(programPicker.selectedId) } },
	);
	const selectedInstructorQuery = useGetUserById(
		!isRoutine ? (programPicker.selectedId ?? "") : "",
		{ query: { enabled: !isRoutine && Boolean(programPicker.selectedId) } },
	);

	const selectedOption = isRoutine
		? selectedRoutineQuery.data?.data
			? toRoutineOption(selectedRoutineQuery.data.data)
			: undefined
		: selectedInstructorQuery.data?.data
			? toInstructorOption(selectedInstructorQuery.data.data)
			: undefined;
	const fetchedOptions = isRoutine
		? (routineListQuery.data?.data ?? []).map(toRoutineOption)
		: (instructorListQuery.data?.data ?? []).map(toInstructorOption);
	const options = [
		...(selectedOption ? [selectedOption] : []),
		...fetchedOptions.filter((option) => option.id !== selectedOption?.id),
	];
	const filteredOptions = query
		? options.filter(
				(option) =>
					option.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
					option.id === programPicker.selectedId,
			)
		: options;
	const listQuery = isRoutine ? routineListQuery : instructorListQuery;
	const searchLabel = isRoutine ? "루틴 검색" : "강사 검색";
	const searchPlaceholder = isRoutine
		? "루틴 이름으로 검색하세요."
		: "강사 이름으로 검색하세요.";

	return (
		<>
			<TextField
				label={searchLabel}
				labelPlacement="outside"
				placeholder={searchPlaceholder}
				value={programPicker.searchValue}
				onValueChange={(value) => programPicker.setSearchValue(value)}
			/>
			<div className="flex max-h-80 flex-col gap-2 overflow-auto">
				{listQuery.isLoading ? (
					<p className="text-sm text-muted">불러오는 중입니다.</p>
				) : listQuery.isError ? (
					<p className="text-sm text-danger">목록을 불러오지 못했습니다.</p>
				) : null}
				{!listQuery.isLoading && !listQuery.isError
					? filteredOptions.map((option) => (
							<button
								type="button"
								key={option.id}
								onClick={() => {
									programPicker.select(option);
									state.close();
								}}
								aria-pressed={programPicker.selectedId === option.id}
								className={`rounded-md px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
									programPicker.selectedId === option.id
										? "bg-accent/15 text-accent"
										: "bg-surface-secondary hover:bg-surface-tertiary"
								}`}
							>
								<p className="font-medium">{option.name}</p>
								{option.subtitle ? (
									<p className="text-xs text-muted">{option.subtitle}</p>
								) : null}
							</button>
						))
					: null}
				{!listQuery.isLoading &&
				!listQuery.isError &&
				filteredOptions.length === 0 ? (
					<p className="text-sm text-muted">{t("검색 결과가 없습니다.")}</p>
				) : null}
			</div>
			<div className="flex justify-end">
				<Button variant="flat" onPress={() => state.close()}>
					닫기
				</Button>
			</div>
		</>
	);
});

ProgramPicker.displayName = "ProgramPicker";
