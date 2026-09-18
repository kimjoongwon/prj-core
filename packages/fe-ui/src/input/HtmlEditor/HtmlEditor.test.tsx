import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HtmlEditor } from ".";

describe("HtmlEditor", () => {
	it("preserves HTML value and emits HTML changes", () => {
		const handleChange = vi.fn();
		render(<HtmlEditor value="<p>기존 내용</p>" onChange={handleChange} />);

		const editor = screen.getByRole("textbox", { name: "HTML 본문" });
		expect(editor.innerHTML).toBe("<p>기존 내용</p>");
		fireEvent.input(editor, { target: { innerHTML: "<p>새 내용</p>" } });
		expect(handleChange).toHaveBeenCalledWith("<p>새 내용</p>");
	});

	it("removes script tags before emitting HTML", () => {
		const handleChange = vi.fn();
		render(<HtmlEditor value="" onChange={handleChange} />);
		fireEvent.input(screen.getByRole("textbox", { name: "HTML 본문" }), {
			target: { innerHTML: "<p>안전</p><script>alert(1)</script>" },
		});
		expect(handleChange).toHaveBeenCalledWith("<p>안전</p>");
	});

	it("supports disabled and invalid states", () => {
		render(
			<HtmlEditor
				value="<p>내용</p>"
				onChange={vi.fn()}
				isDisabled
				isInvalid
				errorMessage="본문을 입력하세요."
			/>,
		);
		expect(screen.getByRole("textbox", { name: "HTML 본문" })).toHaveAttribute(
				"contenteditable",
				"false",
			);
		expect(screen.getByRole("textbox", { name: "HTML 본문" })).toHaveAttribute(
				"aria-invalid",
				"true",
			);
		expect(screen.getByText("본문을 입력하세요.")).toBeInTheDocument();
	});
});
