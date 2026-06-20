"use client";

import {
	Button,
	ContentLanguageNotice,
	Input,
	PageTitleBar,
	ProgramPickerModal,
	SectionSurface,
	useT,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { Select } from "../../selection/Select/Select";

const LEVEL_OPTIONS = [
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
export interface TimelineSessionProgramCreateScreenProps {
	descriptionText?: string;
	contentLanguageCode?: string | null;
	name: string;
	routineName: string;
	instructorName: string;
	capacity: string;
	level: string;
	errors: Record<string, string>;
	routineQuery: string;
	instructorQuery: string;
	routineOptions: TimelineSessionProgramPickerOption[];
	instructorOptions: TimelineSessionProgramPickerOption[];
	routinePreview: TimelineSessionProgramRoutinePreviewItem[];
	hasUnschedulableRoutine: boolean;
	isRoutinePickerOpen: boolean;
	isInstructorPickerOpen: boolean;
	isSubmitPending: boolean;
	isSubmitDisabled: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeCapacityInput: (value: string) => void;
	onChangeLevelSelect: (value: string) => void;
	onChangeRoutineQueryInput: (value: string) => void;
	onChangeInstructorQueryInput: (value: string) => void;
	onSelectRoutineOption: (value: string) => void;
	onSelectInstructorOption: (value: string) => void;
	onClickOpenRoutinePickerButton: () => void;
	onClickCloseRoutinePickerButton: () => void;
	onClickOpenInstructorPickerButton: () => void;
	onClickCloseInstructorPickerButton: () => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}
export const TimelineSessionProgramCreateScreen = observer(
	({
		descriptionText,
		contentLanguageCode,
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
	}: TimelineSessionProgramCreateScreenProps) => {
		const t = useT();
		const selectedLevel = LEVEL_OPTIONS.some((option) => option.value === level)
			? level
			: undefined;
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="프로그램 등록"
					description={descriptionText}
					actions={
						<Button variant="flat" onPress={onClickCancelButton}>
							취소
						</Button>
					}
				/>

				<SectionSurface top={<PageTitleBar level={2} title="기본 정보" />}>
					<VStack gap={4}>
						<ContentLanguageNotice contentLanguageCode={contentLanguageCode} />
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
							<Button variant="flat" onPress={onClickOpenRoutinePickerButton}>
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
						<div className="rounded-lg bg-surface-secondary p-3 text-sm text-muted">
							<p className="font-medium text-foreground">{t("연결 요약")}</p>
							<p className="mt-1">
								{t("루틴")}: {routineName || "-"}
							</p>
							<p>
								{t("강사")}: {instructorName || "-"}
							</p>
						</div>
						<div className="rounded-lg border border-border p-3">
							<div className="flex items-center justify-between gap-3">
								<p className="font-medium text-foreground">
									{t("실행 운동 preview")}
								</p>
								<Chip
									color={hasUnschedulableRoutine ? "warning" : "success"}
									size="sm"
								>
									{hasUnschedulableRoutine ? t("저장 불가") : t("저장 가능")}
								</Chip>
							</div>
							{routinePreview.length === 0 ? (
								<p className="mt-2 text-sm text-muted">
									{t("선택한 루틴에 등록된 운동이 없습니다.")}
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
													color={activity.isSchedulable ? "success" : "warning"}
													size="sm"
													variant="flat"
												>
													{activity.isSchedulable ? t("가능") : t("불가")}
												</Chip>
											</div>
											<p className="mt-1 text-muted text-sm">
												{t("반복")} {activity.repetitions}
												{t("회")} · {t("휴식")} {activity.restTime}
												{t("초")}
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
									{t(
										"영상이 없는 운동이 포함되어 있어 저장 버튼이 비활성화됩니다.",
									)}
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
							value={selectedLevel}
							onChange={(value) => onChangeLevelSelect(String(value ?? ""))}
							options={LEVEL_OPTIONS}
						/>
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
				</SectionSurface>
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
			</VStack>
		);
	},
);
