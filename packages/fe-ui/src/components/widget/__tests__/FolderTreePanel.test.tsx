import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FolderTreePanel, type FolderTreeItem } from "../FolderTreePanel/FolderTreePanel";

describe("FolderTreePanel", () => {
	const user = userEvent.setup();
	const mockFolders: FolderTreeItem[] = [
		{
			id: "folder-1",
			name: "폴더 1",
			path: "/폴더 1",
			parentId: null,
			children: [
				{
					id: "folder-1-1",
					name: "하위 폴더 1-1",
					path: "/폴더 1/하위 폴더 1-1",
					parentId: "folder-1",
				},
			],
		},
		{
			id: "folder-2",
			name: "폴더 2",
			path: "/폴더 2",
			parentId: null,
		},
	];

	const defaultProps = {
		folders: mockFolders,
		expandedFolderIds: new Set<string>(),
		onSelect: vi.fn(),
		onExpand: vi.fn(),
		onCollapse: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("렌더링", () => {
		it("폴더 목록이 렌더링되어야 한다", () => {
			// When
			render(<FolderTreePanel {...defaultProps} />);

			// Then
			expect(screen.getByText("폴더 1")).toBeInTheDocument();
			expect(screen.getByText("폴더 2")).toBeInTheDocument();
		});

		it("빈 폴더 목록일 때 안내 메시지가 표시되어야 한다", () => {
			// When
			render(<FolderTreePanel {...defaultProps} folders={[]} />);

			// Then
			expect(screen.getByText("폴더가 없습니다")).toBeInTheDocument();
		});

		it("헤더에 '폴더' 텍스트가 표시되어야 한다", () => {
			// When
			render(<FolderTreePanel {...defaultProps} />);

			// Then
			expect(screen.getByText("폴더")).toBeInTheDocument();
		});

		it("showCreateButton=true일 때 폴더 생성 버튼이 표시되어야 한다", () => {
			// Given
			const onCreate = vi.fn();

			// When
			render(<FolderTreePanel {...defaultProps} onCreate={onCreate} showCreateButton />);

			// Then
			expect(screen.getByLabelText("폴더 생성")).toBeInTheDocument();
		});

		it("showCreateButton=false일 때 폴더 생성 버튼이 표시되지 않아야 한다", () => {
			// When
			render(<FolderTreePanel {...defaultProps} showCreateButton={false} />);

			// Then
			expect(screen.queryByLabelText("폴더 생성")).not.toBeInTheDocument();
		});

		it("onCreate가 없으면 폴더 생성 버튼이 표시되지 않아야 한다", () => {
			// When
			render(<FolderTreePanel {...defaultProps} showCreateButton />);

			// Then
			expect(screen.queryByLabelText("폴더 생성")).not.toBeInTheDocument();
		});
	});

	describe("폴더 선택", () => {
		it("폴더 클릭 시 onSelect가 호출되어야 한다", async () => {
			// Given
			const onSelect = vi.fn();

			// When
			render(<FolderTreePanel {...defaultProps} onSelect={onSelect} />);
			await user.click(screen.getByText("폴더 1"));

			// Then
			expect(onSelect).toHaveBeenCalledWith("folder-1");
		});

		it("선택된 폴더는 하이라이트 스타일이 적용되어야 한다", () => {
			// When
			render(<FolderTreePanel {...defaultProps} selectedFolderId="folder-1" />);

			// Then
			const selectedFolder = screen.getByText("폴더 1").closest("div");
			expect(selectedFolder).toHaveClass("bg-primary/10");
		});

		it("Enter 키로 폴더를 선택할 수 있어야 한다", async () => {
			// Given
			const onSelect = vi.fn();

			// When
			render(<FolderTreePanel {...defaultProps} onSelect={onSelect} />);
			const folderButton = screen.getByText("폴더 1").closest('[role="button"]');
			folderButton?.focus();
			await user.keyboard("{Enter}");

			// Then
			expect(onSelect).toHaveBeenCalledWith("folder-1");
		});
	});

	describe("폴더 확장/축소", () => {
		it("확장된 폴더의 하위 폴더가 표시되어야 한다", () => {
			// Given
			const expandedIds = new Set(["folder-1"]);

			// When
			render(<FolderTreePanel {...defaultProps} expandedFolderIds={expandedIds} />);

			// Then
			expect(screen.getByText("하위 폴더 1-1")).toBeInTheDocument();
		});

		it("축소된 폴더의 하위 폴더는 표시되지 않아야 한다", () => {
			// When
			render(<FolderTreePanel {...defaultProps} />);

			// Then
			expect(screen.queryByText("하위 폴더 1-1")).not.toBeInTheDocument();
		});

		it("토글 버튼 클릭 시 onExpand가 호출되어야 한다", async () => {
			// Given
			const onExpand = vi.fn();

			// When
			render(<FolderTreePanel {...defaultProps} onExpand={onExpand} />);
			const toggleButton = screen.getByText("폴더 1").parentElement?.querySelector("button");
			await user.click(toggleButton!);

			// Then
			expect(onExpand).toHaveBeenCalledWith("folder-1");
		});

		it("확장된 폴더에서 토글 버튼 클릭 시 onCollapse가 호출되어야 한다", async () => {
			// Given
			const onCollapse = vi.fn();
			const expandedIds = new Set(["folder-1"]);

			// When
			render(
				<FolderTreePanel
					{...defaultProps}
					expandedFolderIds={expandedIds}
					onCollapse={onCollapse}
				/>,
			);
			const toggleButton = screen.getByText("폴더 1").parentElement?.querySelector("button");
			await user.click(toggleButton!);

			// Then
			expect(onCollapse).toHaveBeenCalledWith("folder-1");
		});
	});

	describe("폴더 생성", () => {
		it("생성 버튼 클릭 시 prompt가 호출되어야 한다", async () => {
			// Given
			const onCreate = vi.fn();
			const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("새 폴더");

			// When
			render(<FolderTreePanel {...defaultProps} onCreate={onCreate} showCreateButton />);
			await user.click(screen.getByLabelText("폴더 생성"));

			// Then
			expect(promptSpy).toHaveBeenCalledWith("폴더명을 입력하세요");
			expect(onCreate).toHaveBeenCalledWith(null, "새 폴더");

			promptSpy.mockRestore();
		});

		it("prompt에서 취소 시 onCreate가 호출되지 않아야 한다", async () => {
			// Given
			const onCreate = vi.fn();
			const promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);

			// When
			render(<FolderTreePanel {...defaultProps} onCreate={onCreate} showCreateButton />);
			await user.click(screen.getByLabelText("폴더 생성"));

			// Then
			expect(onCreate).not.toHaveBeenCalled();

			promptSpy.mockRestore();
		});

		it("선택된 폴더가 있으면 해당 폴더 하위에 생성해야 한다", async () => {
			// Given
			const onCreate = vi.fn();
			const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("새 폴더");

			// When
			render(
				<FolderTreePanel
					{...defaultProps}
					selectedFolderId="folder-1"
					onCreate={onCreate}
					showCreateButton
				/>,
			);
			await user.click(screen.getByLabelText("폴더 생성"));

			// Then
			expect(onCreate).toHaveBeenCalledWith("folder-1", "새 폴더");

			promptSpy.mockRestore();
		});
	});

	describe("width prop", () => {
		it("width가 적용되어야 한다", () => {
			// Given
			const width = 300;

			// When
			const { container } = render(<FolderTreePanel {...defaultProps} width={width} />);

			// Then
			const panel = container.querySelector("aside");
			expect(panel).toHaveStyle({ width: "300px" });
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const customClass = "custom-panel";

			// When
			const { container } = render(<FolderTreePanel {...defaultProps} className={customClass} />);

			// Then
			expect(container.querySelector(".custom-panel")).toBeInTheDocument();
		});
	});
});
