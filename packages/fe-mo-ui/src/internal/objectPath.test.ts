import { getPathValue, setPathValue } from "./objectPath";

describe("objectPath", () => {
	it("dot path 로 중첩 값을 읽어야 한다", () => {
		const state = {
			form: {
				customer: {
					name: "plate",
				},
			},
		};

		expect(getPathValue(state, "form.customer.name", "fallback")).toBe("plate");
		expect(getPathValue(state, "form.customer.email", "fallback")).toBe(
			"fallback",
		);
	});

	it("배열 인덱스 경로를 정규화해서 값을 써야 한다", () => {
		const state = {};

		setPathValue(state, "items[0].name", "alpha");

		expect(state).toEqual({
			items: [
				{
					name: "alpha",
				},
			],
		});
	});
});
