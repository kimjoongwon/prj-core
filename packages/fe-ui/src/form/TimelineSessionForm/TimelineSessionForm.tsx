"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import {
	getContentLanguageLabel,
	toContentLanguageCode,
} from "../../data-display/content-language";
import { Typography } from "../../data-display/Typography";
import { Alert } from "../../feedback/Alert/Alert";
import { Select } from "../../input/Select";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";
import { Section } from "../../layout";
import { HStack, VStack } from "../../rhythm";
export type TimelineSessionFormSessionType =
	| "ONE_TIME"
	| "ONE_TIME_RANGE"
	| "RECURRING";
export type TimelineSessionFormCycleType = "WEEKLY" | "MONTHLY";
export type TimelineSessionFormDayOfWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";
export type TimelineSessionFormField =
	| "name"
	| "type"
	| "description"
	| "startDateTime"
	| "endDateTime"
	| "recurringDayOfWeek"
	| "repeatCycleType";
export interface TimelineSessionFormState {
	name: string;
	type: TimelineSessionFormSessionType;
	originalType?: TimelineSessionFormSessionType;
	description: string;
	startDateTime: string;
	endDateTime: string;
	recurringDayOfWeek: TimelineSessionFormDayOfWeek | null;
	repeatCycleType: TimelineSessionFormCycleType | "";
	originalStartDateTime?: string;
	originalEndDateTime?: string;
	originalRecurringDayOfWeek?: TimelineSessionFormDayOfWeek | null;
	originalRepeatCycleType?: TimelineSessionFormCycleType | "";
	errors: Partial<Record<TimelineSessionFormField, string>>;
}
export interface TimelineSessionFormProps {
	state: TimelineSessionFormState;
	contentLanguageCode?: string | null;
	readOnly?: boolean;
}
const sessionTypeOptions = [
	{
		value: "ONE_TIME",
		label: "일회성 특강",
	},
	{
		value: "ONE_TIME_RANGE",
		label: "기간형 집중 프로그램",
	},
	{
		value: "RECURRING",
		label: "정기 반복 클래스",
	},
];
const sessionTypeDescriptions: Record<TimelineSessionFormSessionType, string> =
	{
		ONE_TIME: "특정 일시에 한 번만 진행되는 수업입니다.",
		ONE_TIME_RANGE: "특정 기간 동안 집중적으로 진행되는 프로그램입니다.",
		RECURRING: "매주 또는 매월 반복되는 정기 수업입니다.",
	};
const dayOfWeekOptions: {
	value: TimelineSessionFormDayOfWeek;
	label: string;
}[] = [
	{
		value: "MONDAY",
		label: "월요일",
	},
	{
		value: "TUESDAY",
		label: "화요일",
	},
	{
		value: "WEDNESDAY",
		label: "수요일",
	},
	{
		value: "THURSDAY",
		label: "목요일",
	},
	{
		value: "FRIDAY",
		label: "금요일",
	},
	{
		value: "SATURDAY",
		label: "토요일",
	},
	{
		value: "SUNDAY",
		label: "일요일",
	},
];
const cycleTypeOptions = [
	{
		value: "WEEKLY",
		label: "주간",
	},
	{
		value: "MONTHLY",
		label: "월간",
	},
];

/**
 * Timeline Session aggregate의 편집 가능한 필드 조합입니다.
 * create/edit/detail 여부는 route가 정하고, form은 readOnly만 기준으로 필드를 잠급니다.
 */
