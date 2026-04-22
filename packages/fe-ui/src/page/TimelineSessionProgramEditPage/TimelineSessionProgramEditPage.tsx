"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	ProgramPickerModal,
	FormSection,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Chip, Input, Select, SelectItem } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type {
	TimelineSessionProgramCreatePageProps,
} from "../TimelineSessionProgramCreatePage/TimelineSessionProgramCreatePage";

const LEVEL_OPTIONS = [
	{ value: "", label: "없음" },
	{ value: "초급", label: "초급" },
	{ value: "중급", label: "중급" },
	{ value: "고급", label: "고급" },
];

export interface TimelineSessionProgramEditPageProps
	extends Omit<
		TimelineSessionProgramCreatePageProps,
		"isSubmitDisabled"
	> {
	isSubmitDisabled: boolean;
}

export const TimelineSessionProgramEditPage =
	observer(
		({
			descriptionText,
			name,
			routineName,
			instructorName,
			capacity,
			level,
			errors,
			routineQuery,
			instructorQuery,
			routineOptions,
			instructorOptions,
			routinePreview,
			hasUnschedulableRoutine,
			isRoutinePickerOpen,
			isInstructorPickerOpen,
			isSubmitPending,
			isSubmitDisabled,
			onChangeNameInput,
			onChangeCapacityInput,
			onChangeLevelSelect,
			onChangeRoutineQueryInput,
			onChangeInstructorQueryInput,
			onSelectRoutineOption,
			onSelectInstructorOption,
			onClickOpenRoutinePickerButton,
			onClickCloseRoutinePickerButton,
			onClickOpenInstructorPickerButton,
			onClickCloseInstructorPickerButton,
			onClickCancelButton,
			onClickSubmitButton,
		}: TimelineSessionProgramEditPageProps) => {
			const selectedLevelKeys = LEVEL_OPTIONS.some(
				(option) => option.value === level,
			)
				? [level]
				: [];

			return (
				<FormPage
					top={
						<PageTitleBar
							title="프로그램 수정"
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
						<FormSectionCard>
							<FormSection top={<PageTitleBar level={2} title="기본 정보" />}>
								<VStack gap={4}>
									<Input
										label="프로그램 이름"
										labelPlacement="outside"
										placeholder="프로그램 이름을 입력하세요."
										value={name}
										onValueChange={onChangeNameInput}
										isRequired
										isInvalid={!!errors.name}
										errorMessage={errors.name}
									/>
									<div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
										<Input
											label="루틴"
											labelPlacement="outside"
											value={routineName}
											placeholder="루틴을 선택하세요"
											isReadOnly
											isRequired
											isInvalid={!!errors.routineId}
											errorMessage={errors.routineId}
											description="모달에서 루틴을 선택하세요."
										/>
										<Button
											variant="flat"
											onPress={onClickOpenRoutinePickerButton}
										>
											루틴 선택
										</Button>
									</div>
									<div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-end">
										<Input
											label="강사"
											labelPlacement="outside"
											value={instructorName}
											placeholder="강사를 선택하세요"
											isReadOnly
											isRequired
											isInvalid={!!errors.instructorId}
											errorMessage={errors.instructorId}
											description="모달에서 강사를 선택하세요."
										/>
										<Button
											variant="flat"
											onPress={onClickOpenInstructorPickerButton}
										>
											강사 선택
										</Button>
									</div>
									<div className="rounded-lg bg-content2 p-3 text-sm text-default-600">
										<p className="font-medium text-default-700">연결 요약</p>
										<p className="mt-1">루틴: {routineName || "-"}</p>
										<p>강사: {instructorName || "-"}</p>
									</div>
									<div className="rounded-lg border border-default-200 p-3">
										<div className="flex items-center justify-between gap-3">
											<p className="font-medium text-default-700">
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
											<p className="mt-2 text-sm text-default-500">
												선택한 루틴에 등록된 운동이 없습니다.
											</p>
										) : (
											<div className="mt-3 flex flex-col gap-2">
												{routinePreview.map((activity) => (
													<div
														key={`${activity.id}:${activity.order}`}
														className="rounded-md bg-content2 px-3 py-2"
													>
														<div className="flex items-center justify-between gap-3">
															<p className="font-medium">
																{activity.order}. {activity.exerciseName}
															</p>
															<Chip
																color={
																	activity.isSchedulable
																		? "success"
																		: "warning"
																}
																size="sm"
																variant="flat"
															>
																{activity.isSchedulable ? "가능" : "불가"}
															</Chip>
														</div>
														<p className="mt-1 text-default-500 text-sm">
															반복 {activity.repetitions}회 · 휴식{" "}
															{activity.restTime}초
														</p>
														{activity.notes ? (
															<p className="mt-1 text-default-500 text-xs">
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
									<Input
										label="정원"
										labelPlacement="outside"
										type="number"
										placeholder="정원을 입력하세요."
										value={capacity}
										onValueChange={onChangeCapacityInput}
										isRequired
										isInvalid={!!errors.capacity}
										errorMessage={errors.capacity}
										min={1}
									/>
									<Select
										label="난이도"
										labelPlacement="outside"
										selectedKeys={selectedLevelKeys}
										onSelectionChange={(keys) => {
											onChangeLevelSelect(
												(Array.from(keys)[0] as string) ?? "",
											);
										}}
									>
										{LEVEL_OPTIONS.map((option) => (
											<SelectItem key={option.value}>{option.label}</SelectItem>
										))}
									</Select>
									<div className="flex justify-end">
										<Button
											color="primary"
											onPress={onClickSubmitButton}
											isLoading={isSubmitPending}
											isDisabled={isSubmitDisabled}
										>
											저장
										</Button>
									</div>
								</VStack>
							</FormSection>
						</FormSectionCard>
					</FormPageSurface>
					<ProgramPickerModal
						isOpen={isRoutinePickerOpen}
						onClose={onClickCloseRoutinePickerButton}
						title="루틴 선택"
						searchLabel="루틴 검색"
						searchPlaceholder="루틴 이름으로 검색하세요."
						searchValue={routineQuery}
						onSearchValueChange={onChangeRoutineQueryInput}
						options={routineOptions}
						onSelect={onSelectRoutineOption}
					/>
					<ProgramPickerModal
						isOpen={isInstructorPickerOpen}
						onClose={onClickCloseInstructorPickerButton}
						title="강사 선택"
						searchLabel="강사 검색"
						searchPlaceholder="강사 이름으로 검색하세요."
						searchValue={instructorQuery}
						onSearchValueChange={onChangeInstructorQueryInput}
						options={instructorOptions}
						onSelect={onSelectInstructorOption}
					/>
				</FormPage>
			);
		},
	);
