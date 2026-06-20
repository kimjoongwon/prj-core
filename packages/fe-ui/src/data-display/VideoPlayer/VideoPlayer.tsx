import { Modal, useOverlayState } from "@heroui/react";
import { Maximize, Minimize, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface VideoPlayerProps {
	/** 비디오 소스 URL */
	src: string;
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
}

/**
 * VideoPlayer 컴포넌트
 * 모달에서 비디오를 재생합니다. 재생/일시정지, 전체화면 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Button onPress={() => setIsOpen(true)}>비디오 보기</Button>
 * <VideoPlayer
 *   src="/videos/intro.mp4"
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 * ```
 */
export const VideoPlayer = (props: VideoPlayerProps) => {
	const { src, isOpen, onClose } = props;
	const [isPlaying, setIsPlaying] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const modalState = useOverlayState({
		isOpen,
		onOpenChange: (open) => {
			if (!open) {
				handleClose();
			}
		},
	});

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
		<Modal state={modalState}>
			<Modal.Backdrop>
				<Modal.Container>
					<Modal.Dialog>
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
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
};
