"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSection,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { observer } from "mobx-react-lite";

export type TimelineSessionPageSessionType =
	| "ONE_TIME"
	| "ONE_TIME_RANGE"
	| "RECURRING";
export type TimelineSessionPageCycleType = "WEEKLY" | "MONTHLY";
export type TimelineSessionPageDayOfWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";

const SESSION_TYPE_OPTIONS = [
	{ value: "ONE_TIME", label: "일회성 특강" },
	{ value: "ONE_TIME_RANGE", label: "기간형 집중 프로그램" },
	{ value: "RECURRING", label: "정기 반복 클래스" },
];

const SESSION_TYPE_DESCRIPTIONS: Record<
	TimelineSessionPageSessionType,
	string
> = {
	ONE_TIME: "특정 일시에 한 번만 진행되는 수업입니다.",
	ONE_TIME_RANGE: "특정 기간 동안 집중적으로 진행되는 프로그램입니다.",
	RECURRING: "매주 또는 매월 반복되는 정기 수업입니다.",
};

const DAY_OF_WEEK_OPTIONS: {
	value: TimelineSessionPageDayOfWeek;
	label: string;
}[] = [
	{ value: "MONDAY", label: "월요일" },
	{ value: "TUESDAY", label: "화요일" },
	{ value: "WEDNESDAY", label: "수요일" },
	{ value: "THURSDAY", label: "목요일" },
	{ value: "FRIDAY", label: "금요일" },
	{ value: "SATURDAY", label: "토요일" },
	{ value: "SUNDAY", label: "일요일" },
];

const CYCLE_TYPE_OPTIONS = [
	{ value: "WEEKLY", label: "주간" },
	{ value: "MONTHLY", label: "월간" },
];

export interface TimelineSessionCreatePageProps {
	descriptionText?: string;
	name: string;
	type: TimelineSessionPageSessionType;
	description: string;
	startDateTime: string;
	endDateTime: string;
	recurringDayOfWeek: TimelineSessionPageDayOfWeek | null;
	repeatCycleType: TimelineSessionPageCycleType | "";
	errors: Record<string, string>;
	isSubmitPending: boolean;
	isSubmitDisabled: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeTypeSelect: (value: string) => void;
	onChangeDescriptionTextarea: (value: string) => void;
	onChangeStartDateTimeInput: (value: string) => void;
	onChangeEndDateTimeInput: (value: string) => void;
	onChangeDayOfWeekSelect: (value: string) => void;
	onChangeCycleTypeSelect: (value: string) => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}

