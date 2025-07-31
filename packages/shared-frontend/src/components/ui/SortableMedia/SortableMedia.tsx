import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Play, X } from "lucide-react";
import { useState } from "react";
import { VideoPlayer } from "../VideoPlayer/VideoPlayer";

export interface SortableMediaProps {
	media: Partial<any>; // TODO: Replace with proper FileDto type when available
	onRemove: (id: string) => void;
}

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
						className="w-full h-full object-cover rounded-lg"
					/>
				) : (
					<div className="relative w-full h-full cursor-pointer">
						<video src={url} className="w-full h-full object-cover rounded-lg">
							<track kind="captions" />
						</video>
						<button
							type="button"
							className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
							onClick={handleVideoClick}
						>
							<Play className="h-12 w-12 text-white" />
						</button>
					</div>
				)}
				<button
					type="button"
					onClick={handleRemoveClick}
					className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1"
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
