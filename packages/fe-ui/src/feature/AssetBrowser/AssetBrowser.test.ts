import {
	getUploadRequirementMessage,
	isUploadActionDisabled,
} from "./AssetBrowser";

describe("AssetBrowser upload action helpers", () => {
	it("store와 space가 준비되면 폴더 미선택 상태에서도 업로드 버튼은 눌릴 수 있어야 한다", () => {
		expect(
			isUploadActionDisabled({
				isStoreReady: true,
				hasSelectedSpace: true,
				isUploadingAsset: false,
			}),
		).toBe(false);
	});

	it("루트 선택 상태에서는 폴더 선택 안내 메시지를 반환해야 한다", () => {
		expect(getUploadRequirementMessage(null, 3)).toBe(
			"업로드할 폴더를 먼저 선택해주세요.",
		);
	});

	it("폴더가 하나도 없으면 폴더 생성 안내 메시지를 반환해야 한다", () => {
		expect(getUploadRequirementMessage(null, 0)).toBe(
			"업로드하려면 먼저 폴더를 생성해주세요.",
		);
	});

	it("폴더가 선택되어 있으면 안내 메시지가 없어야 한다", () => {
		expect(getUploadRequirementMessage("folder-123", 3)).toBeNull();
	});
});
