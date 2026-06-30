import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { describe, expect, it, vi } from "vitest";
import { TextField } from ".";

interface TextFieldTestState {
	email: string;
}

function createTextFieldTestState(
	state: TextFieldTestState,
): TextFieldTestState {
	return observable(state) as TextFieldTestState;
}

describe("TextField", () => {
	it("keeps direct value change callbacks working", () => {
		const handleChange = vi.fn();

		render(
			<TextField
				label="Email"
				value="admin@plate.com"
				onChange={handleChange}
			/>,
		);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "ops@plate.com" },
		});

		expect(handleChange).toHaveBeenCalledWith("ops@plate.com");
	});

	it("binds state path changes through useFormField", async () => {
		const state = createTextFieldTestState({
			email: "",
		});

		render(<TextField state={state} path="email" label="Email" />);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "ops@plate.com" },
		});

		await waitFor(() => {
			expect(state.email).toBe("ops@plate.com");
		});
	});
});
