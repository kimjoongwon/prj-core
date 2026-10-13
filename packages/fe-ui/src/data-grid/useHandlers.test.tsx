import {
	act,
	fireEvent,
	render,
	renderHook,
	screen,
} from "@testing-library/react";
import { autorun, isObservable, runInAction } from "mobx";
import { describe, expect, it, vi } from "vitest";
import { createDataGridState, DataGrid, type DataGridState } from "./DataGrid";
import { useHandlers as usePaginationHandlers } from "./DataGridPagination/useHandlers";
import { useHandlers as useTableHandlers } from "./DataGridTable/useHandlers";
import {
	addRow,
	clearChanges,
	combineRowsWithChanges,
	deleteRow,
	getChangesSnapshot,
	getRow,
	parseQuery,
	setValue,
	updateQuery,
	useHandlers,
} from "./useHandlers";

type Employee = { id: string; name: string; department: string };
const originalEmployee: Employee = {
	id: "employee-1",
	name: "김민서",
	department: "플랫폼",
};
const createEmployeeState = () => {
	const querySetter = vi.fn(async () => new URLSearchParams());
	return {
		querySetter,
		state: createDataGridState<Employee>({
			query: { take: 10, skip: 0 },
			setQueryStates: querySetter,
			pagination: { totalCount: 50 },
			table: {
				rows: [originalEmployee],
				columns: [
					{ accessorKey: "name", header: "이름" },
					{ accessorKey: "department", header: "부서" },
				],
				selection: { mode: "multiple" },
			},
		}),
	};
};

