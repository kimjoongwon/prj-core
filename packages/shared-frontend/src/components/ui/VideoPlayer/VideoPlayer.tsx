import { Modal, ModalContent } from "@heroui/react";
import { Maximize, Minimize, Pause, Play } from "lucide-react";

import { useEffect, useRef, useState } from "react";

export interface VideoPlayerProps {
	src: string;
	isOpen: boolean;
	onClose: () => void;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
	const { src, isOpen, onClose } = props;
	const [isPlaying, setIsPlaying] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			videoRef.current?.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	};

	const handleClose = () => {
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0; // Reset video to start
		}
		setIsPlaying(false);
		setIsFullscreen(false);
		onClose();
	};

	useEffect(() => {
		if (!isOpen) {
			handleClose();
		}
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<ModalContent>
				<div className="relative h-full w-full overflow-hidden rounded-lg bg-black bg-opacity-10">
					<video
						ref={videoRef}
						src={src}
						className="h-full w-full object-contain"
						onClick={togglePlay}
					>
						<track kind="captions" />
					</video>
					<div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-black bg-opacity-10 p-4 transition-all duration-300 hover:bg-opacity-30">
						<button
							type="button"
							onClick={togglePlay}
							className="text-white shadow-md transition-colors hover:text-gray-300"
						>
							{isPlaying ? (
								<Pause className="h-6 w-6" />
							) : (
								<Play className="h-6 w-6" />
							)}
						</button>
						<button
							type="button"
							onClick={toggleFullscreen}
							className="text-white shadow-md transition-colors hover:text-gray-300"
						>
							{isFullscreen ? (
								<Minimize className="h-6 w-6" />
							) : (
								<Maximize className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</ModalContent>
		</Modal>
	);
};
