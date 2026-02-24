import { makeAutoObservable } from "mobx";
import type { RootStore } from "./rootStore";

/**
 * AlbumStore - 앨범 관리 UI 상태
 *
 * 앨범 편집 모드, 에셋 추가/제거, 순서 변경 등의 상태를 관리합니다.
 *
 * @example
 * ```typescript
 * const rootStore = new RootStore();
 * rootStore.albumStore = new AlbumStore(rootStore);
 *
 * // 앨범 조회 모드 진입
 * albumStore.setCurrentAlbum("album-1");
 *
 * // 순서 편집 모드 토글
 * albumStore.toggleReorderMode();
 *
 * // 엔트리 선택
 * albumStore.toggleEntrySelection("entry-1");
 * ```
 */
export class AlbumStore {
	readonly rootStore: RootStore;

	// ============================================================================
	// Observable State
	// ============================================================================

	/** 현재 조회 중인 앨범 ID */
	currentAlbumId: string | null = null;

	/** 순서 편집 모드 여부 */
	isReorderMode = false;

	/** 선택된 엔트리 ID 목록 */
	selectedEntryIds: Set<string> = new Set();

	/** 에셋 추가 모달 열림 여부 */
	isAddAssetModalOpen = false;

	/** 앨범 편집 모달 열림 여부 */
	isEditAlbumModalOpen = false;

	/** 캡션 편집 중인 엔트리 ID */
	editingEntryId: string | null = null;

	/** 앨범 내 에셋 검색어 */
	searchKeyword = "";

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

	/** 선택된 엔트리가 있는지 확인 */
	get hasSelection(): boolean {
		return this.selectedEntryIds.size > 0;
	}

	/** 선택된 엔트리 개수 */
	get selectionCount(): number {
		return this.selectedEntryIds.size;
	}

	/** 앨범 조회 중인지 확인 */
	get isViewingAlbum(): boolean {
		return this.currentAlbumId !== null;
	}

	// ============================================================================
	// Actions - Album Navigation
	// ============================================================================

	/**
	 * 현재 앨범 설정
	 */
	setCurrentAlbum(albumId: string | null): void {
		this.currentAlbumId = albumId;
		// 앨범 변경 시 관련 상태 초기화
		this.clearSelection();
		this.isReorderMode = false;
		this.editingEntryId = null;
	}

	// ============================================================================
	// Actions - Reorder Mode
	// ============================================================================

	/**
	 * 순서 편집 모드 토글
	 */
	toggleReorderMode(): void {
		this.isReorderMode = !this.isReorderMode;
		// 편집 모드 종료 시 선택 초기화
		if (!this.isReorderMode) {
			this.clearSelection();
		}
	}

	// ============================================================================
	// Actions - Entry Selection
	// ============================================================================

	/**
	 * 엔트리 선택
	 */
	selectEntry(entryId: string): void {
		this.selectedEntryIds.add(entryId);
	}

	/**
	 * 엔트리 선택 해제
	 */
	deselectEntry(entryId: string): void {
		this.selectedEntryIds.delete(entryId);
	}

	/**
	 * 엔트리 선택 토글
	 */
	toggleEntrySelection(entryId: string): void {
		if (this.selectedEntryIds.has(entryId)) {
			this.selectedEntryIds.delete(entryId);
		} else {
			this.selectedEntryIds.add(entryId);
		}
	}

	/**
	 * 선택 초기화
	 */
	clearSelection(): void {
		this.selectedEntryIds.clear();
	}

	// ============================================================================
	// Actions - Modals
	// ============================================================================

	/**
	 * 에셋 추가 모달 열기
	 */
	openAddAssetModal(): void {
		this.isAddAssetModalOpen = true;
	}

	/**
	 * 에셋 추가 모달 닫기
	 */
	closeAddAssetModal(): void {
		this.isAddAssetModalOpen = false;
	}

	/**
	 * 앨범 편집 모달 열기
	 */
	openEditAlbumModal(): void {
		this.isEditAlbumModalOpen = true;
	}

	/**
	 * 앨범 편집 모달 닫기
	 */
	closeEditAlbumModal(): void {
		this.isEditAlbumModalOpen = false;
	}

	// ============================================================================
	// Actions - Caption Editing
	// ============================================================================

	/**
	 * 캡션 편집 시작
	 */
	startEditCaption(entryId: string): void {
		this.editingEntryId = entryId;
	}

	/**
	 * 캡션 편집 종료
	 */
	finishEditCaption(): void {
		this.editingEntryId = null;
	}

	// ============================================================================
	// Actions - Search
	// ============================================================================

	/**
	 * 검색어 설정
	 */
	setSearchKeyword(keyword: string): void {
		this.searchKeyword = keyword;
	}

	// ============================================================================
	// Actions - Bulk Operations (API 호출은 외부에서 수행)
	// ============================================================================

	/**
	 * 선택된 엔트리 ID 목록 반환
	 */
	getSelectedEntryIds(): string[] {
		return Array.from(this.selectedEntryIds);
	}
}
