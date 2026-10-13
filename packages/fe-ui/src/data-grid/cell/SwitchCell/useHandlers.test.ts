import { renderHook } from "@testing-library/react";
import { configure, observable } from "mobx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SwitchCellState } from "./SwitchCell";
import { useHandlers } from "./useHandlers";

beforeEach(() => {
	configure({ enforceActions: "always" });
});

afterEach(() => {
	configure({ enforceActions: "observed" });
	vi.restoreAllMocks();
});

describe("SwitchCell handlers", () => {
	it("진행 중인 중복 변경을 막고 실패 후 선택 상태와 loading을 복구한다", async () => {
		let rejectToggle!: (reason: Error) => void;
		const toggleResult = new Promise<void>((_resolve, reject) => {
			rejectToggle = reject;
		});
		const onToggle = vi.fn(() => toggleResult);
		const state = observable<SwitchCellState>({
			optimisticSelected: false,
			isLoading: false,
		});
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		const { result } = renderHook(() => useHandlers(state));
		const toggleSelection = result.current.getToggleHandler(onToggle);
		const pending = toggleSelection(true);
		expect(state.optimisticSelected).toBe(true);
		expect(state.isLoading).toBe(true);
		await toggleSelection(false);
		expect(onToggle).toHaveBeenCalledOnce();
		rejectToggle(new Error("저장 실패"));
		await pending;
		expect(state.optimisticSelected).toBe(false);
		expect(state.isLoading).toBe(false);
		expect(warn).not.toHaveBeenCalled();
	});

	it("부모 선택값을 동기화하고 비활성 상태의 변경 요청을 무시한다", async () => {
		const state = observable<SwitchCellState>({
			optimisticSelected: false,
			isLoading: false,
		});
		const onToggle = vi.fn();
		const { result } = renderHook(() => useHandlers(state));
		result.current.syncSelection(true);
		expect(state.optimisticSelected).toBe(true);
		await result.current.getToggleHandler(onToggle, true)(false);
		expect(onToggle).not.toHaveBeenCalled();
		expect(state.optimisticSelected).toBe(true);
	});
});
