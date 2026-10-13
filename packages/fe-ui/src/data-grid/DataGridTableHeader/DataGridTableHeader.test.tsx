import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createDataGridState, DataGrid } from "../DataGrid";

type Employee = { id: string; name: string; department: string };
const originalEmployee: Employee = {
	id: "employee-1",
	name: "김민서",
	department: "플랫폼",
};

const renderEmployeeDataGrid = () => {
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
				{
					id: "actions",
					header: "",
				},
			],
		},
	});
	render(<DataGrid state={state} />);
	return { querySetter, state };
};

describe("DataGridTableHeader 접근성 이름", () => {
	it("table 요소가 '데이터 테이블' 접근성 이름을 가진다", () => {
		renderEmployeeDataGrid();

		expect(
			screen.getByRole("table", { name: "데이터 테이블" }),
		).toBeInTheDocument();
	});

	it("정렬 가능 컬럼헤더가 자식 정렬·너비 조절 버튼 이름이 아닌 컬럼 라벨을 이름으로 가진다", () => {
		renderEmployeeDataGrid();

		const nameHeader = screen.getByRole("columnheader", { name: "이름" });
		expect(nameHeader).toHaveAttribute("aria-label", "이름");
		expect(nameHeader).toHaveAccessibleName("이름");
	});

	it("중첩 그룹 컬럼헤더도 그룹 라벨을 명시적 이름으로 가진다", () => {
		renderEmployeeDataGrid();

		const groupHeader = screen.getByRole("columnheader", {
			name: "인적 정보",
		});
		expect(groupHeader).toHaveAttribute("aria-label", "인적 정보");
		expect(groupHeader).toHaveAttribute("colspan", "2");
	});

	it("빈 라벨 컬럼헤더는 aria-label을 부여하지 않는다", () => {
		renderEmployeeDataGrid();

		const table = screen.getByRole("table", { name: "데이터 테이블" });
		const headerCells = within(table).getAllByRole("columnheader");
		const actionsHeader = headerCells.find(
			(cell) => cell.getAttribute("aria-label") === null,
		);
		expect(actionsHeader).toBeDefined();
		expect(
			headerCells.filter((cell) => cell.hasAttribute("aria-label")),
		).toHaveLength(3);
	});
});
