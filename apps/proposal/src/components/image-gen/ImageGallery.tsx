"use client";

import { Button } from "@heroui/react";
import { Download, RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ImageHistoryImage } from "@/lib/image-history";
import { getProxyImageUrl } from "@/lib/image-history";
import { ImageCard } from "./ImageCard";

interface ImageGalleryProps {
	images: ImageHistoryImage[];
	prompt?: string;
	onRegenerate?: () => void;
	onDownloadAll?: () => void;
}

export const ImageGallery = observer(
	({ images, prompt, onRegenerate, onDownloadAll }: ImageGalleryProps) => {
		const handleDownload = async (image: ImageHistoryImage) => {
			const url = getProxyImageUrl(image);
			const response = await fetch(url);
			const blob = await response.blob();

			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = image.filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		};

		const handleCopy = async (image: ImageHistoryImage) => {
			try {
				const url = getProxyImageUrl(image);
				const response = await fetch(url);
				const blob = await response.blob();

				await navigator.clipboard.write([
					new ClipboardItem({
						[blob.type]: blob,
					}),
				]);
			} catch (error) {
				console.error("Failed to copy image:", error);
			}
		};

		if (images.length === 0) {
			return null;
		}

		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">생성 결과</h3>
						{prompt && (
							<p className="text-sm text-default-500 truncate max-w-md">
								{prompt}
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

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{images.map((image, index) => (
						<ImageCard
							key={`${image.filename}-${index}`}
							src={getProxyImageUrl(image)}
							filename={image.filename}
							onDownload={() => handleDownload(image)}
							onCopy={() => handleCopy(image)}
						/>
					))}
				</div>
			</div>
		);
	},
);
