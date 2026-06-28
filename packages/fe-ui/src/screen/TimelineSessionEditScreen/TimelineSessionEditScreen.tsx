"use client";

import {
	Button,
	ContentLanguageNotice,
	Input,
	PageTitleBar,
	Section,
	SectionSurface,
	TextArea,
	useT,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Select } from "../../selection/Select/Select";
import type {
	TimelineSessionScreenCycleType,
	TimelineSessionScreenDayOfWeek,
	TimelineSessionScreenSessionType,
} from "../TimelineSessionCreateScreen/TimelineSessionCreateScreen";

const SESSION_TYPE_OPTIONS = [
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
const SESSION_TYPE_DESCRIPTIONS: Record<
	TimelineSessionScreenSessionType,
	string
> = {
	ONE_TIME: "특정 일시에 한 번만 진행되는 수업입니다.",
	ONE_TIME_RANGE: "특정 기간 동안 집중적으로 진행되는 프로그램입니다.",
	RECURRING: "매주 또는 매월 반복되는 정기 수업입니다.",
};
const DAY_OF_WEEK_OPTIONS: {
	value: TimelineSessionScreenDayOfWeek;
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
const CYCLE_TYPE_OPTIONS = [
	{
		value: "WEEKLY",
		label: "주간",
	},
	{
		value: "MONTHLY",
		label: "월간",
	},
];
export interface TimelineSessionEditScreenProps {
	descriptionText?: string;
	contentLanguageCode?: string | null;
	name: string;
	type: TimelineSessionScreenSessionType;
	description: string;
	startDateTime: string;
	endDateTime: string;
	recurringDayOfWeek: TimelineSessionScreenDayOfWeek | null;
	repeatCycleType: TimelineSessionScreenCycleType | "";
	errors: Record<string, string>;
	isSubmitPending: boolean;
	isSubmitDisabled: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeTypeSelect: (value: string) => void;
	onChangeDescriptionTextArea: (value: string) => void;
	onChangeStartDateTimeInput: (value: string) => void;
	onChangeEndDateTimeInput: (value: string) => void;
	onChangeDayOfWeekSelect: (value: string) => void;
	onChangeCycleTypeSelect: (value: string) => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}
export const TimelineSessionEditScreen = observer(
	({
		descriptionText,
		contentLanguageCode,
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
		onChangeDescriptionTextArea,
		onChangeStartDateTimeInput,
		onChangeEndDateTimeInput,
		onChangeDayOfWeekSelect,
		onChangeCycleTypeSelect,
		onClickCancelButton,
		onClickSubmitButton,
	}: TimelineSessionEditScreenProps) => {
		const t = useT();
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="세션 수정"
					description={descriptionText}
					actions={
						<Button variant="flat" onPress={onClickCancelButton}>
							취소
						</Button>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack gap={4}>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="기본 정보" />
									</Section.Header>
									<Section.Body>
										<VStack gap={4}>
											<ContentLanguageNotice
												contentLanguageCode={contentLanguageCode}
											/>
											<Input
												label="세션명"
												labelPlacement="outside"
												placeholder="세션명을 입력하세요."
												value={name}
												onValueChange={onChangeNameInput}
												isRequired
												isInvalid={!!errors.name}
												errorMessage={errors.name}
											/>
											<Select
												label="세션 유형"
												value={type}
												onChange={(value) =>
													onChangeTypeSelect(String(value ?? ""))
												}
												options={SESSION_TYPE_OPTIONS}
												isRequired
											/>
											<p className="text-sm text-muted">
												{t(SESSION_TYPE_DESCRIPTIONS[type])}
											</p>
											<TextArea
												label="설명"
												labelPlacement="outside"
												placeholder="세션에 대한 부가 설명을 입력하세요."
												value={description}
												onValueChange={onChangeDescriptionTextArea}
												maxLength={500}
												description={`${description.length} / 500`}
											/>
										</VStack>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="일정 설정" />
									</Section.Header>
									<Section.Body>
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
															value={recurringDayOfWeek ?? undefined}
															onChange={(value) =>
																onChangeDayOfWeekSelect(String(value ?? ""))
															}
															options={DAY_OF_WEEK_OPTIONS}
															isRequired
															isInvalid={!!errors.recurringDayOfWeek}
															errorMessage={errors.recurringDayOfWeek}
															className="flex-1"
														/>
														<Select
															label="반복 주기"
															value={repeatCycleType || undefined}
															onChange={(value) =>
																onChangeCycleTypeSelect(String(value ?? ""))
															}
															options={CYCLE_TYPE_OPTIONS}
															isRequired
															isInvalid={!!errors.repeatCycleType}
															errorMessage={errors.repeatCycleType}
															className="flex-1"
														/>
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
									</Section.Body>
								</Section>
								<div className="flex justify-end">
									<Button
										color="primary"
										onPress={onClickSubmitButton}
										isLoading={isSubmitPending}
										isDisabled={isSubmitDisabled}
									>
										수정
									</Button>
								</div>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
