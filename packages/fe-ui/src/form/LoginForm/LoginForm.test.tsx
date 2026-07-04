import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { describe, expect, it, vi } from "vitest";
import { LoginForm, type LoginFormState } from "./LoginForm";

function createLoginFormState(
	state: Partial<LoginFormState> = {},
): LoginFormState {
	return observable({
		email: "",
		password: "",
		fieldErrors: {},
		errorMessage: null,
		...state,
	}) as LoginFormState;
}

describe("LoginForm", () => {
	it("renders email and password fields with bound values", () => {
		const state = createLoginFormState({
			email: "admin@plate.com",
			password: "password123!",
		});

		render(<LoginForm state={state} />);

		expect(screen.getByLabelText("이메일")).toHaveValue("admin@plate.com");
		expect(screen.getByLabelText("비밀번호")).toHaveValue("password123!");
	});

	it("updates the provided form state when fields change", async () => {
		const state = createLoginFormState();

		render(<LoginForm state={state} />);

		fireEvent.change(screen.getByLabelText("이메일"), {
			target: { value: "admin@example.com" },
		});
		fireEvent.change(screen.getByLabelText("비밀번호"), {
			target: { value: "new-password" },
		});

		await waitFor(() => {
			expect(state.email).toBe("admin@example.com");
			expect(state.password).toBe("new-password");
		});
	});

	it("shows schema validation message on field blur", async () => {
		const state = createLoginFormState({
			email: "invalid-email",
			password: "password123",
		});

		render(<LoginForm state={state} />);

		fireEvent.blur(screen.getByLabelText("이메일"));

		await waitFor(() => {
			expect(state.fieldErrors.email).toBe(
				"유효한 이메일 주소를 입력해주세요",
			);
		});
		expect(
			screen.getByText("유효한 이메일 주소를 입력해주세요"),
		).toBeInTheDocument();
	});

	it("blocks submit when required values are missing", async () => {
		const state = createLoginFormState();
		const handleSubmit = vi.fn();

		render(
			<div onSubmit={handleSubmit}>
				<LoginForm state={state}>
					<button type="submit">submit</button>
				</LoginForm>
			</div>,
		);

		fireEvent.click(screen.getByRole("button", { name: "submit" }));

		await waitFor(() => {
			expect(state.fieldErrors.email).toBe("필수 입력 항목입니다");
			expect(state.fieldErrors.password).toBe("필수 입력 항목입니다");
		});
		expect(handleSubmit).not.toHaveBeenCalled();
	});
});
