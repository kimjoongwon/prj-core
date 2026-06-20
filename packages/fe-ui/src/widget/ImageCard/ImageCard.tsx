"use client";

import { Copy, Download, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";

export interface ImageCardProps {
	/** 이미지 소스 URL */
	src: string;
	/** 파일명 (alt 텍스트용) */
	filename: string;
	/** 다운로드 핸들러 */
	onDownload?: () => void;
	/** 클립보드 복사 핸들러 */
	onCopy?: () => void;
	/** 삭제 핸들러 */
	onDelete?: () => void;
	/** 액션 버튼 표시 여부 */
	showActions?: boolean;
	/** 가로세로 비율 (기본: square) */
	aspectRatio?: "square" | "video" | "auto";
	/** 추가 클래스명 */
	className?: string;
}

const aspectRatioClasses = {
	square: "aspect-square",
	video: "aspect-video",
	auto: "",
};

/**
 * ImageCard 컴포넌트
 * 이미지를 카드 형태로 표시하며, 호버 시 다운로드/복사/삭제 액션을 제공합니다.
 *
 * @example
 * ```tsx
 * <ImageCard
 *   src="/images/photo.jpg"
 *   filename="photo.jpg"
 *   aspectRatio="square"
 *   onDownload={handleDownload}
 *   onCopy={handleCopy}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const ImageCard = observer(
	({
		src,
		filename,
		onDownload,
		onCopy,
		onDelete,
		showActions = true,
		aspectRatio = "square",
		className,
	}: ImageCardProps) => {
		const hasActions = showActions && (onDownload || onCopy || onDelete);

		return (
			<div
				className={`group relative rounded-xl overflow-hidden bg-surface-secondary border border-border ${className ?? ""}`}
			>
				<div className={aspectRatioClasses[aspectRatio]}>
					<img
						src={src}
						alt={filename}
						className="w-full h-full object-cover"
					/>
				</div>

				{hasActions && (
					<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
						{onDownload && (
							<Button
								isIconOnly
								size="sm"
								variant="flat"
								onPress={onDownload}
								aria-label="다운로드"
							>
								<Download className="w-4 h-4" />
							</Button>
						)}
						{onCopy && (
							<Button
								isIconOnly
								size="sm"
								variant="flat"
								onPress={onCopy}
								aria-label="클립보드에 복사"
							>
								<Copy className="w-4 h-4" />
							</Button>
						)}
						{onDelete && (
							<Button
								isIconOnly
								size="sm"
								variant="flat"
								color="danger"
								onPress={onDelete}
								aria-label="삭제"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						)}
					</div>
				)}
			</div>
		);
	},
);
