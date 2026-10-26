// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	InputStateInspectionProvider,
	useInputStateInspection,
} from "./input-state-inspection";

describe("input state inspection", () => {
	it("reads the registered reader and disposes it", () => {
		const { result } = renderHook(() => useInputStateInspection(), {
			wrapper: ({ children }) => (
				<InputStateInspectionProvider>{children}</InputStateInspectionProvider>
			),
		});
		let current = "first";
		const dispose = result.current?.registerInputState("field", () => current);

		expect(result.current?.read("field")).toBe("first");
		current = "second";
		expect(result.current?.read("field")).toBe("second");
		act(() => dispose?.());
		expect(result.current?.read("field")).toBeUndefined();
	});

	it("is disabled without a provider", () => {
		const { result } = renderHook(() => useInputStateInspection());
		expect(result.current).toBeUndefined();
	});
});
