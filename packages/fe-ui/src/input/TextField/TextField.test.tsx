import {
	InputStateInspectionProvider,
	useInputStateInspection,
} from "@cocrepo/hook";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
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
	it("owns an observable default state and exposes its actual value to inspection", async () => {
		const Inspector = observer(() => {
			const inspection = useInputStateInspection();
			const id = inspection?.entries()[0];
			return (
				<output aria-label="inspected-value">
					{String(id ? inspection.read(id) : "")}
				</output>
			);
		});

		render(
			<InputStateInspectionProvider>
				<TextField label="Name" defaultValue="initial" />
				<Inspector />
			</InputStateInspectionProvider>,
		);

		const input = screen.getByLabelText("Name");
		await waitFor(() =>
			expect(screen.getByLabelText("inspected-value")).toHaveTextContent(
				"initial",
			),
		);
		fireEvent.change(input, { target: { value: "next" } });
		await waitFor(() =>
			expect(screen.getByLabelText("inspected-value")).toHaveTextContent(
				"next",
			),
		);
	});

	it("keeps two internal instances isolated and cleans inspection on unmount", async () => {
		const Inspector = observer(() => {
			const inspection = useInputStateInspection();
			return (
				<output aria-label="inspection-count">
					{inspection?.entries().length ?? 0}
				</output>
			);
		});
		const view = render(
			<InputStateInspectionProvider>
				<TextField label="First" />
				<TextField label="Second" />
				<Inspector />
			</InputStateInspectionProvider>,
		);
		await waitFor(() =>
			expect(screen.getByLabelText("inspection-count")).toHaveTextContent("2"),
		);
		fireEvent.change(screen.getByLabelText("First"), {
			target: { value: "one" },
		});
		expect(screen.getByLabelText("Second")).toHaveValue("");
		view.unmount();
	});

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

	it("reads a replaced external state and path without local value copying", async () => {
		const firstState = createTextFieldTestState({ email: "first" });
		const secondState = createTextFieldTestState({ email: "second" });
		const view = render(
			<TextField state={firstState} path="email" label="Email" />,
		);
		expect(screen.getByLabelText("Email")).toHaveValue("first");
		view.rerender(<TextField state={secondState} path="email" label="Email" />);
		await waitFor(() =>
			expect(screen.getByLabelText("Email")).toHaveValue("second"),
		);
		secondState.email = "updated";
		await waitFor(() =>
			expect(screen.getByLabelText("Email")).toHaveValue("updated"),
		);
	});

	it("keeps number value resolution working", () => {
		const handleChange = vi.fn();

		render(
			<TextField
				label="Display order"
				type="number"
				value={1}
				onChange={handleChange}
			/>,
		);

		fireEvent.change(screen.getByLabelText("Display order"), {
			target: { value: "2" },
		});

		expect(handleChange).toHaveBeenCalledWith(2);
	});
});
