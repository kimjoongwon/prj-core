import { act, render, screen } from "@testing-library/react";
import { observable } from "mobx";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StorybookStatePreview } from "./StorybookStatePreview";

const inspection = {
	entries: () => ["email"],
	read: () => ({ value: "first@example.com" }),
};
let activeInspection: typeof inspection | undefined = inspection;

vi.mock("@cocrepo/hook", () => ({
	useInputStateInspection: () => activeInspection,
}));

afterEach(() => {
	activeInspection = undefined;
});

describe("StorybookStatePreview", () => {
	it("renders the live state without a source code panel", () => {
		const state = observable({ value: "first@example.com" });

		render(
			<StorybookStatePreview readState={() => ({ value: state.value })}>
				<div>story content</div>
			</StorybookStatePreview>,
		);

		expect(screen.getByText("story content")).toBeTruthy();
		expect(screen.getAllByText(/first@example.com/)).toHaveLength(2);
		expect(screen.queryByText("사용 코드")).toBeNull();

		act(() => {
			state.value = "updated@example.com";
		});
		expect(screen.getByText(/updated@example.com/)).toBeTruthy();
	});

	it("shows the no-state contract without fabricating state", () => {
		render(
			<StorybookStatePreview>
				<div>read-only story</div>
			</StorybookStatePreview>,
		);

		expect(screen.getByText("변경 가능한 상태 없음")).toBeTruthy();
	});
});
