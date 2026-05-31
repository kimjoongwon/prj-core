import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { LoginForm, type LoginFormState } from "./LoginForm";

function createLoginFormState(state: LoginFormState): LoginFormState {
	return observable(state) as LoginFormState;
}

describe("LoginForm", () => {
	it("renders email and password fields with bound values", () => {
		const state = createLoginFormState({
			email: "ops@example.com",
			password: "password123!",
		});

		render(<LoginForm state={state} />);

		expect(screen.getByLabelText("Email")).toHaveValue("ops@example.com");
		expect(screen.getByLabelText("Password")).toHaveValue("password123!");
	});

	it("updates the provided form state when fields change", async () => {
		const state = createLoginFormState({
			email: "",
			password: "",
		});

		render(<LoginForm state={state} />);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "admin@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "new-password" },
		});

		await waitFor(() => {
			expect(state.email).toBe("admin@example.com");
			expect(state.password).toBe("new-password");
		});
	});
});
