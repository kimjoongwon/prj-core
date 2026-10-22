import { afterEach, describe, expect, it } from "vitest";
import type {
	LayoutDebugScanResult,
	LayoutDebugStyleReader,
} from "./layoutDebugScan";
import {
	buildLayoutDebugLabelChipPlacements,
	scanLayoutDebugDocument,
} from "./layoutDebugScan";

function stubElementRect(
	element: Element,
	top: number,
	left: number,
	width: number,
	height: number,
) {
	element.getBoundingClientRect = () =>
		({
			top,
			left,
			width,
			height,
			right: left + width,
			bottom: top + height,
			x: left,
			y: top,
			toJSON: () => ({}),
		}) as DOMRect;
}

function createFakeStyleReader(
	stylesByElement: Map<Element, Record<string, string>>,
): LayoutDebugStyleReader {
	return (element: Element) => ({
		getPropertyValue: (propertyName: string) =>
			stylesByElement.get(element)?.[propertyName] ?? "",
	});
}

function requireElement(selector: string): Element {
	const element = document.querySelector(selector);
	if (!element) {
		throw new Error(`픽스처 요소를 찾지 못했습니다: ${selector}`);
	}
	return element;
}

function buildScanFixture(): {
	stylesByElement: Map<Element, Record<string, string>>;
} {
	document.body.innerHTML = `
		<main data-layout="Admin.Main">
			<div data-layout="Screen">
				<div data-screen-slot="header">header</div>
				<section data-layout="Section">
					<div data-section-slot="body">body</div>
					<div data-section-slot="left-aside">aside</div>
				</section>
				<div data-layout="VStack" data-layout-gap="section">
					<div class="fixture-child">child-a</div>
					<div class="fixture-child">child-b</div>
				</div>
				<div data-layout="Container" data-layout-width="page"></div>
				<div data-layout="SectionSurface"></div>
				<div data-debug-name="커스텀 카드"></div>
				<div data-layout="Auth" id="hidden-auth">hidden</div>
			</div>
			<div id="anonymous-flex">
				<div class="fixture-child">grid-a</div>
				<div class="fixture-child">grid-b</div>
			</div>
		</main>
		<div data-layout-debug-layer="">
			<div data-layout="VStack" data-layout-gap="page">overlay 내부</div>
		</div>
	`;

	const screen = requireElement('[data-layout="Screen"]');
	const vstack = requireElement('[data-layout="VStack"]');
	const hiddenAuth = requireElement("#hidden-auth");
	const anonymousFlex = requireElement("#anonymous-flex");
	const vstackChildren = Array.from(
		document.querySelectorAll(".fixture-child"),
	).slice(0, 2);
	const anonymousChildren = Array.from(
		document.querySelectorAll(".fixture-child"),
	).slice(2);
	if (vstackChildren.length !== 2 || anonymousChildren.length !== 2) {
		throw new Error("스캔 픽스처가 올바르게 구성되지 않았습니다.");
	}

	stubElementRect(requireElement('[data-layout="Admin.Main"]'), 0, 0, 1200, 900);
	stubElementRect(screen, 0, 0, 1140, 860);
	stubElementRect(requireElement('[data-screen-slot="header"]'), 0, 0, 1140, 60);
	stubElementRect(requireElement('[data-layout="Section"]'), 70, 0, 1140, 200);
	stubElementRect(requireElement('[data-section-slot="body"]'), 70, 0, 760, 200);
	stubElementRect(requireElement('[data-section-slot="left-aside"]'), 70, 780, 360, 200);
	stubElementRect(vstack, 290, 0, 1140, 116);
	stubElementRect(vstackChildren[0], 290, 0, 1140, 50);
	stubElementRect(vstackChildren[1], 356, 0, 1140, 50);
	stubElementRect(requireElement('[data-layout="Container"]'), 420, 0, 1140, 40);
	stubElementRect(requireElement('[data-layout="SectionSurface"]'), 470, 0, 1140, 60);
	stubElementRect(requireElement('[data-debug-name]'), 540, 0, 1140, 60);
	stubElementRect(hiddenAuth, 0, 0, 0, 0);
	stubElementRect(anonymousFlex, 620, 0, 1140, 110);
	stubElementRect(anonymousChildren[0], 620, 0, 1140, 50);
	stubElementRect(anonymousChildren[1], 680, 0, 1140, 50);

	const stylesByElement = new Map<Element, Record<string, string>>();
	stylesByElement.set(document.documentElement, { "font-size": "16px" });
	stylesByElement.set(vstack, {
		display: "flex",
		"flex-direction": "column",
		"row-gap": "16px",
	});
	stylesByElement.set(anonymousFlex, {
		display: "flex",
		"flex-direction": "column",
		"row-gap": "10px",
	});
	stylesByElement.set(hiddenAuth, { display: "none" });

	return { stylesByElement };
}

