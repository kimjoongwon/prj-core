"use client";

import { Card } from "@heroui/react";
import { ImageIcon, PlayCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import {
	getContentLanguageLabel,
	toContentLanguageCode,
} from "../../data-display/content-language";
import type { AssetBrowserAsset } from "../../domain/asset/AssetBrowser";
import { Alert } from "../../feedback/Alert/Alert";
import { Button } from "../../input/Button/Button";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";

export interface TaskExerciseMediaAsset extends AssetBrowserAsset {}

export type TaskExerciseFormField =
	| "name"
	| "duration"
	| "durationMin"
	| "durationSec"
	| "count"
	| "description"
	| "imageFileId"
	| "videoFileId";

export interface TaskExerciseFormState {
	name: string;
	durationMin: number;
	durationSec: number;
	count: number;
	description: string;
	imageFileId: string;
	videoFileId: string;
	errors: Partial<Record<TaskExerciseFormField, string>>;
}

export interface TaskExerciseFormProps {
	state: TaskExerciseFormState;
	contentLanguageCode?: string | null;
	selectedImageAsset?: TaskExerciseMediaAsset;
	selectedVideoAsset?: TaskExerciseMediaAsset;
	readOnly?: boolean;
	onOpenImagePicker?: () => void;
	onOpenVideoPicker?: () => void;
	onClickClearImageAssetButton?: () => void;
	onClickClearVideoAssetButton?: () => void;
}

function clearFieldError(
	state: TaskExerciseFormState,
	field: TaskExerciseFormField,
) {
	if (state.errors[field]) {
		delete state.errors[field];
	}
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
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<PlayCircle className="h-8 w-8 text-white/90" />
				</div>
			</Card>
		);
	}

	return (
		<Card
			className={`flex items-center justify-center rounded-xl border border-dashed border-border bg-surface-secondary text-muted ${className ?? ""}`}
		>
			<div className="flex flex-col items-center gap-2">
				<ImageIcon className="h-7 w-7" />
				<span className="text-xs">미리보기 없음</span>
			</div>
		</Card>
	);
}

const ExerciseMediaField = observer(
	({
		label,
		description,
		selectedAsset,
		fileId,
		placeholder,
		isEditable,
		onOpenPicker,
		onClear,
	}: {
		label: string;
		description: string;
		selectedAsset?: TaskExerciseMediaAsset;
		fileId: string;
		placeholder: string;
		isEditable: boolean;
		onOpenPicker?: () => void;
		onClear?: () => void;
	}) => {
		const isImage = selectedAsset?.mimeType?.startsWith("image/");

		return (
			<div className="rounded-2xl border border-border bg-surface p-4">
				<div className="mb-3 flex items-start justify-between gap-3">
					<div>
						<p className="font-medium">{label}</p>
						<p className="mt-1 text-sm text-muted">{description}</p>
					</div>
					{isEditable ? (
						<div className="flex gap-2">
							<Button size="sm" variant="flat" onPress={onOpenPicker}>
								{selectedAsset || fileId ? "다시 선택" : "에셋에서 선택"}
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="danger"
								onPress={onClear}
								isDisabled={!selectedAsset && !fileId}
							>
								해제
							</Button>
						</div>
					) : null}
				</div>
				{selectedAsset ? (
					<div className="flex flex-col gap-3 md:flex-row">
						<MediaPreview
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
				) : fileId ? (
					<div className="rounded-xl border border-border bg-surface-secondary px-4 py-3">
						<p className="break-all font-mono text-sm">{fileId}</p>
					</div>
				) : (
					<div className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted">
						{placeholder}
					</div>
				)}
			</div>
		);
	},
);

/**
 * Task Exercise aggregate의 운동 상세/수정 필드 조합입니다.
 * 화면 모드는 route가 전달한 readOnly로만 결정합니다.
 */
