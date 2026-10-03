import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FolderTreeItem } from "../../domain/asset/AssetBrowser/FolderTree";
import { AssetListScreen, type AssetListScreenProps } from "./AssetListScreen";

vi.mock("../../domain/asset/AssetBrowser", () => ({
	AssetBrowser: () => <section>에셋 브라우저 목업</section>,
	assetBrowserQueryInputs: [],
}));

const folders: FolderTreeItem[] = [{ id: "folder-1", name: "기본 폴더" }];

const screenProps: AssetListScreenProps = {
	folders,
	totalCount: 0,
	queryStates: {
		take: 10,
		skip: 0,
		search: "",
		kind: "",
		status: "",
		folderId: "",
	},
	setQueryStates: async () => new URLSearchParams(),
	isLoading: false,
	isSpaceReady: true,
	hasSelectedSpace: true,
	isRemoving: false,
	isUploadingAsset: false,
	isCreatingFolder: false,
	isUpdatingFolder: false,
	isRemovingFolder: false,
	onUploadAsset: async (_file: File, _folderId: string) => undefined,
	onDeleteAsset: async (_assetId: string) => undefined,
	onCreateFolder: async (_input: { name: string; parentFolderId?: string }) =>
		undefined,
	onRenameFolder: async (_input: { folderId: string; name: string }) =>
		undefined,
	onDeleteFolder: async (_folderId: string) => undefined,
};

describe("AssetListScreen", () => {
	it("에셋 브라우저를 관리 모드로 렌더링한다", () => {
		render(<AssetListScreen {...screenProps} />);

		expect(screen.getByText("에셋 브라우저 목업")).toBeInTheDocument();
	});

	it("브라우저 콘텐츠를 wide 폭 역할 Container로 감싼다", () => {
		render(<AssetListScreen {...screenProps} />);

		const wideContainer = screen
			.getByText("에셋 브라우저 목업")
			.closest("div.max-w-\\[96rem\\]");
		expect(wideContainer).not.toBeNull();
		expect(wideContainer?.className).toContain("mx-auto");
		expect(wideContainer?.className).toContain("w-full");
	});
});
