"use client";

import { Button } from "@heroui/react";
import { Download, FileText, Image, Video, ZoomIn, ZoomOut } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { AssetKind } from "@cocrepo/prisma";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { AssetPreview } from "../../widget/AssetPreview/AssetPreview";

/** 에셋 기본 정보 (뷰어용) */
export interface AssetViewerAsset {
	/** 에셋 ID */
	id: string;
	/** 원본 파일명 */
	originalName: string;
	/** 에셋 종류 */
	kind: AssetKind;
	/** MIME 타입 */
	mimeType: string;
	/** 파일 크기 (바이트) */
	sizeBytes: bigint | number;
	/** 이미지 메타데이터 */
	image?: {
		width: number;
		height: number;
	};
	/** 비디오 메타데이터 */
	video?: {
		width: number;
		height: number;
		durationMs: number;
		codec?: string;
	};
}

export interface AssetViewerProps {
	/** 에셋 정보 */
	asset: AssetViewerAsset;
	/** 미리보기 URL */
	previewUrl?: string;
	/** 다운로드 URL */
	downloadUrl?: string;
	/** 다운로드 핸들러 */
	onDownload?: () => void;
}

/**
 * 파일 크기를 읽기 쉬운 형태로 포맷팅
 */
const formatFileSize = (bytes: bigint | number): string => {
	const size = typeof bytes === "bigint" ? Number(bytes) : bytes;
	const units = ["B", "KB", "MB", "GB", "TB"];
	let unitIndex = 0;
	let sizeValue = size;

	while (sizeValue >= 1024 && unitIndex < units.length - 1) {
		sizeValue /= 1024;
		unitIndex++;
	}

	return `${sizeValue.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * AssetViewer 컴포넌트
 * 에셋 타입별 미리보기와 다운로드 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <AssetViewer
 *   asset={asset}
 *   previewUrl="/api/assets/xxx/preview"
 *   downloadUrl="/api/assets/xxx/download"
 *   onDownload={() => handleDownload()}
 * />
 * ```
 */
export const AssetViewer = observer(
	({ asset, previewUrl, downloadUrl, onDownload }: AssetViewerProps) => {
		const state = useLocalObservable(() => ({
			zoom: 1,
			zoomIn() {
				this.zoom = Math.min(this.zoom + 0.25, 3);
			},
			zoomOut() {
				this.zoom = Math.max(this.zoom - 0.25, 0.25);
			},
			resetZoom() {
				this.zoom = 1;
			},
		}));

		const handleDownload = () => {
			if (downloadUrl) {
				window.open(downloadUrl, "_blank");
			}
			onDownload?.();
		};

		// 해상도 정보 표시
		const getResolutionInfo = () => {
			if (asset.kind === "IMAGE" && asset.image) {
				return `${asset.image.width} x ${asset.image.height}`;
			}
			if (asset.kind === "VIDEO" && asset.video) {
				return `${asset.video.width} x ${asset.video.height}`;
			}
			return null;
		};

		const resolutionInfo = getResolutionInfo();

		return (
			<VStack gap={4} className="w-full">
				{/* 미리보기 영역 */}
				<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-content2">
					<div
						className="flex h-full w-full items-center justify-center"
						style={{ transform: `scale(${state.zoom})` }}
					>
						{previewUrl ? (
							<AssetPreview
								kind={asset.kind}
								previewUrl={previewUrl}
								mimeType={asset.mimeType}
								originalName={asset.originalName}
							/>
						) : (
							<VStack alignItems="center" gap={2} className="text-default-400">
								{asset.kind === "IMAGE" && <Image className="size-12" />}
								{asset.kind === "VIDEO" && <Video className="size-12" />}
								{asset.kind === "DOCUMENT" && <FileText className="size-12" />}
								<span>미리보기를 불러올 수 없습니다.</span>
							</VStack>
						)}
					</div>
				</div>

				{/* 컨트롤 바 */}
				<HStack justifyContent="between" alignItems="center" className="w-full">
					<HStack gap={2}>
						{/* 해상도/크기 정보 */}
						{resolutionInfo && (
							<span className="text-sm text-default-500">{resolutionInfo}</span>
						)}
						<span className="text-sm text-default-500">
							{formatFileSize(asset.sizeBytes)}
						</span>
					</HStack>

					<HStack gap={2}>
						{/* 줌 컨트롤 (이미지/문서만) */}
						{(asset.kind === "IMAGE" || asset.kind === "DOCUMENT") && (
							<>
								<Button
									isIconOnly
									size="sm"
									variant="flat"
									onPress={state.zoomOut}
									isDisabled={state.zoom <= 0.25}
								>
									<ZoomOut className="size-4" />
								</Button>
								<span className="min-w-[3rem] text-center text-sm">
									{Math.round(state.zoom * 100)}%
								</span>
								<Button
									isIconOnly
									size="sm"
									variant="flat"
									onPress={state.zoomIn}
									isDisabled={state.zoom >= 3}
								>
									<ZoomIn className="size-4" />
								</Button>
							</>
						)}

						{/* 다운로드 버튼 */}
						<Button
							variant="flat"
							color="primary"
							startContent={<Download className="size-4" />}
							onPress={handleDownload}
						>
							원본 다운로드
						</Button>
					</HStack>
				</HStack>
			</VStack>
		);
	},
);

AssetViewer.displayName = "AssetViewer";