export const TaskExerciseForm = observer(
	({
		state,
		contentLanguageCode,
		selectedImageAsset,
		selectedVideoAsset,
		readOnly = false,
		onOpenImagePicker,
		onOpenVideoPicker,
		onClickClearImageAssetButton,
		onClickClearVideoAssetButton,
	}: TaskExerciseFormProps) => {
		const languageCode = toContentLanguageCode(contentLanguageCode);
		const languageLabel = getContentLanguageLabel(contentLanguageCode);
		const isSchedulable = state.videoFileId.trim().length > 0;

		return (
			<div className="flex flex-col gap-4">
				<Alert
					status={languageCode ? "accent" : "warning"}
					title="현재 Space 콘텐츠 언어"
					actions={
						<Chip
							size="sm"
							variant="flat"
							color={languageCode ? "primary" : "warning"}
						>
							{languageLabel}
						</Chip>
					}
				/>
				<TextField
					label="운동명"
					placeholder="운동 이름을 입력하세요"
					state={state}
					path="name"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isRequired
					isInvalid={Boolean(state.errors.name)}
					errorMessage={state.errors.name}
					onValueChange={() => clearFieldError(state, "name")}
				/>
				<div>
					<label className="mb-1 block text-sm font-medium text-foreground">
						지속시간 <span className="text-danger">*</span>
					</label>
					<div className="flex items-center gap-2">
						<TextField
							type="number"
							placeholder="분"
							state={state}
							path="durationMin"
							min={0}
							endContent={<span className="text-sm text-muted">분</span>}
							className="max-w-32"
							isReadOnly={readOnly}
							isDisabled={readOnly}
							onValueChange={() => clearFieldError(state, "duration")}
						/>
						<TextField
							type="number"
							placeholder="초"
							state={state}
							path="durationSec"
							min={0}
							max={59}
							endContent={<span className="text-sm text-muted">초</span>}
							className="max-w-32"
							isReadOnly={readOnly}
							isDisabled={readOnly}
							onValueChange={() => clearFieldError(state, "duration")}
						/>
					</div>
					{state.errors.duration ? (
						<p className="mt-1 text-sm text-danger">{state.errors.duration}</p>
					) : null}
				</div>
				<TextField
					label="반복횟수"
					type="number"
					placeholder="반복 횟수"
					state={state}
					path="count"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isRequired
					min={1}
					isInvalid={Boolean(state.errors.count)}
					errorMessage={state.errors.count}
					endContent={<span className="text-sm text-muted">회</span>}
					onValueChange={() => clearFieldError(state, "count")}
				/>
				<TextArea
					label="설명"
					placeholder="운동 설명, 수행 방법 등을 입력하세요 (선택)"
					state={state}
					path="description"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					maxLength={500}
					minRows={3}
				/>
				<ExerciseMediaField
					label="대표 이미지"
					description="운동 카드와 상세 화면에서 먼저 보일 이미지를 선택합니다."
					selectedAsset={selectedImageAsset}
					fileId={state.imageFileId}
					placeholder="이미지 에셋을 선택하면 여기서 바로 미리보기를 확인할 수 있습니다."
					isEditable={!readOnly}
					onOpenPicker={onOpenImagePicker}
					onClear={onClickClearImageAssetButton}
				/>
				<ExerciseMediaField
					label="운동 영상"
					description="루틴 편성과 프로그램 생성에는 영상이 연결된 운동이 필요합니다."
					selectedAsset={selectedVideoAsset}
					fileId={state.videoFileId}
					placeholder="영상 에셋을 선택하면 루틴 카드에서 영상 썸네일로 활용됩니다."
					isEditable={!readOnly}
					onOpenPicker={onOpenVideoPicker}
					onClear={onClickClearVideoAssetButton}
				/>
				<div className="rounded-lg bg-surface-secondary p-3 text-sm text-muted">
					<div className="flex items-center gap-2">
						<span className="font-medium text-foreground">
							스케줄 가능 상태
						</span>
						<Chip color={isSchedulable ? "success" : "warning"} size="sm">
							{isSchedulable ? "가능" : "불가"}
						</Chip>
					</div>
					<p className="mt-2">
						영상 파일 ID가 입력된 Exercise만 루틴 편성 및 Program 생성에 사용할
						수 있습니다.
					</p>
				</div>
			</div>
		);
	},
);
