import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AssetFilterPanel, type AssetFilters } from "../AssetFilterPanel/AssetFilterPanel";

// HeroUI Select 모킹
vi.mock("@heroui/react", () => ({
	Select: ({ selectedKeys, onSelectionChange, placeholder, children, className, classNames }: any) => (
		<div data-testid="mock-select" className={className}>
			<button
				type="button"
				onClick={() => {
					// "이미지" 옵션 클릭 시 IMAGE 반환
					if (placeholder === "종류") {
						onSelectionChange(new Set(["IMAGE"]));
					} else if (placeholder === "상태") {
						onSelectionChange(new Set(["READY"]));
					}
				}}
			>
				{placeholder}
			</button>
			<div data-testid="selected-keys">
				{selectedKeys ? Array.from(selectedKeys).join(",") : "none"}
			</div>
		</div>
	),
	SelectItem: ({ children }: any) => <div>{children}</div>,
}));

describe("AssetFilterPanel", () => {
	const user = userEvent.setup();
	const defaultFilters: AssetFilters = {
		kind: "all",
		status: "all",
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("렌더링", () => {
		it("종류 필터가 렌더링되어야 한다 (showKindFilter=true)", () => {
			// When
			render(
				<AssetFilterPanel
					filters={defaultFilters}
					onChange={vi.fn()}
					showKindFilter
				/>,
			);

			// Then
			expect(screen.getByText("종류")).toBeInTheDocument();
		});

		it("상태 필터가 렌더링되어야 한다 (showStatusFilter=true)", () => {
			// When
			render(
				<AssetFilterPanel
					filters={defaultFilters}
					onChange={vi.fn()}
					showStatusFilter
				/>,
			);

			// Then
			expect(screen.getByText("상태")).toBeInTheDocument();
		});

		it("showKindFilter=false일 때 종류 필터가 표시되지 않아야 한다", () => {
			// When
			render(
				<AssetFilterPanel
					filters={defaultFilters}
					onChange={vi.fn()}
					showKindFilter={false}
				/>,
			);

			// Then
			expect(screen.queryByText("종류")).not.toBeInTheDocument();
		});

		it("showStatusFilter=false일 때 상태 필터가 표시되지 않아야 한다", () => {
			// When
			render(
				<AssetFilterPanel
					filters={defaultFilters}
					onChange={vi.fn()}
					showStatusFilter={false}
				/>,
			);

			// Then
			expect(screen.queryByText("상태")).not.toBeInTheDocument();
		});
	});

	describe("필터 선택", () => {
		it("선택된 종류 필터가 표시되어야 한다", () => {
			// Given
			const filters: AssetFilters = { kind: "IMAGE", status: "all" };

			// When
			render(<AssetFilterPanel filters={filters} onChange={vi.fn()} />);

			// Then
			const selectedKeys = screen.getAllByTestId("selected-keys")[0];
			expect(selectedKeys).toHaveTextContent("IMAGE");
		});

		it("선택된 상태 필터가 표시되어야 한다", () => {
			// Given
			const filters: AssetFilters = { kind: "all", status: "READY" };

			// When
			render(<AssetFilterPanel filters={filters} onChange={vi.fn()} />);

			// Then
			const selectedKeys = screen.getAllByTestId("selected-keys")[1];
			expect(selectedKeys).toHaveTextContent("READY");
		});

		it("필터가 없으면 'all'이 선택되어야 한다", () => {
			// Given
			const filters: AssetFilters = {};

			// When
			render(<AssetFilterPanel filters={filters} onChange={vi.fn()} />);

			// Then
			const selectedKeys = screen.getAllByTestId("selected-keys");
			expect(selectedKeys[0]).toHaveTextContent("all");
			expect(selectedKeys[1]).toHaveTextContent("all");
		});
	});

	describe("필터 변경", () => {
		it("종류 필터 변경 시 onChange가 호출되어야 한다", async () => {
			// Given
			const onChange = vi.fn();

			// When
			render(
				<AssetFilterPanel
					filters={defaultFilters}
					onChange={onChange}
					showKindFilter
				/>,
			);
			await user.click(screen.getByText("종류"));

			// Then
			expect(onChange).toHaveBeenCalledWith({
				...defaultFilters,
				kind: "IMAGE",
			});
		});

		it("상태 필터 변경 시 onChange가 호출되어야 한다", async () => {
			// Given
			const onChange = vi.fn();

			// When
			render(
				<AssetFilterPanel
					filters={defaultFilters}
					onChange={onChange}
					showStatusFilter
				/>,
			);
			await user.click(screen.getByText("상태"));

			// Then
			expect(onChange).toHaveBeenCalledWith({
				...defaultFilters,
				status: "READY",
			});
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const customClass = "custom-filter";

			// When
			const { container } = render(
				<AssetFilterPanel
					filters={defaultFilters}
					onChange={vi.fn()}
					className={customClass}
				/>,
			);

			// Then
			expect(container.querySelector(".custom-filter")).toBeInTheDocument();
		});
	});
});
