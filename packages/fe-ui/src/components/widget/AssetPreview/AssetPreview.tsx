"use client";

import { Button } from "@heroui/react";
import { Download, FileText, Image, Video } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { AssetKind } from "@cocrepo/prisma";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

export interface AssetPreviewProps {
	/** 에셋 종류 */
	kind: AssetKind;
	/** 미리보기 URL */
	previewUrl?: string;
	/** MIME 타입 */
	mimeType?: string;
	/** 원본 파일명 */
	originalName?: string;
	/** 너비 */
	width?: number | string;
	/** 높이 */
	height?: number | string;
	/** 자동 재생 (비디오) */
	autoPlay?: boolean;
	/** 컨트롤 표시 (비디오) */
	controls?: boolean;
	/** 다운로드 핸들러 */
	onDownload?: () => void;
	/** 추가 클래스 */
	className?: string;
}

/**
 * MIME 타입이 PDF인지 확인
 */
const isPdf = (mimeType?: string): boolean => {
	return mimeType === "application/pdf";
};

/**
 * 이미지 MIME 타입인지 확인
 */
const isImage = (mimeType?: string): boolean => {
	if (!mimeType) return false;
	return mimeType.startsWith("image/");
};

/**
 * 비디오 MIME 타입인지 확인
 */
const isVideo = (mimeType?: string): boolean => {
	if (!mimeType) return false;
	return mimeType.startsWith("video/");
};

/**
 * AssetPreview 컴포넌트
 * 에셋의 미리보기를 표시합니다. 이미지, 비디오, 문서 타입에 따라 적절한 뷰어를 렌더링합니다.
 *
 * @example
 * ```tsx
 * <AssetPreview
 *   kind="IMAGE"
 *   previewUrl="/api/assets/xxx/preview"
 *   mimeType="image/png"
 *   originalName="hero-image.png"
 * />
 * ```
 */
export const AssetPreview = observer(
	({
		kind,
		previewUrl,
		mimeType,
		originalName,
		width,
		height,
		autoPlay = false,
		controls = true,
		onDownload,
		className = "",
	}: AssetPreviewProps) => {
		// 이미지 렌더링
		if (kind === "IMAGE" && previewUrl) {
			return (
				<img
					src={previewUrl}
					alt={originalName || "Preview"}
					className={`max-h-full max-w-full object-contain ${className}`}
					style={{ width, height }}
				/>
			);
		}

		// 비디오 렌더링
		if (kind === "VIDEO" && previewUrl) {
			return (
				<video
					src={previewUrl}
					className={`max-h-full max-w-full ${className}`}
					style={{ width, height }}
					controls={controls}
					autoPlay={autoPlay}
					playsInline
				>
					<track kind="captions" />
					비디오를 재생할 수 없습니다.
				</video>
			);
		}

		// PDF 렌더링
		if (kind === "DOCUMENT" && isPdf(mimeType) && previewUrl) {
			return (
				<iframe
					src={previewUrl}
					className={`h-full w-full ${className}`}
					style={{ width, height, minHeight: "400px" }}
					title={originalName || "PDF Preview"}
				/>
			);
		}

		// 미지원 타입 또는 URL 없음
		return (
			<VStack
				alignItems="center"
				justifyContent="center"
				gap={4}
				className={`h-full min-h-[200px] rounded-lg bg-content2 p-8 ${className}`}
			>
				{kind === "IMAGE" && <Image className="size-16 text-default-300" />}
				{kind === "VIDEO" && <Video className="size-16 text-default-300" />}
				{kind === "DOCUMENT" && <FileText className="size-16 text-default-300" />}

				<VStack alignItems="center" gap={2}>
					<span className="text-lg font-medium text-default-600">
						{originalName || "파일"}
					</span>
					<span className="text-sm text-default-400">
						{isPdf(mimeType)
							? "PDF를 불러올 수 없습니다."
							: "이 파일 형식은 미리보기를 지원하지 않습니다."}
					</span>
				</VStack>

				{onDownload && (
					<Button
						variant="flat"
						color="primary"
						startContent={<Download className="size-4" />}
						onPress={onDownload}
					>
						원본 다운로드
					</Button>
				)}
			</VStack>
		);
	},
);

AssetPreview.displayName = "AssetPreview";
