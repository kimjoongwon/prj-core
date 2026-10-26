import { createSliderState } from "./index";

describe("createSliderState", () => {
	it("0을 유효한 초기값으로 보존하고 범위 값도 변경할 수 있어야 한다", () => {
		const state = createSliderState(0);

		expect(state.value).toBe(0);
		state.setValue([10, 20]);

		expect(state.value).toEqual([10, 20]);
	});
});
