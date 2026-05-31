import { fireEvent, render, screen } from "@testing-library/react";
import { observable } from "mobx";
import { vi } from "vitest";
import { LoginPage, type LoginPageState } from "./LoginPage";

function createLoginPageState(
	state: Partial<LoginPageState> & {
		loginForm?: Partial<LoginPageState["loginForm"]>;
	} = {},
): LoginPageState {
	return observable({
		loginForm: {
			email: "",
			password: "",
			...state.loginForm,
		},
		errorMessage: state.errorMessage ?? "",
	}) as LoginPageState;
}

describe("LoginPage", () => {
	it("renders the title, caption, form fields, and submit action", () => {
		const state = createLoginPageState();

		render(
			<LoginPage
				state={state}
				title="관리자 로그인"
				caption="관리자 계정으로 로그인해주세요."
				onSubmitLoginForm={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "관리자 로그인" }),
		).toBeInTheDocument();
		expect(
			screen.getByText("관리자 계정으로 로그인해주세요."),
		).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "로그인" })).toBeEnabled();
	});

	it("delegates form submit to the page event prop", () => {
		const state = createLoginPageState();
		const onSubmitLoginForm = vi.fn();

		render(
			<LoginPage
				state={state}
				title="관리자 로그인"
				caption="관리자 계정으로 로그인해주세요."
				onSubmitLoginForm={onSubmitLoginForm}
			/>,
		);

		fireEvent.submit(screen.getByRole("form", { name: "관리자 로그인" }));

		expect(onSubmitLoginForm).toHaveBeenCalledTimes(1);
	});

	it("keeps the submit action disabled while loading", () => {
		const state = createLoginPageState();
		const onSubmitLoginForm = vi.fn();

		render(
			<LoginPage
				state={state}
				title="관리자 로그인"
				caption="관리자 계정으로 로그인해주세요."
				isLoading
				onSubmitLoginForm={onSubmitLoginForm}
			/>,
		);

		fireEvent.submit(screen.getByRole("form", { name: "관리자 로그인" }));

		expect(screen.getByRole("button", { name: "로그인" })).toBeDisabled();
		expect(onSubmitLoginForm).not.toHaveBeenCalled();
	});

	it("renders page-level errors as alert feedback", () => {
		const state = createLoginPageState({
			errorMessage: "이메일 또는 비밀번호를 다시 확인해주세요.",
		});

		render(
			<LoginPage
				state={state}
				title="관리자 로그인"
				caption="관리자 계정으로 로그인해주세요."
				onSubmitLoginForm={vi.fn()}
			/>,
		);

		expect(screen.getByRole("alert")).toHaveTextContent(
			"이메일 또는 비밀번호를 다시 확인해주세요.",
		);
	});
});
