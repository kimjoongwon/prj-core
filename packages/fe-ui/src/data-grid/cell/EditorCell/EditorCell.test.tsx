import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditorCell } from "./EditorCell";

describe("EditorCell 입력 계약", () => {
	it("빈 숫자 입력을 문자열로 유지하고 숫자 입력을 변환한다", () => {
		const onValueChange = vi.fn();
		const onFinish = vi.fn();
		render(
			<EditorCell
				config={{ type: "number" }}
				context={{
					row: { id: "alpha" },
					field: "count",
					value: 3,
					initialValue: 3,
					isValidating: false,
					onValueChange,
					onFinish,
					onCancel: vi.fn(),
				}}
			/>,
		);
		const input = screen.getByLabelText("count");
		fireEvent.change(input, { target: { value: "" } });
		expect(onValueChange).toHaveBeenLastCalledWith("");
		fireEvent.change(input, { target: { value: "12" } });
		expect(onValueChange).toHaveBeenLastCalledWith(12);
		fireEvent.keyDown(input, { key: "Tab", shiftKey: true });
		expect(onFinish).toHaveBeenCalledWith("previous");
	});

	it("boolean 변경 값을 완료 콜백보다 먼저 전달한다", () => {
		const onValueChange = vi.fn();
		const onFinish = vi.fn();
		render(
			<EditorCell
				config={{ type: "boolean" }}
				context={{
					row: { id: "alpha" },
					field: "isEnabled",
					value: false,
					initialValue: false,
					isValidating: false,
					onValueChange,
					onFinish,
					onCancel: vi.fn(),
				}}
			/>,
		);
		fireEvent.click(screen.getByLabelText("isEnabled"));
		expect(onValueChange).toHaveBeenCalledWith(true);
		expect(onValueChange.mock.invocationCallOrder[0]).toBeLessThan(
			onFinish.mock.invocationCallOrder[0],
		);
	});
});
