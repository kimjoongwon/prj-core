import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExpandableCell } from "./ExpandableCell";

describe("ExpandableCell", () => {
	it("renders value correctly", () => {
		render(<ExpandableCell value="Test folder" />);
		expect(screen.getByText("Test folder")).toBeInTheDocument();
	});

	it("renders as expandable folder when canExpand is true", () => {
		render(<ExpandableCell value="Folder" canExpand={true} isExpanded={false} />);
		expect(screen.getByText("Folder")).toBeInTheDocument();
		expect(screen.getByTitle("폴더 닫힘 아이콘")).toBeInTheDocument();
	});

	it("renders as expanded folder when isExpanded is true", () => {
		render(<ExpandableCell value="Folder" canExpand={true} isExpanded={true} />);
		expect(screen.getByText("Folder")).toBeInTheDocument();
		expect(screen.getByTitle("폴더 열림 아이콘")).toBeInTheDocument();
	});

	it("renders as document when canExpand is false", () => {
		render(<ExpandableCell value="Document.pdf" canExpand={false} />);
		expect(screen.getByText("Document.pdf")).toBeInTheDocument();
		expect(screen.getByTitle("문서 아이콘")).toBeInTheDocument();
	});

	it("calls onToggleExpand when expandable folder is clicked", () => {
		const onToggleExpand = vi.fn();
		render(
			<ExpandableCell
				value="Folder"
				canExpand={true}
				isExpanded={false}
				onToggleExpand={onToggleExpand}
			/>
		);
		
		const folderIcon = screen.getByTitle("폴더 닫힘 아이콘").closest("div");
		fireEvent.click(folderIcon!);
		expect(onToggleExpand).toHaveBeenCalledTimes(1);
	});

	it("applies correct padding for nested levels", () => {
		render(<ExpandableCell value="Nested" depth={2} />);
		const container = screen.getByText("Nested").closest("div")?.parentElement;
		expect(container).toHaveStyle({ paddingLeft: "4rem" });
	});

	it("renders without expansion functionality when expandable is false", () => {
		render(<ExpandableCell value="Simple text" expandable={false} />);
		expect(screen.getByText("Simple text")).toBeInTheDocument();
		expect(screen.getByTitle("문서 아이콘")).toBeInTheDocument();
	});

	it("renders connection lines for nested items", () => {
		render(<ExpandableCell value="Nested item" depth={1} />);
		const container = screen.getByText("Nested item").closest("div")?.parentElement;
		const connectionLines = container?.querySelectorAll(".border-l, .border-t");
		expect(connectionLines?.length).toBeGreaterThan(0);
	});

	it("does not render connection lines for root level items", () => {
		render(<ExpandableCell value="Root item" depth={0} />);
		const container = screen.getByText("Root item").closest("div")?.parentElement;
		const connectionLines = container?.querySelectorAll(".border-l, .border-t");
		expect(connectionLines?.length).toBe(0);
	});

	it("handles string values correctly", () => {
		render(<ExpandableCell value="String value" />);
		expect(screen.getByText("String value")).toBeInTheDocument();
	});

	it("handles number values correctly", () => {
		render(<ExpandableCell value={123} />);
		expect(screen.getByText("123")).toBeInTheDocument();
	});

	it("applies hover styles to expandable folders", () => {
		render(<ExpandableCell value="Folder" canExpand={true} />);
		const folderContainer = screen.getByTitle("폴더 닫힘 아이콘").closest("div");
		expect(folderContainer).toHaveClass("hover:text-yellow-600", "hover:bg-yellow-50");
	});

	it("has cursor pointer for expandable folders", () => {
		render(<ExpandableCell value="Folder" canExpand={true} />);
		const folderContainer = screen.getByTitle("폴더 닫힘 아이콘").closest("div");
		expect(folderContainer).toHaveStyle({ cursor: "pointer" });
	});

	it("does not have cursor pointer for documents", () => {
		render(<ExpandableCell value="Document" canExpand={false} />);
		const documentContainer = screen.getByTitle("문서 아이콘").closest("div");
		expect(documentContainer).not.toHaveStyle({ cursor: "pointer" });
	});
});