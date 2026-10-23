"use client";

import { Canvas, type RootState } from "@react-three/fiber";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { Suspense, useEffect } from "react";
import { MomoAvatarModel } from "./MomoAvatarModel";
import { MomoAvatarPoster } from "./MomoAvatarPoster";
import type { MomoAvatarPlaybackProps } from "./momoAvatar";

export function createMomoAvatarCanvasState(onUnavailable: () => void) {
	let canvasElement: HTMLCanvasElement | undefined;
	const onContextLost = (event: Event) => {
		event.preventDefault();
		onUnavailable();
	};
	return makeAutoObservable(
		{
			activate() {
				canvasElement?.addEventListener("webglcontextlost", onContextLost);
			},
			configureCanvas({ gl }: Pick<RootState, "gl">) {
				this.dispose();
				canvasElement = gl.domElement;
				canvasElement.addEventListener("webglcontextlost", onContextLost);
			},
			dispose() {
				canvasElement?.removeEventListener("webglcontextlost", onContextLost);
			},
		},
		{},
		{ autoBind: true, name: "MomoAvatarCanvasState" },
	);
}

export type MomoAvatarCanvasState = ReturnType<
	typeof createMomoAvatarCanvasState
>;

export function MomoAvatarCanvas(props: MomoAvatarPlaybackProps) {
	const { isPlaying, onUnavailable } = props;
	const momoAvatarCanvasState = useLocalObservable(() =>
		createMomoAvatarCanvasState(onUnavailable),
	);
	useEffect(() => {
		momoAvatarCanvasState.activate();
		return momoAvatarCanvasState.dispose;
	}, [momoAvatarCanvasState]);

	return (
		<Canvas
			camera={{ position: [0, 0, 3.9], fov: 36, near: 0.1, far: 30 }}
			dpr={[1, 1.5]}
			frameloop={isPlaying ? "always" : "demand"}
			gl={{ antialias: true, alpha: true }}
			fallback={<MomoAvatarPoster />}
			onCreated={momoAvatarCanvasState.configureCanvas}
		>
			<ambientLight intensity={1.1} />
			<directionalLight position={[-3, 5, 5]} intensity={2.5} />
			<Suspense fallback={null}>
				<MomoAvatarModel {...props} />
			</Suspense>
		</Canvas>
	);
}

MomoAvatarCanvas.displayName = "MomoAvatarCanvas";