export const TimelineSessionCreatePage = observer(
	({
		descriptionText,
		name,
		type,
		description,
		startDateTime,
		endDateTime,
		recurringDayOfWeek,
		repeatCycleType,
		errors,
		isSubmitPending,
		isSubmitDisabled,
		onChangeNameInput,
		onChangeTypeSelect,
		onChangeDescriptionTextarea,
		onChangeStartDateTimeInput,
		onChangeEndDateTimeInput,
		onChangeDayOfWeekSelect,
		onChangeCycleTypeSelect,
		onClickCancelButton,
		onClickSubmitButton,
	}: TimelineSessionCreatePageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="세션 등록"
						description={descriptionText}
						actions={
							<Button variant="flat" onPress={onClickCancelButton}>
								취소
							</Button>
						}
					/>
				}
			>
				<FormPageSurface>
					<VStack gap={4}>
						<FormSectionCard>
							<FormSection top={<PageTitleBar level={2} title="기본 정보" />}>
								<VStack gap={4}>
									<Input
										label="세션명"
										labelPlacement="outside"
										placeholder="예: 월요일 오전 요가 클래스"
										value={name}
										onValueChange={onChangeNameInput}
										isRequired
										isInvalid={!!errors.name}
										errorMessage={errors.name}
									/>
									<Select
										label="세션 유형"
										labelPlacement="outside"
										selectedKeys={[type]}
										onSelectionChange={(keys) => {
											const value = Array.from(keys)[0] as string;
											if (value) onChangeTypeSelect(value);
										}}
										isRequired
									>
										{SESSION_TYPE_OPTIONS.map((option) => (
											<SelectItem key={option.value}>{option.label}</SelectItem>
										))}
									</Select>
									<p className="text-sm text-default-500">
										{SESSION_TYPE_DESCRIPTIONS[type]}
									</p>
									<Textarea
										label="설명"
										labelPlacement="outside"
										placeholder="세션에 대한 부가 설명을 입력하세요."
										value={description}
										onValueChange={onChangeDescriptionTextarea}
										maxLength={500}
										description={`${description.length} / 500`}
									/>
								</VStack>
							</FormSection>
						</FormSectionCard>
						<FormSectionCard>
							<FormSection top={<PageTitleBar level={2} title="일정 설정" />}>
								<VStack gap={4}>
									{type === "ONE_TIME" ? (
										<Input
											label="일시"
											labelPlacement="outside"
											type="datetime-local"
											value={startDateTime}
											onValueChange={onChangeStartDateTimeInput}
											isRequired
											isInvalid={!!errors.startDateTime}
											errorMessage={errors.startDateTime}
										/>
									) : null}
									{type === "ONE_TIME_RANGE" ? (
										<>
											<Input
												label="시작 일시"
												labelPlacement="outside"
												type="datetime-local"
												value={startDateTime}
												onValueChange={onChangeStartDateTimeInput}
												isRequired
												isInvalid={!!errors.startDateTime}
												errorMessage={errors.startDateTime}
											/>
											<Input
												label="종료 일시"
												labelPlacement="outside"
												type="datetime-local"
												value={endDateTime}
												onValueChange={onChangeEndDateTimeInput}
												isRequired
												isInvalid={!!errors.endDateTime}
												errorMessage={errors.endDateTime}
											/>
										</>
									) : null}
									{type === "RECURRING" ? (
										<>
											<div className="flex gap-4">
												<Select
													label="반복 요일"
													labelPlacement="outside"
													selectedKeys={
														recurringDayOfWeek ? [recurringDayOfWeek] : []
													}
													onSelectionChange={(keys) => {
														const value = Array.from(keys)[0] as string;
														if (value) onChangeDayOfWeekSelect(value);
													}}
													isRequired
													isInvalid={!!errors.recurringDayOfWeek}
													errorMessage={errors.recurringDayOfWeek}
													className="flex-1"
												>
													{DAY_OF_WEEK_OPTIONS.map((option) => (
														<SelectItem key={option.value}>
															{option.label}
														</SelectItem>
													))}
												</Select>
												<Select
													label="반복 주기"
													labelPlacement="outside"
													selectedKeys={
														repeatCycleType ? [repeatCycleType] : []
													}
													onSelectionChange={(keys) => {
														const value = Array.from(keys)[0] as string;
														if (value) onChangeCycleTypeSelect(value);
													}}
													isRequired
													isInvalid={!!errors.repeatCycleType}
													errorMessage={errors.repeatCycleType}
													className="flex-1"
												>
													{CYCLE_TYPE_OPTIONS.map((option) => (
														<SelectItem key={option.value}>
															{option.label}
														</SelectItem>
													))}
												</Select>
											</div>
											<Input
												label="시작 일시 (선택)"
												labelPlacement="outside"
												type="datetime-local"
												value={startDateTime}
												onValueChange={onChangeStartDateTimeInput}
											/>
											<Input
												label="종료 일시 (선택)"
												labelPlacement="outside"
												type="datetime-local"
												value={endDateTime}
												onValueChange={onChangeEndDateTimeInput}
											/>
										</>
									) : null}
								</VStack>
							</FormSection>
						</FormSectionCard>
						<div className="flex justify-end">
							<Button
								color="primary"
								onPress={onClickSubmitButton}
								isLoading={isSubmitPending}
								isDisabled={isSubmitDisabled}
							>
								등록
							</Button>
						</div>
					</VStack>
				</FormPageSurface>
			</FormPage>
		);
	},
);
