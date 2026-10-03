"use client";

import {
	Alert,
	getContentLanguageLabel,
	HStack,
	Screen,
	Section,
	SectionSurface,
	Typography,
	toContentLanguageCode,
	useT,
	VStack,
} from "@cocrepo/ui";
import { Card } from "@heroui/react";
import { ImageIcon, PlayCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import {
	AssetBrowser,
	type AssetBrowserAsset,
	type AssetBrowserProps,
} from "../../domain/asset/AssetBrowser";
import { Button } from "../../input/Button/Button";
import { TextArea } from "../../input/TextArea/TextArea";
import { TextField } from "../../input/TextField/TextField";
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
function MediaPreview({
	imageUrl,
	videoUrl,
	title,
	className,
}: {
	imageUrl?: string | null;
	videoUrl?: string | null;
	title: string;
	className?: string;
}) {
	const mediaClassName = `relative overflow-hidden rounded-xl bg-surface-secondary ${className ?? ""}`;
	if (imageUrl) {
		return (
			<Card className={mediaClassName}>
				<img
					src={imageUrl}
					alt={title}
					className="h-full w-full object-cover"
					loading="lazy"
				/>
			</Card>
		);
	}
	if (videoUrl) {
		return (
			<Card className={mediaClassName}>
				<video
					src={videoUrl}
					className="h-full w-full object-cover"
					muted
					playsInline
					preload="metadata"
				/>
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-backdrop via-transparent to-transparent" />
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<PlayCircle className="h-8 w-8 text-accent-foreground" />
				</div>
			</Card>
		);
	}
	return (
		<Card
			className={`flex items-center justify-center rounded-xl border border-dashed border-border bg-surface-secondary text-muted ${className ?? ""}`}
		>
			<VStack gap="block" alignItems="center">
				<ImageIcon className="h-7 w-7" />
				<Typography.Paragraph size="xs">미리보기 없음</Typography.Paragraph>
			</VStack>
		</Card>
	);
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
			<HStack alignItems="start" justifyContent="between" gap="block">
				<div>
					<Typography.Paragraph weight="medium">
						{t(label)}
					</Typography.Paragraph>
					<Typography.Paragraph size="sm" color="muted" className="mt-1">
						{t(description)}
					</Typography.Paragraph>
				</div>
				<HStack>
					<Button size="sm" variant="tertiary" onPress={onOpenPicker}>
						{selectedAsset ? t("다시 선택") : t("에셋에서 선택")}
					</Button>
					<Button
						size="sm"
						variant="tertiary"
						onPress={onClear}
						isDisabled={!selectedAsset}
					>
						{t("해제")}
					</Button>
				</HStack>
			</HStack>
			{selectedAsset ? (
				<VStack gap="block" className="md:flex-row">
					<MediaPreview
						imageUrl={isImage ? selectedAsset.publicUrl : undefined}
						videoUrl={!isImage ? selectedAsset.publicUrl : undefined}
						title={selectedAsset.originalName}
						className="aspect-video w-full max-w-xs"
					/>
					<VStack gap="dense">
						<Typography.Paragraph weight="medium">
							{selectedAsset.originalName}
						</Typography.Paragraph>
						<Typography.Paragraph color="muted" size="sm">
							{selectedAsset.mimeType}
						</Typography.Paragraph>
						<Typography.Code className="break-all">
							{selectedAsset.id}
						</Typography.Code>
					</VStack>
				</VStack>
			) : (
				<Typography.Paragraph
					color="muted"
					size="sm"
					className="rounded-xl border border-dashed border-border px-4 py-6"
				>
					{t(placeholder)}
				</Typography.Paragraph>
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
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const languageLabel = getContentLanguageLabel(contentLanguageCode);
		return (
			<VStack fullWidth>
				<Screen.Header
					title="태스크 등록"
					description="새로운 태스크와 운동 detail을 등록합니다."
					actions={
						<HStack>
							<Button
								variant="tertiary"
								onPress={onClickCancelButton}
								isDisabled={isSubmitPending}
							>
								{t("취소")}
							</Button>
							<Button
								variant="primary"
								onPress={onClickSaveButton}
								isLoading={isSubmitPending}
							>
								{t("저장")}
							</Button>
						</HStack>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Header title="기본 정보" />
						<Section.Body>
							<VStack gap="section">
								<Alert
									status={languageCode ? "accent" : "warning"}
									title="현재 Space 콘텐츠 언어"
									actions={
										<Chip
											size="sm"
											variant="soft"
											color={languageCode ? "accent" : "warning"}
										>
											{languageLabel}
										</Chip>
									}
								/>
								<TextField
									label={t("운동명")}
									placeholder={t("운동 이름을 입력하세요")}
									value={name}
									onValueChange={onChangeNameInput}
									isRequired
									isInvalid={Boolean(errors.name)}
									errorMessage={errors.name ? t(errors.name) : undefined}
								/>
								<div>
									<label className="mb-1 block">
										<Typography type="body-sm" weight="medium">
											{t("지속시간")} <span className="text-danger">*</span>
										</Typography>
									</label>
									<HStack alignItems="center">
										<TextField
											type="number"
											placeholder={t("분")}
											value={String(durationMin)}
											onValueChange={onChangeDurationMinInput}
											min={0}
											endContent={
												<Typography type="body-sm" color="muted">
													{t("분")}
												</Typography>
											}
											className="max-w-32"
										/>
										<TextField
											type="number"
											placeholder={t("초")}
											value={String(durationSec)}
											onValueChange={onChangeDurationSecInput}
											min={0}
											max={59}
											endContent={
												<Typography type="body-sm" color="muted">
													{t("초")}
												</Typography>
											}
											className="max-w-32"
										/>
									</HStack>
									{errors.duration ? (
										<Typography.Paragraph
											size="sm"
											className="mt-1 text-danger"
										>
											{t(errors.duration)}
										</Typography.Paragraph>
									) : null}
								</div>
								<TextField
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
										<Typography type="body-sm" color="muted">
											{t("회")}
										</Typography>
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
								<div className="rounded-lg bg-surface-secondary p-3">
									<HStack alignItems="center">
										<Typography type="body-sm" weight="medium">
											{t("스케줄 가능 상태")}
										</Typography>
										<Chip
											color={isSchedulable ? "success" : "warning"}
											size="sm"
										>
											{isSchedulable ? t("가능") : t("불가")}
										</Chip>
									</HStack>
									<Typography.Paragraph
										size="sm"
										color="muted"
										className="mt-2"
									>
										{t(
											"영상 파일 ID가 입력된 Exercise만 루틴 편성 및 Program 생성에 사용할 수 있습니다.",
										)}
									</Typography.Paragraph>
								</div>
							</VStack>
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
