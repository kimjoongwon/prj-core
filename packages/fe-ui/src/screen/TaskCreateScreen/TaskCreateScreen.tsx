"use client";

import {
	AssetBrowser,
	type AssetBrowserAsset,
	type AssetBrowserProps,
	ContentLanguageNotice,
	MediaThumbnail,
	PageTitleBar,
	Section,
	SectionSurface,
	useT,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Input } from "../../input/Input/Input";
import { TextArea } from "../../input/TextArea/TextArea";
export interface ExerciseMediaAsset extends AssetBrowserAsset {}
export interface TaskCreateScreenProps {
	name: string;
	durationMin: number;
	durationSec: number;
	count: number;
	description: string;
	contentLanguageCode?: string | null;
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
	onChangeDescriptionTextArea: (value: string) => void;
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
const ExerciseMediaField = observer(function ExerciseMediaField({
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
	const t = useT();
	const isImage = selectedAsset?.mimeType?.startsWith("image/");
	return (
		<div className="rounded-2xl border border-border bg-surface p-4">
			<div className="mb-3 flex items-start justify-between gap-3">
				<div>
					<p className="font-medium">{t(label)}</p>
					<p className="mt-1 text-sm text-muted">{t(description)}</p>
				</div>
				<div className="flex gap-2">
					<Button size="sm" variant="flat" onPress={onOpenPicker}>
						{selectedAsset ? t("다시 선택") : t("에셋에서 선택")}
					</Button>
					<Button
						size="sm"
						variant="flat"
						color="danger"
						onPress={onClear}
						isDisabled={!selectedAsset}
					>
						{t("해제")}
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
						<p className="text-muted">{selectedAsset.mimeType}</p>
						<p className="break-all font-mono text-xs text-muted">
							{selectedAsset.id}
						</p>
					</div>
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted">
					{t(placeholder)}
				</div>
			)}
		</div>
	);
});
export const TaskCreateScreen = observer(
	({
		name,
		durationMin,
		durationSec,
		count,
		description,
		contentLanguageCode,
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
		onChangeDescriptionTextArea,
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
	}: TaskCreateScreenProps) => {
		const t = useT();
		return (
			<VStack gap="section" fullWidth>
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
								{t("취소")}
							</Button>
							<Button
								color="primary"
								onPress={onClickSaveButton}
								isLoading={isSubmitPending}
							>
								{t("저장")}
							</Button>
						</div>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="기본 정보" />
						</Section.Header>
						<Section.Body>
							<div className="flex flex-col gap-4">
								<ContentLanguageNotice
									contentLanguageCode={contentLanguageCode}
								/>
								<Input
									label={t("운동명")}
									placeholder={t("운동 이름을 입력하세요")}
									value={name}
									onValueChange={onChangeNameInput}
									isRequired
									isInvalid={Boolean(errors.name)}
									errorMessage={errors.name ? t(errors.name) : undefined}
								/>
								<div>
									<label className="mb-1 block text-sm font-medium text-foreground">
										{t("지속시간")} <span className="text-danger">*</span>
									</label>
									<div className="flex items-center gap-2">
										<Input
											type="number"
											placeholder={t("분")}
											value={String(durationMin)}
											onValueChange={onChangeDurationMinInput}
											min={0}
											endContent={
												<span className="text-muted text-sm">{t("분")}</span>
											}
											className="max-w-32"
										/>
										<Input
											type="number"
											placeholder={t("초")}
											value={String(durationSec)}
											onValueChange={onChangeDurationSecInput}
											min={0}
											max={59}
											endContent={
												<span className="text-muted text-sm">{t("초")}</span>
											}
											className="max-w-32"
										/>
									</div>
									{errors.duration ? (
										<p className="mt-1 text-sm text-danger">
											{t(errors.duration)}
										</p>
									) : null}
								</div>
								<Input
									label={t("반복횟수")}
									type="number"
									placeholder={t("반복 횟수")}
									value={String(count)}
									onValueChange={onChangeCountInput}
									isRequired
									min={1}
									isInvalid={Boolean(errors.count)}
									errorMessage={errors.count ? t(errors.count) : undefined}
									endContent={
										<span className="text-muted text-sm">{t("회")}</span>
									}
								/>
								<TextArea
									label={t("설명")}
									placeholder={t("운동 설명, 수행 방법 등을 입력하세요 (선택)")}
									value={description}
									onValueChange={onChangeDescriptionTextArea}
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
								<div className="rounded-lg bg-surface-secondary p-3 text-sm text-muted">
									<div className="flex items-center gap-2">
										<span className="font-medium text-foreground">
											{t("스케줄 가능 상태")}
										</span>
										<Chip
											color={isSchedulable ? "success" : "warning"}
											size="sm"
										>
											{isSchedulable ? t("가능") : t("불가")}
										</Chip>
									</div>
									<p className="mt-2">
										{t(
											"영상 파일 ID가 입력된 Exercise만 루틴 편성 및 Program 생성에 사용할 수 있습니다.",
										)}
									</p>
								</div>
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
				<AssetBrowser
					{...assetBrowserProps}
					mode="picker"
					presentation="modal"
					title={t(assetBrowserTitle)}
					description={t(assetBrowserDescription)}
					isOpen={isAssetBrowserOpen}
					onClose={onCloseAssetBrowser}
					selectedAssetId={assetBrowserSelectedAssetId}
					onSelectAsset={onSelectAssetFromBrowser}
				/>
			</VStack>
		);
	},
);
