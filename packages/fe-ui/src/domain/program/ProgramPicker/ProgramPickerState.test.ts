import { describe, expect, it, vi } from "vitest";
import { ProgramPickerState } from "./ProgramPickerState";

const options = [
	{ id: "program-yoga", name: "모닝 요가" },
	{ id: "program-pilates", name: "리포머 필라테스" },
];

describe("ProgramPickerState", () => {
	it("검색어를 대소문자와 앞뒤 공백에 무관하게 적용한다", () => {
		const state = new ProgramPickerState({
			searchLabel: "검색",
			searchPlaceholder: "프로그램명",
			options,
			onSelect: vi.fn(),
		});

		state.setSearchValue("  필라테스  ");

		expect(state.visibleOptions.map((option) => option.id)).toEqual([
			"program-pilates",
		]);
	});

	it("선택된 항목은 검색 결과에서 제외되어도 첫 항목에 유지한다", () => {
		const state = new ProgramPickerState({
			searchLabel: "검색",
			searchPlaceholder: "프로그램명",
			options,
			selectedId: "program-yoga",
			onSelect: vi.fn(),
		});

		state.setSearchValue("필라테스");

		expect(state.visibleOptions.map((option) => option.id)).toEqual([
			"program-yoga",
			"program-pilates",
		]);
	});

	it("선택 callback에 ID와 동일한 ProgramPickerState를 전달한다", () => {
		const onSelect = vi.fn();
		const state = new ProgramPickerState({
			searchLabel: "검색",
			searchPlaceholder: "프로그램명",
			options,
			onSelect,
		});

		state.select("program-yoga");

		expect(onSelect).toHaveBeenCalledWith("program-yoga", state);
	});
});
