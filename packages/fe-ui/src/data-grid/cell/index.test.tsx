import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as cells from "./index";

describe("DataGrid 셀 컴포넌트", () => {
	it("모든 공용 셀 컴포넌트를 내보낸다", () => {
		expect(Object.keys(cells)).toEqual(expect.arrayContaining([
			"ActionButtonCell", "BooleanCell", "ChipCell", "DateTimeCell", "DefaultCell", "EditorCell", "ExpiryCell", "HierarchyCell", "InputCell", "LinkCell", "NameCell", "PhoneCell", "ProfileAvatarCell", "RowActionsCell", "SelectionCell", "SwitchCell", "TimeRemainingCell",
		]));
	});

	it("값 대체 표시와 선택 변경 전달을 처리한다", () => {
		const onSelectionChange = vi.fn();
		render(<table><tbody><tr><cells.SelectionCell entity="row" rowKey="row-1" isSelected={false} selectionMode="multiple" onSelectionChange={onSelectionChange} /></tr></tbody></table>);
		fireEvent.click(screen.getByLabelText("행 선택"));
		expect(onSelectionChange).toHaveBeenCalledWith("row-1", true);
	});

	it("불리언과 링크 셀의 표시 분기를 렌더링한다", () => {
		const { rerender } = render(<cells.BooleanCell value={true} trueLabel="Enabled" falseLabel="Disabled" />);
		expect(screen.getByText("Enabled")).toBeInTheDocument();
		rerender(<cells.LinkCell href="/rows/1">Row link</cells.LinkCell>);
		expect(screen.getByRole("link", { name: "Row link" })).toHaveAttribute("href", "/rows/1");
	});
});
