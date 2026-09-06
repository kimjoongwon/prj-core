import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { describe, expect, it } from "vitest";
import { UserForm, type UserFormState } from "./UserForm";

function createState(state: Partial<UserFormState> = {}): UserFormState {
	return observable({
		name: "홍길동",
		email: "hong@example.com",
		phone: "010-1234-5678",
		password: "Password123!",
		fieldErrors: {},
		errorMessage: null,
		...state,
	}) as UserFormState;
}

describe("UserForm", () => {
	it("Given 주어진 User 입력값이 있을 때 When 값을 변경하면 Then 외부 state에 반영된다", async () => {
		const state = createState();

		render(<UserForm state={state} />);

		expect(screen.getByLabelText("이름")).toHaveValue("홍길동");
		expect(screen.getByLabelText("이메일")).toHaveValue("hong@example.com");
		expect(screen.getByLabelText("전화번호")).toHaveValue("010-1234-5678");
		expect(screen.getByLabelText("비밀번호")).toHaveValue("Password123!");

		fireEvent.change(screen.getByLabelText("이름"), {
			target: { value: "김온유" },
		});
		fireEvent.change(screen.getByLabelText("이메일"), {
			target: { value: "onyu@example.com" },
		});
		fireEvent.change(screen.getByLabelText("전화번호"), {
			target: { value: "010-9999-8888" },
		});
		fireEvent.change(screen.getByLabelText("비밀번호"), {
			target: { value: "NextPassword123!" },
		});

		await waitFor(() => {
			expect(state.name).toBe("김온유");
			expect(state.email).toBe("onyu@example.com");
			expect(state.phone).toBe("010-9999-8888");
			expect(state.password).toBe("NextPassword123!");
		});
	});

	it("Given UserFormSchema에 맞지 않는 입력값이 있을 때 When 필드를 blur하면 Then schema 오류가 fieldErrors와 화면에 반영된다", async () => {
		const state = createState({
			name: "김",
			email: "invalid-email",
			phone: "010-12",
			password: "short",
		});

		render(<UserForm state={state} />);

		fireEvent.blur(screen.getByLabelText("이름"));
		fireEvent.blur(screen.getByLabelText("이메일"));
		fireEvent.blur(screen.getByLabelText("전화번호"));
		fireEvent.blur(screen.getByLabelText("비밀번호"));

		await waitFor(() => {
			expect(state.fieldErrors.name).toBe("최소 2자 이상 입력해주세요");
			expect(state.fieldErrors.email).toBe("유효한 이메일 주소를 입력해주세요");
			expect(state.fieldErrors.phone).toBe("올바른 형식이 아닙니다");
			expect(state.fieldErrors.password).toBe("최소 10자 이상 입력해주세요");
		});
		expect(screen.getByText("최소 2자 이상 입력해주세요")).toBeInTheDocument();
		expect(screen.getByText("최소 10자 이상 입력해주세요")).toBeInTheDocument();
		expect(
			screen.getByText("유효한 이메일 주소를 입력해주세요"),
		).toBeInTheDocument();
		expect(screen.getByText("올바른 형식이 아닙니다")).toBeInTheDocument();
	});

	it("Given 공백과 대문자를 포함한 입력값이 있을 때 When blur하면 Then 원래 값이 변환되지 않은 채 검증된다", async () => {
		const state = createState({
			email: "  ONYU@EXAMPLE.COM  ",
		});

		render(<UserForm state={state} />);
		fireEvent.blur(screen.getByLabelText("이메일"));

		await waitFor(() => {
			expect(state.fieldErrors.email).toBe(
				"유효한 이메일 주소를 입력해주세요",
			);
		});
		expect(state.email).toBe("  ONYU@EXAMPLE.COM  ");
	});

	it("Given 여러 필드 오류가 있을 때 When 이름 값을 변경하면 Then 해당 필드 오류만 제거된다", async () => {
		const state = createState({
			name: "",
			fieldErrors: {
				name: "이름을 입력하세요",
				email: "이메일을 확인하세요",
				phone: "전화번호를 확인하세요",
				password: "비밀번호를 확인하세요",
			},
		});

		render(<UserForm state={state} />);

		expect(screen.getByText("이름을 입력하세요")).toBeInTheDocument();
		expect(screen.getByText("이메일을 확인하세요")).toBeInTheDocument();
		expect(screen.getByText("전화번호를 확인하세요")).toBeInTheDocument();
		expect(screen.getByText("비밀번호를 확인하세요")).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText("이름"), {
			target: { value: "김온유" },
		});

		await waitFor(() => {
			expect(state.name).toBe("김온유");
			expect(state.fieldErrors.name).toBeUndefined();
		});
		expect(state.fieldErrors.email).toBe("이메일을 확인하세요");
		expect(state.fieldErrors.phone).toBe("전화번호를 확인하세요");
		expect(state.fieldErrors.password).toBe("비밀번호를 확인하세요");
		expect(screen.queryByText("이름을 입력하세요")).not.toBeInTheDocument();
	});

	it("Given readOnly UserForm일 때 When 렌더링하면 Then 일반 필드는 비활성화되고 비밀번호는 숨겨진다", () => {
		const state = createState();

		render(<UserForm state={state} readOnly />);

		expect(screen.getByLabelText("이름")).toBeDisabled();
		expect(screen.getByLabelText("이메일")).toBeDisabled();
		expect(screen.getByLabelText("전화번호")).toBeDisabled();
		expect(screen.queryByLabelText("비밀번호")).not.toBeInTheDocument();
	});
});