afterEach(() => {
	document.body.innerHTML = "";
});

describe("scanLayoutDebugDocument", () => {
	it("Given 마킹된 레이아웃 요소들 When labels 모드로 스캔하면 종류별 라벨을 수집한다", () => {
		const { stylesByElement } = buildScanFixture();
		const result = scanLayoutDebugDocument(document.body, "labels", {
			readComputedStyle: createFakeStyleReader(stylesByElement),
		});

		const labels = result.annotations.map((annotation) => annotation.label);
		expect(labels).toContain("Admin.Main");
		expect(labels).toContain("Screen");
		expect(labels).toContain("Screen.Header");
		expect(labels).toContain("Section");
		expect(labels).toContain("Section.Body");
		expect(labels).toContain("Section.LeftAside");
		expect(labels).toContain("Container");
		expect(labels).toContain("SectionSurface");
		expect(labels).toContain("커스텀 카드");
		expect(result.rulers).toEqual([]);
	});

	it("Given VStack 간격 When 스캔하면 시맨틱 리듬과 계산 px를 라벨에 포함한다", () => {
		const { stylesByElement } = buildScanFixture();
		const result = scanLayoutDebugDocument(document.body, "labels", {
			readComputedStyle: createFakeStyleReader(stylesByElement),
		});

		const vstack = result.annotations.find(
			(annotation) => annotation.label === "VStack",
		);
		expect(vstack?.kind).toBe("stack");
		expect(vstack?.detail).toBe("section · 16px");
	});

	it("Given Container 폭 역할 When 스캔하면 라벨에 폭 이름을 포함한다", () => {
		const { stylesByElement } = buildScanFixture();
		const result = scanLayoutDebugDocument(document.body, "labels", {
			readComputedStyle: createFakeStyleReader(stylesByElement),
		});

		const container = result.annotations.find(
			(annotation) => annotation.label === "Container",
		);
		expect(container?.kind).toBe("shell");
		expect(container?.detail).toBe("page");
	});

	it("Given 중첩된 마킹 요소들 When 스캔하면 깊이를 계산한다", () => {
		const { stylesByElement } = buildScanFixture();
		const result = scanLayoutDebugDocument(document.body, "labels", {
			readComputedStyle: createFakeStyleReader(stylesByElement),
		});

		const depthByLabel = new Map(
			result.annotations.map((annotation) => [
				annotation.label,
				annotation.depth,
			]),
		);
		expect(depthByLabel.get("Admin.Main")).toBe(0);
		expect(depthByLabel.get("Screen")).toBe(1);
		expect(depthByLabel.get("Screen.Header")).toBe(2);
		expect(depthByLabel.get("Section.Body")).toBe(3);
		expect(depthByLabel.get("VStack")).toBe(2);
	});

	it("Given 숨겨진 요소와 오버레이 내부 요소 When 스캔하면 제외한다", () => {
		const { stylesByElement } = buildScanFixture();
		const result = scanLayoutDebugDocument(document.body, "labels", {
			readComputedStyle: createFakeStyleReader(stylesByElement),
		});

		const labels = result.annotations.map((annotation) => annotation.label);
		expect(labels).not.toContain("Auth");
		expect(labels.filter((label) => label === "VStack")).toHaveLength(1);
	});

	it("Given rulers 모드 When 스캔하면 시맨틱 간격 자와 미표기 raw 간격을 수집한다", () => {
		const { stylesByElement } = buildScanFixture();
		const result = scanLayoutDebugDocument(document.body, "rulers", {
			readComputedStyle: createFakeStyleReader(stylesByElement),
		});

		const stackRuler = result.rulers.find((ruler) => !ruler.isRaw);
		expect(stackRuler?.label).toBe("section · 16px");
		expect(stackRuler?.orientation).toBe("vertical");
		expect(stackRuler?.rect.height).toBe(16);

		const rawRuler = result.rulers.find((ruler) => ruler.isRaw);
		expect(rawRuler?.label).toBe("10px");

		const rawAnnotation = result.annotations.find(
			(annotation) => annotation.kind === "raw",
		);
		expect(rawAnnotation?.label).toBe("flex");
		expect(rawAnnotation?.detail).toBe("10px");
	});
});

