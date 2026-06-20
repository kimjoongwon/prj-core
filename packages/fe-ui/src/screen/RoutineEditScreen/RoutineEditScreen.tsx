"use client";

import {
	Button,
	ContentLanguageNotice,
	Input,
	PageTitleBar,
	SectionSurface,
	useT,
	VStack,
} from "@cocrepo/ui";
import { Modal, Spinner, useOverlayState } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type {
	RoutineActivityFormItem,
	RoutineTaskCandidate,
} from "../RoutineCreateScreen/RoutineCreateScreen";
import { RoutineActivitySection } from "../RoutineCreateScreen/RoutineCreateScreen";
export interface RoutineEditScreenProps {
	routineName?: string;
	name: string;
	label: string;
	contentLanguageCode?: string | null;
	exerciseQuery: string;
	activities: RoutineActivityFormItem[];
	candidateTasks: RoutineTaskCandidate[];
	nameError?: string;
	labelError?: string;
	activitiesError?: string;
	isLoading: boolean;
	isNotFound: boolean;
	isTasksLoading: boolean;
	isSubmitting: boolean;
	isEmptyActivitiesWarningOpen: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeLabelInput: (value: string) => void;
	onChangeExerciseQueryInput: (value: string) => void;
	onClickAddActivityButton: (taskId: string) => void;
	onChangeActivityInput: (
		taskId: string,
		field: "repetitions" | "restTime" | "notes",
		value: string,
	) => void;
	onClickRemoveActivityButton: (taskId: string) => void;
	onReorderActivities: (fromIndex: number, toIndex: number) => void;
	onClickCancelButton: () => void;
	onClickSaveButton: () => void;
	onCloseEmptyActivitiesWarningModal: () => void;
	onClickConfirmEmptyActivitiesWarningButton: () => void;
}
export const RoutineEditScreen = observer(
	({
		routineName,
		name,
		label,
		contentLanguageCode,
		exerciseQuery,
		activities,
		candidateTasks,
		nameError,
		labelError,
		activitiesError,
		isLoading,
		isNotFound,
		isTasksLoading,
		isSubmitting,
		isEmptyActivitiesWarningOpen,
		onChangeNameInput,
		onChangeLabelInput,
		onChangeExerciseQueryInput,
		onClickAddActivityButton,
		onChangeActivityInput,
		onClickRemoveActivityButton,
		onReorderActivities,
		onClickCancelButton,
		onClickSaveButton,
		onCloseEmptyActivitiesWarningModal,
		onClickConfirmEmptyActivitiesWarningButton,
	}: RoutineEditScreenProps) => {
		const t = useT();
		const emptyActivitiesWarningState = useOverlayState({
			isOpen: isEmptyActivitiesWarningOpen,
			onOpenChange: (open) => {
				if (!open) {
					onCloseEmptyActivitiesWarningModal();
				}
			},
		});
		if (isLoading) {
			return (
				<VStack gap="section" fullWidth>
					<PageTitleBar title="루틴 수정" description="로딩 중..." />

					<SectionSurface>
						<div className="flex items-center justify-center gap-2 p-8">
							<Spinner size="sm" />
							<span className="text-muted">{t("로딩 중...")}</span>
						</div>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound) {
			return (
				<VStack gap="section" fullWidth>
					<PageTitleBar
						title="루틴 수정"
						description="루틴을 찾을 수 없습니다."
					/>

					<SectionSurface>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-muted">{t("루틴을 찾을 수 없습니다.")}</p>
							<Button variant="flat" onPress={onClickCancelButton}>
								목록으로
							</Button>
						</div>
					</SectionSurface>
				</VStack>
			);
		}
		const pageActions = (
			<div className="flex gap-2">
				<Button
					variant="flat"
					onPress={onClickCancelButton}
					isDisabled={isSubmitting}
				>
					취소
				</Button>
				<Button
					color="primary"
					onPress={onClickSaveButton}
					isLoading={isSubmitting}
				>
					저장
				</Button>
			</div>
		);
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="루틴 수정"
					description={
						routineName ? (
							<>
								{routineName} {t("루틴을 수정합니다.")}
							</>
						) : (
							"루틴을 수정합니다."
						)
					}
					actions={pageActions}
				/>

				<SectionSurface>
					<SectionSurface top={<PageTitleBar level={2} title="기본 정보" />}>
						<div className="flex flex-col gap-4">
							<ContentLanguageNotice
								contentLanguageCode={contentLanguageCode}
							/>
							<Input
								label="루틴 이름"
								placeholder="예: 풀바디 루틴 A"
								value={name}
								onValueChange={onChangeNameInput}
								isRequired
								isInvalid={Boolean(nameError)}
								errorMessage={nameError}
								maxLength={100}
							/>
							<Input
								label="단축 라벨"
								placeholder="예: FULL-A"
								value={label}
								onValueChange={onChangeLabelInput}
								isRequired
								isInvalid={Boolean(labelError)}
								errorMessage={labelError}
								maxLength={50}
							/>
						</div>
					</SectionSurface>
					<RoutineActivitySection
						exerciseQuery={exerciseQuery}
						candidateTasks={candidateTasks}
						activities={activities}
						activitiesError={activitiesError}
						isTasksLoading={isTasksLoading}
						onChangeExerciseQueryInput={onChangeExerciseQueryInput}
						onClickAddActivityButton={onClickAddActivityButton}
						onChangeActivityInput={onChangeActivityInput}
						onClickRemoveActivityButton={onClickRemoveActivityButton}
						onReorderActivities={onReorderActivities}
					/>
				</SectionSurface>
				<Modal state={emptyActivitiesWarningState}>
					<Modal.Backdrop>
						<Modal.Container>
							<Modal.Dialog>
								<Modal.Header>{t("활동 없이 저장")}</Modal.Header>
								<Modal.Body>
									<p>
										{t("활동이 0개인 루틴입니다. 이대로 저장하시겠습니까?")}
									</p>
								</Modal.Body>
								<Modal.Footer>
									<Button
										variant="flat"
										onPress={onCloseEmptyActivitiesWarningModal}
										isDisabled={isSubmitting}
									>
										취소
									</Button>
									<Button
										color="warning"
										onPress={onClickConfirmEmptyActivitiesWarningButton}
										isLoading={isSubmitting}
									>
										{t("저장 진행")}
									</Button>
								</Modal.Footer>
							</Modal.Dialog>
						</Modal.Container>
					</Modal.Backdrop>
				</Modal>
			</VStack>
		);
	},
);
