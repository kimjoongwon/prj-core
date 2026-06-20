"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer";

export interface SortableMediaProps {
	/** 미디어 객체 (id, url, mimeType 포함) */
	media: Partial<any>; // TODO: Replace with proper FileDto type when available
	/** 삭제 핸들러 */
	onRemove: (id: string) => void;
}

/**
 * SortableMedia 컴포넌트
 * 드래그로 정렬 가능한 미디어(이미지/비디오) 아이템입니다.
 *
 * @example
 * ```tsx
 * <SortableMedia
 *   media={{ id: "1", url: "/image.jpg", mimeType: "image/jpeg" }}
 *   onRemove={(id) => handleRemove(id)}
 * />
 * ```
 *
 * @see DraggableSortableList 여러 미디어를 정렬하려면 DraggableSortableList와 함께 사용하세요.
 */
export function SortableMedia({ media, onRemove }: SortableMediaProps) {
	const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: media.id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 1 : 0,
		opacity: isDragging ? 0.5 : 1,
	};

	const handleRemoveClick = () => {
		onRemove(media.id);
	};

	const handleVideoClick = () => {
		setIsVideoPlayerOpen(true);
	};

	const url = media.url;

	return (
		<>
			<div
				ref={setNodeRef}
				style={style}
				className="relative aspect-square touch-none"
				{...attributes}
				{...listeners}
			>
				{media.mimeType?.includes("image") ? (
					<img
						src={url || "/placeholder.svg"}
						alt="Uploaded content"
						className="h-full w-full rounded-lg object-cover"
					/>
				) : (
					<div className="relative h-full w-full cursor-pointer">
						<video src={url} className="h-full w-full rounded-lg object-cover">
							<track kind="captions" />
						</video>
						<button
							type="button"
							className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50"
							onClick={handleVideoClick}
						>
							<Play className="h-12 w-12 text-white" />
						</button>
					</div>
				)}
				<button
					type="button"
					onClick={handleRemoveClick}
					className="-top-2 -right-2 absolute rounded-full bg-gray-800 p-1"
				>
					<X className="h-4 w-4 text-white" />
				</button>
			</div>
			{url && (
				<VideoPlayer
					src={url}
					isOpen={isVideoPlayerOpen}
					onClose={() => setIsVideoPlayerOpen(false)}
				/>
			)}
		</>
	);
}
