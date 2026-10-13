import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useHandlers as useDropdownHandlers } from "./DropdownInput/useHandlers";
import { InputRenderer } from "./InputRenderer";
import * as inputs from "./index";

describe("DataGrid 입력 컴포넌트", () => {
	it("모든 공용 입력 컴포넌트를 내보낸다", () => {
		expect(Object.keys(inputs)).toEqual(
			expect.arrayContaining([
				"ButtonInput",
				"ColumnFilterInput",
				"ColumnResizerInput",
				"ColumnSortInput",
				"ChipGroupInput",
				"DateRangeInput",
				"DropdownInput",
				"InputRenderer",
				"MultiSelectInput",
				"SearchInput",
				"SelectInput",
			]),
		);
	});

	it("입력 렌더러를 통해 검색과 선택 조회 변경을 전달한다", () => {
		const onQueryChange = vi.fn();
		const { rerender } = render(
			<InputRenderer
				config={
					{
						id: "name",
						type: "search",
						label: "Name",
						props: { queryKey: "name" },
					} as never
				}
				queryValues={{}}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Alpha" },
		});
		fireEvent.keyDown(screen.getByLabelText("Name"), { key: "Enter" });
		expect(onQueryChange).toHaveBeenCalledWith({ name: "Alpha", skip: 0 });

		rerender(
			<InputRenderer
				config={
					{
						id: "status",
						type: "select",
						label: "Status",
						props: { options: [{ label: "Active", value: "active" }] },
					} as never
				}
				queryValues={{}}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.change(screen.getByLabelText("Status"), {
			target: { value: "active" },
		});
		expect(onQueryChange).toHaveBeenCalledWith({ status: "active", skip: 0 });
	});

	it("검색 draft를 유지하고 최신 query와 callback을 동기화한다", () => {
		const originalQueryChange = vi.fn();
		const latestQueryChange = vi.fn();
		const config = { id: "name", type: "search", label: "Name" } as const;
		const { rerender } = render(
			<inputs.SearchInput
				config={config}
				queryValues={{ name: "Original" }}
				onQueryChange={originalQueryChange}
			/>,
		);
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "  Draft  " },
		});
		fireEvent.keyDown(screen.getByLabelText("Name"), { key: "Escape" });
		expect(originalQueryChange).not.toHaveBeenCalled();

		rerender(
			<inputs.SearchInput
				config={config}
				queryValues={{ name: "Original" }}
				onQueryChange={latestQueryChange}
			/>,
		);
		expect(screen.getByLabelText("Name")).toHaveValue("  Draft  ");
		fireEvent.keyDown(screen.getByLabelText("Name"), { key: "Enter" });
		expect(latestQueryChange).toHaveBeenLastCalledWith({
			name: "Draft",
			skip: 0,
		});
		expect(originalQueryChange).not.toHaveBeenCalled();

		rerender(
			<inputs.SearchInput
				config={{ ...config, props: { queryKey: "username" } }}
				queryValues={{ username: "External" }}
				onQueryChange={latestQueryChange}
			/>,
		);
		expect(screen.getByLabelText("Name")).toHaveValue("External");
		fireEvent.click(screen.getByLabelText("검색어 지우기"));
		expect(screen.getByLabelText("Name")).toHaveValue("");
		expect(latestQueryChange).toHaveBeenLastCalledWith({
			username: null,
			skip: 0,
		});
		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "   " },
		});
		fireEvent.keyDown(screen.getByLabelText("Name"), { key: "Enter" });
		expect(latestQueryChange).toHaveBeenLastCalledWith({
			username: null,
			skip: 0,
		});
	});

	it("열 필터 입력을 통해 선택 해제와 검색 조회를 전달한다", () => {
		const onQueryChange = vi.fn();
		render(
			<inputs.ColumnFilterInput
				config={{
					id: "status",
					type: "select",
					label: "Status",
					props: {
						queryKey: "accountStatus",
						options: [{ label: "Active", value: "active" }],
					},
				}}
				queryValues={{ accountStatus: "active" }}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.change(screen.getByLabelText("Status"), {
			target: { value: "" },
		});
		expect(onQueryChange).toHaveBeenCalledWith({
			accountStatus: null,
			skip: 0,
		});
	});

	it("단일 칩 선택과 선택 해제 시 페이지 위치를 초기화한다", () => {
		const onQueryChange = vi.fn();
		render(
			<inputs.ChipGroupInput
				config={{
					id: "status",
					type: "chip-group",
					props: {
						options: [
							{ label: "Active", value: "active" },
							{ label: "Disabled", value: "disabled" },
						],
					},
				}}
				queryValues={{ status: "active" }}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Active" }));
		expect(onQueryChange).toHaveBeenLastCalledWith({ status: null, skip: 0 });
		fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
		expect(onQueryChange).toHaveBeenLastCalledWith({
			status: "disabled",
			skip: 0,
		});
	});

	it("다중 칩은 문자열 query를 보존하며 빈 선택은 null로 전달한다", () => {
		const onQueryChange = vi.fn();
		const config = {
			id: "status",
			type: "chip-group" as const,
			props: {
				defaultValue: [],
				options: [
					{ label: "Active", value: "active" },
					{ label: "Disabled", value: "disabled" },
				],
			},
		};
		const { rerender } = render(
			<inputs.ChipGroupInput
				config={config}
				queryValues={{ status: "active" }}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
		expect(onQueryChange).toHaveBeenLastCalledWith({
			status: ["active", "disabled"],
			skip: 0,
		});
		rerender(
			<inputs.ChipGroupInput
				config={config}
				queryValues={{ status: ["active", 1] }}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Active" }));
		expect(onQueryChange).toHaveBeenLastCalledWith({ status: null, skip: 0 });
	});

	it("날짜 범위의 사용자 query key와 비우기 동작을 보존한다", () => {
		const onQueryChange = vi.fn();
		render(
			<inputs.DateRangeInput
				config={{
					id: "period",
					type: "date-range",
					label: "Period",
					props: { queryKeys: { start: "from", end: "to" } },
				}}
				queryValues={{ from: "2026-10-01", to: "2026-10-13" }}
				onQueryChange={onQueryChange}
			/>,
		);
		expect(screen.getByLabelText("Period 시작일")).toHaveValue("2026-10-01");
		fireEvent.change(screen.getByLabelText("Period 시작일"), {
			target: { value: "2026-10-05" },
		});
		expect(onQueryChange).toHaveBeenLastCalledWith({
			from: "2026-10-05",
			skip: 0,
		});
		fireEvent.change(screen.getByLabelText("Period 종료일"), {
			target: { value: "" },
		});
		expect(onQueryChange).toHaveBeenLastCalledWith({ to: null, skip: 0 });
	});

	it("설정에 주입된 버튼 동작을 실행한다", () => {
		const onClick = vi.fn();
		render(
			<inputs.ButtonInput
				config={{
					id: "delete",
					type: "button",
					label: "Delete",
					props: { variant: "solid", color: "danger" },
					handlers: { onClick },
				}}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));
		expect(onClick).toHaveBeenCalledOnce();
	});

	it("다중 선택은 기존 query에서 선택을 추가하고 마지막 선택을 비운다", async () => {
		const onQueryChange = vi.fn();
		const config = {
			id: "status",
			type: "multi-select" as const,
			label: "Status",
			props: {
				options: [
					{ label: "Active", value: "active" },
					{ label: "Disabled", value: "disabled" },
				],
			},
		};
		const { rerender } = render(
			<inputs.MultiSelectInput
				config={config}
				queryValues={{ status: "active" }}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.click(screen.getByText("Status 1"));
		fireEvent.click(await screen.findByRole("checkbox", { name: "Disabled" }));
		expect(onQueryChange).toHaveBeenLastCalledWith({
			status: ["active", "disabled"],
			skip: 0,
		});
		rerender(
			<inputs.MultiSelectInput
				config={config}
				queryValues={{ status: ["active", 1] }}
				onQueryChange={onQueryChange}
			/>,
		);
		fireEvent.click(await screen.findByRole("checkbox", { name: "Active" }));
		expect(onQueryChange).toHaveBeenLastCalledWith({ status: null, skip: 0 });
	});

	it("드롭다운 action은 선택한 항목만 실행하고 없는 key를 무시한다", () => {
		const exportRows = vi.fn();
		const deleteRows = vi.fn();
		const { result } = renderHook(() =>
			useDropdownHandlers({
				config: {
					id: "actions",
					type: "dropdown",
					props: {
						items: [
							{ key: "export", label: "Export", onClick: exportRows },
							{ key: "delete", label: "Delete", onClick: deleteRows },
						],
					},
				},
			}),
		);
		result.current.activateMenuItem("export");
		result.current.activateMenuItem("missing");
		expect(exportRows).toHaveBeenCalledOnce();
		expect(deleteRows).not.toHaveBeenCalled();
	});

	it("열 정렬과 너비 변경 콜백을 상호작용으로 연결한다", () => {
		const onToggle = vi.fn();
		const onColumnSizingChange = vi.fn();
		render(
			<>
				<inputs.ColumnSortInput
					label="Name"
					sortDirection={null}
					onToggle={onToggle}
				/>
				<inputs.ColumnResizerInput
					columnId="name"
					onColumnSizingChange={onColumnSizingChange}
				/>
			</>,
		);
		fireEvent.click(screen.getByLabelText("정렬 변경"));
		fireEvent.doubleClick(screen.getByLabelText("name 컬럼 너비 조절"));
		expect(onToggle).toHaveBeenCalledOnce();
		expect(onColumnSizingChange).toHaveBeenCalledWith("name", null);
	});

	it("열 크기를 제한 범위로 조절하고 pointerup에서 이벤트를 정리한다", () => {
		const onColumnSizingChange = vi.fn();
		render(
			<table>
				<thead>
					<tr>
						<th>
							<inputs.ColumnResizerInput
								columnId="name"
								minSize={80}
								maxSize={200}
								onColumnSizingChange={onColumnSizingChange}
							/>
						</th>
					</tr>
				</thead>
			</table>,
		);
		const resizer = screen.getByLabelText("name 컬럼 너비 조절");
		const headerCell = resizer.closest("th");
		expect(headerCell).not.toBeNull();
		vi.spyOn(headerCell!, "getBoundingClientRect").mockReturnValue({
			width: 100,
		} as DOMRect);
		fireEvent(
			resizer,
			new MouseEvent("pointerdown", { bubbles: true, clientX: 100 }),
		);
		expect(document.body.style.cursor).toBe("col-resize");
		expect(document.body.style.userSelect).toBe("none");
		fireEvent(window, new MouseEvent("pointermove", { clientX: 500 }));
		expect(onColumnSizingChange).toHaveBeenLastCalledWith("name", 200);
		fireEvent(window, new MouseEvent("pointermove", { clientX: 0 }));
		expect(onColumnSizingChange).toHaveBeenLastCalledWith("name", 80);
		fireEvent(window, new MouseEvent("pointermove", { clientX: 125.4 }));
		expect(onColumnSizingChange).toHaveBeenLastCalledWith("name", 125);
		fireEvent(window, new MouseEvent("pointerup"));
		expect(document.body.style.cursor).toBe("");
		expect(document.body.style.userSelect).toBe("");
		onColumnSizingChange.mockClear();
		fireEvent(window, new MouseEvent("pointermove", { clientX: 300 }));
		expect(onColumnSizingChange).not.toHaveBeenCalled();
	});
});
