import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetCard, type AssetCardItem } from "../AssetCard/AssetCard";

// 하위 컴포넌트 모킹
vi.mock("../../ui/data-display/AssetThumbnail/AssetThumbnail", () => ({
	AssetThumbnail: ({ kind, size }: any) => (
		<div data-testid="asset-thumbnail" data-kind={kind} data-size={size}>
			Thumbnail
		</div>
	),
}));

vi.mock("../../ui/data-display/AssetStatusBadge", () => ({
	AssetStatusBadge: ({ status }: any) => (
		<span data-testid="status-badge">{status}</span>
	),
}));

vi.mock("../../ui/data-display/AssetKindBadge", () => ({
	AssetKindBadge: ({ kind }: any) => (
		<span data-testid="kind-badge">{kind}</span>
	),
}));

vi.mock("../../ui/data-display/SizeDisplay/SizeDisplay", () => ({
	SizeDisplay: ({ bytes }: any) => (
		<span data-testid="size-display">{bytes} bytes</span>
	),
}));

vi.mock("../../ui/data-display/SelectionCheckbox/SelectionCheckbox", () => ({
	SelectionCheckbox: ({ checked, onChange }: any) => (
		<input
			type="checkbox"
			checked={checked}
			onChange={(e) => onChange(e.target.checked)}
			data-testid="selection-checkbox"
		/>
	),
}));

describe("AssetCard", () => {
	const user = userEvent.setup();
	const mockAsset: AssetCardItem = {
		id: "asset-1",
		name: "test-image.jpg",
		kind: "IMAGE",
		status: "READY",
		size: 1024,
		thumbnailUrl: "https://example.com/thumb.jpg",
		mimeType: "image/jpeg",
		createdAt: new Date("2024-01-01"),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("렌더링", () => {
		it("에셋 이름이 표시되어야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} />);

			// Then
			expect(screen.getByText("test-image.jpg")).toBeInTheDocument();
		});

		it("썸네일이 렌더링되어야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} />);

			// Then
			expect(screen.getByTestId("asset-thumbnail")).toBeInTheDocument();
		});

		it("상태 뱃지가 표시되어야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} />);

			// Then
			expect(screen.getByTestId("status-badge")).toHaveTextContent("READY");
		});

		it("종류 뱃지가 표시되어야 한다 (showMeta=true)", () => {
			// When
			render(<AssetCard asset={mockAsset} showMeta />);

			// Then
			expect(screen.getByTestId("kind-badge")).toHaveTextContent("IMAGE");
		});

		it("파일 크기가 표시되어야 한다 (showMeta=true)", () => {
			// When
			render(<AssetCard asset={mockAsset} showMeta />);

			// Then
			expect(screen.getByTestId("size-display")).toHaveTextContent("1024 bytes");
		});

		it("showMeta=false일 때 메타 정보가 표시되지 않아야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} showMeta={false} />);

			// Then
			expect(screen.queryByTestId("kind-badge")).not.toBeInTheDocument();
			expect(screen.queryByTestId("size-display")).not.toBeInTheDocument();
		});

		it("showCheckbox=true일 때 체크박스가 표시되어야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} showCheckbox />);

			// Then
			expect(screen.getByTestId("selection-checkbox")).toBeInTheDocument();
		});

		it("showCheckbox=false일 때 체크박스가 표시되지 않아야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} showCheckbox={false} />);

			// Then
			expect(screen.queryByTestId("selection-checkbox")).not.toBeInTheDocument();
		});
	});

	describe("선택 상태", () => {
		it("selected=true일 때 선택 스타일이 적용되어야 한다", () => {
			// When
			const { container } = render(<AssetCard asset={mockAsset} selected />);

			// Then
			const card = container.querySelector(".border-primary");
			expect(card).toBeInTheDocument();
		});

		it("selected=false일 때 기본 스타일이 적용되어야 한다", () => {
			// When
			const { container } = render(<AssetCard asset={mockAsset} selected={false} />);

			// Then
			const card = container.querySelector(".border-divider");
			expect(card).toBeInTheDocument();
		});
	});

	describe("이벤트 핸들러", () => {
		it("카드 클릭 시 onClick이 호출되어야 한다", async () => {
			// Given
			const onClick = vi.fn();

			// When
			render(<AssetCard asset={mockAsset} onClick={onClick} />);
			await user.click(screen.getByText("test-image.jpg"));

			// Then
			expect(onClick).toHaveBeenCalledWith(mockAsset);
		});

		it("체크박스 클릭 시 onSelect가 호출되어야 한다", async () => {
			// Given
			const onSelect = vi.fn();

			// When
			render(<AssetCard asset={mockAsset} onSelect={onSelect} showCheckbox />);
			await user.click(screen.getByTestId("selection-checkbox"));

			// Then
			expect(onSelect).toHaveBeenCalledWith("asset-1", true);
		});

		it("체크박스 클릭 시 카드 클릭 이벤트가 전파되지 않아야 한다", async () => {
			// Given
			const onClick = vi.fn();
			const onSelect = vi.fn();

			// When
			render(
				<AssetCard
					asset={mockAsset}
					onClick={onClick}
					onSelect={onSelect}
					showCheckbox
				/>,
			);
			await user.click(screen.getByTestId("selection-checkbox"));

			// Then
			expect(onClick).not.toHaveBeenCalled();
			expect(onSelect).toHaveBeenCalled();
		});

		it("Enter 키 입력 시 onClick이 호출되어야 한다", async () => {
			// Given
			const onClick = vi.fn();

			// When
			render(<AssetCard asset={mockAsset} onClick={onClick} />);
			const card = screen.getByRole("button");
			card.focus();
			await user.keyboard("{Enter}");

			// Then
			expect(onClick).toHaveBeenCalledWith(mockAsset);
		});
	});

	describe("thumbnailSize prop", () => {
		it("thumbnailSize가 'sm'일 때 썸네일 크기가 'sm'으로 전달되어야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} thumbnailSize="sm" />);

			// Then
			expect(screen.getByTestId("asset-thumbnail")).toHaveAttribute("data-size", "sm");
		});

		it("thumbnailSize가 'lg'일 때 썸네일 크기가 'lg'로 전달되어야 한다", () => {
			// When
			render(<AssetCard asset={mockAsset} thumbnailSize="lg" />);

			// Then
			expect(screen.getByTestId("asset-thumbnail")).toHaveAttribute("data-size", "lg");
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const customClass = "custom-card";

			// When
			const { container } = render(<AssetCard asset={mockAsset} className={customClass} />);

			// Then
			expect(container.querySelector(".custom-card")).toBeInTheDocument();
		});
	});
});
