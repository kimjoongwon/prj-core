import { resolveStackGapFromPixels, type StackGap } from "../rhythm/stack-gap";

/** 레이아웃 디버그 모드. off → labels → rulers → off 로 순환합니다. */
export type LayoutDebugMode = "off" | "labels" | "rulers";

/** 오버레이 레이어가 DOM 스캔에서 자기 자신을 건너뛰기 위해 사용하는 속성입니다. */
export const LAYOUT_DEBUG_LAYER_ATTRIBUTE = "data-layout-debug-layer";

export type LayoutDebugElementKind =
	| "shell" // Admin, Auth, Screen, Container, Section 루트
	| "slot" // Admin.*, Auth.*, Section.*, Screen.* 슬롯
	| "stack" // VStack, HStack 리듬 프리미티브
	| "surface" // SectionSurface, ScreenSurface
	| "named" // data-debug-name 확장 포인트
	| "raw"; // 시맨틱 마킹 없이 간격을 쓰는 flex/grid (rulers 모드)

export interface LayoutDebugRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface LayoutDebugAnnotation {
	id: string;
	label: string;
	detail?: string;
	kind: LayoutDebugElementKind;
	rect: LayoutDebugRect;
	/** 다른 주석 요소에 둘러싸인 중첩 깊이(0 = 최상위). 점선 인셋에 사용합니다. */
	depth: number;
}

export interface LayoutDebugGapRuler {
	id: string;
	rect: LayoutDebugRect;
	label: string;
	isRaw: boolean;
	/** 자의 방향. 세로 간격(열 방향 흐름)에 세로 자를 그립니다. */
	orientation: "vertical" | "horizontal";
}

export interface LayoutDebugScanResult {
	annotations: LayoutDebugAnnotation[];
	rulers: LayoutDebugGapRuler[];
}

/** 테스트 주입용 계산 스타일 판독기. 기본값은 window.getComputedStyle입니다. */
export type LayoutDebugStyleReader = (
	element: Element,
) => { getPropertyValue(propertyName: string): string };

export interface LayoutDebugScanDeps {
	readComputedStyle?: LayoutDebugStyleReader;
}

const SHELL_LAYOUT_NAMES = new Set([
	"Admin",
	"Auth",
	"Screen",
	"Container",
	"Section",
]);
const STACK_LAYOUT_NAMES = new Set(["VStack", "HStack"]);
const SURFACE_LAYOUT_NAMES = new Set(["SectionSurface", "ScreenSurface"]);
/** 라벨에 간격 상세를 함께 표시할 data-layout 값입니다. */
const GAP_DETAIL_LAYOUT_NAMES = new Set([
	"VStack",
	"HStack",
	"Screen",
	"Section",
]);

const ANNOTATION_SELECTOR = [
	"[data-layout]",
	"[data-section-slot]",
	"[data-screen-slot]",
	"[data-debug-name]",
].join(",");

/** rulers 모드에서 미표기 간격 컨테이너로 판단할 최소 간격(px)입니다. */
const MIN_RAW_GAP_PIXELS = 2;
/** rulers 모드에서 자를 그릴 최소 간격(px)과 허용 오차(px)입니다. */
const MIN_RULER_GAP_PIXELS = 2;
const RULER_GAP_TOLERANCE_PIXELS = 6;

function pascalizeSlotName(slotName: string): string {
	return slotName
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
}

function parsePixelValue(value: string): number | null {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : null;
}

function readGapPixels(
	element: Element,
	gapAxis: "row" | "column",
	readComputedStyle: LayoutDebugStyleReader,
): number | null {
	const gapValue = readComputedStyle(element).getPropertyValue(
		gapAxis === "row" ? "row-gap" : "column-gap",
	);
	return parsePixelValue(gapValue);
}

function formatGapDetail(
	semantic: StackGap | null,
	gapPixels: number | null,
): string | undefined {
	if (gapPixels === null) {
		return semantic ?? undefined;
	}
	const pixelText = `${Math.round(gapPixels)}px`;
	return semantic ? `${semantic} · ${pixelText}` : pixelText;
}

interface LayoutDebugElementDescription {
	label: string;
	detail?: string;
	kind: LayoutDebugElementKind;
}

