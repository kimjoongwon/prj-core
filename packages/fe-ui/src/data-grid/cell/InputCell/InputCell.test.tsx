import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InputCell } from "./InputCell";

describe("InputCell", () => {
	it("Given 문자열 값 When 입력하면 Then 변경 값을 즉시 전달한다", () => {
		const handleValueChange = vi.fn();

		render(
			<InputCell
				aria-label="카테고리 이름"
				value="의류"
				onValueChange={handleValueChange}
				onFinish={vi.fn()}
				onCancel={vi.fn()}
			/>,
		);

		fireEvent.change(screen.getByRole("textbox", { name: "카테고리 이름" }), {
			target: { value: "상의" },
		});

		expect(handleValueChange).toHaveBeenCalledWith("상의");
	});

	it("Given 숫자 입력 When 값을 바꾸면 Then number로 전달한다", () => {
		const handleValueChange = vi.fn();

		render(
			<InputCell
				aria-label="표시 순서"
				type="number"
				value={1}
				onValueChange={handleValueChange}
				onFinish={vi.fn()}
				onCancel={vi.fn()}
			/>,
		);

		fireEvent.change(screen.getByRole("spinbutton", { name: "표시 순서" }), {
			target: { value: "2" },
		});

		expect(handleValueChange).toHaveBeenCalledWith(2);
	});

	it("Given 편집 중 When Enter, Escape, blur가 발생하면 Then 완료와 취소를 구분한다", () => {
		const handleFinish = vi.fn();
		const handleCancel = vi.fn();

		render(
			<InputCell
				aria-label="카테고리 이름"
				value="의류"
				onValueChange={vi.fn()}
				onFinish={handleFinish}
				onCancel={handleCancel}
			/>,
		);

		const input = screen.getByRole("textbox", { name: "카테고리 이름" });
		fireEvent.keyDown(input, { key: "Enter" });
		fireEvent.keyDown(input, { key: "Escape" });
		fireEvent.blur(input);

		expect(handleFinish).toHaveBeenCalledTimes(2);
		expect(handleCancel).toHaveBeenCalledTimes(1);
	});

	it("Given 행 클릭 영역 안 When input을 누르면 Then 상위 클릭으로 전파하지 않는다", () => {
		const handleParentClick = vi.fn();
		window.addEventListener("click", handleParentClick);

		render(
			<InputCell
				aria-label="카테고리 이름"
				value="의류"
				onValueChange={vi.fn()}
				onFinish={vi.fn()}
				onCancel={vi.fn()}
			/>,
		);

		fireEvent.click(screen.getByRole("textbox", { name: "카테고리 이름" }));

		expect(handleParentClick).not.toHaveBeenCalled();
		window.removeEventListener("click", handleParentClick);
	});
});
