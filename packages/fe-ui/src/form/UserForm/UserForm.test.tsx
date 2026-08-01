import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { describe, expect, it } from "vitest";
import { UserForm, type UserFormState } from "./UserForm";

function createState(state: Partial<UserFormState> = {}): UserFormState {
	return observable({
		name: "홍길동",
		email: "hong@example.com",
		phone: "010-1234-5678",
		errors: {},
		...state,
	}) as UserFormState;
}

describe("UserForm", () => {
	it("renders fields and binds MobX state values", async () => {
		const state = createState();

		render(<UserForm state={state} />);

		expect(screen.getByLabelText("이름")).toHaveValue("홍길동");
		expect(screen.getByLabelText("이메일")).toHaveValue("hong@example.com");
		expect(screen.getByLabelText("연락처")).toHaveValue("010-1234-5678");

		fireEvent.change(screen.getByLabelText("이름"), {
			target: { value: "김온유" },
		});
		fireEvent.change(screen.getByLabelText("이메일"), {
			target: { value: "onyu@example.com" },
		});
		fireEvent.change(screen.getByLabelText("연락처"), {
			target: { value: "010-9999-8888" },
		});

		await waitFor(() => {
			expect(state.name).toBe("김온유");
			expect(state.email).toBe("onyu@example.com");
			expect(state.phone).toBe("010-9999-8888");
		});
	});

	it("clears only the changed field error", async () => {
		const state = createState({
			name: "",
			errors: {
				name: "이름을 입력하세요",
				email: "이메일을 확인하세요",
				phone: "연락처를 확인하세요",
			},
		});

		render(<UserForm state={state} />);

		expect(screen.getByText("이름을 입력하세요")).toBeInTheDocument();
		expect(screen.getByText("이메일을 확인하세요")).toBeInTheDocument();
		expect(screen.getByText("연락처를 확인하세요")).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText("이름"), {
			target: { value: "김온유" },
		});

		await waitFor(() => {
			expect(state.name).toBe("김온유");
			expect(state.errors.name).toBeUndefined();
		});
		expect(state.errors.email).toBe("이메일을 확인하세요");
		expect(state.errors.phone).toBe("연락처를 확인하세요");
		expect(screen.queryByText("이름을 입력하세요")).not.toBeInTheDocument();
	});

	it("locks all fields in readOnly mode", () => {
		const state = createState();

		render(<UserForm state={state} readOnly />);

		expect(screen.getByLabelText("이름")).toBeDisabled();
		expect(screen.getByLabelText("이메일")).toBeDisabled();
		expect(screen.getByLabelText("연락처")).toBeDisabled();
	});
});
