import { makeAutoObservable } from "mobx";
import type {
	LayoutDebugMode,
	LayoutDebugScanResult,
} from "./layoutDebugScan";

/** 디버그 모드 순환 순서입니다. */
export const LAYOUT_DEBUG_MODE_ORDER: readonly LayoutDebugMode[] = [
	"off",
	"labels",
	"rulers",
];

export const LAYOUT_DEBUG_MODE_STORAGE_KEY = "@cocrepo/ui.layout-debug-mode";

const layoutDebugModeValues = new Set<string>(LAYOUT_DEBUG_MODE_ORDER);

/** 저장된 값이 유효한 디버그 모드인지 판별해 반환합니다. */
export function parseLayoutDebugMode(
	value: string | null | undefined,
): LayoutDebugMode | null {
	return typeof value === "string" && layoutDebugModeValues.has(value)
		? (value as LayoutDebugMode)
		: null;
}

export interface LayoutDebugOverlayStateConfig {
	/** 마운트 복원 없이 초기 모드를 지정할 때 사용합니다. */
	initialMode?: LayoutDebugMode;
	/** 모드 순환 시 호출되는 지속화 콜백(기본: 없음). */
	persistMode?: (mode: LayoutDebugMode) => void;
}

/** LayoutDebugOverlay의 토글 상태와 스캔 결과를 관리합니다. */
export interface LayoutDebugOverlayState {
	mode: LayoutDebugMode;
	/** 최근 스캔 결과. 모드가 off이면 null입니다. */
	scanResult: LayoutDebugScanResult | null;
	/** 다음 모드로 순환하고 지속화 콜백에 전달합니다. */
	cycleMode(): LayoutDebugMode;
	/** 새로고침 직후 저장된 모드를 복원합니다. 지속화하지 않습니다. */
	restoreMode(mode: LayoutDebugMode): void;
	applyScanResult(scanResult: LayoutDebugScanResult | null): void;
}

export function createLayoutDebugOverlayState(
	config: LayoutDebugOverlayStateConfig = {},
): LayoutDebugOverlayState {
	const state = {
		mode: config.initialMode ?? "off",
		scanResult: null as LayoutDebugScanResult | null,
		cycleMode(): LayoutDebugMode {
			const currentIndex = LAYOUT_DEBUG_MODE_ORDER.indexOf(this.mode);
			const nextMode =
				LAYOUT_DEBUG_MODE_ORDER[
					(currentIndex + 1) % LAYOUT_DEBUG_MODE_ORDER.length
				];
			this.mode = nextMode;
			if (nextMode === "off") {
				this.scanResult = null;
			}
			config.persistMode?.(nextMode);
			return nextMode;
		},
		restoreMode(mode: LayoutDebugMode) {
			this.mode = mode;
			if (mode === "off") {
				this.scanResult = null;
			}
		},
		applyScanResult(scanResult: LayoutDebugScanResult | null) {
			this.scanResult = scanResult;
		},
	};

	return makeAutoObservable(state, undefined, {
		autoBind: true,
		name: "LayoutDebugOverlayState",
	});
}