describe("buildLayoutDebugLabelChipPlacements", () => {
	const nestedScanResult: LayoutDebugScanResult = {
		annotations: [
			{
				id: "annotation-0",
				label: "Auth",
				kind: "shell",
				rect: { top: 0, left: 0, width: 400, height: 800 },
				depth: 0,
			},
			{
				id: "annotation-1",
				label: "Auth.Main",
				kind: "slot",
				rect: { top: 0, left: 0, width: 400, height: 760 },
				depth: 0,
			},
			{
				id: "annotation-2",
				label: "Auth.Body",
				kind: "slot",
				rect: { top: 0, left: 0, width: 400, height: 720 },
				depth: 0,
			},
		],
		rulers: [],
	};

	it("Given 같은 좌상단을 공유하는 중첩 요소 When 배치하면 세로 계단으로 펼친다", () => {
		const placements = buildLayoutDebugLabelChipPlacements(nestedScanResult);
		const tops = placements.map((placement) => placement.top);

		expect(tops[0]).toBe(2);
		expect(tops[1]).toBe(2 + 18);
		expect(tops[2]).toBe(2 + 18 * 2);
	});

	it("Given 서로 떨어진 요소 When 배치하면 각자 요소 좌상단을 유지한다", () => {
		const placements = buildLayoutDebugLabelChipPlacements({
			annotations: [
				{
					id: "annotation-0",
					label: "Section",
					kind: "shell",
					rect: { top: 0, left: 0, width: 400, height: 100 },
					depth: 0,
				},
				{
					id: "annotation-1",
					label: "Section",
					kind: "shell",
					rect: { top: 500, left: 0, width: 400, height: 100 },
					depth: 0,
				},
			],
			rulers: [],
		});

		expect(placements.map((placement) => placement.top)).toEqual([2, 502]);
	});

	it("Given 간격 자 칩이 요소 칩과 겹치면 When 배치하면 오른쪽으로 밀어낸다", () => {
		const placements = buildLayoutDebugLabelChipPlacements({
			annotations: [
				{
					id: "annotation-0",
					label: "VStack",
					detail: "section · 16px",
					kind: "stack",
					rect: { top: 0, left: 0, width: 400, height: 120 },
					depth: 0,
				},
			],
			rulers: [
				{
					id: "ruler-0",
					rect: { top: 2, left: 8, width: 0, height: 16 },
					label: "section · 16px",
					isRaw: false,
					orientation: "vertical",
				},
			],
		});

		const elementChip = placements.find(
			(placement) => placement.id === "annotation-0-chip",
		);
		const rulerChip = placements.find(
			(placement) => placement.id === "ruler-0-chip",
		);
		if (!elementChip || !rulerChip) {
			throw new Error("칩 배치 결과가 올바르지 않습니다.");
		}
		expect(elementChip.left).toBe(2);
		expect(rulerChip.left).toBeGreaterThan(elementChip.left + elementChip.width);
	});

	it("Given 한글 라벨 When 폭을 추정하면 전각 폭을 반영한다", () => {
		const asciiChip = buildLayoutDebugLabelChipPlacements({
			annotations: [
				{
					id: "annotation-0",
					label: "abc",
					kind: "named",
					rect: { top: 0, left: 0, width: 100, height: 50 },
					depth: 0,
				},
			],
			rulers: [],
		})[0];
		const hangulChip = buildLayoutDebugLabelChipPlacements({
			annotations: [
				{
					id: "annotation-0",
					label: "가나다",
					kind: "named",
					rect: { top: 0, left: 0, width: 100, height: 50 },
					depth: 0,
				},
			],
			rulers: [],
		})[0];

		expect(hangulChip.width).toBeGreaterThan(asciiChip.width);
	});

	it("Given 중첩 깊이가 있는 요소 When 배치하면 칩이 인셋 링 좌상단으로 이동한다", () => {
		const placements = buildLayoutDebugLabelChipPlacements({
			annotations: [
				{
					id: "annotation-0",
					label: "Screen",
					kind: "shell",
					rect: { top: 100, left: 50, width: 400, height: 300 },
					depth: 0,
				},
				{
					id: "annotation-1",
					label: "Section.Body",
					kind: "slot",
					rect: { top: 500, left: 50, width: 380, height: 280 },
					depth: 3,
				},
			],
			rulers: [],
		});

		const screenChip = placements.find(
			(placement) => placement.id === "annotation-0-chip",
		);
		const sectionBodyChip = placements.find(
			(placement) => placement.id === "annotation-1-chip",
		);
		if (!screenChip || !sectionBodyChip) {
			throw new Error("칩 배치 결과가 올바르지 않습니다.");
		}
		expect(screenChip.left).toBe(52);
		expect(screenChip.top).toBe(102);
		// 깊이 3 → 인셋 9px 안쪽 링의 좌상단에 붙는다
		expect(sectionBodyChip.left).toBe(50 + 9 + 2);
		expect(sectionBodyChip.top).toBe(500 + 9 + 2);
	});
});
