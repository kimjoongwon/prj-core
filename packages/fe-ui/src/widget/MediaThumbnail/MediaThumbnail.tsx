"use client";

import { cn } from "@heroui/react";
import { ImageIcon, PlayCircle } from "lucide-react";

export interface MediaThumbnailProps {
	imageUrl?: string | null;
	videoUrl?: string | null;
	title: string;
	className?: string;
}

export function MediaThumbnail({
	imageUrl,
	videoUrl,
	title,
	className,
}: MediaThumbnailProps) {
	if (imageUrl) {
		return (
			<div
				className={cn(
					"relative overflow-hidden rounded-xl bg-content2",
					className,
				)}
			>
				<img
					src={imageUrl}
					alt={title}
					className="h-full w-full object-cover"
					loading="lazy"
				/>
			</div>
		);
	}

	if (videoUrl) {
		return (
			<div
				className={cn(
					"relative overflow-hidden rounded-xl bg-content2",
					className,
				)}
			>
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
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-xl border border-dashed border-default-300 bg-content2 text-default-400",
				className,
			)}
		>
			<div className="flex flex-col items-center gap-2">
				<ImageIcon className="h-7 w-7" />
				<span className="text-xs">미리보기 없음</span>
			</div>
		</div>
	);
}
