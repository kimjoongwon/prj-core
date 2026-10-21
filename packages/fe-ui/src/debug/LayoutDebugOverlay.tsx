"use client";

import { useLocalObservable, observer } from "mobx-react-lite";
import { useEffect, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
	LAYOUT_DEBUG_CHIP_FONT_SIZE_PX,
	LAYOUT_DEBUG_CHIP_HEIGHT_PX,
	buildLayoutDebugLabelChipPlacements,
	getLayoutDebugBoxInsetPx,
	isNodeInsideLayoutDebugLayer,
	scanLayoutDebugDocument,
	type LayoutDebugElementKind,
	type LayoutDebugMode,
} from "./layoutDebugScan";
import {
	LAYOUT_DEBUG_MODE_STORAGE_KEY,
	createLayoutDebugOverlayState,
	parseLayoutDebugMode,
} from "./layoutDebugOverlayState";

/**
 * 레이아웃 디버그 토글 단축키(Alt+Shift+D)인지 판별합니다.
 * macOS는 Option 조합 시 event.key가 글리프(예: "∆")로 전달되고 한글 IME에서도
 * key가 변하므로, 물리 키 위치 기준의 event.code로 판별합니다.
 */
export function isLayoutDebugShortcut(event: {
	altKey: boolean;
	metaKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	code: string;
}): boolean {
	return (
		event.altKey &&
		event.shiftKey &&
		!event.metaKey &&
		!event.ctrlKey &&
		event.code === "KeyD"
	);
}

function readPersistedLayoutDebugMode(): LayoutDebugMode {
	try {
		return (
			parseLayoutDebugMode(
				window.localStorage.getItem(LAYOUT_DEBUG_MODE_STORAGE_KEY),
			) ?? "off"
		);
	} catch {
		return "off";
	}
}

function persistLayoutDebugMode(mode: LayoutDebugMode) {
	try {
		window.localStorage.setItem(LAYOUT_DEBUG_MODE_STORAGE_KEY, mode);
	} catch {
		// localStorage 접근이 막힌 환경에서는 이번 세션에서만 유지됩니다.
	}
}

const LAYOUT_DEBUG_KIND_COLORS: Record<LayoutDebugElementKind, string> = {
	shell: "#0d9488",
	slot: "#0369a1",
	stack: "#c026d3",
	surface: "#7c3aed",
	named: "#1d4ed8",
	raw: "#ea580c",
};

const LAYOUT_DEBUG_MODE_LABELS: Record<
	Exclude<LayoutDebugMode, "off">,
	string
> = {
	labels: "라벨",
	rulers: "라벨+간격",
};

/** 중첩 깊이별 점선 패턴. 같은 위치에 겹친 링도 대시 리듬으로 구분됩니다. */
const LAYOUT_DEBUG_DASH_PATTERNS_BY_DEPTH = ["8 4", "5 3", "3 3", "1 3"];

const LAYOUT_DEBUG_CHIP_BASE_STYLE: CSSProperties = {
	position: "absolute",
	color: "#ffffff",
	fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
	whiteSpace: "nowrap",
	borderRadius: 3,
};

const LAYOUT_DEBUG_BADGE_STYLE: CSSProperties = {
	position: "fixed",
	right: 12,
	bottom: 12,
	backgroundColor: "rgba(15, 23, 42, 0.85)",
	color: "#e2e8f0",
	fontSize: 11,
	lineHeight: "16px",
	padding: "4px 10px",
	borderRadius: 999,
	border: "1px solid rgba(148, 163, 184, 0.45)",
	fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
	whiteSpace: "nowrap",
};

interface LayoutDebugLabelChipProps {
	top: number;
	left: number;
	text: string;
	color: string;
	subdued?: boolean;
}

function LayoutDebugLabelChip({
	top,
	left,
	text,
	color,
	subdued = false,
}: LayoutDebugLabelChipProps) {
	return (
		<div
			style={{
				...LAYOUT_DEBUG_CHIP_BASE_STYLE,
				top,
				left,
				backgroundColor: color,
				fontSize: LAYOUT_DEBUG_CHIP_FONT_SIZE_PX,
				lineHeight: `${LAYOUT_DEBUG_CHIP_HEIGHT_PX - 2}px`,
				padding: "1px 4px",
				opacity: subdued ? 0.8 : 1,
			}}
		>
			{text}
		</div>
	);
}

/**
 * LayoutDebugOverlay 컴포넌트
 * Alt+Shift+D로 화면 계층을 점선과 라벨로 보여주는 디버그 오버레이입니다.
 * 감시 대상 요소는 전혀 수정하지 않고 body 끝에 별도 레이어를 portal로 렌더합니다.
 * 모드는 off → labels(점선+컴포넌트 라벨) → rulers(+자식 사이 간격 자, 미표기 간격) 로 순환하며
 * localStorage에 저장되어 새로고침에도 유지됩니다.
 */
