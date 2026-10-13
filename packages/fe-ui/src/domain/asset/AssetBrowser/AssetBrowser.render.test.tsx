import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DataGridState } from "../../../data-grid";
import {
	AssetBrowser,
	type AssetBrowserAsset,
	type AssetBrowserProps,
} from "./AssetBrowser";
import type { FolderTreeProps } from "./FolderTree";

vi.mock("../../../data-grid", async (importOriginal) => {
	const dataGrid = await importOriginal<typeof import("../../../data-grid")>();
	return {
		...dataGrid,
		DataGrid: ({ state }: { state: DataGridState<AssetBrowserAsset> }) => (
			<section>
				{state.table.rows.map((asset) => (
					<span key={asset.id}>{asset.originalName}</span>
				))}
				<output data-testid="asset-query">
					{String(state.query.filters.search)}
				</output>
				<output data-testid="asset-pagination">
					{state.query.pagination.skip}/{state.pagination.totalCount}
				</output>
			</section>
		),
	};
});

vi.mock("./FolderTree", () => ({
	FolderTree: ({ folders }: FolderTreeProps) => (
		<aside>
			{folders.map((folder) => (
				<span key={folder.id}>{folder.name}</span>
			))}
		</aside>
	),
}));

const originalAsset: AssetBrowserAsset = {
	id: "1",
	spaceId: "1",
	folderId: "1",
	kind: "IMAGE",
	status: "READY",
	originalName: "Original image",
	storageKey: "original-image",
	extension: "png",
	checksum: null,
	metadata: null,
	createdById: null,
	mimeType: "image/png",
	publicUrl: "https://example.com/original.png",
	sizeBytes: 128,
	createdAt: "2026-10-13T00:00:00.000Z",
	updatedAt: "2026-10-13T00:00:00.000Z",
};

const browserProps: AssetBrowserProps = {
	mode: "manage",
	title: "에셋 관리",
	description: "에셋 목록",
	assets: [originalAsset],
	totalCount: 1,
	folders: [{ id: "1", name: "Original folder" }],
	queryStates: {
		take: 20,
		skip: 0,
		search: "original",
		kind: "",
		status: "",
		folderId: "",
	},
	setQueryStates: async () => new URLSearchParams(),
	isSpaceReady: true,
	hasSelectedSpace: true,
	isRemoving: false,
	isUploadingAsset: false,
	isCreatingFolder: false,
	isUpdatingFolder: false,
	isRemovingFolder: false,
	onUploadAsset: async () => undefined,
	onDeleteAsset: async () => undefined,
	onCreateFolder: async () => undefined,
	onRenameFolder: async () => undefined,
	onDeleteFolder: async () => undefined,
};

describe("AssetBrowser 응답 렌더링", () => {
	it("query·에셋 응답·count가 바뀌면 첫 렌더부터 새 상태를 표시한다", () => {
		const { rerender } = render(<AssetBrowser {...browserProps} />);
		expect(screen.getByText("Original image")).toBeInTheDocument();
		expect(screen.getByTestId("asset-query")).toHaveTextContent("original");
		expect(screen.getByTestId("asset-pagination")).toHaveTextContent("0/1");

		rerender(
			<AssetBrowser
				{...browserProps}
				assets={[{ ...originalAsset, id: "2", originalName: "Updated image" }]}
				folders={[{ id: "2", name: "Updated folder" }]}
				totalCount={43}
				queryStates={{
					...browserProps.queryStates,
					search: "updated",
					skip: 20,
				}}
			/>,
		);
		expect(screen.queryByText("Original image")).not.toBeInTheDocument();
		expect(screen.getByText("Updated image")).toBeInTheDocument();
		expect(screen.getByText("Updated folder")).toBeInTheDocument();
		expect(screen.getByTestId("asset-query")).toHaveTextContent("updated");
		expect(screen.getByTestId("asset-pagination")).toHaveTextContent("20/43");
	});

	it("Space가 선택되지 않으면 기존 안내를 표시한다", () => {
		render(<AssetBrowser {...browserProps} hasSelectedSpace={false} />);
		expect(
			screen.getByText("Space를 선택하면 에셋을 조회할 수 있습니다"),
		).toBeInTheDocument();
		expect(screen.queryByText("Original image")).not.toBeInTheDocument();
	});
});
