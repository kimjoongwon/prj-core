import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InputRenderer } from "../InputRenderer";
import * as inputs from "./index";

describe("DataGrid 입력 컴포넌트", () => {
	it("모든 공용 입력 컴포넌트를 내보낸다", () => {
		expect(Object.keys(inputs)).toEqual(expect.arrayContaining([
			"ButtonInput", "ColumnFilterInput", "ColumnResizerInput", "ColumnSortInput",
			"ChipGroupInput", "DateRangeInput", "DropdownInput", "MultiSelectInput", "SearchInput", "SelectInput",
		]));
	});

	it("입력 렌더러를 통해 검색과 선택 조회 변경을 전달한다", () => {
		const onQueryChange = vi.fn();
		const { rerender } = render(
			<InputRenderer config={{ id: "name", type: "search", label: "Name", props: { queryKey: "name" } } as never} queryValues={{}} onQueryChange={onQueryChange} />,
		);
		fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Alpha" } });
		fireEvent.keyDown(screen.getByLabelText("Name"), { key: "Enter" });
		expect(onQueryChange).toHaveBeenCalledWith({ name: "Alpha", skip: 0 });

		rerender(<InputRenderer config={{ id: "status", type: "select", label: "Status", props: { options: [{ label: "Active", value: "active" }] } } as never} queryValues={{}} onQueryChange={onQueryChange} />);
		fireEvent.change(screen.getByLabelText("Status"), { target: { value: "active" } });
		expect(onQueryChange).toHaveBeenCalledWith({ status: "active", skip: 0 });
	});

	it("열 정렬과 너비 변경 콜백을 상호작용으로 연결한다", () => {
		const onToggle = vi.fn();
		const onColumnSizingChange = vi.fn();
		render(<><inputs.ColumnSortInput label="Name" sortDirection={null} onToggle={onToggle} /><inputs.ColumnResizerInput columnId="name" onColumnSizingChange={onColumnSizingChange} /></>);
		fireEvent.click(screen.getByLabelText("정렬 변경"));
		fireEvent.doubleClick(screen.getByLabelText("name 컬럼 너비 조절"));
		expect(onToggle).toHaveBeenCalledOnce();
		expect(onColumnSizingChange).toHaveBeenCalledWith("name", null);
	});
});
