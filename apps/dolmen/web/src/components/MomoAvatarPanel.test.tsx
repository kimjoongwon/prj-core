import "@testing-library/jest-dom/vitest";
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import type { ReactNode } from "react";
import type { WebGLRenderer } from "three";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMomoAvatarCanvasState } from "./MomoAvatarCanvas";
import { MomoAvatarPanel } from "./MomoAvatarPanel";
import type { MomoAvatarPlaybackProps } from "./momoAvatar";

const canvasMock = vi.hoisted(() => ({ shouldFail: false }));

vi.mock("@cocrepo/ui", () => ({
	Typography: {
		Paragraph: ({ children }: { children: ReactNode }) => <p>{children}</p>,
	},
}));

vi.mock("./MomoAvatarModel", () => ({ MomoAvatarModel: () => null }));

vi.mock("next/dynamic", () => ({
	default: () => (props: MomoAvatarPlaybackProps) => {
		if (canvasMock.shouldFail) throw new Error("WebGL unavailable");
		return (
			<div data-testid="momo-canvas" data-playing={String(props.isPlaying)}>
				<button type="button" onClick={props.onReady}>
					모델 준비
				</button>
				<button type="button" onClick={props.onUnavailable}>
					3D 오류
				</button>
			</div>
		);
	},
}));

let motionPreference: MediaQueryList;
let viewportCallback: IntersectionObserverCallback;
const disconnectViewportObserver = vi.fn();

function applyViewportVisibility(isIntersecting: boolean) {
	act(() => {
		viewportCallback(
			[{ isIntersecting }] as IntersectionObserverEntry[],
			{} as IntersectionObserver,
		);
	});
}

beforeEach(() => {
	canvasMock.shouldFail = false;
	disconnectViewportObserver.mockClear();
	motionPreference = Object.assign(new EventTarget(), {
		matches: false,
		media: "(prefers-reduced-motion: reduce)",
	}) as MediaQueryList;
	vi.stubGlobal(
		"matchMedia",
		vi.fn(() => motionPreference),
	);
	vi.stubGlobal(
		"IntersectionObserver",
		class {
			constructor(callback: IntersectionObserverCallback) {
				viewportCallback = callback;
			}
			observe() {}
			disconnect = disconnectViewportObserver;
		},
	);
	vi.spyOn(document, "hidden", "get").mockReturnValue(false);
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("MomoAvatarPanel", () => {
	it("보일 때만 3D를 읽고 모델 준비 이후 viewport와 탭 가시성에 따라 재생한다", () => {
		const onReady = vi.fn();
		const { unmount } = render(
			<MomoAvatarPanel
				motion="idle"
				playbackId={0}
				onReady={onReady}
				onOneShotFinished={vi.fn()}
			/>,
		);
		expect(screen.queryByTestId("momo-canvas")).not.toBeInTheDocument();
		applyViewportVisibility(true);
		expect(screen.getByTestId("momo-canvas")).toHaveAttribute(
			"data-playing",
			"true",
		);
		fireEvent.click(screen.getByText("모델 준비"));
		fireEvent.click(screen.getByText("모델 준비"));
		expect(onReady).toHaveBeenCalledTimes(1);
		applyViewportVisibility(false);
		expect(screen.getByTestId("momo-canvas")).toHaveAttribute(
			"data-playing",
			"false",
		);
		applyViewportVisibility(true);
		vi.spyOn(document, "hidden", "get").mockReturnValue(true);
		fireEvent(document, new Event("visibilitychange"));
		expect(screen.getByTestId("momo-canvas")).toHaveAttribute(
			"data-playing",
			"false",
		);
		unmount();
		expect(disconnectViewportObserver).toHaveBeenCalledTimes(1);
	});

	it("reduced motion에서는 poster와 상태 텍스트를 유지하고 환경 변경 리스너를 정리한다", () => {
		Object.defineProperty(motionPreference, "matches", {
			value: true,
			configurable: true,
		});
		const removePreferenceListener = vi.spyOn(
			motionPreference,
			"removeEventListener",
		);
		const { container, unmount } = render(
			<MomoAvatarPanel
				motion="listen"
				playbackId={0}
				onReady={vi.fn()}
				onOneShotFinished={vi.fn()}
			/>,
		);
		applyViewportVisibility(true);
		expect(screen.queryByTestId("momo-canvas")).not.toBeInTheDocument();
		expect(container.querySelector("img")).toHaveAttribute(
			"src",
			"/dolmen/momo/poster.webp",
		);
		expect(screen.getByRole("status")).toHaveTextContent(
			"면접 질문을 입력해 주세요",
		);
		Object.defineProperty(motionPreference, "matches", { value: false });
		act(() => {
			motionPreference.dispatchEvent(new Event("change"));
		});
		expect(screen.getByTestId("momo-canvas")).toBeInTheDocument();
		unmount();
		expect(removePreferenceListener).toHaveBeenCalledWith(
			"change",
			expect.any(Function),
		);
	});

	it("모델 실패와 WebGL 렌더 오류 모두 채팅과 독립적으로 poster로 돌아간다", () => {
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});
		const { container } = render(
			<MomoAvatarPanel
				motion="think"
				playbackId={0}
				onReady={vi.fn()}
				onOneShotFinished={vi.fn()}
			/>,
		);
		canvasMock.shouldFail = true;
		applyViewportVisibility(true);
		expect(screen.queryByTestId("momo-canvas")).not.toBeInTheDocument();
		expect(container.querySelector("img")).toBeInTheDocument();
		expect(screen.getByRole("status")).toHaveTextContent(
			"이력서에서 근거를 확인하고 있어요",
		);
		expect(consoleError).toHaveBeenCalled();
	});

	it("자산 로딩 실패 알림 이후 3D 재시도를 반복하지 않는다", () => {
		const { container } = render(
			<MomoAvatarPanel
				motion="idle"
				playbackId={0}
				onReady={vi.fn()}
				onOneShotFinished={vi.fn()}
			/>,
		);
		applyViewportVisibility(true);
		fireEvent.click(screen.getByText("3D 오류"));
		applyViewportVisibility(false);
		applyViewportVisibility(true);
		expect(screen.queryByTestId("momo-canvas")).not.toBeInTheDocument();
		expect(container.querySelector("img")).toBeInTheDocument();
	});
});

describe("MomoAvatarCanvasState", () => {
	it("context loss를 fallback으로 전달하고 StrictMode cleanup 뒤 재연결할 수 있다", () => {
		const onUnavailable = vi.fn();
		const canvasElement = document.createElement("canvas");
		const canvasState = createMomoAvatarCanvasState(onUnavailable);
		canvasState.configureCanvas({
			gl: { domElement: canvasElement } as WebGLRenderer,
		});
		const contextLostEvent = new Event("webglcontextlost", {
			cancelable: true,
		});
		canvasElement.dispatchEvent(contextLostEvent);
		expect(contextLostEvent.defaultPrevented).toBe(true);
		expect(onUnavailable).toHaveBeenCalledTimes(1);
		canvasState.dispose();
		canvasElement.dispatchEvent(new Event("webglcontextlost"));
		expect(onUnavailable).toHaveBeenCalledTimes(1);
		canvasState.activate();
		canvasElement.dispatchEvent(new Event("webglcontextlost"));
		expect(onUnavailable).toHaveBeenCalledTimes(2);
		canvasState.dispose();
	});
});
