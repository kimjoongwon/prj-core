"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import {
	getContentLanguageLabel,
	toContentLanguageCode,
} from "../../data-display/content-language";
import { ProgramPickerModal } from "../../feature/ProgramPickerModal/ProgramPickerModal";
import { Alert } from "../../feedback/Alert/Alert";
import { Button } from "../../input/Button/Button";
import { Select } from "../../input/Select";
import { TextField } from "../../input/TextField";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
export type TimelineSessionProgramFormField =
	| "name"
	| "routineId"
	| "instructorId"
	| "capacity"
	| "level";
export interface TimelineSessionProgramRoutinePreviewItem {
	id: string;
	order: number;
	exerciseName: string;
	repetitions: number;
	restTime: number;
	notes?: string | null;
	isSchedulable: boolean;
}
export interface TimelineSessionProgramPickerOption {
	id: string;
	name: string;
	subtitle: string;
}
export interface TimelineSessionProgramFormState {
	name: string;
	routineId: string;
	routineName: string;
	routineQuery: string;
	instructorId: string;
	instructorName: string;
	instructorQuery: string;
	capacity: string;
	level: string;
	isRoutinePickerOpen: boolean;
	isInstructorPickerOpen: boolean;
	errors: Partial<Record<TimelineSessionProgramFormField, string>>;
}
export interface TimelineSessionProgramFormProps {
	state: TimelineSessionProgramFormState;
	contentLanguageCode?: string | null;
	routineOptions: TimelineSessionProgramPickerOption[];
	instructorOptions: TimelineSessionProgramPickerOption[];
	routinePreview: TimelineSessionProgramRoutinePreviewItem[];
	hasUnschedulableRoutine: boolean;
	readOnly?: boolean;
}
const levelOptions = [
	{
		value: "",
		label: "없음",
	},
	{
		value: "초급",
		label: "초급",
	},
	{
		value: "중급",
		label: "중급",
	},
	{
		value: "고급",
		label: "고급",
	},
];

/**
 * Timeline Session Program aggregate의 편집 가능한 필드 조합입니다.
 * picker open/close도 form state 안에서만 다루고, route는 옵션과 submit만 소유합니다.
 */
