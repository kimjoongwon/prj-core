import { LoginSchema } from "@cocrepo/schema";
import type { FormSchemaStateContract } from "@cocrepo/type";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "../../input/TextField";
import { Form } from "./Form";

interface LoginTestState extends FormSchemaStateContract<LoginSchema> {
	email: string;
	password: string;
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
	it("Given 필수값이 없을 때 When submit하면 Then 오류를 기록하고 submit을 막는다", async () => {
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

	it("Given 유효한 값이 있을 때 When submit하면 Then 상위 submit handler를 호출한다", () => {
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

	it("Given 기존 필드 오류가 있을 때 When 값을 변경하면 Then state의 clearFieldError로 해당 오류만 제거한다", async () => {
		let clearedField: (keyof LoginSchema & string) | null = null;
		let state: LoginTestState;

		state = createLoginTestState({
			email: "invalid-email",
			password: "password123",
			fieldErrors: {
				email: "이메일을 확인하세요",
				password: "비밀번호를 확인하세요",
			},
			clearFieldError: (field) => {
				clearedField = field;
				delete state.fieldErrors[field];
			},
		});

		render(
			<Form state={state} schema={LoginSchema}>
				<TextField state={state} path="email" label="Email" />
				<TextField state={state} path="password" label="Password" />
			</Form>,
		);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "admin@example.com" },
		});

		await waitFor(() => {
			expect(clearedField).toBe("email");
			expect(state.fieldErrors.email).toBeUndefined();
		});
		expect(state.fieldErrors.password).toBe("비밀번호를 확인하세요");
	});

	it("Given onChange 검증일 때 When 잘못된 값으로 변경하면 Then 기존 오류를 새 schema 오류로 교체한다", async () => {
		const state = createLoginTestState({
			email: "admin@example.com",
			password: "password123",
			fieldErrors: { email: "기존 서버 오류" },
		});

		render(
			<Form state={state} schema={LoginSchema} validationTimings={["onChange"]}>
				<TextField state={state} path="email" label="Email" />
			</Form>,
		);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "invalid-email" },
		});

		await waitFor(() => {
			expect(state.fieldErrors.email).toBe("유효한 이메일 주소를 입력해주세요");
		});
		expect(
			screen.getByText("유효한 이메일 주소를 입력해주세요"),
		).toBeInTheDocument();
	});

	it("Given readOnly Form일 때 When 필드가 blur되면 Then 입력을 잠그고 검증하지 않는다", () => {
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
