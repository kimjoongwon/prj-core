import { fireEvent, render, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	LAYOUT_DEBUG_MODE_STORAGE_KEY,
	parseLayoutDebugMode,
} from "./layoutDebugOverlayState";
import {
	LayoutDebugOverlay,
	isLayoutDebugShortcut,
} from "./LayoutDebugOverlay";

function pressLayoutDebugShortcut() {
	fireEvent.keyDown(window, {
		altKey: true,
		shiftKey: true,
		code: "KeyD",
		key: "∆",
	});
}

function findOverlayLayer(): Element | null {
	return document.querySelector("[data-layout-debug-layer]");
}

afterEach(() => {
	cleanup();
	window.localStorage.clear();
	document.body.innerHTML = "";
});

describe("isLayoutDebugShortcut", () => {
	it("Given Alt+Shift+물리 D When 판별하면 true를 반환한다", () => {
		// macOS는 Option 조합에서 key가 글리프(예: "∆")로 전달되어도 물리 키 code로 판별한다
		expect(
			isLayoutDebugShortcut({
				altKey: true,
				metaKey: false,
				ctrlKey: false,
				shiftKey: true,
				code: "KeyD",
			}),
		).toBe(true);
	});

	it("Given 다른 조합 When 판별하면 false를 반환한다", () => {
		expect(
			isLayoutDebugShortcut({
				altKey: false,
				metaKey: false,
				ctrlKey: false,
				shiftKey: true,
				code: "KeyD",
			}),
		).toBe(false);
		expect(
			isLayoutDebugShortcut({
				altKey: true,
				metaKey: true,
				ctrlKey: false,
				shiftKey: true,
				code: "KeyD",
			}),
		).toBe(false);
		expect(
			isLayoutDebugShortcut({
				altKey: true,
				metaKey: false,
				ctrlKey: false,
				shiftKey: true,
				code: "KeyX",
			}),
		).toBe(false);
	});
});

describe("parseLayoutDebugMode", () => {
	it("Given 저장된 값 When 해석하면 유효한 모드만 반환한다", () => {
		expect(parseLayoutDebugMode("labels")).toBe("labels");
		expect(parseLayoutDebugMode("rulers")).toBe("rulers");
		expect(parseLayoutDebugMode("off")).toBe("off");
		expect(parseLayoutDebugMode("nonsense")).toBeNull();
		expect(parseLayoutDebugMode(null)).toBeNull();
	});
});

describe("LayoutDebugOverlay", () => {
	it("Given 기본 상태 When 렌더하면 오버레이를 표시하지 않는다", () => {
		render(<LayoutDebugOverlay />);
		expect(findOverlayLayer()).toBeNull();
	});

	it("Given 저장된 모드 When 마운트하면 해당 모드로 복원한다", async () => {
		window.localStorage.setItem(LAYOUT_DEBUG_MODE_STORAGE_KEY, "labels");
		render(<LayoutDebugOverlay />);

		await waitFor(() => {
			expect(findOverlayLayer()).not.toBeNull();
		});
		expect(findOverlayLayer()?.textContent).toContain("레이아웃 디버그");
	});

	it("Given Alt+Shift+D 입력 When 반복하면 off → labels → rulers → off 로 순환하고 저장한다", async () => {
		render(<LayoutDebugOverlay />);

		pressLayoutDebugShortcut();
		await waitFor(() => {
			expect(findOverlayLayer()).not.toBeNull();
		});
		expect(window.localStorage.getItem(LAYOUT_DEBUG_MODE_STORAGE_KEY)).toBe(
			"labels",
		);

		pressLayoutDebugShortcut();
		await waitFor(() => {
			expect(window.localStorage.getItem(LAYOUT_DEBUG_MODE_STORAGE_KEY)).toBe(
				"rulers",
			);
		});

		pressLayoutDebugShortcut();
		await waitFor(() => {
			expect(findOverlayLayer()).toBeNull();
		});
		expect(window.localStorage.getItem(LAYOUT_DEBUG_MODE_STORAGE_KEY)).toBe(
			"off",
		);
	});

	it("Given 마킹된 요소 When labels 모드로 스캔하면 라벨 칩을 그린다", async () => {
		window.localStorage.setItem(LAYOUT_DEBUG_MODE_STORAGE_KEY, "labels");
		const container = document.createElement("div");
		container.innerHTML =
			'<div data-layout="VStack" data-layout-gap="section"><div>child-a</div><div>child-b</div></div>';
		const vstackFixture = container.firstElementChild;
		if (!vstackFixture) {
			throw new Error("라벨 칩 픽스처가 올바르게 구성되지 않았습니다.");
		}
		// jsdom은 레이아웃을 계산하지 않으므로 보이는 rect를 직접 부여합니다.
		vstackFixture.getBoundingClientRect = () =>
			({
				top: 0,
				left: 0,
				width: 400,
				height: 120,
				right: 400,
				bottom: 120,
				x: 0,
				y: 0,
				toJSON: () => ({}),
			}) as DOMRect;
		document.body.appendChild(container);

		render(<LayoutDebugOverlay />);

		await waitFor(() => {
			expect(findOverlayLayer()?.textContent).toContain("VStack");
		});
	});
});
