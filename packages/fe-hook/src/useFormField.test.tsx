// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { makeAutoObservable } from "mobx";
import { describe, expect, it } from "vitest";
import { useFormField } from "./useFormField";

describe("useFormField", () => {
	it("reads and writes the single external path without copying it", () => {
		const state = makeAutoObservable({ value: "first" });
		const { result, rerender } = renderHook(() =>
			useFormField({ state, path: "value", defaultValue: "fallback" }),
		);

		expect(result.current.state.value).toBe("first");
		act(() => result.current.setValue("second"));
		expect(state.value).toBe("second");
		state.value = "third";
		rerender();
		expect(result.current.state.value).toBe("third");
	});

	it("uses fallback only for undefined and preserves false, zero, and empty values", () => {
		const state = makeAutoObservable({ falseValue: false, zero: 0, empty: "" });
		const { result } = renderHook(() =>
			useFormField({ state, path: "falseValue", defaultValue: true }),
		);
		const zero = renderHook(() =>
			useFormField({ state, path: "zero", defaultValue: 9 }),
		);
		const empty = renderHook(() =>
			useFormField({ state, path: "empty", defaultValue: "fallback" }),
		);

		expect(result.current.state.value).toBe(false);
		expect(zero.result.current.state.value).toBe(0);
		expect(empty.result.current.state.value).toBe("");
	});

	it("keeps the multi-path splitter and aggregator contract", () => {
		const state = makeAutoObservable({ first: "A", last: "B" });
		const { result, rerender } = renderHook(() =>
			useFormField({
				state,
				paths: ["first", "last"] as const,
				valueSplitter: (value: string) => ({ first: value[0], last: value[1] }),
				valueAggregator: (values) => `${values.first}${values.last}`,
			}),
		);

		expect(result.current.state.value).toBe("AB");
		act(() => result.current.setValue("CD"));
		expect(state.first).toBe("C");
		expect(state.last).toBe("D");
		state.first = "E";
		rerender();
		expect(result.current.state.value).toBe("ED");
	});

	it("supports multi-path writes without an aggregator", () => {
		const state = makeAutoObservable({ first: "A", last: "B" });
		const { result } = renderHook(() =>
			useFormField({
				state,
				paths: ["first", "last"] as const,
				value: "AB",
				valueSplitter: (value: string) => ({ first: value[0], last: value[1] }),
			}),
		);
		act(() => result.current.setValue("CD"));
		expect(result.current.state.value).toBe("CD");
	});

	it("uses the new state and path when either source is replaced", () => {
		type ReplacedState = { value: string | undefined; other: string | undefined };
		const first = makeAutoObservable<ReplacedState>({ value: "first", other: undefined });
		const second = makeAutoObservable<ReplacedState>({ value: undefined, other: "second" });
		const { result, rerender } = renderHook(
			({ state, path }: { state: typeof first; path: "value" | "other" }) =>
				useFormField({ state, path, defaultValue: "fallback" }),
			{ initialProps: { state: first, path: "value" } },
		);
		expect(result.current.state.value).toBe("first");
		rerender({ state: second, path: "other" });
		expect(result.current.state.value).toBe("second");
		act(() => result.current.setValue("updated"));
		expect(second.other).toBe("updated");
		expect(first.value).toBe("first");
	});
});
