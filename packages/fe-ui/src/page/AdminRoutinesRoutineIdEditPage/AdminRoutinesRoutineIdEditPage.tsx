"use client";

import type {
	AdminRoutineActivityFormItem,
	AdminRoutineTaskCandidate,
} from "../AdminRoutinesNewPage/AdminRoutinesNewPage";
import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSection,
	FormSectionCard,
} from "@cocrepo/ui";
import {
	Button,
	Chip,
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
	onClickCancelButton: () => void;
	onClickSaveButton: () => void;
	onCloseEmptyActivitiesWarningModal: () => void;
	onClickConfirmEmptyActivitiesWarningButton: () => void;
}

function RoutineActivitySection({
	exerciseQuery,
	candidateTasks,
	activities,
	activitiesError,
	isTasksLoading,
	onChangeExerciseQueryInput,
	onClickAddActivityButton,
	onChangeActivityInput,
	onClickRemoveActivityButton,
}: Pick<
	AdminRoutinesRoutineIdEditPageProps,
	| "exerciseQuery"
	| "candidateTasks"
	| "activities"
	| "activitiesError"
	| "isTasksLoading"
	| "onChangeExerciseQueryInput"
	| "onClickAddActivityButton"
	| "onChangeActivityInput"
	| "onClickRemoveActivityButton"
>) {
	return (
		<FormSectionCard>
			<FormSection top={<PageTitleBar level={2} title="활동 구성" />}>
				<div className="flex flex-col gap-4">
					<Input
						label="운동 검색"
						placeholder="운동 이름으로 검색하세요."
						value={exerciseQuery}
						onValueChange={onChangeExerciseQueryInput}
						description="현재 Space + 상위 Space 운동 중 영상이 등록된 운동만 후보로 표시합니다."
					/>
					<div className="rounded-lg border border-default-200 p-3">
						<div className="mb-2 text-sm text-default-500">
							후보 운동 (스케줄 가능만 표시)
						</div>
						{isTasksLoading ? (
							<div className="flex items-center gap-2 text-sm text-default-500">
								<Spinner size="sm" />
								<span>운동 목록을 불러오는 중...</span>
							</div>
						) : candidateTasks.length === 0 ? (
							<p className="text-sm text-default-500">
								조건에 맞는 스케줄 가능 운동이 없습니다.
							</p>
						) : (
							<div className="flex flex-col gap-2">
								{candidateTasks.map((task) => (
									<div
										key={task.id}
										className="flex items-center justify-between rounded-md bg-content2 px-3 py-2"
									>
										<div>
											<p className="font-medium">{task.exerciseName}</p>
											<p className="text-xs text-default-500">
												기본 반복 {task.exerciseCount}회
											</p>
										</div>
										<Button
											size="sm"
											variant="flat"
											onPress={() => onClickAddActivityButton(task.id)}
										>
											추가
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
					<div className="rounded-lg border border-default-200 p-3">
						<div className="mb-2 text-sm text-default-500">추가된 활동</div>
						{activitiesError ? (
							<p className="mb-3 text-sm text-danger">{activitiesError}</p>
						) : null}
						{activities.length === 0 ? (
							<p className="text-sm text-default-500">
								아직 추가된 활동이 없습니다.
							</p>
						) : (
							<div className="flex flex-col gap-3">
								{activities.map((activity, index) => (
									<div
										key={activity.taskId}
										className="rounded-md bg-content2 p-3"
									>
										<div className="mb-3 flex items-center justify-between">
											<p className="font-medium">
												{index + 1}. {activity.exerciseName}
											</p>
											<div className="flex items-center gap-2">
												<Chip
													color={activity.isSchedulable ? "success" : "warning"}
													size="sm"
												>
													{activity.isSchedulable ? "가능" : "불가"}
												</Chip>
												<Button
													size="sm"
													variant="flat"
													color="danger"
													onPress={() =>
														onClickRemoveActivityButton(activity.taskId)
													}
												>
													제거
												</Button>
											</div>
										</div>
										{!activity.isSchedulable ? (
											<p className="mb-3 text-sm text-warning">
												영상이 없어 Program 생성에 사용할 수 없는 운동입니다.
											</p>
										) : null}
										<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
											<Input
												type="number"
												label="반복 횟수"
												value={activity.repetitions}
												onValueChange={(value) =>
													onChangeActivityInput(
														activity.taskId,
														"repetitions",
														value,
													)
												}
												min={1}
											/>
											<Input
												type="number"
												label="휴식 시간(초)"
												value={activity.restTime}
												onValueChange={(value) =>
													onChangeActivityInput(
														activity.taskId,
														"restTime",
														value,
													)
												}
												min={0}
											/>
											<Input
												label="메모"
												value={activity.notes}
												onValueChange={(value) =>
													onChangeActivityInput(
														activity.taskId,
														"notes",
														value,
													)
												}
												placeholder="필요 시 메모를 입력하세요."
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</FormSection>
		</FormSectionCard>
	);
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
