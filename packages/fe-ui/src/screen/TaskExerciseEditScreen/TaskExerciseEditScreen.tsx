"use client";

import type { RoutineDto } from "@cocrepo/api/core/routines";
import type { ExerciseDto, TaskDto } from "@cocrepo/api/core/tasks";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { DateTimeCell } from "../../data-grid/cell";
import {
	AssetBrowser,
	type AssetBrowserProps,
} from "../../domain/asset/AssetBrowser";
import {
	TaskExerciseForm,
	type TaskExerciseFormState,
	type TaskExerciseMediaAsset,
} from "../../form/TaskExerciseForm";
import { Button } from "../../input/Button/Button";
import { Screen } from "../../layout/Screen";
import { Section } from "../../layout/Section/Section";
import { HStack, VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
export interface ExerciseMediaAsset extends TaskExerciseMediaAsset {}
export type TaskExerciseEditScreenRoutine = Pick<
	RoutineDto,
	"id" | "name" | "label" | "createdAt"
>;
export type TaskExerciseEditScreenMetadata = Pick<
	ExerciseDto,
	"taskId" | "createdAt" | "updatedAt"
> &
	Pick<TaskDto, "spaceId"> & {
		routines?: TaskExerciseEditScreenRoutine[];
	};
export interface TaskExerciseEditScreenProps {
	title?: ReactNode;
	description?: ReactNode;
	actions?: ReactNode;
	state: TaskExerciseFormState;
	contentLanguageCode?: string | null;
	selectedImageAsset?: ExerciseMediaAsset;
	selectedVideoAsset?: ExerciseMediaAsset;
	readOnly?: boolean;
	metadata?: TaskExerciseEditScreenMetadata;
	assetBrowserProps?: Omit<
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
	assetBrowserTitle?: string;
	assetBrowserDescription?: string;
	assetBrowserSelectedAssetId?: string;
	isAssetBrowserOpen?: boolean;
	isLoading: boolean;
	isNotFound: boolean;
	isSubmitPending: boolean;
	onOpenImagePicker?: () => void;
	onOpenVideoPicker?: () => void;
	onCloseAssetBrowser?: () => void;
	onSelectAssetFromBrowser?: (asset: ExerciseMediaAsset) => void;
	onClickClearImageAssetButton?: () => void;
	onClickClearVideoAssetButton?: () => void;
	onClickCancelButton: () => void;
	onClickSaveButton?: () => void;
}
const formatDuration = (durationMin: number, durationSec: number) =>
	durationMin > 0 ? `${durationMin}분 ${durationSec}초` : `${durationSec}초`;

/** Task Exercise aggregate의 상세/수정 route가 공유하는 화면입니다. */
export const TaskExerciseEditScreen = observer(
	({
		title,
		description,
		actions,
		state,
		contentLanguageCode,
		selectedImageAsset,
		selectedVideoAsset,
		readOnly = false,
		metadata,
		assetBrowserProps,
		assetBrowserTitle = "에셋 선택",
		assetBrowserDescription = "운동에 연결할 에셋을 선택합니다.",
		assetBrowserSelectedAssetId,
		isAssetBrowserOpen = false,
		isLoading,
		isNotFound,
		isSubmitPending,
		onOpenImagePicker,
		onOpenVideoPicker,
		onCloseAssetBrowser,
		onSelectAssetFromBrowser,
		onClickClearImageAssetButton,
		onClickClearVideoAssetButton,
		onClickCancelButton,
		onClickSaveButton,
	}: TaskExerciseEditScreenProps) => {
		const resolvedTitle = title ?? (readOnly ? "운동 정보" : "운동 정보 수정");
		const resolvedDescription =
			description ??
			(readOnly
				? "태스크에 연결된 운동 detail입니다."
				: "운동 detail을 수정합니다.");
		const resolvedActions =
			actions ??
			(readOnly ? undefined : (
				<HStack>
					<Button
						variant="tertiary"
						onPress={onClickCancelButton}
						isDisabled={isSubmitPending}
					>
						취소
					</Button>
					<Button
						variant="primary"
						onPress={onClickSaveButton}
						isLoading={isSubmitPending}
					>
						저장
					</Button>
				</HStack>
			));
		if (isLoading) {
			return (
				<VStack fullWidth>
					<Screen.Header title={resolvedTitle} description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<HStack
									alignItems="center"
									justifyContent="center"
									className="p-8"
								>
									<Spinner size="sm" />
									<span className="text-muted">로딩 중...</span>
								</HStack>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound) {
			return (
				<VStack fullWidth>
					<Screen.Header
						title={resolvedTitle}
						description="운동 detail을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<VStack
									gap="section"
									alignItems="center"
									justifyContent="center"
									className="p-8"
								>
									<p className="text-muted">운동 detail을 찾을 수 없습니다.</p>
									<Button variant="tertiary" onPress={onClickCancelButton}>
										목록으로
									</Button>
								</VStack>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack fullWidth>
				<Screen.Header
					title={resolvedTitle}
					description={resolvedDescription}
					actions={resolvedActions}
				/>
				<SectionSurface>
					<Section>
						<Section.Header title="기본 정보" />
						<Section.Body>
							<TaskExerciseForm
								state={state}
								contentLanguageCode={contentLanguageCode}
								selectedImageAsset={selectedImageAsset}
								selectedVideoAsset={selectedVideoAsset}
								readOnly={readOnly}
								onOpenImagePicker={onOpenImagePicker}
								onOpenVideoPicker={onOpenVideoPicker}
								onClickClearImageAssetButton={onClickClearImageAssetButton}
								onClickClearVideoAssetButton={onClickClearVideoAssetButton}
							/>
						</Section.Body>
					</Section>
					{metadata ? (
						<Section>
							<Section.Header title="태스크 정보" />
							<Section.Body>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="text-sm text-muted">Task ID</label>
										<p className="mt-1 font-mono text-sm">{metadata.taskId}</p>
									</div>
									<div>
										<label className="text-sm text-muted">Space ID</label>
										<p className="mt-1 font-mono text-sm">
											{metadata.spaceId ?? "-"}
										</p>
									</div>
									<div>
										<label className="text-sm text-muted">지속시간</label>
										<p className="mt-1">
											{formatDuration(state.durationMin, state.durationSec)}
										</p>
									</div>
									<div>
										<label className="text-sm text-muted">스케줄 가능</label>
										<div className="mt-1">
											<Chip
												color={
													state.videoFileId.trim().length > 0
														? "success"
														: "warning"
												}
												size="sm"
											>
												{state.videoFileId.trim().length > 0 ? "가능" : "불가"}
											</Chip>
										</div>
									</div>
									<div>
										<label className="text-sm text-muted">등록일</label>
										<div className="mt-1">
											<DateTimeCell value={metadata.createdAt ?? "-"} />
										</div>
									</div>
									<div>
										<label className="text-sm text-muted">수정일</label>
										<div className="mt-1">
											<DateTimeCell value={metadata.updatedAt} />
										</div>
									</div>
								</div>
							</Section.Body>
						</Section>
					) : null}
					{metadata?.routines?.length ? (
						<Section>
							<Section.Header title="연관 루틴" />
							<Section.Body>
								<VStack gap="block">
									{metadata.routines.map((routine, index) => (
										<div
											key={`${routine.id}:${index}`}
											className="flex items-center justify-between rounded-lg bg-surface-secondary p-3"
										>
											<div>
												<p className="font-medium">{routine.name}</p>
												<p className="text-sm text-muted">
													{routine.label || "-"}
												</p>
											</div>
											<div className="text-sm text-muted">
												<DateTimeCell value={routine.createdAt} />
											</div>
										</div>
									))}
								</VStack>
							</Section.Body>
						</Section>
					) : null}
				</SectionSurface>
				{assetBrowserProps ? (
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
				) : null}
			</VStack>
		);
	},
);
