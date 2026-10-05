import { describe, expect, it, vi } from "vitest";
import { ProgramPickerState } from "./ProgramPickerState";

const options = [{ id: "program-yoga", name: "모닝 요가" }];

describe("ProgramPickerState", () => {
	it("조회 종류와 검색어를 상태에 저장한다", () => {
		const state = new ProgramPickerState({
			kind: "routine",
			onSelect: vi.fn(),
		});

		state.setSearchValue("  필라테스  ");

		expect(state.searchValue).toBe("  필라테스  ");
	});

	it("선택 callback에 ID, 후보, 동일한 ProgramPickerState를 전달한다", () => {
		const onSelect = vi.fn();
		const state = new ProgramPickerState({
			kind: "routine",
			onSelect,
		});
		const option = options[0];

		state.select(option);

		expect(onSelect).toHaveBeenCalledWith("program-yoga", option, state);
	});
});