function describeLayoutDebugElement(
	element: Element,
	rootFontSizePixels: number,
	readComputedStyle: LayoutDebugStyleReader,
): LayoutDebugElementDescription | null {
	const layoutName = element.getAttribute("data-layout");
	if (layoutName) {
		const kind = STACK_LAYOUT_NAMES.has(layoutName)
			? "stack"
			: SHELL_LAYOUT_NAMES.has(layoutName)
				? "shell"
				: SURFACE_LAYOUT_NAMES.has(layoutName)
					? "surface"
					: "slot";
		let detail: string | undefined;
		if (layoutName === "Container") {
			detail = element.getAttribute("data-layout-width") ?? undefined;
		} else if (GAP_DETAIL_LAYOUT_NAMES.has(layoutName)) {
			const gapAxis = layoutName === "HStack" ? "column" : "row";
			const gapPixels = readGapPixels(element, gapAxis, readComputedStyle);
			const semantic =
				layoutName === "VStack" || layoutName === "HStack"
					? (element.getAttribute("data-layout-gap") as StackGap | null)
					: gapPixels === null
						? null
						: resolveStackGapFromPixels(gapPixels, rootFontSizePixels);
			detail = formatGapDetail(semantic, gapPixels);
		}
		return { label: layoutName, detail, kind };
	}
	const sectionSlotName = element.getAttribute("data-section-slot");
	if (sectionSlotName) {
		return {
			label: `Section.${pascalizeSlotName(sectionSlotName)}`,
			kind: "slot",
		};
	}
	const screenSlotName = element.getAttribute("data-screen-slot");
	if (screenSlotName) {
		return {
			label: `Screen.${pascalizeSlotName(screenSlotName)}`,
			kind: "slot",
		};
	}
	const debugName = element.getAttribute("data-debug-name");
	if (debugName) {
		return { label: debugName, kind: "named" };
	}
	return null;
}

/** 노드가 오버레이 레이어 내부(레이어 자신 포함)인지 판별합니다. */
export function isNodeInsideLayoutDebugLayer(node: Node): boolean {
	let current: Node | null = node;
	while (current) {
		if (
			current instanceof Element &&
			current.hasAttribute(LAYOUT_DEBUG_LAYER_ATTRIBUTE)
		) {
			return true;
		}
		current = current.parentNode;
	}
	return false;
}

/** 뷰포트 rect를 문서 좌표로 옮기고, 크기가 0이면(숨김) null을 반환합니다. */
function readDocumentRect(element: Element): LayoutDebugRect | null {
	const viewportRect = element.getBoundingClientRect();
	if (viewportRect.width <= 0 || viewportRect.height <= 0) {
		return null;
	}
	return {
		top: viewportRect.top + window.scrollY,
		left: viewportRect.left + window.scrollX,
		width: viewportRect.width,
		height: viewportRect.height,
	};
}

function readRootFontSizePixels(
	readComputedStyle: LayoutDebugStyleReader,
): number {
	const documentElement =
		document.documentElement ??
		(document.body?.ownerDocument?.documentElement ?? null);
	if (!documentElement) {
		return 16;
	}
	return (
		parsePixelValue(
			readComputedStyle(documentElement).getPropertyValue("font-size"),
		) ?? 16
	);
}

/**
 * 스택/그리드의 인접한 자식 사이 간격 자를 만듭니다.
 * 열 방향 흐름(flex-col, grid)은 세로 자, 행 방향 flex는 가로 자를 그립니다.
 */
