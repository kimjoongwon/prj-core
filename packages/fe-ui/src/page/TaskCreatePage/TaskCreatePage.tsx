"use client";

import {
	AssetBrowser,
	type AssetBrowserAsset,
	type AssetBrowserProps,
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	MediaThumbnail,
	PageTitleBar,
} from "@cocrepo/ui";
import { Button, Chip, Input, Textarea } from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface ExerciseMediaAsset extends AssetBrowserAsset {}

export interface TaskCreatePageProps {
	name: string;
	durationMin: number;
	durationSec: number;
	count: number;
	description: string;
	selectedImageAsset?: ExerciseMediaAsset;
	selectedVideoAsset?: ExerciseMediaAsset;
	assetBrowserProps: Omit<
		AssetBrowserProps,
		| "mode"
		| "presentation"
		| "title"
		| "description"
		| "isOpen"
		| "onClose"
		| "selectedAssetId"
		| "onSelectAsset"
	>;
	assetBrowserTitle: string;
	assetBrowserDescription: string;
	assetBrowserSelectedAssetId?: string;
	isAssetBrowserOpen: boolean;
	errors: Record<string, string>;
	isSchedulable: boolean;
	isSubmitPending: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeDurationMinInput: (value: string) => void;
	onChangeDurationSecInput: (value: string) => void;
	onChangeCountInput: (value: string) => void;
	onChangeDescriptionTextarea: (value: string) => void;
	onChangeImageFileIdInput: (value: string) => void;
	onChangeVideoFileIdInput: (value: string) => void;
	onOpenImagePicker: () => void;
	onOpenVideoPicker: () => void;
	onCloseAssetBrowser: () => void;
	onSelectAssetFromBrowser: (asset: ExerciseMediaAsset) => void;
	onClickClearImageAssetButton: () => void;
	onClickClearVideoAssetButton: () => void;
	onClickCancelButton: () => void;
	onClickSaveButton: () => void;
}

function ExerciseMediaField({
	label,
	description,
	selectedAsset,
	placeholder,
	onOpenPicker,
	onClear,
}: {
	label: string;
	description: string;
	selectedAsset?: ExerciseMediaAsset;
	placeholder: string;
	onOpenPicker: () => void;
	onClear: () => void;
}) {
	const isImage = selectedAsset?.mimeType?.startsWith("image/");
	return (
		<div className="rounded-2xl border border-default-200 bg-content1 p-4">
			<div className="mb-3 flex items-start justify-between gap-3">
				<div>
					<p className="font-medium">{label}</p>
					<p className="mt-1 text-sm text-default-500">{description}</p>
				</div>
				<div className="flex gap-2">
					<Button size="sm" variant="flat" onPress={onOpenPicker}>
						{selectedAsset ? "다시 선택" : "에셋에서 선택"}
					</Button>
					<Button
						size="sm"
						variant="flat"
						color="danger"
						onPress={onClear}
						isDisabled={!selectedAsset}
					>
						해제
					</Button>
				</div>
			</div>
			{selectedAsset ? (
				<div className="flex flex-col gap-3 md:flex-row">
					<MediaThumbnail
						imageUrl={isImage ? selectedAsset.publicUrl : undefined}
						videoUrl={!isImage ? selectedAsset.publicUrl : undefined}
						title={selectedAsset.originalName}
						className="aspect-video w-full max-w-xs"
					/>
					<div className="space-y-1 text-sm">
						<p className="font-medium">{selectedAsset.originalName}</p>
						<p className="text-default-500">{selectedAsset.mimeType}</p>
						<p className="break-all font-mono text-xs text-default-400">
							{selectedAsset.id}
						</p>
					</div>
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-default-300 px-4 py-6 text-sm text-default-500">
					{placeholder}
				</div>
			)}
		</div>
	);
}

export const TaskCreatePage = observer(
	({
		name,
		durationMin,
		durationSec,
		count,
		description,
		selectedImageAsset,
		selectedVideoAsset,
		assetBrowserProps,
		assetBrowserTitle,
		assetBrowserDescription,
		assetBrowserSelectedAssetId,
		isAssetBrowserOpen,
		errors,
		isSchedulable,
		isSubmitPending,
		onChangeNameInput,
		onChangeDurationMinInput,
		onChangeDurationSecInput,
		onChangeCountInput,
		onChangeDescriptionTextarea,
		onChangeImageFileIdInput,
		onChangeVideoFileIdInput,
		onOpenImagePicker,
		onOpenVideoPicker,
		onCloseAssetBrowser,
		onSelectAssetFromBrowser,
		onClickClearImageAssetButton,
		onClickClearVideoAssetButton,
		onClickCancelButton,
		onClickSaveButton,
	}: TaskCreatePageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="태스크 등록"
						description="새로운 태스크와 운동 detail을 등록합니다."
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
												<span className="text-default-400 text-sm">분</span>
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
												<span className="text-default-400 text-sm">초</span>
											}
											className="max-w-32"
										/>
									</div>
									{errors.duration ? (
										<p className="mt-1 text-sm text-danger">
											{errors.duration}
										</p>
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
										<span className="text-default-400 text-sm">회</span>
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
								<ExerciseMediaField
									label="대표 이미지"
									description="운동 카드와 상세 화면에서 먼저 보일 이미지를 선택합니다."
									selectedAsset={selectedImageAsset}
									placeholder="이미지 에셋을 선택하면 여기서 바로 미리보기를 확인할 수 있습니다."
									onOpenPicker={onOpenImagePicker}
									onClear={() => {
										onChangeImageFileIdInput("");
										onClickClearImageAssetButton();
									}}
								/>
								<ExerciseMediaField
									label="운동 영상"
									description="루틴 편성과 프로그램 생성에는 영상이 연결된 운동이 필요합니다."
									selectedAsset={selectedVideoAsset}
									placeholder="영상 에셋을 선택하면 루틴 카드에서 영상 썸네일로 활용됩니다."
									onOpenPicker={onOpenVideoPicker}
									onClear={() => {
										onChangeVideoFileIdInput("");
										onClickClearVideoAssetButton();
									}}
								/>
								<div className="rounded-lg bg-content2 p-3 text-sm text-default-600">
									<div className="flex items-center gap-2">
										<span className="font-medium text-default-700">
											스케줄 가능 상태
										</span>
										<Chip
											color={isSchedulable ? "success" : "warning"}
											size="sm"
										>
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
				<AssetBrowser
					{...assetBrowserProps}
					mode="picker"
					presentation="modal"
					title={assetBrowserTitle}
					description={assetBrowserDescription}
					isOpen={isAssetBrowserOpen}
					onClose={onCloseAssetBrowser}
					selectedAssetId={assetBrowserSelectedAssetId}
					onSelectAsset={onSelectAssetFromBrowser}
				/>
			</FormPage>
		);
	},
);