export const LayoutDebugOverlay = observer(function LayoutDebugOverlay() {
	const state = useLocalObservable(() =>
		createLayoutDebugOverlayState({ persistMode: persistLayoutDebugMode }),
	);

	useEffect(() => {
		state.restoreMode(readPersistedLayoutDebugMode());

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.repeat || !isLayoutDebugShortcut(event)) {
				return;
			}
			event.preventDefault();
			state.cycleMode();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [state]);

	useEffect(() => {
		if (state.mode === "off") {
			state.applyScanResult(null);
			return;
		}

		let scanFrame = 0;
		const scheduleScan = () => {
			window.cancelAnimationFrame(scanFrame);
			scanFrame = window.requestAnimationFrame(() => {
				if (state.mode === "off") {
					return;
				}
				state.applyScanResult(
					scanLayoutDebugDocument(document.body, state.mode),
				);
			});
		};

		// 오버레이 렌더로 인한 DOM 변화는 다시 스캔하지 않습니다(무한 루프 방지).
		const mutationObserver = new MutationObserver((mutations) => {
			const isOverlayOnlyChange = mutations.every((mutation) =>
				isNodeInsideLayoutDebugLayer(mutation.target),
			);
			if (!isOverlayOnlyChange) {
				scheduleScan();
			}
		});
		mutationObserver.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
		});

		const handleViewportChange = () => scheduleScan();
		window.addEventListener("resize", handleViewportChange);
		// Admin.Main처럼 내부 스크롤 컨테이너의 스크롤도 문서 좌표를 바꾸므로 capture로 관찰합니다.
		window.addEventListener("scroll", handleViewportChange, {
			capture: true,
			passive: true,
		});
		// jsdom처럼 ResizeObserver가 없는 환경에서는 생략합니다.
		const resizeObserver =
			typeof ResizeObserver !== "undefined"
				? new ResizeObserver(scheduleScan)
				: null;
		resizeObserver?.observe(document.documentElement);

		scheduleScan();

		return () => {
			window.cancelAnimationFrame(scanFrame);
			mutationObserver.disconnect();
			window.removeEventListener("resize", handleViewportChange);
			window.removeEventListener("scroll", handleViewportChange, true);
			resizeObserver?.disconnect();
		};
	}, [state, state.mode]);

	if (typeof document === "undefined") {
		return null;
	}
	const mode = state.mode;
	const scanResult = state.scanResult;
	if (mode === "off" || !scanResult) {
		return null;
	}

	const layerHeight = Math.max(
		document.documentElement.scrollHeight,
		window.innerHeight,
	);
	const labelChipPlacements = buildLayoutDebugLabelChipPlacements(scanResult);

	return createPortal(
		<div
			aria-hidden="true"
			data-layout-debug-layer=""
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: layerHeight,
				pointerEvents: "none",
				zIndex: 2147483000,
			}}
		>
			<svg
				width="100%"
				height="100%"
				style={{ position: "absolute", top: 0, left: 0, display: "block" }}
			>
				{scanResult.annotations.map((annotation) => {
					const boxInsetPx = getLayoutDebugBoxInsetPx(annotation.depth);
					return (
						<rect
							key={annotation.id}
							x={annotation.rect.left + boxInsetPx + 0.5}
							y={annotation.rect.top + boxInsetPx + 0.5}
							width={Math.max(
								annotation.rect.width - boxInsetPx * 2 - 1,
								0,
							)}
							height={Math.max(
								annotation.rect.height - boxInsetPx * 2 - 1,
								0,
							)}
							fill="none"
							stroke={LAYOUT_DEBUG_KIND_COLORS[annotation.kind]}
							strokeWidth={1}
							strokeDasharray={
								annotation.kind === "raw"
									? "2 4"
									: LAYOUT_DEBUG_DASH_PATTERNS_BY_DEPTH[
											annotation.depth %
												LAYOUT_DEBUG_DASH_PATTERNS_BY_DEPTH.length
										]
							}
							opacity={annotation.kind === "raw" ? 0.55 : 0.9}
						/>
					);
				})}
				{scanResult.rulers.map((ruler) => {
					const rulerColor = ruler.isRaw
						? LAYOUT_DEBUG_KIND_COLORS.raw
						: LAYOUT_DEBUG_KIND_COLORS.stack;
					const tickStart =
						ruler.orientation === "vertical"
							? ruler.rect.top
							: ruler.rect.left;
					const tickEnd =
						ruler.orientation === "vertical"
							? ruler.rect.top + ruler.rect.height
							: ruler.rect.left + ruler.rect.width;
					return (
						<g
							key={ruler.id}
							stroke={rulerColor}
							strokeWidth={1}
							opacity={ruler.isRaw ? 0.7 : 0.9}
						>
							{ruler.orientation === "vertical" ? (
								<>
									<line
										x1={ruler.rect.left}
										x2={ruler.rect.left}
										y1={tickStart}
										y2={tickEnd}
									/>
									<line
										x1={ruler.rect.left - 4}
										x2={ruler.rect.left + 4}
										y1={tickStart}
										y2={tickStart}
									/>
									<line
										x1={ruler.rect.left - 4}
										x2={ruler.rect.left + 4}
										y1={tickEnd}
										y2={tickEnd}
									/>
								</>
							) : (
								<>
									<line
										x1={tickStart}
										x2={tickEnd}
										y1={ruler.rect.top}
										y2={ruler.rect.top}
									/>
									<line
										x1={tickStart}
										x2={tickStart}
										y1={ruler.rect.top - 4}
										y2={ruler.rect.top + 4}
									/>
									<line
										x1={tickEnd}
										x2={tickEnd}
										y1={ruler.rect.top - 4}
										y2={ruler.rect.top + 4}
									/>
								</>
							)}
						</g>
					);
				})}
			</svg>
			{labelChipPlacements.map((chip) => (
				<LayoutDebugLabelChip
					key={chip.id}
					top={chip.top}
					left={chip.left}
					text={chip.text}
					color={LAYOUT_DEBUG_KIND_COLORS[chip.kind]}
					subdued={chip.subdued}
				/>
			))}
			<div style={LAYOUT_DEBUG_BADGE_STYLE}>
				레이아웃 디버그 · {LAYOUT_DEBUG_MODE_LABELS[mode]} · Alt+Shift+D
			</div>
		</div>,
		document.body,
	);
});
