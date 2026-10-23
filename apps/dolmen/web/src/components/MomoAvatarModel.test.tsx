import { context } from "@react-three/fiber";
import { act, cleanup, render } from "@testing-library/react";
import { type ContextType, StrictMode } from "react";
import { AnimationClip, Group, NumberKeyframeTrack, Object3D } from "three";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MomoAvatarModel } from "./MomoAvatarModel";

const fixture = vi.hoisted(() => ({
	frameCallbacks: [] as ((state: unknown, delta: number) => void)[],
	gltf: undefined as unknown,
	invalidate: vi.fn(),
}));

vi.mock("@react-three/drei", async (importOriginal) => ({
	...(await importOriginal<typeof import("@react-three/drei")>()),
	useGLTF: () => fixture.gltf,
}));

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	fixture.frameCallbacks.length = 0;
});

describe("MomoAvatarModel", () => {
	it("StrictMode의 effect 재실행 후 실제 mixer가 모션을 재생하고 종료 이벤트를 전달한다", () => {
		// jsdom은 Three의 group/primitive를 DOM으로 읽는다. 이 테스트는 WebGL 대신
		// 실제 useAnimations와 AnimationMixer의 action/binding 수명을 확인한다.
		vi.spyOn(console, "error").mockImplementation(() => {});
		const scene = new Group();
		const body = new Object3D();
		body.name = "Body";
		scene.add(body);
		fixture.gltf = {
			scene,
			animations: ["idle", "hello", "listen", "think", "happy", "speak"].map(
				(motion) =>
					new AnimationClip(motion, 4, [
						new NumberKeyframeTrack("Body.position[y]", [0, 4], [0, 0.1]),
					]),
			),
		};
		const onOneShotFinished = vi.fn();
		const onReady = vi.fn();
		const onUnavailable = vi.fn();
		const rootState = {
			invalidate: fixture.invalidate,
			internal: {
				subscribe(callbackRef: {
					current: (state: unknown, delta: number) => void;
				}) {
					const callback = (state: unknown, delta: number) =>
						callbackRef.current(state, delta);
					fixture.frameCallbacks.push(callback);
					return () => {
						const callbackIndex = fixture.frameCallbacks.indexOf(callback);
						if (callbackIndex >= 0)
							fixture.frameCallbacks.splice(callbackIndex, 1);
					};
				},
			},
		};
		const rootStore = Object.assign(
			(selector: (state: unknown) => unknown) => selector(rootState),
			{ getState: () => rootState },
		) as unknown as NonNullable<ContextType<typeof context>>;
		const { rerender, unmount } = render(
			<StrictMode>
				<context.Provider value={rootStore}>
					<MomoAvatarModel
						motion="idle"
						playbackId={0}
						isPlaying
						onReady={onReady}
						onUnavailable={onUnavailable}
						onOneShotFinished={onOneShotFinished}
					/>
				</context.Provider>
			</StrictMode>,
		);
		expect(onReady).toHaveBeenCalled();
		expect(onUnavailable).not.toHaveBeenCalled();
		rerender(
			<StrictMode>
				<context.Provider value={rootStore}>
					<MomoAvatarModel
						motion="hello"
						playbackId={7}
						isPlaying
						onReady={onReady}
						onUnavailable={onUnavailable}
						onOneShotFinished={onOneShotFinished}
					/>
				</context.Provider>
			</StrictMode>,
		);
		act(() => fixture.frameCallbacks.at(-1)?.({}, 4.1));
		expect(onOneShotFinished).toHaveBeenCalledExactlyOnceWith(7);
		unmount();
	});
});
