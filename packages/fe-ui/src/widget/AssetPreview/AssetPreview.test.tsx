import { render, screen } from "@testing-library/react";
import {
	AssetPreview,
	getAssetPreviewMode,
	getAssetPreviewStatusMessage,
	getAssetPreviewUrl,
} from "./AssetPreview";

const baseAsset = {
	id: "asset-1",
	originalName: "banner.png",
	kind: "IMAGE" as const,
	status: "READY" as const,
	mimeType: "image/png",
	sizeBytes: 2457600,
	publicUrl: "https://cdn.example.com/banner.png",
};

describe("AssetPreview", () => {
	it("이미지 에셋은 img 태그로 렌더링해야 한다", () => {
		render(<AssetPreview asset={baseAsset} />);

		expect(screen.getByRole("img", { name: "banner.png" })).toBeInTheDocument();
	});

	it("PDF 문서는 iframe 뷰어를 렌더링해야 한다", () => {
		render(
			<AssetPreview
				asset={{
					...baseAsset,
					kind: "DOCUMENT",
					originalName: "guide.pdf",
					mimeType: "application/pdf",
					publicUrl: "https://cdn.example.com/guide.pdf",
				}}
			/>,
		);

		expect(screen.getByTitle("guide.pdf PDF preview")).toBeInTheDocument();
	});

	it("공개 URL이 없어도 인증 프록시 URL로 이미지를 렌더링해야 한다", () => {
		render(
			<AssetPreview
				asset={{
					...baseAsset,
					publicUrl: null,
				}}
			/>,
		);

		expect(screen.getByRole("img", { name: "banner.png" })).toHaveAttribute(
			"src",
			"/api/v1/assets/asset-1/content",
		);
	});
});

describe("AssetPreview helpers", () => {
	it("문서지만 PDF가 아니면 unsupported 모드를 반환해야 한다", () => {
		expect(
			getAssetPreviewMode({
				...baseAsset,
				kind: "DOCUMENT",
				mimeType:
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				publicUrl: "https://cdn.example.com/report.xlsx",
			}),
		).toBe("unsupported");
	});

	it("공개 URL이 없어도 READY 상태면 프록시 URL을 반환해야 한다", () => {
		expect(
			getAssetPreviewUrl({
				...baseAsset,
				publicUrl: null,
			}),
		).toBe("/api/v1/assets/asset-1/content");
	});

	it("업로드 중이면 안내 메시지와 함께 프리뷰 URL이 없어야 한다", () => {
		expect(
			getAssetPreviewStatusMessage({
				...baseAsset,
				status: "UPLOADING",
				publicUrl: null,
			}),
		).toContain("업로드");
		expect(
			getAssetPreviewUrl({
				...baseAsset,
				status: "UPLOADING",
				publicUrl: null,
			}),
		).toBeNull();
	});
});
