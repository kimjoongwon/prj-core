export type MomoMotion =
	| "idle"
	| "hello"
	| "listen"
	| "think"
	| "happy"
	| "speak";

export const MOMO_MODEL_URL = "/dolmen/momo/momo.glb";
export const MOMO_POSTER_URL = "/dolmen/momo/poster.webp";
export const MOMO_ONE_SHOT_TIMEOUT_MS = 4_500;
// 웹 자산의 여섯 모션 전체에서 측정한 범위. 자산 재생성 시 함께 갱신한다.
export const MOMO_ANIMATION_BOUNDS = {
	min: [-1.2144, -0.0028, -0.9006] as const,
	max: [1.2256, 2.9183, 0.9511] as const,
};

export const MOMO_MOTION_LABELS: Record<MomoMotion, string> = {
	idle: "질문을 기다리고 있어요",
	hello: "반가워요! 위키에 대해 물어보세요",
	listen: "질문을 입력해 주세요",
	think: "근거를 살펴보고 있어요",
	happy: "답변을 마쳤어요",
	speak: "답변을 전하고 있어요",
};

export interface MomoAvatarPlaybackProps {
	motion: MomoMotion;
	playbackId: number;
	isPlaying: boolean;
	onReady: () => void;
	onUnavailable: () => void;
	onOneShotFinished: (playbackId: number) => void;
}
