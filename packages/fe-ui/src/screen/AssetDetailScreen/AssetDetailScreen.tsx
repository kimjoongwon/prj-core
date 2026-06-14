"use client";

import {
	AssetPreview,
	AssetPreviewDialog,
	DateTimeCell,
	SectionSurface,
	getAssetPreviewUrl,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, FolderInput, Maximize2, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button } from "../../action/Button/Button";
import { Chip } from "../../data-display/Chip/Chip";
import { Input } from "../../input/Input/Input";
import { Select } from "../../selection/Select/Select";
import { Spinner, ListBox } from "@heroui/react";
export interface AssetDetailScreenFolder {
	id: string;
	name: string;
}
export interface AssetDetailScreenAsset {
	id: string;
	originalName: string;
	kind: "IMAGE" | "VIDEO" | "DOCUMENT";
	status: "UPLOADING" | "READY" | "FAILED";
	mimeType: string;
	sizeBytes: number;
	folderId: string;
	publicUrl?: string | null;
	createdAt: string;
	storageKey: string;
	checksum?: string | null;
}
export interface AssetDetailScreenProps {
	asset?: AssetDetailScreenAsset;
	folders: AssetDetailScreenFolder[];
	targetFolderId: string;
	targetFolderError?: string;
	isLoading: boolean;
	isRemoving: boolean;
	isMoving: boolean;
	onClickBackButton: () => void;
	onClickDeleteAssetButton: () => Promise<void>;
	onChangeTargetFolderSelection: (targetFolderId: string) => void;
	onClickMoveAssetButton: () => Promise<void>;
}
const getKindLabel = (kind: AssetDetailScreenAsset["kind"]) => {
	switch (kind) {
		case "IMAGE":
			return "이미지";
		case "VIDEO":
			return "비디오";
		case "DOCUMENT":
			return "문서";
		default:
			return kind;
	}
};
const getStatusLabel = (status: AssetDetailScreenAsset["status"]) => {
	switch (status) {
		case "READY":
			return "완료";
		case "UPLOADING":
			return "업로드 중";
		case "FAILED":
			return "실패";
		default:
			return status;
	}
};
const getStatusColor = (
	status: AssetDetailScreenAsset["status"],
): "success" | "warning" | "danger" | "default" => {
	switch (status) {
		case "READY":
			return "success";
		case "UPLOADING":
			return "warning";
		case "FAILED":
			return "danger";
		default:
			return "default";
	}
};
const getKindColor = (
	kind: AssetDetailScreenAsset["kind"],
): "secondary" | "primary" | "default" => {
	switch (kind) {
		case "IMAGE":
			return "secondary";
		case "VIDEO":
			return "primary";
		case "DOCUMENT":
			return "default";
		default:
			return "default";
	}
};
const formatBytes = (bytes: number) => {
	if (bytes === 0) {
		return "0 B";
	}
	const units = ["B", "KB", "MB", "GB"];
	const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
	const value = bytes / 1024 ** exponent;
	return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};
