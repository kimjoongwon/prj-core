"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSection,
	FormSectionCard,
} from "@cocrepo/ui";
import { Button, Chip, Input, Spinner, Textarea } from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface AdminTasksTaskIdExerciseEditPageProps {
	exerciseName?: string;
	name: string;
	durationMin: number;
	durationSec: number;
	count: number;
	description: string;
	imageFileId: string;
	videoFileId: string;
	errors: Record<string, string>;
	isSchedulable: boolean;
	isLoading: boolean;
	isNotFound: boolean;
	isSubmitPending: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeDurationMinInput: (value: string) => void;
	onChangeDurationSecInput: (value: string) => void;
	onChangeCountInput: (value: string) => void;
	onChangeDescriptionTextarea: (value: string) => void;
	onChangeImageFileIdInput: (value: string) => void;
	onChangeVideoFileIdInput: (value: string) => void;
	onClickCancelButton: () => void;
	onClickSaveButton: () => void;
}

export const AdminTasksTaskIdExerciseEditPage = observer(
	({
		exerciseName,
		name,
		durationMin,
		durationSec,
		count,
		description,
		imageFileId,
		videoFileId,
		errors,
		isSchedulable,
		isLoading,
		isNotFound,
		isSubmitPending,
		onChangeNameInput,
		onChangeDurationMinInput,
		onChangeDurationSecInput,
		onChangeCountInput,
		onChangeDescriptionTextarea,
		onChangeImageFileIdInput,
		onChangeVideoFileIdInput,
		onClickCancelButton,
		onClickSaveButton,
	}: AdminTasksTaskIdExerciseEditPageProps) => {
		if (isLoading) {
			return (
				<FormPage
					top={<PageTitleBar title="운동 정보 수정" description="로딩 중..." />}
				>
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
							title="운동 정보 수정"
							description="운동 detail을 찾을 수 없습니다."
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">
									운동 detail을 찾을 수 없습니다.
								</p>
								<Button variant="flat" onPress={onClickCancelButton}>
									목록으로
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		return (
			<FormPage
				top={
					<PageTitleBar
						title="운동 정보 수정"
						description={
							exerciseName
								? `${exerciseName} 운동 detail을 수정합니다.`
								: "운동 detail을 수정합니다."
						}
						actions={
							<div className="flex gap-2">
								<Button
									variant="flat"
									onPress={onClickCancelButton}
									isDisabled={isSubmitPending}
								>
									취소
								</Button>
								<Button
									color="primary"
									onPress={onClickSaveButton}
									isLoading={isSubmitPending}
								>
									저장
								</Button>
							</div>
						}
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<FormSection top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="flex flex-col gap-4">
								<Input
									label="운동명"
									placeholder="운동 이름을 입력하세요"
									value={name}
									onValueChange={onChangeNameInput}
									isRequired
									isInvalid={Boolean(errors.name)}
									errorMessage={errors.name}
								/>
								<div>
									<label className="mb-1 block text-sm font-medium text-default-700">
										지속시간 <span className="text-danger">*</span>
									</label>
									<div className="flex items-center gap-2">
										<Input
											type="number"
											placeholder="분"
											value={String(durationMin)}
											onValueChange={onChangeDurationMinInput}
											min={0}
											endContent={
												<span className="text-sm text-default-400">분</span>
											}
											className="max-w-32"
										/>
										<Input
											type="number"
											placeholder="초"
											value={String(durationSec)}
											onValueChange={onChangeDurationSecInput}
											min={0}
											max={59}
											endContent={
												<span className="text-sm text-default-400">초</span>
											}
											className="max-w-32"
										/>
									</div>
									{errors.duration ? (
										<p className="mt-1 text-sm text-danger">{errors.duration}</p>
									) : null}
								</div>
								<Input
									label="반복횟수"
									type="number"
									placeholder="반복 횟수"
									value={String(count)}
									onValueChange={onChangeCountInput}
									isRequired
									min={1}
									isInvalid={Boolean(errors.count)}
									errorMessage={errors.count}
									endContent={
										<span className="text-sm text-default-400">회</span>
									}
								/>
								<Textarea
									label="설명"
									placeholder="운동 설명, 수행 방법 등을 입력하세요 (선택)"
									value={description}
									onValueChange={onChangeDescriptionTextarea}
									maxLength={500}
									minRows={3}
								/>
								<Input
									label="이미지 파일 ID"
									placeholder="업로드된 이미지 에셋 ID를 입력하세요"
									value={imageFileId}
									onValueChange={onChangeImageFileIdInput}
									description="선택 입력입니다. 운동 상세 화면에서 자산 링크로 노출됩니다."
								/>
								<Input
									label="영상 파일 ID"
									placeholder="업로드된 영상 에셋 ID를 입력하세요"
									value={videoFileId}
									onValueChange={onChangeVideoFileIdInput}
									description="비어 있으면 저장은 가능하지만 루틴 편성과 프로그램 생성에는 사용할 수 없습니다."
								/>
								<div className="rounded-lg bg-content2 p-3 text-sm text-default-600">
									<div className="flex items-center gap-2">
										<span className="font-medium text-default-700">
											스케줄 가능 상태
										</span>
										<Chip color={isSchedulable ? "success" : "warning"} size="sm">
											{isSchedulable ? "가능" : "불가"}
										</Chip>
									</div>
									<p className="mt-2">
										영상 파일 ID가 입력된 Exercise만 루틴 편성 및 Program 생성에
										사용할 수 있습니다.
									</p>
								</div>
							</div>
						</FormSection>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	},
);
