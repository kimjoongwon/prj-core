import { Modal, ModalContent } from "@heroui/react";
export interface VideoPlayerProps {
	src: string;
}

import { Maximize, Minimize, Pause, Play } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { state } from "../SortableMedia/SortableMedia";

export const VideoPlayer = observer(({ src }: VideoPlayerProps) => {
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

	const close = () => {
		state.open = false;
		if (videoRef.current) {
			videoRef.current.pause();
			videoRef.current.currentTime = 0; // Reset video to start
		}
		setIsPlaying(false);
		setIsFullscreen(false);
	};

	return (
		<Modal isOpen={state.open} onClose={close}>
			<ModalContent>
				<div className="relative w-full h-full bg-black bg-opacity-10 rounded-lg overflow-hidden">
					<video
						ref={videoRef}
						src={src}
						className="w-full h-full object-contain"
						onClick={togglePlay}
					>
						<track kind="captions" />
					</video>
					<div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 bg-black bg-opacity-10 hover:bg-opacity-30 transition-all duration-300">
						<button
							type="button"
							onClick={togglePlay}
							className="text-white hover:text-gray-300 transition-colors shadow-md"
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
							className="text-white hover:text-gray-300 transition-colors shadow-md"
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
});