function collectGapRulers(
	container: Element,
	containerRect: LayoutDebugRect,
	rootFontSizePixels: number,
	readComputedStyle: LayoutDebugStyleReader,
	existingRulers: LayoutDebugGapRuler[],
): void {
	const display = readComputedStyle(container).getPropertyValue("display");
	const isFlex = display.includes("flex");
	const isGrid = display.includes("grid");
	if (!isFlex && !isGrid) {
		return;
	}
	const flexDirection = readComputedStyle(container).getPropertyValue(
		"flex-direction",
	);
	const isColumnFlow = isGrid || flexDirection.startsWith("column");
	const gapPixels = readGapPixels(
		container,
		isColumnFlow ? "row" : "column",
		readComputedStyle,
	);
	if (gapPixels === null || gapPixels < MIN_RULER_GAP_PIXELS) {
		return;
	}
	const semantic = resolveStackGapFromPixels(gapPixels, rootFontSizePixels);

	const childRects: LayoutDebugRect[] = [];
	for (const child of Array.from(container.children)) {
		if (isNodeInsideLayoutDebugLayer(child)) {
			continue;
		}
		const childRect = readDocumentRect(child);
		if (childRect) {
			childRects.push(childRect);
		}
	}
	if (childRects.length < 2) {
		return;
	}

	for (let index = 0; index + 1 < childRects.length; index += 1) {
		const current = childRects[index];
		const next = childRects[index + 1];
		if (isColumnFlow) {
			const gapTop = current.top + current.height;
			const gapHeight = next.top - gapTop;
			if (gapHeight < MIN_RULER_GAP_PIXELS) {
				continue;
			}
			if (gapHeight > gapPixels + RULER_GAP_TOLERANCE_PIXELS) {
				continue;
			}
			const overlapStart = Math.max(current.left, next.left);
			const overlapEnd = Math.min(
				current.left + current.width,
				next.left + next.width,
			);
			const rulerLeft =
				overlapEnd > overlapStart
					? (overlapStart + overlapEnd) / 2
					: containerRect.left + 16;
			existingRulers.push({
				id: `ruler-${existingRulers.length}`,
				rect: { top: gapTop, left: rulerLeft, width: 0, height: gapHeight },
				label: formatGapDetail(semantic, gapPixels) ?? "",
				isRaw: semantic === null,
				orientation: "vertical",
			});
		} else {
			const gapLeft = current.left + current.width;
			const gapWidth = next.left - gapLeft;
			if (gapWidth < MIN_RULER_GAP_PIXELS) {
				continue;
			}
			if (gapWidth > gapPixels + RULER_GAP_TOLERANCE_PIXELS) {
				continue;
			}
			const overlapTop = Math.max(current.top, next.top);
			const overlapBottom = Math.min(
				current.top + current.height,
				next.top + next.height,
			);
			const rulerTop =
				overlapBottom > overlapTop
					? (overlapTop + overlapBottom) / 2
					: containerRect.top + 16;
			existingRulers.push({
				id: `ruler-${existingRulers.length}`,
				rect: { top: rulerTop, left: gapLeft, width: gapWidth, height: 0 },
				label: formatGapDetail(semantic, gapPixels) ?? "",
				isRaw: semantic === null,
				orientation: "horizontal",
			});
		}
	}
}

/**
 * 문서를 스캔해 레이아웃 디버그 라벨과 간격 자 대상을 수집합니다.
 * labels 모드는 마킹된 요소 라벨만, rulers 모드는 미표기 간격 컨테이너와 간격 자까지 수집합니다.
 */
