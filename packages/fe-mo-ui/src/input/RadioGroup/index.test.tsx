import { createRadioGroupState } from "./index";

describe("createRadioGroupState", () => {
	it("빈 문자열을 유효한 초기값으로 보존하고 변경할 수 있어야 한다", () => {
		const state = createRadioGroupState("");

		expect(state.value).toBe("");
		state.setValue("sms");

		expect(state.value).toBe("sms");
	});
});
