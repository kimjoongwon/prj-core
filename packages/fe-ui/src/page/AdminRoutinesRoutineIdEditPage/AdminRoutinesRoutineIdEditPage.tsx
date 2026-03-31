"use client";

import type {
	AdminRoutineActivityFormItem,
	AdminRoutineTaskCandidate,
} from "../AdminRoutinesNewPage/AdminRoutinesNewPage";
import { RoutineActivitySection } from "../AdminRoutinesNewPage/AdminRoutinesNewPage";
import {
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	PageTitleBar,
} from "@cocrepo/ui";
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface AdminRoutinesRoutineIdEditPageProps {
	routineName?: string;
	name: string;
	label: string;
	exerciseQuery: string;
	activities: AdminRoutineActivityFormItem[];
	candidateTasks: AdminRoutineTaskCandidate[];
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

export const AdminRoutinesRoutineIdEditPage = observer(
	({
		routineName,
		name,
		label,
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
	}: AdminRoutinesRoutineIdEditPageProps) => {
		if (isLoading) {
			return (
				<FormPage top={<PageTitleBar title="루틴 수정" description="로딩 중..." />}>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex items-center justify-center gap-2 p-8">
								<Spinner size="sm" />
								<span className="text-default-500">로딩 중...</span>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		if (isNotFound) {
			return (
				<FormPage
					top={
						<PageTitleBar
							title="루틴 수정"
							description="루틴을 찾을 수 없습니다."
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">루틴을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickCancelButton}>
									목록으로
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
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
			<FormPage
				top={
					<PageTitleBar
						title="루틴 수정"
						description={
							routineName ? `${routineName} 루틴을 수정합니다.` : "루틴을 수정합니다."
						}
						actions={pageActions}
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<FormSection top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="flex flex-col gap-4">
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
						</FormSection>
					</FormSectionCard>
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
				</FormPageSurface>
				<Modal
					isOpen={isEmptyActivitiesWarningOpen}
					onClose={onCloseEmptyActivitiesWarningModal}
				>
					<ModalContent>
						<ModalHeader>활동 없이 저장</ModalHeader>
						<ModalBody>
							<p>활동이 0개인 루틴입니다. 이대로 저장하시겠습니까?</p>
						</ModalBody>
						<ModalFooter>
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
								저장 진행
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</FormPage>
		);
	},
);