export function scanLayoutDebugDocument(
	root: ParentNode,
	mode: LayoutDebugMode,
	deps: LayoutDebugScanDeps = {},
): LayoutDebugScanResult {
	const readComputedStyle =
		deps.readComputedStyle ??
		((element: Element) => window.getComputedStyle(element));
	const rootFontSizePixels = readRootFontSizePixels(readComputedStyle);

	const annotations: LayoutDebugAnnotation[] = [];
	const annotationElements: Element[] = [];
	const rulerTargets: Array<{ element: Element; rect: LayoutDebugRect }> = [];
	for (const element of Array.from(
		root.querySelectorAll(ANNOTATION_SELECTOR),
	)) {
		if (isNodeInsideLayoutDebugLayer(element)) {
			continue;
		}
		const rect = readDocumentRect(element);
		if (!rect) {
			continue;
		}
		const description = describeLayoutDebugElement(
			element,
			rootFontSizePixels,
			readComputedStyle,
		);
		if (!description) {
			continue;
		}
		annotations.push({
			id: `annotation-${annotations.length}`,
			rect,
			depth: 0,
			...description,
		});
		annotationElements.push(element);
		rulerTargets.push({ element, rect });
	}

	// 중첩 깊이만큼 점선을 안쪽으로 들여 그려 같은 위치 겹침을 링으로 분리합니다.
	annotationElements.forEach((element, index) => {
		annotations[index].depth = annotationElements.reduce(
			(containingCount, other) =>
				containingCount + (other !== element && other.contains(element) ? 1 : 0),
			0,
		);
	});

	const rulers: LayoutDebugGapRuler[] = [];
	if (mode === "rulers") {
		for (const target of rulerTargets) {
			collectGapRulers(
				target.element,
				target.rect,
				rootFontSizePixels,
				readComputedStyle,
				rulers,
			);
		}
		for (const element of Array.from(root.querySelectorAll("*"))) {
			if (isNodeInsideLayoutDebugLayer(element) || element.hasAttribute("data-layout")) {
				continue;
			}
			if (element.children.length < 2) {
				continue;
			}
			const display = readComputedStyle(element).getPropertyValue("display");
			if (
				display !== "flex" &&
				display !== "inline-flex" &&
				display !== "grid" &&
				display !== "inline-grid"
			) {
				continue;
			}
			const isGrid = display.endsWith("grid");
			const isColumnFlow =
				isGrid ||
				readComputedStyle(element)
					.getPropertyValue("flex-direction")
					.startsWith("column");
			const gapPixels = readGapPixels(
				element,
				isColumnFlow ? "row" : "column",
				readComputedStyle,
			);
			if (gapPixels === null || gapPixels < MIN_RAW_GAP_PIXELS) {
				continue;
			}
			const rect = readDocumentRect(element);
			if (!rect || (rect.width < 32 && rect.height < 32)) {
				continue;
			}
			const semantic = resolveStackGapFromPixels(
				gapPixels,
				rootFontSizePixels,
			);
			annotations.push({
				id: `annotation-${annotations.length}`,
				label: isGrid ? "grid" : "flex",
				detail: formatGapDetail(semantic, gapPixels),
				kind: "raw",
				rect,
				depth: 0,
			});
			collectGapRulers(
				element,
				rect,
				rootFontSizePixels,
				readComputedStyle,
				rulers,
			);
		}
	}

	return { annotations, rulers };
}

/** 라벨 칩 폰트 크기와 높이(px). 오버레이 칩 스타일과 같은 값을 유지해야 합니다. */
export const LAYOUT_DEBUG_CHIP_FONT_SIZE_PX = 10;
export const LAYOUT_DEBUG_CHIP_HEIGHT_PX = 16;
/** 중첩 깊이 1단계당 점선을 안쪽으로 미는 폭(px)입니다. */
export const LAYOUT_DEBUG_BOX_INSET_STEP_PX = 3;
const MAX_BOX_INSET_DEPTH = 5;
const CHIP_PADDING_PX = 8;
const CHIP_GAP_PX = 2;
const CHIP_TEXT_OFFSET_PX = 2;
const MONOSPACE_ASCII_CHAR_WIDTH_PX = 6;
const MONOSPACE_CJK_CHAR_WIDTH_PX = 10;
const MAX_CHIP_DISPLACEMENT_STEPS = 200;

/** 중첩 깊이에 따른 점선 인셋 폭(px). 깊이 상한을 넘으면 최대 인셋을 유지합니다. */
export function getLayoutDebugBoxInsetPx(depth: number): number {
	const boundedDepth = Math.min(Math.max(depth, 0), MAX_BOX_INSET_DEPTH);
	return boundedDepth * LAYOUT_DEBUG_BOX_INSET_STEP_PX;
}

export interface LayoutDebugLabelChipPlacement {
	id: string;
	top: number;
	left: number;
	width: number;
	height: number;
	text: string;
	kind: LayoutDebugElementKind;
	subdued: boolean;
}

interface ChipFootprint {
	top: number;
	left: number;
	width: number;
	height: number;
}

function isWideGlyph(character: string): boolean {
	// 한글(UC+1100~)과 CJK·전각 형식(UC+FFEF까지)을 전각 폭으로 셉니다.
	return character >= "\u1100" && character <= "\uFFEF";
}

