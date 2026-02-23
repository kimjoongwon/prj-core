import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetManager } from "../AssetManager/AssetManager";
import { makeAutoObservable } from "mobx";

// Mock AssetStore 타입
interface MockAssetStore {
	rootStore: unknown;
	currentFolderId: string | null;
	searchKeyword: string;
	selectedKind: string | null;
	viewMode: "grid" | "list";
	selectedAssetIds: Set<string>;
	pickerMode: boolean;
	selectionMode: "single" | "multiple";
	allowedTypes: string[];
	isUploading: boolean;
	uploadProgress: number;
	hasSelection: boolean;
	selectionCount: number;
	isSingleSelection: boolean;
	isMultipleSelection: boolean;
	setCurrentFolder: ReturnType<typeof vi.fn>;
	setSearchKeyword: ReturnType<typeof vi.fn>;
	setSelectedKind: ReturnType<typeof vi.fn>;
	toggleViewMode: ReturnType<typeof vi.fn>;
	setViewMode: ReturnType<typeof vi.fn>;
	selectAsset: ReturnType<typeof vi.fn>;
	deselectAsset: ReturnType<typeof vi.fn>;
	toggleAssetSelection: ReturnType<typeof vi.fn>;
	selectAllAssets: ReturnType<typeof vi.fn>;
	clearSelection: ReturnType<typeof vi.fn>;
	enterPickerMode: ReturnType<typeof vi.fn>;
	exitPickerMode: ReturnType<typeof vi.fn>;
	confirmSelection: ReturnType<typeof vi.fn>;
	cancelPicker: ReturnType<typeof vi.fn>;
	setUploading: ReturnType<typeof vi.fn>;
	updateUploadProgress: ReturnType<typeof vi.fn>;
	getSelectedAssetIds: ReturnType<typeof vi.fn>;
}

// Mock AssetStore 생성
const createMockAssetStore = (): MockAssetStore => {
	const store = makeAutoObservable({
		rootStore: {},
		currentFolderId: null as string | null,
		searchKeyword: "",
		selectedKind: null as string | null,
		viewMode: "grid" as const,
		selectedAssetIds: new Set<string>(),
		pickerMode: false,
		selectionMode: "single" as const,
		allowedTypes: [],
		isUploading: false,
		uploadProgress: 0,
		get hasSelection() {
			return this.selectedAssetIds.size > 0;
		},
		get selectionCount() {
			return this.selectedAssetIds.size;
		},
		get isSingleSelection() {
			return this.pickerMode && this.selectionMode === "single";
		},
		get isMultipleSelection() {
			return this.pickerMode && this.selectionMode === "multiple";
		},
		setCurrentFolder: vi.fn((folderId: string | null) => {
			store.currentFolderId = folderId;
		}),
		setSearchKeyword: vi.fn(),
		setSelectedKind: vi.fn(),
		toggleViewMode: vi.fn(),
		setViewMode: vi.fn((mode: "grid" | "list") => {
			store.viewMode = mode;
		}),
		selectAsset: vi.fn(),
		deselectAsset: vi.fn(),
		toggleAssetSelection: vi.fn(),
		selectAllAssets: vi.fn((assetIds: string[]) => {
			assetIds.forEach((id) => store.selectedAssetIds.add(id));
		}),
		clearSelection: vi.fn(),
		enterPickerMode: vi.fn(),
		exitPickerMode: vi.fn(),
		confirmSelection: vi.fn(),
		cancelPicker: vi.fn(),
		setUploading: vi.fn(),
		updateUploadProgress: vi.fn(),
		getSelectedAssetIds: vi.fn(() => []),
	});
	return store;
};

// Store 모킹 - 모듈 레벨에서 완전히 교체
let mockStore: MockAssetStore;

vi.mock("@cocrepo/store", () => ({
	useAssetStore: () => mockStore,
}));

// 하위 컴포넌트 모킹
vi.mock("../FolderNavigator", () => ({
	FolderNavigator: ({ folders, onFolderSelect }: any) => (
		<div data-testid="folder-navigator">
			{folders?.map((f: any) => (
				<button key={f.id} type="button" onClick={() => onFolderSelect?.(f.id)}>
					{f.name}
				</button>
			))}
		</div>
	),
}));

