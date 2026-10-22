// 브라우저와 같은 Three.js GLTFLoader/AnimationMixer로 자산 계약을 검사한다.
// Node 검증이므로 화면 렌더링이나 브라우저 FPS 측정을 대신하지 않는다.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { AnimationMixer, Box3, LoopOnce } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const bytes = await readFile(
	new URL("../../public/momo/momo.glb", import.meta.url),
);
const gltf = await new GLTFLoader().parseAsync(
	bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
	"",
);
const expectedClips = ["idle", "hello", "listen", "think", "happy", "speak"];
assert.deepEqual(
	gltf.animations.map((clip) => clip.name),
	expectedClips,
);
const mixer = new AnimationMixer(gltf.scene);
const bounds = new Box3();
for (const clip of gltf.animations) {
	assert.equal(clip.duration, 4);
	assert.equal(clip.tracks.length, 30);
	mixer.stopAllAction();
	const action = mixer.clipAction(clip).reset().setLoop(LoopOnce, 1).play();
	action.clampWhenFinished = true;
	for (const seconds of [0, 1, 2, 3, 3.99, 4]) {
		mixer.setTime(seconds);
		gltf.scene.updateMatrixWorld(true);
		bounds.union(new Box3().setFromObject(gltf.scene, true));
	}
}
assert(
	bounds.min.toArray().concat(bounds.max.toArray()).every(Number.isFinite),
);
mixer.stopAllAction();
const idleAction = mixer.clipAction(gltf.animations[0]).reset().play();
const helloAction = mixer.clipAction(gltf.animations[1]).reset().play();
idleAction.crossFadeTo(helloAction, 0.2, false);
for (let step = 0; step < 20; step += 1) mixer.update(0.02);
assert(idleAction.getEffectiveWeight() <= 0.001);
assert(helloAction.getEffectiveWeight() >= 0.999);
console.log(
	JSON.stringify(
		{
			status: "passed",
			clips: gltf.animations.map((clip) => ({
				name: clip.name,
				seconds: clip.duration,
				tracks: clip.tracks.length,
			})),
			sampledBounds: { min: bounds.min.toArray(), max: bounds.max.toArray() },
			crossFade: "passed",
		},
		null,
		2,
	),
);