describe("DataGrid observable와 담당 handlers", () => {
	it("query를 필터·정렬·페이지로 파싱하고 잘못된 페이지 값은 기본값을 사용한다", () => {
		expect(
			parseQuery({
				search: "김",
				sort: ["name", "-department"],
				take: 5,
				skip: 10,
				page: 3,
			}),
		).toEqual({
			filters: { search: "김" },
			sort: [
				{ id: "name", desc: false },
				{ id: "department", desc: true },
			],
			pagination: { take: 5, skip: 10 },
		});
		expect(parseQuery({ take: -1, skip: Number.NaN, sort: "-name" })).toEqual({
			filters: {},
			sort: [{ id: "name", desc: true }],
			pagination: { take: 20, skip: 0 },
		});
	});

	it("원본값을 공유해 반복 편집과 원본 복원 시 변경분과 표시 행을 갱신한다", () => {
		const { state } = createEmployeeState();
		expect(isObservable(state)).toBe(true);
		const displayedNames: string[][] = [];
		const dispose = autorun(() =>
			displayedNames.push(
				combineRowsWithChanges(state, state.table.rows).map((row) => row.name),
			),
		);
		try {
			setValue(state, originalEmployee, "name", "변경 이름");
			setValue(state, getRow(state, originalEmployee), "name", "두 번째 이름");
			expect(getChangesSnapshot(state).updated).toEqual([
				{ id: originalEmployee.id, changes: { name: "두 번째 이름" } },
			]);
			setValue(
				state,
				getRow(state, originalEmployee),
				"name",
				originalEmployee.name,
			);
			expect(getChangesSnapshot(state).updated).toEqual([]);
			expect(displayedNames).toEqual([
				["김민서"],
				["변경 이름"],
				["두 번째 이름"],
				["김민서"],
			]);
			expect(originalEmployee.name).toBe("김민서");
		} finally {
			dispose();
		}
	});

	it("새 행 삭제는 생성분을 취소하고 기존 행 삭제와 초기화는 표시 결과에 반영한다", () => {
		const { state } = createEmployeeState();
		const newEmployee: Employee = {
			id: "new-employee",
			name: "신규",
			department: "운영",
		};
		addRow(state, newEmployee);
		setValue(state, newEmployee, "name", "신규 변경");
		expect(getChangesSnapshot(state).created[0].name).toBe("신규 변경");
		deleteRow(state, newEmployee.id);
		expect(getChangesSnapshot(state)).toEqual({
			created: [],
			updated: [],
			deleted: [],
		});
		deleteRow(state, originalEmployee.id);
		expect(combineRowsWithChanges(state, state.table.rows)).toEqual([]);
		clearChanges(state);
		expect(combineRowsWithChanges(state, state.table.rows)).toEqual([
			originalEmployee,
		]);
	});

	it("서로 다른 Hook과 재렌더가 같은 원본값을 사용하고 callback 참조를 유지한다", () => {
		const { state } = createEmployeeState();
		const first = renderHook(() => useHandlers(state));
		const second = renderHook(() => useHandlers(state));
		const originalCallback = first.result.current.setValue;
		act(() => first.result.current.setValue(originalEmployee, "name", "편집"));
		act(() =>
			second.result.current.setValue(
				getRow(state, originalEmployee),
				"name",
				"김민서",
			),
		);
		first.rerender();
		expect(first.result.current.setValue).toBe(originalCallback);
		expect(getChangesSnapshot(state).updated).toEqual([]);
	});

	it("TanStack 함수형 Updater는 최신 정렬·펼침·선택을 기준으로 동작한다", () => {
		const { state, querySetter } = createEmployeeState();
		const { result } = renderHook(() => useTableHandlers(state));
		const handlers = result.current;
		act(() =>
			updateQuery(state.query, { sort: ["-department"], take: 10, skip: 20 }),
		);
		act(() =>
			handlers.changeSorting((current) => [
				...current,
				{ id: "name", desc: false },
			]),
		);
		expect(querySetter).toHaveBeenLastCalledWith({
			sort: ["-department", "name"],
			skip: 0,
		});
		act(() =>
			handlers.changeExpandedRows((current) => ({
				...(current === true ? {} : current),
				"employee-1": true,
			})),
		);
		expect(state.table.expandedRowIds).toEqual({ "employee-1": true });
		act(() => handlers.changeRowSelection({ "employee-1": true }));
		act(() =>
			handlers.changeRowSelection((current) => ({
				...current,
				"employee-2": true,
			})),
		);
		expect([...state.table.selectedRowKeys]).toEqual([
			"employee-1",
			"employee-2",
		]);
	});

	it("페이지 callback은 query 변경 후에도 최신 skip/take를 사용한다", () => {
		const { state, querySetter } = createEmployeeState();
		const { result } = renderHook(() =>
			usePaginationHandlers(state.pagination),
		);
		const nextPage = result.current.nextPage;
		act(() => updateQuery(state.query, { take: 10, skip: 20 }));
		act(() => nextPage());
		expect(querySetter).toHaveBeenLastCalledWith({ take: 10, skip: 30 });
	});

	it("Pagination이 소유한 전체 건수 변경을 화면에 반영한다", () => {
		const { state } = createEmployeeState();
		render(<DataGrid state={state} />);
		expect(screen.getByText(/총\s*50건/)).toBeInTheDocument();
		act(() => {
			runInAction(() => {
				state.pagination.totalCount = 0;
			});
		});
		expect(screen.getByText(/총\s*0건/)).toBeInTheDocument();
	});

	it("ActionBar 소유 설정과 액션을 선택 원본과 함께 갱신한다", () => {
		const { state } = createEmployeeState();
		render(<DataGrid state={state} />);
		fireEvent.click(screen.getAllByRole("checkbox")[1]);
		expect(screen.getByText("1개 선택됨")).toBeInTheDocument();
		act(() => {
			runInAction(() => {
				state.actionBar.showCount = false;
				state.actionBar.actions = <button type="button">선택 행 삭제</button>;
			});
		});
		expect(screen.queryByText("1개 선택됨")).not.toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "선택 행 삭제" }),
		).toBeInTheDocument();
	});

	it("native 행 선택은 헤더와 액션바를 갱신하고 새 행은 바로 렌더링된다", () => {
		const { state } = createEmployeeState();
		render(<DataGrid state={state} />);
		const [selectAll, selectEmployee] = screen.getAllByRole("checkbox");
		fireEvent.click(selectEmployee);
		expect(state.table.selectedRowKeys.has(originalEmployee.id)).toBe(true);
		expect(selectAll).toBeChecked();
		expect(screen.getByText("1개 선택됨")).toBeInTheDocument();
		act(() =>
			addRow(state, {
				id: "employee-2",
				name: "새 구성원",
				department: "운영",
			}),
		);
		expect(screen.getByText("새 구성원")).toBeInTheDocument();
		fireEvent.click(screen.getAllByRole("checkbox")[0]);
		expect(state.table.selectedRowKeys.size).toBe(2);
	});

	it("TanStack 중첩 헤더 구조를 유지한다", () => {
		const querySetter = vi.fn(async () => new URLSearchParams());
		const state = createDataGridState<Employee>({
			setQueryStates: querySetter,
			table: {
				rows: [originalEmployee],
				columns: [
					{
						header: "인적 정보",
						columns: [
							{ accessorKey: "name", header: "이름" },
							{ accessorKey: "department", header: "부서" },
						],
					},
				],
			},
		});
		render(<DataGrid state={state} />);
		expect(
			screen.getByRole("columnheader", { name: "인적 정보" }),
		).toHaveAttribute("colspan", "2");
		expect(
			screen.getByRole("columnheader", { name: "이름" }),
		).toBeInTheDocument();
	});

	it("그룹 query 변경과 native 그룹 펼침이 표시 행을 갱신한다", () => {
		let state: DataGridState<Employee>;
		const querySetter = vi.fn(async (values: Record<string, unknown>) => {
			updateQuery(state.query, {
				...state.query.filters,
				take: 10,
				skip: 0,
				...values,
			});
			return new URLSearchParams();
		});
		state = createDataGridState<Employee>({
			setQueryStates: querySetter,
			groupPanel: { show: "always" },
			table: {
				rows: [originalEmployee],
				columns: [
					{ accessorKey: "name", header: "이름" },
					{
						accessorKey: "department",
						header: "부서",
						meta: { label: "부서" },
					},
				],
			},
		});
		render(<DataGrid state={state} />);
		fireEvent.click(screen.getByRole("button", { name: "부서 그룹 추가" }));
		expect(querySetter).toHaveBeenLastCalledWith({
			groupBy: ["department"],
			skip: 0,
		});
		expect(screen.queryByText(originalEmployee.name)).not.toBeInTheDocument();
		fireEvent.click(
			screen.getByRole("button", { name: "부서 플랫폼 그룹 펼치기" }),
		);
		expect(screen.getByText(originalEmployee.name)).toBeInTheDocument();
	});

	it("외부 선택 모델도 변경 handler에 연결한다", () => {
		const { state } = createEmployeeState();
		const setSelectedKeys = vi.fn();
		runInAction(() => {
			state.table.selectionSource = {
				selectedKeys: new Set(["employee-1"]),
				setSelectedKeys,
			};
		});
		const { result } = renderHook(() => useTableHandlers(state));
		act(() =>
			result.current.changeRowSelection((current) => ({
				...current,
				"employee-2": true,
			})),
		);
		expect(setSelectedKeys).toHaveBeenCalledWith(
			new Set(["employee-1", "employee-2"]),
		);
		expect(state.table.selectedRowKeys.size).toBe(0);
	});
});
