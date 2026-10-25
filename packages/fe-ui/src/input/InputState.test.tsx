import { InputStateInspectionProvider, useInputStateInspection } from "@cocrepo/hook";
import { LoginSchema } from "@cocrepo/schema";
import type { FormSchemaStateContract } from "@cocrepo/type";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/Form";
import { Checkbox } from "./Checkbox";
import { RadioGroup } from "./RadioGroup";
import { Select } from "./Select";
import { StringListInput } from "./StringListInput";
import { Switch } from "./Switch";
import { TextField } from "./TextField";

const Inspector = observer(() => {
	const inspection = useInputStateInspection();
	return (
		<output aria-label="inspection-values">
			{JSON.stringify(inspection?.entries().map((id) => inspection.read(id)) ?? [])}
		</output>
	);
});

interface ValidationTestState extends FormSchemaStateContract<LoginSchema> {
	email: string;
	password: string;
}

describe("input default and bound state contracts", () => {
	it("updates internal checkbox state and calls each callback once", async () => {
		const onChange = vi.fn();
		const onValueChange = vi.fn();
		render(
			<InputStateInspectionProvider>
				<Checkbox onChange={onChange} onValueChange={onValueChange}>
					Accept
				</Checkbox>
				<Inspector />
			</InputStateInspectionProvider>,
		);
		fireEvent.click(screen.getByText("Accept"));
		await waitFor(() => expect(screen.getByLabelText("inspection-values")).toHaveTextContent("true"));
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	it("switches checkbox from pure to bound mode without changing hook order", () => {
		const state = observable({ accepted: false });
		const view = render(<Checkbox>Accept</Checkbox>);
		view.rerender(<Checkbox path="accepted" state={state}>Accept</Checkbox>);
		fireEvent.click(screen.getByText("Accept"));
		expect(state.accepted).toBe(true);
	});

	it("keeps numeric RadioGroup state selected and writes numeric options", () => {
		const state = observable({ choice: 0 });
		render(
			<RadioGroup
				aria-label="Numeric choice"
				options={[{ value: 0, text: "Zero" }, { value: 1, text: "One" }]}
				path="choice"
				state={state}
			/>,
		);
		expect(screen.getByLabelText("Numeric choice")).toBeInTheDocument();
		fireEvent.click(screen.getByText("One"));
		expect(state.choice).toBe(1);
	});

	it("preserves controlled switch value while emitting one change callback", () => {
		const onValueChange = vi.fn();
		const view = render(
			<Switch value={false} onValueChange={onValueChange}>Notify</Switch>,
		);
		const switchControl = screen.getByRole("switch");
		fireEvent.click(switchControl);
		expect(onValueChange).toHaveBeenCalledTimes(1);
		expect(switchControl).not.toBeChecked();
		view.rerender(<Switch value={true} onValueChange={onValueChange}>Notify</Switch>);
		expect(screen.getByRole("switch")).toBeChecked();
	});

	it("updates a bound selection through its external path", async () => {
		const state = observable({ choice: "one" });
		render(
			<InputStateInspectionProvider>
				<Select
					label="Choice"
					options={[{ value: "one", text: "One" }, { value: "two", text: "Two" }]}
					path="choice"
					state={state}
				/>
				<RadioGroup
					label="Radio"
					options={[{ value: "one", text: "One" }, { value: "two", text: "Two" }]}
					path="choice"
					state={state}
				/>
				<Inspector />
			</InputStateInspectionProvider>,
		);
		fireEvent.click(screen.getAllByText("Two")[1]);
		await waitFor(() => expect(state.choice).toBe("two"));
	});

	it("renders the selected option label and only uses placeholder when empty", () => {
		const options = [
			{ value: "ko_KR", text: "한국어" },
			{ value: 0, text: "Zero" },
		];
		const view = render(
			<Select
				aria-label="Language"
				options={options}
				placeholder="Choose language"
				value="ko_KR"
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("한국어");
		view.rerender(
			<Select
				aria-label="Language"
				options={options}
				placeholder="Choose language"
				value={null}
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Choose language");
	});

	it("renders numeric zero keys from controlled and default values", () => {
		const options = [{ value: 0, text: "Zero" }];
		const view = render(
			<Select aria-label="Number" options={options} placeholder="Choose" value={0} />,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Zero");
		view.unmount();
		const defaultView = render(
			<Select
				aria-label="Number"
				defaultValue={0}
				options={options}
				placeholder="Choose"
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Zero");
		defaultView.unmount();
		const secondView = render(
			<Select
				aria-label="Number"
				defaultSelectedKey={0}
				options={options}
				placeholder="Choose"
			/>,
		);
		expect(screen.getByRole("button")).toHaveTextContent("Zero");
		secondView.unmount();
	});

	it("supports default list add, edit, and remove without an external value", () => {
		render(<StringListInput placeholder="URL" addLabel="Add" removeLabel="Remove" />);
		fireEvent.click(screen.getByText("Add"));
		const input = screen.getByPlaceholderText("URL");
		fireEvent.change(input, { target: { value: "https://example.com" } });
		expect(input).toHaveValue("https://example.com");
		fireEvent.click(screen.getByLabelText("Remove"));
		expect(screen.queryByPlaceholderText("URL")).not.toBeInTheDocument();
	});

	it("runs bound validation at onChange and onBlur timings", async () => {
		const state = observable({
			email: "",
			password: "",
			fieldErrors: {} as Record<string, string>,
			errorMessage: null,
		}) as ValidationTestState;
		render(
			<Form state={state} schema={LoginSchema} validationTimings={["onChange", "onBlur"]}>
				<TextField state={state} path="email" label="Email" />
			</Form>,
		);
		const input = screen.getByLabelText("Email");
		fireEvent.change(input, { target: { value: "invalid" } });
		await waitFor(() => expect(state.fieldErrors.email).toBeDefined());
		fireEvent.blur(input);
		await waitFor(() => expect(state.fieldErrors.email).toBeDefined());
	});
});
