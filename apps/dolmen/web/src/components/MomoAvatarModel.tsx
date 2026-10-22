"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import {
	type AnimationMixerEventMap,
	Box3,
	LoopOnce,
	LoopRepeat,
	type Object3D,
	Vector3,
} from "three";
import {
	MOMO_ANIMATION_BOUNDS,
	MOMO_MODEL_URL,
	type MomoAvatarPlaybackProps,
} from "./momoAvatar";

function createMomoAvatarModelState(sourceScene: Object3D) {
	// 캐시된 scene을 복제하고 geometry와 material은 공유한다.
	const modelScene = sourceScene.clone(true);
	const modelBounds = new Box3().set(
		new Vector3(...MOMO_ANIMATION_BOUNDS.min),
		new Vector3(...MOMO_ANIMATION_BOUNDS.max),
	);
	const modelHeight = modelBounds.getSize(new Vector3()).y;
	const modelScale = modelHeight > 0 ? 2 / modelHeight : 1;
	return makeAutoObservable(
		{
			modelScene,
			modelScale,
			modelPosition: modelBounds
				.getCenter(new Vector3())
				.multiplyScalar(-modelScale)
				.toArray(),
		},
		{ modelScene: false },
		{ autoBind: true, name: "MomoAvatarModelState" },
	);
}

export type MomoAvatarModelState = ReturnType<
	typeof createMomoAvatarModelState
>;

export const MomoAvatarModel = observer(function MomoAvatarModel({
	motion,
	playbackId,
	isPlaying,
	onReady,
	onUnavailable,
	onOneShotFinished,
}: MomoAvatarPlaybackProps) {
	// 초기 자산은 비Draco 표준 GLB이므로 CDN decoder에 의존하지 않는다.
	const gltf = useGLTF(MOMO_MODEL_URL, false);
	const momoAvatarModelState = useLocalObservable(() =>
		createMomoAvatarModelState(gltf.scene),
	);
	const { actions, mixer } = useAnimations(
		gltf.animations,
		momoAvatarModelState.modelScene,
	);
	const invalidate = useThree((state) => state.invalidate);

	useEffect(() => {
		const hasEveryClip = [
			"idle",
			"hello",
			"listen",
			"think",
			"happy",
			"speak",
		].every((clipName) =>
			gltf.animations.some((clip) => clip.name === clipName),
		);
		if (!hasEveryClip) {
			onUnavailable();
			return;
		}
		onReady();
	}, [gltf.animations, onReady, onUnavailable]);

	useEffect(() => {
		const motionAction = actions[motion];
		if (!motionAction) {
			return;
		}
		const isOneShot = motion === "hello" || motion === "happy";
		motionAction.reset();
		motionAction.clampWhenFinished = isOneShot;
		motionAction.setLoop(
			isOneShot ? LoopOnce : LoopRepeat,
			isOneShot ? 1 : Infinity,
		);
		motionAction.fadeIn(0.2).play();
		const onAnimationFinished = (event: AnimationMixerEventMap["finished"]) => {
			if (isOneShot && event.action === motionAction) {
				onOneShotFinished(playbackId);
			}
		};
		mixer.addEventListener("finished", onAnimationFinished);
		invalidate();
		return () => {
			mixer.removeEventListener("finished", onAnimationFinished);
			motionAction.fadeOut(0.2);
		};
	}, [actions, mixer, motion, playbackId, onOneShotFinished, invalidate]);

	useEffect(() => {
		mixer.timeScale = isPlaying ? 1 : 0;
		if (isPlaying) {
			invalidate();
		}
		return () => {
			mixer.timeScale = 0;
		};
	}, [mixer, isPlaying, invalidate]);

	// mixer/action의 해제는 useAnimations가 소유한다. 여기서 uncacheRoot를 호출하면
	// StrictMode의 effect 재실행이 캐시된 action을 재생할 때 binding이 사라진다.

	return (
		<group
			position={momoAvatarModelState.modelPosition}
			scale={momoAvatarModelState.modelScale}
			dispose={null}
		>
			<primitive object={momoAvatarModelState.modelScene} dispose={null} />
		</group>
	);
});

MomoAvatarModel.displayName = "MomoAvatarModel";
