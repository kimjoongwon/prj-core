import { render, screen } from "@testing-library/react";
import {
	AssetPreview,
	getAssetPreviewMode,
	getAssetPreviewStatusMessage,
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

	it("공개 URL이 없으면 프리뷰 제한 메시지를 보여줘야 한다", () => {
		render(
			<AssetPreview
				asset={{
					...baseAsset,
					publicUrl: null,
				}}
			/>,
		);

		expect(
			screen.getByText("지금은 인라인 미리보기를 열 수 없습니다."),
		).toBeInTheDocument();
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

	it("공개 URL이 없으면 안내 메시지에 공개 URL 필요성을 포함해야 한다", () => {
		expect(
			getAssetPreviewStatusMessage({
				...baseAsset,
				publicUrl: null,
			}),
		).toContain("공개 URL");
	});
});
