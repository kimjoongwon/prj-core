import { LoginSchema } from "@cocrepo/schema";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "../../input/TextField";
import { Form } from "./Form";

interface LoginTestState {
	email: string;
	password: string;
	fieldErrors: Partial<Record<keyof LoginSchema & string, string>>;
	errorMessage: string | null;
}

function createLoginTestState(
	state: Partial<LoginTestState> = {},
): LoginTestState {
	return observable({
		email: "",
		password: "",
		fieldErrors: {},
		errorMessage: null,
		...state,
	}) as LoginTestState;
}

describe("Form", () => {
	it("blocks submit and writes schema errors to fieldErrors", async () => {
		const state = createLoginTestState();
		const handleSubmitCapture = vi.fn();

		render(
			<Form
				data-testid="login-form"
				state={state}
				schema={LoginSchema}
				onSubmitCapture={handleSubmitCapture}
			>
				<TextField state={state} path="email" label="Email" />
				<TextField state={state} path="password" label="Password" />
			</Form>,
		);

		fireEvent.submit(screen.getByTestId("login-form"));

		await waitFor(() => {
			expect(state.fieldErrors.email).toBe("필수 입력 항목입니다");
			expect(state.fieldErrors.password).toBe("필수 입력 항목입니다");
		});
		expect(handleSubmitCapture).not.toHaveBeenCalled();
	});

	it("calls submit capture after successful schema validation", () => {
		const state = createLoginTestState({
			email: "admin@example.com",
			password: "password123",
		});
		const handleSubmitCapture = vi.fn();

		render(
			<Form
				data-testid="login-form"
				state={state}
				schema={LoginSchema}
				onSubmitCapture={handleSubmitCapture}
			>
				<TextField state={state} path="email" label="Email" />
				<TextField state={state} path="password" label="Password" />
			</Form>,
		);

		fireEvent.submit(screen.getByTestId("login-form"));

		expect(handleSubmitCapture).toHaveBeenCalledTimes(1);
	});

	it("passes readOnly to bound fields without running field validation", () => {
		const state = createLoginTestState();

		render(
			<Form state={state} schema={LoginSchema} readOnly>
				<TextField state={state} path="email" label="Email" />
			</Form>,
		);

		const input = screen.getByLabelText("Email");
		expect(input).toHaveAttribute("readonly");

		fireEvent.blur(input);

		expect(state.fieldErrors.email).toBeUndefined();
	});
});