export const TimelineSessionForm = observer(
	({
		state,
		contentLanguageCode,
		readOnly = false,
	}: TimelineSessionFormProps) => {
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const languageLabel = getContentLanguageLabel(contentLanguageCode);
		const changeType = (value: string) => {
			if (readOnly) {
				return;
			}
			const nextType = value as TimelineSessionFormSessionType;
			const previousType = state.type;
			state.type = nextType;
			if (nextType !== previousType) {
				state.startDateTime = "";
				state.endDateTime = "";
				state.recurringDayOfWeek = null;
				state.repeatCycleType = "";
			}
			if (nextType === state.originalType) {
				state.startDateTime = state.originalStartDateTime ?? "";
				state.endDateTime = state.originalEndDateTime ?? "";
				state.recurringDayOfWeek = state.originalRecurringDayOfWeek ?? null;
				state.repeatCycleType = state.originalRepeatCycleType ?? "";
			}
			state.errors = {};
		};
		return (
			<VStack>
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
								label="세션명"
								placeholder="예: 월요일 오전 요가 클래스"
								state={state}
								path="name"
								isReadOnly={readOnly}
								isDisabled={readOnly}
								isRequired
								isInvalid={Boolean(state.errors.name)}
								errorMessage={state.errors.name}
								onValueChange={() => {
									if (state.errors.name) {
										delete state.errors.name;
									}
								}}
							/>
							<Select
								label="세션 유형"
								state={state}
								path="type"
								options={sessionTypeOptions}
								isDisabled={readOnly}
								isRequired
								onValueChange={changeType}
							/>
							<Typography type="body-sm" color="muted">
								{sessionTypeDescriptions[state.type]}
							</Typography>
							<TextArea
								label="설명"
								placeholder="세션에 대한 부가 설명을 입력하세요."
								state={state}
								path="description"
								isReadOnly={readOnly}
								isDisabled={readOnly}
								maxLength={500}
								description={`${state.description.length} / 500`}
							/>
						</VStack>
					</Section.Body>
				</Section>
				<Section>
					<Section.Header title="일정 설정" />
					<Section.Body>
						<VStack>
							{state.type === "ONE_TIME" ? (
								<TextField
									label="일시"
									type="datetime-local"
									state={state}
									path="startDateTime"
									isReadOnly={readOnly}
									isDisabled={readOnly}
									isRequired
									isInvalid={Boolean(state.errors.startDateTime)}
									errorMessage={state.errors.startDateTime}
									onValueChange={() => {
										delete state.errors.startDateTime;
									}}
								/>
							) : null}
							{state.type === "ONE_TIME_RANGE" ? (
								<>
									<TextField
										label="시작 일시"
										type="datetime-local"
										state={state}
										path="startDateTime"
										isReadOnly={readOnly}
										isDisabled={readOnly}
										isRequired
										isInvalid={Boolean(state.errors.startDateTime)}
										errorMessage={state.errors.startDateTime}
										onValueChange={() => {
											delete state.errors.startDateTime;
										}}
									/>
									<TextField
										label="종료 일시"
										type="datetime-local"
										state={state}
										path="endDateTime"
										isReadOnly={readOnly}
										isDisabled={readOnly}
										isRequired
										isInvalid={Boolean(state.errors.endDateTime)}
										errorMessage={state.errors.endDateTime}
										onValueChange={() => {
											delete state.errors.endDateTime;
										}}
									/>
								</>
							) : null}
							{state.type === "RECURRING" ? (
								<>
									<HStack gap="section">
										<Select
											label="반복 요일"
											state={state}
											path="recurringDayOfWeek"
											options={dayOfWeekOptions}
											isDisabled={readOnly}
											isRequired
											isInvalid={Boolean(state.errors.recurringDayOfWeek)}
											errorMessage={state.errors.recurringDayOfWeek}
											className="flex-1"
											onValueChange={() => {
												delete state.errors.recurringDayOfWeek;
											}}
										/>
										<Select
											label="반복 주기"
											state={state}
											path="repeatCycleType"
											options={cycleTypeOptions}
											isDisabled={readOnly}
											isRequired
											isInvalid={Boolean(state.errors.repeatCycleType)}
											errorMessage={state.errors.repeatCycleType}
											className="flex-1"
											onValueChange={() => {
												delete state.errors.repeatCycleType;
											}}
										/>
									</HStack>
									<TextField
										label="시작 일시 (선택)"
										type="datetime-local"
										state={state}
										path="startDateTime"
										isReadOnly={readOnly}
										isDisabled={readOnly}
									/>
									<TextField
										label="종료 일시 (선택)"
										type="datetime-local"
										state={state}
										path="endDateTime"
										isReadOnly={readOnly}
										isDisabled={readOnly}
									/>
								</>
							) : null}
						</VStack>
					</Section.Body>
				</Section>
			</VStack>
		);
	},
);
