"use client";

import { useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import {
	getContentLanguageLabel,
	toContentLanguageCode,
} from "../../data-display/content-language";
import { Typography } from "../../data-display/Typography";
import {
	ProgramPicker,
	ProgramPickerState,
} from "../../domain/program/ProgramPicker";
import { Alert } from "../../feedback/Alert/Alert";
import { Button } from "../../input/Button/Button";
import { Select } from "../../input/Select";
import { TextField } from "../../input/TextField";
import { Section } from "../../layout";
import { HStack, VStack } from "../../rhythm";
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
export interface TimelineSessionProgramFormState {
	name: string;
	routineId: string;
	routineName: string;
	instructorId: string;
	instructorName: string;
	capacity: string;
	level: string;
	errors: Partial<Record<TimelineSessionProgramFormField, string>>;
}
export interface TimelineSessionProgramFormProps {
	state: TimelineSessionProgramFormState;
	contentLanguageCode?: string | null;
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
 * picker는 API 조회와 후보 변환을 스스로 소유하고, form은 선택 결과와 submit만 소유합니다.
 */
export const TimelineSessionProgramForm = observer(
	({
		state,
		contentLanguageCode,
		routinePreview,
		hasUnschedulableRoutine,
		readOnly = false,
	}: TimelineSessionProgramFormProps) => {
		const app = useApp();
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const languageLabel = getContentLanguageLabel(contentLanguageCode);
		const selectRoutineOption = (value: string, option: { name: string }) => {
			if (readOnly) {
				return;
			}
			state.routineId = value;
			state.routineName = option.name;
			delete state.errors.routineId;
		};
		const selectInstructorOption = (
			value: string,
			option: { name: string },
		) => {
			if (readOnly) {
				return;
			}
			state.instructorId = value;
			state.instructorName = option.name;
			delete state.errors.instructorId;
		};
		const openRoutinePicker = () => {
			const programPickerState = new ProgramPickerState({
				kind: "routine",
				selectedId: state.routineId || undefined,
				onSelect: selectRoutineOption,
			});

			app.modal.open({
				title: "루틴 선택",
				state: programPickerState,
				content: { kind: "component", component: ProgramPicker },
			});
		};
		const openInstructorPicker = () => {
			const programPickerState = new ProgramPickerState({
				kind: "instructor",
				selectedId: state.instructorId || undefined,
				onSelect: selectInstructorOption,
			});

			app.modal.open({
				title: "강사 선택",
				state: programPickerState,
				content: { kind: "component", component: ProgramPicker },
			});
		};
		return (
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
									variant="soft"
									color={languageCode ? "accent" : "warning"}
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
								<Button variant="tertiary" onPress={openRoutinePicker}>
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
								<Button variant="tertiary" onPress={openInstructorPicker}>
									강사 선택
								</Button>
							) : null}
						</div>
						<div className="rounded-lg bg-surface-secondary p-3">
							<Typography type="body-sm" weight="medium">
								연결 요약
							</Typography>
							<Typography className="mt-1" type="body-sm" color="muted">
								루틴: {state.routineName || "-"}
							</Typography>
							<Typography type="body-sm" color="muted">
								강사: {state.instructorName || "-"}
							</Typography>
						</div>
						<div className="rounded-lg border border-border p-3">
							<HStack alignItems="center" justifyContent="between" gap="block">
								<Typography type="body-sm" weight="medium">
									실행 운동 preview
								</Typography>
								<Chip
									color={hasUnschedulableRoutine ? "warning" : "success"}
									size="sm"
								>
									{hasUnschedulableRoutine ? "저장 불가" : "저장 가능"}
								</Chip>
							</HStack>
							{routinePreview.length === 0 ? (
								<Typography className="mt-2" type="body-sm" color="muted">
									선택한 루틴에 등록된 운동이 없습니다.
								</Typography>
							) : (
								<VStack gap="block" className="mt-3">
									{routinePreview.map((activity, index) => (
										<div
											key={`${activity.id}:${index}`}
											className="rounded-md bg-surface-secondary px-3 py-2"
										>
											<HStack
												alignItems="center"
												justifyContent="between"
												gap="block"
											>
												<Typography type="body-sm" weight="medium">
													{activity.order}. {activity.exerciseName}
												</Typography>
												<Chip
													color={activity.isSchedulable ? "success" : "warning"}
													size="sm"
													variant="soft"
												>
													{activity.isSchedulable ? "가능" : "불가"}
												</Chip>
											</HStack>
											<Typography className="mt-1" type="body-sm" color="muted">
												반복 {activity.repetitions}회 · 휴식 {activity.restTime}
												초
											</Typography>
											{activity.notes ? (
												<Typography
													className="mt-1"
													type="body-xs"
													color="muted"
												>
													{activity.notes}
												</Typography>
											) : null}
										</div>
									))}
								</VStack>
							)}
							{hasUnschedulableRoutine ? (
								<Typography className="mt-3 text-warning" type="body-sm">
									영상이 없는 운동이 포함되어 있어 저장 버튼이 비활성화됩니다.
								</Typography>
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
		);
	},
);