vi.mock("../AssetBrowser", () => ({
	AssetBrowser: ({ assets, isLoading, onAssetClick }: any) => (
		<div data-testid="asset-browser">
			{isLoading && <span>Loading...</span>}
			{assets?.map((a: any) => (
				<button key={a.id} type="button" onClick={() => onAssetClick?.(a)}>
					{a.originalName}
				</button>
			))}
		</div>
	),
}));

vi.mock("../../widget/SearchFilterBar/SearchFilterBar", () => ({
	SearchFilterBar: ({ searchValue, onSearchChange, placeholder }: any) => (
		<div data-testid="search-filter-bar">
			<input
				type="text"
				value={searchValue}
				onChange={(e) => onSearchChange(e.target.value)}
				placeholder={placeholder}
			/>
		</div>
	),
}));

describe("AssetManager", () => {
	const user = userEvent.setup();

	const mockFolders = [
		{ id: "folder-1", name: "폴더 1", parentId: null },
		{ id: "folder-2", name: "폴더 2", parentId: null },
	];

	const mockAssets = [
		{
			id: "asset-1",
			originalName: "image.jpg",
			kind: "IMAGE" as const,
			status: "READY" as const,
			sizeBytes: 1024,
			spaceId: "space-1",
			folderId: "folder-1",
			storageKey: "key-1",
			mimeType: "image/jpeg",
			extension: ".jpg",
			checksum: "abc123",
			metadata: null,
			creatorId: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		mockStore = createMockAssetStore();
	});

	describe("렌더링", () => {
		it("기본 레이아웃이 렌더링되어야 한다", () => {
			// When
			render(<AssetManager />);

			// Then
			expect(screen.getByTestId("search-filter-bar")).toBeInTheDocument();
			expect(screen.getByTestId("folder-navigator")).toBeInTheDocument();
			expect(screen.getByTestId("asset-browser")).toBeInTheDocument();
		});

		it("폴더 트리가 숨겨져야 한다 (showFolderTree=false)", () => {
			// When
			render(<AssetManager showFolderTree={false} />);

			// Then
			expect(screen.queryByTestId("folder-navigator")).not.toBeInTheDocument();
		});

		it("검색창이 숨겨져야 한다 (showSearch=false)", () => {
			// When
			render(<AssetManager showSearch={false} />);

			// Then
			expect(screen.queryByTestId("search-filter-bar")).not.toBeInTheDocument();
		});

		it("업로드 버튼이 렌더링되어야 한다 (showUploadButton=true)", () => {
			// When
			render(<AssetManager showUploadButton />);

			// Then
			expect(screen.getByText("업로드")).toBeInTheDocument();
		});

		it("업로드 버튼이 숨겨져야 한다 (showUploadButton=false)", () => {
			// When
			render(<AssetManager showUploadButton={false} />);

			// Then
			expect(screen.queryByText("업로드")).not.toBeInTheDocument();
		});

		it("폴더 생성 버튼이 렌더링되어야 한다 (showFolderCreateButton=true)", () => {
			// When
			render(<AssetManager showFolderCreateButton />);

			// Then
			expect(screen.getByText("폴더 생성")).toBeInTheDocument();
		});

		it("폴더 생성 버튼이 숨겨져야 한다 (showFolderCreateButton=false)", () => {
			// When
			render(<AssetManager showFolderCreateButton={false} />);

			// Then
			expect(screen.queryByText("폴더 생성")).not.toBeInTheDocument();
		});

		it("뷰 토글이 렌더링되어야 한다 (showViewToggle=true)", () => {
			// When
			render(<AssetManager showViewToggle />);

			// Then
			expect(screen.getByText("그리드")).toBeInTheDocument();
			expect(screen.getByText("리스트")).toBeInTheDocument();
		});

		it("뷰 토글이 숨겨져야 한다 (showViewToggle=false)", () => {
			// When
			render(<AssetManager showViewToggle={false} />);

			// Then
			expect(screen.queryByText("그리드")).not.toBeInTheDocument();
			expect(screen.queryByText("리스트")).not.toBeInTheDocument();
		});
	});

	describe("폴더 데이터", () => {
		it("폴더 목록이 FolderNavigator에 전달되어야 한다", () => {
			// When
			render(<AssetManager folders={mockFolders} />);

			// Then
			expect(screen.getByText("폴더 1")).toBeInTheDocument();
			expect(screen.getByText("폴더 2")).toBeInTheDocument();
		});
	});

	describe("에셋 데이터", () => {
		it("에셋 목록이 AssetBrowser에 전달되어야 한다", () => {
			// When
			render(<AssetManager assets={mockAssets} />);

			// Then
			expect(screen.getByText("image.jpg")).toBeInTheDocument();
		});

		it("로딩 상태가 AssetBrowser에 전달되어야 한다", () => {
			// When
			render(<AssetManager assets={[]} isLoading />);

			// Then
			expect(screen.getByText("Loading...")).toBeInTheDocument();
		});
	});

	describe("이벤트 핸들러", () => {
		it("업로드 버튼 클릭 시 onUploadClick이 호출되어야 한다", async () => {
			// Given
			const onUploadClick = vi.fn();

			// When
			render(<AssetManager showUploadButton onUploadClick={onUploadClick} />);
			await user.click(screen.getByText("업로드"));

			// Then
			expect(onUploadClick).toHaveBeenCalled();
		});

		it("폴더 생성 버튼 클릭 시 onFolderCreateClick이 호출되어야 한다", async () => {
			// Given
			const onFolderCreateClick = vi.fn();

			// When
			render(<AssetManager showFolderCreateButton onFolderCreateClick={onFolderCreateClick} />);
			await user.click(screen.getByText("폴더 생성"));

			// Then
			expect(onFolderCreateClick).toHaveBeenCalled();
		});

		it("에셋 클릭 시 onAssetClick이 호출되어야 한다", async () => {
			// Given
			const onAssetClick = vi.fn();

			// When
			render(<AssetManager assets={mockAssets} onAssetClick={onAssetClick} />);
			await user.click(screen.getByText("image.jpg"));

			// Then
			expect(onAssetClick).toHaveBeenCalledWith(mockAssets[0]);
		});

		it("검색어 입력 시 Store가 업데이트되어야 한다", async () => {
			// When
			render(<AssetManager showSearch />);
			const input = screen.getByPlaceholderText("에셋 검색...");
			await user.type(input, "test");

			// Then
			expect(mockStore.setSearchKeyword).toHaveBeenCalled();
		});

		it("뷰 모드 변경 시 Store가 업데이트되어야 한다", async () => {
			// When
			render(<AssetManager showViewToggle />);
			await user.click(screen.getByText("리스트"));

			// Then
			expect(mockStore.setViewMode).toHaveBeenCalledWith("list");
		});
	});

	describe("선택 액션 바", () => {
		it("선택된 항목이 있을 때 선택 액션 바가 표시되어야 한다", () => {
			// Given
			mockStore.selectedAssetIds.add("asset-1");

			// When
			render(<AssetManager assets={mockAssets} />);

			// Then
			expect(screen.getByText("1개 선택됨")).toBeInTheDocument();
		});

		it("선택된 항목이 없을 때 선택 액션 바가 표시되지 않아야 한다", () => {
			// When
			render(<AssetManager assets={mockAssets} />);

			// Then
			expect(screen.queryByText("선택됨")).not.toBeInTheDocument();
		});

		it("전체 선택 버튼 클릭 시 모든 에셋이 선택되어야 한다", async () => {
			// Given
			mockStore.selectedAssetIds.add("asset-1");

			// When
			render(<AssetManager assets={mockAssets} />);
			await user.click(screen.getByText("전체 선택"));

			// Then
			expect(mockStore.selectAllAssets).toHaveBeenCalledWith(["asset-1"]);
		});
	});

	describe("초기 폴더 설정", () => {
		it("initialFolderId가 있으면 Store의 currentFolderId가 설정되어야 한다", () => {
			// When
			render(<AssetManager initialFolderId="folder-1" />);

			// Then
			expect(mockStore.setCurrentFolder).toHaveBeenCalledWith("folder-1");
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const customClass = "custom-manager";

			// When
			const { container } = render(<AssetManager className={customClass} />);

			// Then
			expect(container.querySelector(".custom-manager")).toBeInTheDocument();
		});
	});
});
