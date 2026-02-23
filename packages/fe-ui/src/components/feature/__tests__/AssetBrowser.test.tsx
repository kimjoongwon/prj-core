import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetBrowser } from "../AssetBrowser/AssetBrowser";
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
		toggleAssetSelection: vi.fn((assetId: string) => {
			if (store.selectedAssetIds.has(assetId)) {
				store.selectedAssetIds.delete(assetId);
			} else {
				store.selectedAssetIds.add(assetId);
			}
		}),
		selectAllAssets: vi.fn(),
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

// Spinner 및 cn 모킹
vi.mock("@heroui/react", () => ({
	Spinner: ({ size }: any) => <div data-testid="spinner" data-size={size}>Loading...</div>,
	cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Asset 타입 정의
interface Asset {
	id: string;
	originalName: string;
	kind: "IMAGE" | "VIDEO" | "DOCUMENT";
	status: "READY" | "UPLOADING" | "FAILED";
	sizeBytes: number;
	spaceId: string;
	folderId: string;
	storageKey: string;
	mimeType: string;
	extension: string | null;
	checksum: string | null;
	metadata: Record<string, unknown> | null;
	creatorId: string | null;
	createdAt: Date | string;
	updatedAt: Date | string;
}

describe("AssetBrowser", () => {
	const user = userEvent.setup();

	const createMockAsset = (overrides?: Partial<Asset>): Asset => ({
		id: "asset-1",
		originalName: "test-image.jpg",
		kind: "IMAGE",
		status: "READY",
		sizeBytes: 1024,
		spaceId: "space-1",
		folderId: "folder-1",
		storageKey: "key-1",
		mimeType: "image/jpeg",
		extension: ".jpg",
		checksum: "abc123",
		metadata: null,
		creatorId: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		...overrides,
	});

	const mockAssets: Asset[] = [
		createMockAsset({ id: "asset-1", originalName: "image1.jpg", kind: "IMAGE", sizeBytes: 1024 }),
		createMockAsset({ id: "asset-2", originalName: "video1.mp4", kind: "VIDEO", sizeBytes: 2048 }),
		createMockAsset({ id: "asset-3", originalName: "doc1.pdf", kind: "DOCUMENT", sizeBytes: 512 }),
	];

	beforeEach(() => {
		vi.clearAllMocks();
		mockStore = createMockAssetStore();
	});

	describe("렌더링", () => {
		it("그리드 뷰에서 에셋 목록이 렌더링되어야 한다", () => {
			// When
			render(<AssetBrowser assets={mockAssets} />);

			// Then
			expect(screen.getByText("image1.jpg")).toBeInTheDocument();
			expect(screen.getByText("video1.mp4")).toBeInTheDocument();
			expect(screen.getByText("doc1.pdf")).toBeInTheDocument();
		});

		it("파일 크기가 포맷팅되어 표시되어야 한다", () => {
			// When
			render(<AssetBrowser assets={mockAssets} />);

			// Then
			expect(screen.getByText("1 KB")).toBeInTheDocument();
			expect(screen.getByText("2 KB")).toBeInTheDocument();
			expect(screen.getByText("512 B")).toBeInTheDocument();
		});

		it("로딩 중이고 에셋이 없으면 스피너가 표시되어야 한다", () => {
			// When
			render(<AssetBrowser assets={[]} isLoading />);

			// Then
			expect(screen.getByTestId("spinner")).toBeInTheDocument();
			expect(screen.getByText("에셋을 불러오는 중...")).toBeInTheDocument();
		});

		it("로딩 중이 아니고 에셋이 없으면 빈 상태가 표시되어야 한다", () => {
			// When
			render(<AssetBrowser assets={[]} isLoading={false} />);

			// Then
			expect(screen.getByText("에셋이 없습니다")).toBeInTheDocument();
			expect(screen.getByText("새로운 에셋을 업로드해 보세요")).toBeInTheDocument();
		});

		it("리스트 뷰에서 에셋 목록이 렌더링되어야 한다", () => {
			// Given
			mockStore.viewMode = "list";

			// When
			render(<AssetBrowser assets={mockAssets} />);

			// Then
			expect(screen.getByText("파일명")).toBeInTheDocument();
			expect(screen.getByText("타입")).toBeInTheDocument();
			expect(screen.getByText("크기")).toBeInTheDocument();
			expect(screen.getByText("날짜")).toBeInTheDocument();
		});
	});

	describe("에셋 선택", () => {
		it("에셋 클릭 시 onAssetClick이 호출되어야 한다", async () => {
			// Given
			const onAssetClick = vi.fn();

			// When
			render(<AssetBrowser assets={mockAssets} onAssetClick={onAssetClick} />);
			await user.click(screen.getByText("image1.jpg"));

			// Then
			expect(onAssetClick).toHaveBeenCalledWith(mockAssets[0]);
		});

		it("Picker 모드에서 에셋 클릭 시 선택이 토글되어야 한다", async () => {
			// Given
			mockStore.pickerMode = true;

			// When
			render(<AssetBrowser assets={mockAssets} pickerMode />);
			await user.click(screen.getByText("image1.jpg"));

			// Then
			expect(mockStore.toggleAssetSelection).toHaveBeenCalledWith("asset-1");
		});

		it("선택된 에셋은 선택 표시가 되어야 한다", () => {
			// Given
			mockStore.selectedAssetIds.add("asset-1");

			// When
			render(<AssetBrowser assets={mockAssets} />);

			// Then
			// 그리드 뷰에서 선택 표시 확인
			expect(screen.getByText("image1.jpg")).toBeInTheDocument();
		});
	});

	describe("이미지 썸네일", () => {
		it("이미지 타입은 썸네일 URL을 표시해야 한다", () => {
			// Given
			const assetWithThumbnail = createMockAsset({
				id: "asset-thumb",
				kind: "IMAGE",
				metadata: { thumbnailUrl: "https://example.com/thumb.jpg" },
			});

			// When
			render(<AssetBrowser assets={[assetWithThumbnail]} />);

			// Then
			const img = screen.getByAltText("test-image.jpg");
			expect(img).toHaveAttribute("src", "https://example.com/thumb.jpg");
		});

		it("메타데이터에 썸네일이 없으면 API URL을 사용해야 한다", () => {
			// Given
			const imageAsset = createMockAsset({ id: "asset-img", kind: "IMAGE", metadata: null });

			// When
			render(<AssetBrowser assets={[imageAsset]} />);

			// Then
			const img = screen.getByAltText("test-image.jpg");
			expect(img).toHaveAttribute("src", "/api/assets/asset-img/file");
		});
	});

	describe("무한 스크롤", () => {
		it("스크롤 시 onLoadMore가 호출되어야 한다", () => {
			// Given
			const onLoadMore = vi.fn();
			const manyAssets = Array.from({ length: 100 }, (_, i) =>
				createMockAsset({ id: `asset-${i}`, originalName: `file-${i}.jpg` })
			);

			// When
			render(<AssetBrowser assets={manyAssets} onLoadMore={onLoadMore} />);
			const scrollContainer = screen.getByText("file-0.jpg").closest("div[class*='overflow']");

			// 스크롤 이벤트 발생
			if (scrollContainer) {
				fireEvent.scroll(scrollContainer, {
					target: {
						scrollHeight: 2000,
						scrollTop: 1900,
						clientHeight: 100,
					},
				});
			}

			// Then
			expect(onLoadMore).toHaveBeenCalled();
		});
	});

	describe("초기 폴더 설정", () => {
		it("initialFolderId가 있으면 Store의 currentFolderId가 설정되어야 한다", () => {
			// When
			render(<AssetBrowser initialFolderId="folder-1" />);

			// Then
			expect(mockStore.setCurrentFolder).toHaveBeenCalledWith("folder-1");
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const customClass = "custom-browser";

			// When
			const { container } = render(<AssetBrowser assets={mockAssets} className={customClass} />);

			// Then
			expect(container.querySelector(".custom-browser")).toBeInTheDocument();
		});
	});

	describe("로딩 상태 표시", () => {
		it("에셋이 있고 로딩 중이면 추가 로딩 스피너가 표시되어야 한다", () => {
			// When
			render(<AssetBrowser assets={mockAssets} isLoading />);

			// Then
			// 이미 에셋이 있으므로 메인 스피너 대신 하단 스피너 표시
			expect(screen.getByTestId("spinner")).toBeInTheDocument();
			expect(screen.getByText("image1.jpg")).toBeInTheDocument();
		});
	});
});