export const TimelineSessionProgramForm = observer(
	({
		state,
		contentLanguageCode,
		routineOptions,
		instructorOptions,
		routinePreview,
		hasUnschedulableRoutine,
		readOnly = false,
	}: TimelineSessionProgramFormProps) => {
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const languageLabel = getContentLanguageLabel(contentLanguageCode);
		const selectRoutineOption = (value: string) => {
			if (readOnly) {
				return;
			}
			const option = routineOptions.find((item) => item.id === value);
			state.routineId = value;
			state.routineName = option?.name ?? state.routineName;
			state.isRoutinePickerOpen = false;
			delete state.errors.routineId;
		};
		const selectInstructorOption = (value: string) => {
			if (readOnly) {
				return;
			}
			const option = instructorOptions.find((item) => item.id === value);
			state.instructorId = value;
			state.instructorName = option?.name ?? state.instructorName;
			state.isInstructorPickerOpen = false;
			delete state.errors.instructorId;
		};
		return (
			<>
				<Section>
					<Section.Header title="기본 정보" />
					<Section.Body>
						<VStack>
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
								label="프로그램 이름"
								placeholder="프로그램 이름을 입력하세요."
								state={state}
								path="name"
								isReadOnly={readOnly}
								isDisabled={readOnly}
								isRequired
								isInvalid={Boolean(state.errors.name)}
								errorMessage={state.errors.name}
								onValueChange={() => {
									delete state.errors.name;
								}}
							/>
							<div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
								<TextField
									label="루틴"
									value={state.routineName}
									placeholder="루틴을 선택하세요"
									isReadOnly
									isRequired
									isInvalid={Boolean(state.errors.routineId)}
									errorMessage={state.errors.routineId}
									description={
										!readOnly ? "모달에서 루틴을 선택하세요." : undefined
									}
								/>
								{!readOnly ? (
									<Button
										variant="flat"
										onPress={() => {
											state.isRoutinePickerOpen = true;
										}}
									>
										루틴 선택
									</Button>
								) : null}
							</div>
							<div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
								<TextField
									label="강사"
									value={state.instructorName}
									placeholder="강사를 선택하세요"
									isReadOnly
									isRequired
									isInvalid={Boolean(state.errors.instructorId)}
									errorMessage={state.errors.instructorId}
									description={
										!readOnly ? "모달에서 강사를 선택하세요." : undefined
									}
								/>
								{!readOnly ? (
									<Button
										variant="flat"
										onPress={() => {
											state.isInstructorPickerOpen = true;
										}}
									>
										강사 선택
									</Button>
								) : null}
							</div>
							<div className="rounded-lg bg-surface-secondary p-3 text-sm text-muted">
								<p className="font-medium text-foreground">연결 요약</p>
								<p className="mt-1">루틴: {state.routineName || "-"}</p>
								<p>강사: {state.instructorName || "-"}</p>
							</div>
							<div className="rounded-lg border border-border p-3">
								<div className="flex items-center justify-between gap-3">
									<p className="font-medium text-foreground">
										실행 운동 preview
									</p>
									<Chip
										color={hasUnschedulableRoutine ? "warning" : "success"}
										size="sm"
									>
										{hasUnschedulableRoutine ? "저장 불가" : "저장 가능"}
									</Chip>
								</div>
								{routinePreview.length === 0 ? (
									<p className="mt-2 text-sm text-muted">
										선택한 루틴에 등록된 운동이 없습니다.
									</p>
								) : (
									<div className="mt-3 flex flex-col gap-2">
										{routinePreview.map((activity, index) => (
											<div
												key={`${activity.id}:${index}`}
												className="rounded-md bg-surface-secondary px-3 py-2"
											>
												<div className="flex items-center justify-between gap-3">
													<p className="font-medium">
														{activity.order}. {activity.exerciseName}
													</p>
													<Chip
														color={
															activity.isSchedulable ? "success" : "warning"
														}
														size="sm"
														variant="flat"
													>
														{activity.isSchedulable ? "가능" : "불가"}
													</Chip>
												</div>
												<p className="mt-1 text-muted text-sm">
													반복 {activity.repetitions}회 · 휴식{" "}
													{activity.restTime}초
												</p>
												{activity.notes ? (
													<p className="mt-1 text-muted text-xs">
														{activity.notes}
													</p>
												) : null}
											</div>
										))}
									</div>
								)}
								{hasUnschedulableRoutine ? (
									<p className="mt-3 text-sm text-warning">
										영상이 없는 운동이 포함되어 있어 저장 버튼이 비활성화됩니다.
									</p>
								) : null}
							</div>
							<TextField
								label="정원"
								type="number"
								placeholder="정원을 입력하세요."
								state={state}
								path="capacity"
								isReadOnly={readOnly}
								isDisabled={readOnly}
								isRequired
								isInvalid={Boolean(state.errors.capacity)}
								errorMessage={state.errors.capacity}
								min={1}
								onValueChange={() => {
									delete state.errors.capacity;
								}}
							/>
							<Select
								label="난이도"
								state={state}
								path="level"
								options={levelOptions}
								isDisabled={readOnly}
							/>
						</VStack>
					</Section.Body>
				</Section>
				{!readOnly ? (
					<ProgramPickerModal
						isOpen={state.isRoutinePickerOpen}
						onClose={() => {
							state.isRoutinePickerOpen = false;
						}}
						title="루틴 선택"
						searchLabel="루틴 검색"
						searchPlaceholder="루틴 이름으로 검색하세요."
						searchValue={state.routineQuery}
						onSearchValueChange={(value: string) => {
							state.routineQuery = value;
						}}
						options={routineOptions}
						onSelect={selectRoutineOption}
					/>
				) : null}
				{!readOnly ? (
					<ProgramPickerModal
						isOpen={state.isInstructorPickerOpen}
						onClose={() => {
							state.isInstructorPickerOpen = false;
						}}
						title="강사 선택"
						searchLabel="강사 검색"
						searchPlaceholder="강사 이름으로 검색하세요."
						searchValue={state.instructorQuery}
						onSearchValueChange={(value: string) => {
							state.instructorQuery = value;
						}}
						options={instructorOptions}
						onSelect={selectInstructorOption}
					/>
				) : null}
			</>
		);
	},
);