export const AssetDetailScreen = observer(
	({
		asset,
		folders,
		targetFolderId,
		targetFolderError,
		isLoading,
		isRemoving,
		isMoving,
		onClickBackButton,
		onClickDeleteAssetButton,
		onChangeTargetFolderSelection,
		onClickMoveAssetButton,
	}: AssetDetailScreenProps) => {
		const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
		const folderIds = new Set(folders.map((folder) => folder.id));
		if (isLoading) {
			return (
				<VStack gap="section" fullWidth>
					<PageTitleBar title="에셋 상세" description="로딩 중..." />

					<SectionSurface>
						<div className="flex items-center justify-center p-10">
							<Spinner size="lg" />
						</div>
					</SectionSurface>
				</VStack>
			);
		}
		if (!asset) {
			return (
				<VStack gap="section" fullWidth>
					<PageTitleBar
						title="에셋 상세"
						description="에셋을 찾을 수 없습니다."
					/>

					<SectionSurface>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-muted">에셋을 찾을 수 없습니다.</p>
							<Button variant="flat" onPress={onClickBackButton}>
								목록으로
							</Button>
						</div>
					</SectionSurface>
				</VStack>
			);
		}
		const previewUrl = getAssetPreviewUrl(asset);
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title={asset.originalName ?? "에셋 상세"}
					description="에셋 상세 정보"
					actions={
						<div className="flex gap-2">
							<Button
								variant="light"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={onClickBackButton}
							>
								목록으로
							</Button>
							{previewUrl ? (
								<Button
									variant="flat"
									color="primary"
									onPress={() => {
										window.open(previewUrl, "_blank", "noopener,noreferrer");
									}}
								>
									원본 열기
								</Button>
							) : null}
							<Button
								variant="flat"
								color="danger"
								isLoading={isRemoving}
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={() => {
									void onClickDeleteAssetButton();
								}}
							>
								삭제
							</Button>
						</div>
					}
				/>

				<SectionSurface>
					<VStack gap={4}>
						<SectionSurface>
							<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_340px]">
								<div className="space-y-4">
									<PageTitleBar
										level={2}
										title="미리보기"
										description={
											previewUrl
												? "목록과 상세에서 바로 확인할 수 있는 뷰어입니다."
												: "업로드 상태나 파일 형식에 따라 인라인 미리보기가 제한될 수 있습니다."
										}
										actions={
											<Button
												variant="flat"
												startContent={<Maximize2 className="h-4 w-4" />}
												onPress={() => {
													setIsPreviewExpanded(true);
												}}
											>
												크게 보기
											</Button>
										}
									/>
									<AssetPreview
										asset={asset}
										showInfo={false}
										className="min-h-[420px]"
									/>
								</div>
								<div className="rounded-[1.5rem] border border-border/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(248,250,252,0.92))] p-5 shadow-sm">
									<div className="flex flex-wrap gap-2">
										<Chip
											size="sm"
											variant="flat"
											color={getKindColor(asset.kind)}
										>
											{getKindLabel(asset.kind)}
										</Chip>
										<Chip
											size="sm"
											variant="flat"
											color={getStatusColor(asset.status)}
										>
											{getStatusLabel(asset.status)}
										</Chip>
										<Chip
											size="sm"
											variant="bordered"
											color={previewUrl ? "success" : "warning"}
										>
											{previewUrl ? "즉시 보기 가능" : "프리뷰 제한"}
										</Chip>
									</div>
									<div className="mt-4 space-y-2">
										<p className="text-lg font-semibold text-foreground">
											{asset.originalName}
										</p>
										<p className="text-sm leading-6 text-muted">
											{previewUrl
												? "브라우저 안에서 바로 검토하고, 필요하면 원본 파일을 새 탭으로 열 수 있습니다."
												: "업로드가 완료되지 않았거나 브라우저가 인라인 렌더링을 지원하지 않는 형식이면 안내 카드로 폴백됩니다."}
										</p>
									</div>
									<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
										<div className="rounded-2xl bg-default/80 px-4 py-3">
											<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
												MIME Type
											</p>
											<p className="mt-2 break-all font-mono text-sm text-foreground">
												{asset.mimeType}
											</p>
										</div>
										<div className="rounded-2xl bg-default/80 px-4 py-3">
											<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
												파일 크기
											</p>
											<p className="mt-2 text-sm font-semibold text-foreground">
												{formatBytes(asset.sizeBytes)}
											</p>
										</div>
										<div className="rounded-2xl bg-default/80 px-4 py-3">
											<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
												현재 폴더
											</p>
											<p className="mt-2 break-all font-mono text-sm text-foreground">
												{asset.folderId}
											</p>
										</div>
										<div className="rounded-2xl bg-default/80 px-4 py-3">
											<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
												등록일
											</p>
											<div className="mt-2 text-sm">
												<DateTimeCell value={asset.createdAt} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</SectionSurface>
						<SectionSurface top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<p className="text-sm text-muted">파일명</p>
									<p className="mt-1 font-medium">{asset.originalName}</p>
								</div>
								<div>
									<p className="text-sm text-muted">에셋 ID</p>
									<p className="mt-1 font-mono text-sm">{asset.id}</p>
								</div>
								<div>
									<p className="text-sm text-muted">타입</p>
									<p className="mt-1">{getKindLabel(asset.kind)}</p>
								</div>
								<div>
									<p className="text-sm text-muted">상태</p>
									<p className="mt-1">{getStatusLabel(asset.status)}</p>
								</div>
								<div>
									<p className="text-sm text-muted">MIME 타입</p>
									<p className="mt-1 font-mono text-sm">{asset.mimeType}</p>
								</div>
								<div>
									<p className="text-sm text-muted">크기</p>
									<p className="mt-1">{formatBytes(asset.sizeBytes)}</p>
								</div>
								<div>
									<p className="text-sm text-muted">현재 폴더 ID</p>
									<p className="mt-1 font-mono text-sm">{asset.folderId}</p>
								</div>
								<div>
									<p className="text-sm text-muted">등록일</p>
									<div className="mt-1">
										<DateTimeCell value={asset.createdAt} />
									</div>
								</div>
							</div>
						</SectionSurface>
						<SectionSurface top={<PageTitleBar level={2} title="폴더 이동" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
								<Select
									label="이동 대상 폴더"
									placeholder="폴더를 선택하세요"
									value={
										targetFolderId && folderIds.has(targetFolderId)
											? targetFolderId
											: null
									}
									isInvalid={Boolean(targetFolderError)}
									errorMessage={targetFolderError}
									onChange={(value) => {
										onChangeTargetFolderSelection(String(value ?? ""));
									}}
								>
									{folders.map((folder) => (
										<ListBox.Item
											key={folder.id}
											id={folder.id}
											textValue={folder.name}
										>
											{folder.name}
										</ListBox.Item>
									))}
								</Select>
								<div className="flex items-end">
									<Button
										color="primary"
										variant="flat"
										isLoading={isMoving}
										startContent={<FolderInput className="h-4 w-4" />}
										onPress={() => {
											void onClickMoveAssetButton();
										}}
									>
										이동
									</Button>
								</div>
							</div>
						</SectionSurface>
						<SectionSurface
							top={<PageTitleBar level={2} title="스토리지 정보" />}
						>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<Input
									label="Storage Key"
									value={asset.storageKey}
									isReadOnly
								/>
								<Input
									label="Checksum"
									value={asset.checksum ?? "-"}
									isReadOnly
								/>
							</div>
						</SectionSurface>
					</VStack>
				</SectionSurface>
				<AssetPreviewDialog
					asset={asset}
					isOpen={isPreviewExpanded}
					onClose={() => {
						setIsPreviewExpanded(false);
					}}
				/>
			</VStack>
		);
	},
);
