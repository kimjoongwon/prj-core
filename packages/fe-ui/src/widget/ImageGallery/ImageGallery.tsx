"use client";

import { Download, RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";
import { ImageCard } from "../ImageCard";

export interface GalleryImage {
	/** 고유 식별자 */
	id: string;
	/** 이미지 URL */
	src: string;
	/** 파일명 */
	filename: string;
}

export interface ImageGalleryProps<T extends GalleryImage = GalleryImage> {
	/** 이미지 목록 */
	images: T[];
	/** 제목 (옵션) */
	title?: string;
	/** 부제목/설명 (옵션) */
	subtitle?: string;
	/** 재생성 핸들러 */
	onRegenerate?: () => void;
	/** 전체 다운로드 핸들러 */
	onDownloadAll?: () => void;
	/** 개별 이미지 다운로드 핸들러 */
	onDownload?: (image: T) => void;
	/** 개별 이미지 복사 핸들러 */
	onCopy?: (image: T) => void;
	/** 개별 이미지 삭제 핸들러 */
	onDelete?: (image: T) => void;
	/** 그리드 컬럼 수 (기본: 2~4 반응형) */
	columns?: 2 | 3 | 4;
	/** 추가 클래스명 */
	className?: string;
}

const columnClasses = {
	2: "grid-cols-2",
	3: "grid-cols-2 md:grid-cols-3",
	4: "grid-cols-2 md:grid-cols-4",
};

/**
 * ImageGallery 컴포넌트
 * 이미지 목록을 그리드 형태로 표시하고 재생성/다운로드/삭제 등의 액션을 제공합니다.
 *
 * @example
 * ```tsx
 * <ImageGallery
 *   images={[
 *     { id: "1", src: "/img1.jpg", filename: "이미지1.jpg" },
 *     { id: "2", src: "/img2.jpg", filename: "이미지2.jpg" },
 *   ]}
 *   title="생성 결과"
 *   columns={4}
 *   onRegenerate={handleRegenerate}
 *   onDownload={handleDownload}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export const ImageGallery = observer(
	<T extends GalleryImage>({
		images,
		title = "생성 결과",
		subtitle,
		onRegenerate,
		onDownloadAll,
		onDownload,
		onCopy,
		onDelete,
		columns = 4,
		className,
	}: ImageGalleryProps<T>) => {
		if (images.length === 0) {
			return null;
		}

		return (
			<div className={`space-y-4 ${className ?? ""}`}>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">{title}</h3>
						{subtitle && (
							<p className="text-sm text-muted truncate max-w-md">
								{subtitle}
							</p>
						)}
					</div>
					<div className="flex gap-2">
						{onRegenerate && (
							<Button
								size="sm"
								variant="flat"
								startContent={<RefreshCw className="w-4 h-4" />}
								onPress={onRegenerate}
							>
								재생성
							</Button>
						)}
						{onDownloadAll && images.length > 1 && (
							<Button
								size="sm"
								variant="flat"
								startContent={<Download className="w-4 h-4" />}
								onPress={onDownloadAll}
							>
								전체 다운로드
							</Button>
						)}
					</div>
				</div>

				<div className={`grid ${columnClasses[columns]} gap-4`}>
					{images.map((image) => (
						<ImageCard
							key={image.id}
							src={image.src}
							filename={image.filename}
							onDownload={onDownload ? () => onDownload(image) : undefined}
							onCopy={onCopy ? () => onCopy(image) : undefined}
							onDelete={onDelete ? () => onDelete(image) : undefined}
						/>
					))}
				</div>
			</div>
		);
	},
);