/** monospace 폰트의 문자별 폭 근사로 칩 전체 폭을 추정합니다(한글 등 전각은 2배 폭). */
function estimateChipWidthPx(text: string): number {
	let textWidth = 0;
	for (const character of text) {
		textWidth += isWideGlyph(character)
			? MONOSPACE_CJK_CHAR_WIDTH_PX
			: MONOSPACE_ASCII_CHAR_WIDTH_PX;
	}
	return textWidth + CHIP_PADDING_PX;
}

function doChipFootprintsOverlap(
	chip: ChipFootprint,
	other: ChipFootprint,
): boolean {
	return (
		chip.left < other.left + other.width + CHIP_GAP_PX &&
		other.left < chip.left + chip.width + CHIP_GAP_PX &&
		chip.top < other.top + other.height + CHIP_GAP_PX &&
		other.top < chip.top + chip.height + CHIP_GAP_PX
	);
}

function findChipOverlap(
	chip: ChipFootprint,
	placedChips: ChipFootprint[],
): ChipFootprint | undefined {
	return placedChips.find((placed) => doChipFootprintsOverlap(chip, placed));
}

/**
 * 스캔 결과에서 겹치지 않는 라벨 칩 배치를 만듭니다.
 * 중첩 구조처럼 같은 좌상단을 공유하는 요소 칩은 아래로 계단 배치하고,
 * 간격 자 칩은 자 선을 벗어나지 않도록 오른쪽으로 밀어냅니다.
 */
export function buildLayoutDebugLabelChipPlacements(
	scanResult: LayoutDebugScanResult,
): LayoutDebugLabelChipPlacement[] {
	const elementPlacements: LayoutDebugLabelChipPlacement[] =
		scanResult.annotations.map((annotation) => {
			const text = [annotation.label, annotation.detail]
				.filter(Boolean)
				.join(" · ");
			// 칩은 자기 점선 링의 좌상단에 붙습니다.
			const boxInsetPx = getLayoutDebugBoxInsetPx(annotation.depth);
			return {
				id: `${annotation.id}-chip`,
				top: annotation.rect.top + boxInsetPx + CHIP_TEXT_OFFSET_PX,
				left: annotation.rect.left + boxInsetPx + CHIP_TEXT_OFFSET_PX,
				width: estimateChipWidthPx(text),
				height: LAYOUT_DEBUG_CHIP_HEIGHT_PX,
				text,
				kind: annotation.kind,
				subdued: annotation.kind === "raw",
			};
		});

	const placedFootprints: ChipFootprint[] = [];
	for (const placement of elementPlacements) {
		let steps = 0;
		while (
			steps < MAX_CHIP_DISPLACEMENT_STEPS &&
			findChipOverlap(placement, placedFootprints)
		) {
			placement.top += LAYOUT_DEBUG_CHIP_HEIGHT_PX + CHIP_GAP_PX;
			steps += 1;
		}
		placedFootprints.push({ ...placement });
	}

	const rulerPlacements: LayoutDebugLabelChipPlacement[] = [];
	for (const ruler of scanResult.rulers) {
		const text = ruler.isRaw ? `raw ${ruler.label}` : ruler.label;
		const placement: LayoutDebugLabelChipPlacement = {
			id: `${ruler.id}-chip`,
			top:
				ruler.orientation === "vertical"
					? ruler.rect.top + ruler.rect.height / 2 - LAYOUT_DEBUG_CHIP_HEIGHT_PX / 2
					: ruler.rect.top - LAYOUT_DEBUG_CHIP_HEIGHT_PX / 2,
			left: ruler.rect.left + 6,
			width: estimateChipWidthPx(text),
			height: LAYOUT_DEBUG_CHIP_HEIGHT_PX,
			text,
			kind: ruler.isRaw ? "raw" : "stack",
			subdued: true,
		};
		let steps = 0;
		while (
			steps < MAX_CHIP_DISPLACEMENT_STEPS &&
			findChipOverlap(placement, [...placedFootprints, ...rulerPlacements])
		) {
			placement.left += placement.width + CHIP_GAP_PX;
			steps += 1;
		}
		rulerPlacements.push(placement);
	}

	return [...elementPlacements, ...rulerPlacements];
}
