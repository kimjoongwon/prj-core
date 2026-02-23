import type { AssetKind } from "@cocrepo/prisma";
import { makeAutoObservable } from "mobx";
import type { RootStore } from "./rootStore";

/**
 * Picker 설정 타입
 */
export interface PickerConfig {
	selectionMode: "single" | "multiple";
	allowedTypes?: AssetKind[];
	initialSelection?: string[];
	onSelect?: (assetIds: string[]) => void;
	onClose?: () => void;
}

/**
 * AssetStore - 에셋 관리 UI 상태
 *
 * 에셋 선택기(Picker) 모드, 현재 선택된 폴더, 검색/필터 상태 등을 관리합니다.
 *
 * @example
 * ```typescript
 * const rootStore = new RootStore();
 * rootStore.assetStore = new AssetStore(rootStore);
 *
 * // Picker 모드 진입
 * assetStore.enterPickerMode({
 *   selectionMode: "multiple",
 *   allowedTypes: ["IMAGE"],
 *   onSelect: (ids) => console.log(ids)
 * });
 *
 * // 에셋 선택
 * assetStore.toggleAssetSelection("asset-1");
 * ```
 */
export class AssetStore {
	readonly rootStore: RootStore;

	// ============================================================================
	// Observable State
	// ============================================================================

	/** 현재 선택된 폴더 ID */
	currentFolderId: string | null = null;

	/** 검색어 */
	searchKeyword = "";

	/** 선택된 타입 필터 */
	selectedKind: AssetKind | null = null;

	/** 뷰 모드 */
	viewMode: "grid" | "list" = "grid";

	/** 선택된 에셋 ID 목록 */
	selectedAssetIds: Set<string> = new Set();

	/** Picker 모드 여부 */
	pickerMode = false;

	/** 선택 모드 */
	selectionMode: "single" | "multiple" = "single";

	/** Picker에서 허용할 타입 */
	allowedTypes: AssetKind[] = [];

	/** 업로드 진행 중 여부 */
	isUploading = false;

	/** 업로드 진행률 (0-100) */
	uploadProgress = 0;

	/** Picker 콜백 */
	private onSelectCallback?: (assetIds: string[]) => void;
	private onCloseCallback?: () => void;

	// ============================================================================
	// Constructor
	// ============================================================================

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	// ============================================================================
	// Computed
	// ============================================================================

	/** 선택된 에셋이 있는지 확인 */
	get hasSelection(): boolean {
		return this.selectedAssetIds.size > 0;
	}

	/** 선택된 에셋 개수 */
	get selectionCount(): number {
		return this.selectedAssetIds.size;
	}

	/** 단일 선택 모드 여부 */
	get isSingleSelection(): boolean {
		return this.pickerMode && this.selectionMode === "single";
	}

	/** 다중 선택 모드 여부 */
	get isMultipleSelection(): boolean {
		return this.pickerMode && this.selectionMode === "multiple";
	}

	// ============================================================================
	// Actions - Navigation
	// ============================================================================

	/**
	 * 현재 폴더 설정
	 */
	setCurrentFolder(folderId: string | null): void {
		this.currentFolderId = folderId;
	}

	// ============================================================================
	// Actions - Search & Filter
	// ============================================================================

	/**
	 * 검색어 설정
	 */
	setSearchKeyword(keyword: string): void {
		this.searchKeyword = keyword;
	}

	/**
	 * 타입 필터 설정
	 */
	setSelectedKind(kind: AssetKind | null): void {
		this.selectedKind = kind;
	}

	/**
	 * 뷰 모드 토글
	 */
	toggleViewMode(): void {
		this.viewMode = this.viewMode === "grid" ? "list" : "grid";
	}

	/**
	 * 뷰 모드 설정
	 */
	setViewMode(mode: "grid" | "list"): void {
		this.viewMode = mode;
	}

	// ============================================================================
	// Actions - Selection
	// ============================================================================

	/**
	 * 에셋 선택 (Picker 모드에서 사용)
	 * - 단일 선택 모드: 기존 선택을 해제하고 새로 선택
	 * - 다중 선택 모드: 기존 선택에 추가
	 */
	selectAsset(assetId: string): void {
		if (this.selectionMode === "single") {
			this.selectedAssetIds.clear();
			this.selectedAssetIds.add(assetId);
		} else {
			this.selectedAssetIds.add(assetId);
		}
	}

	/**
	 * 에셋 선택 해제
	 */
	deselectAsset(assetId: string): void {
		this.selectedAssetIds.delete(assetId);
	}

	/**
	 * 에셋 선택 토글
	 */
	toggleAssetSelection(assetId: string): void {
		if (this.selectedAssetIds.has(assetId)) {
			this.selectedAssetIds.delete(assetId);
		} else {
			// 단일 선택 모드에서는 기존 선택을 해제
			if (this.selectionMode === "single") {
				this.selectedAssetIds.clear();
			}
			this.selectedAssetIds.add(assetId);
		}
	}

	/**
	 * 전체 선택 (현재 visible한 에셋 목록 필요)
	 */
	selectAllAssets(assetIds: string[]): void {
		for (const id of assetIds) {
			this.selectedAssetIds.add(id);
		}
	}

	/**
	 * 선택 초기화
	 */
	clearSelection(): void {
		this.selectedAssetIds.clear();
	}

	// ============================================================================
	// Actions - Picker Mode
	// ============================================================================

	/**
	 * Picker 모드 진입
	 */
	enterPickerMode(config: PickerConfig): void {
		this.pickerMode = true;
		this.selectionMode = config.selectionMode;
		this.allowedTypes = config.allowedTypes ?? [];
		this.onSelectCallback = config.onSelect;
		this.onCloseCallback = config.onClose;

		// 초기 선택 설정
		this.selectedAssetIds.clear();
		if (config.initialSelection) {
			for (const id of config.initialSelection) {
				this.selectedAssetIds.add(id);
			}
		}
	}

	/**
	 * Picker 모드 종료
	 */
	exitPickerMode(): void {
		this.pickerMode = false;
		this.allowedTypes = [];
		this.onSelectCallback = undefined;
		this.onCloseCallback = undefined;
		this.selectedAssetIds.clear();
	}

	/**
	 * 선택 완료 (Picker에서 호출)
	 */
	confirmSelection(): void {
		if (this.onSelectCallback) {
			this.onSelectCallback(Array.from(this.selectedAssetIds));
		}
	}

	/**
	 * Picker 취소
	 */
	cancelPicker(): void {
		if (this.onCloseCallback) {
			this.onCloseCallback();
		}
		this.exitPickerMode();
	}

	// ============================================================================
	// Actions - Upload
	// ============================================================================

	/**
	 * 업로드 상태 설정
	 */
	setUploading(isUploading: boolean, progress = 0): void {
		this.isUploading = isUploading;
		this.uploadProgress = progress;
	}

	/**
	 * 업로드 진행률 업데이트
	 */
	updateUploadProgress(progress: number): void {
		this.uploadProgress = progress;
	}

	// ============================================================================
	// Actions - Bulk Operations (API 호출은 외부에서 수행)
	// ============================================================================

	/**
	 * 선택된 에셋 ID 목록 반환
	 */
	getSelectedAssetIds(): string[] {
		return Array.from(this.selectedAssetIds);
	}
}
