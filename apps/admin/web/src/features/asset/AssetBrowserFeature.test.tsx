import type { AssetBrowserBindings } from "@cocrepo/hook";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AssetBrowserFeature } from "./AssetBrowserFeature";

const assetBrowserHooks = vi.hoisted(() => ({
	useAssetBrowser: vi.fn(),
	useAssetBrowserData: vi.fn(),
}));

vi.mock("@cocrepo/hook", () => assetBrowserHooks);
vi.mock("@cocrepo/ui", () => ({
	AssetBrowser: ({ isSpaceReady, hasSelectedSpace }: AssetBrowserBindings) => (
		<span>
			{!isSpaceReady
				? "Space 준비 중"
				: !hasSelectedSpace
					? "Space 미선택"
					: "조회 결과"}
		</span>
	),
	AssetListScreen: ({
		isSpaceReady,
		hasSelectedSpace,
	}: AssetBrowserBindings) => (
		<span>
			{!isSpaceReady
				? "Space 준비 중"
				: !hasSelectedSpace
					? "Space 미선택"
					: "조회 결과"}
		</span>
	),
}));

const browserBindings: AssetBrowserBindings = {
	queryStates: {
		take: 20,
		skip: 0,
		search: "",
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

describe("AssetBrowserFeature 공간 준비 gate", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		assetBrowserHooks.useAssetBrowser.mockReturnValue(browserBindings);
		assetBrowserHooks.useAssetBrowserData.mockReturnValue({
			assets: [],
			totalCount: 0,
			folders: [],
		});
	});

	it.each([
		{ isSpaceReady: false, hasSelectedSpace: true, expected: "Space 준비 중" },
		{ isSpaceReady: true, hasSelectedSpace: false, expected: "Space 미선택" },
	])("$expected 상태에서는 Suspense 조회 자식을 mount하지 않는다", (readiness) => {
		assetBrowserHooks.useAssetBrowser.mockReturnValue({
			...browserBindings,
			...readiness,
		});
		render(
			<AssetBrowserFeature
				mode="manage"
				title="에셋 관리"
				description="목록"
			/>,
		);
		expect(screen.getByText(readiness.expected)).toBeInTheDocument();
		expect(assetBrowserHooks.useAssetBrowserData).not.toHaveBeenCalled();
	});

	it("준비된 Space에서만 현재 query와 강제 필터로 조회한다", () => {
		render(
			<AssetBrowserFeature
				mode="picker"
				title="이미지 선택"
				description="대표 이미지"
				forcedKind="IMAGE"
				forcedStatus="READY"
			/>,
		);
		expect(assetBrowserHooks.useAssetBrowserData).toHaveBeenCalledWith({
			queryStates: browserBindings.queryStates,
			forcedKind: "IMAGE",
			forcedStatus: "READY",
		});
		expect(screen.getByText("조회 결과")).toBeInTheDocument();
	});
});
