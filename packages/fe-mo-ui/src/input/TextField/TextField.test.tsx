import {
	InputStateInspectionProvider,
	useInputStateInspection,
} from "@cocrepo/hook/input-state-inspection";
import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";
import { type ReactNode } from "react";
import { Text } from "react-native";
import { observable } from "mobx";
import { runInAction } from "mobx";
import { TextField } from "./index";

jest.mock("heroui-native/input", () => {
	const { TextInput } = require("react-native");
	return { Input: TextInput, inputClassNames: () => ({}) };
});
jest.mock("heroui-native/text-field", () => {
	const Root = ({ children }: { children: ReactNode }) => children;
	return {
		TextField: Root,
		textFieldClassNames: () => ({}),
		useTextField: () => ({}),
	};
});
jest.mock("heroui-native/label", () => {
	const { Text } = require("react-native");
	return {
		Label: ({ children }: { children: ReactNode }) => <Text>{children}</Text>,
		labelClassNames: () => ({}),
	};
});

const InspectionValue = () => {
	const inspection = useInputStateInspection();
	const id = inspection?.entries()[0];
	return (
		<Text testID="inspection-value">
			{String(id ? inspection.read(id) : "")}
		</Text>
	);
};
const renderInput = (children: ReactNode) =>
	render(
		<InputStateInspectionProvider>
			{children}
			<InspectionValue />
		</InputStateInspectionProvider>,
	);

describe("TextField input state contract", () => {
	it("keeps standalone compound input editable and exposes the live internal value", async () => {
		renderInput(<TextField.Input accessibilityLabel="name" />);
		fireEvent.changeText(screen.getByLabelText("name"), "Ada");
		await waitFor(() =>
			expect(screen.getByTestId("inspection-value")).toHaveTextContent("Ada"),
		);
	});

	it("uses controlled value as the source and invokes onChange once", async () => {
		const onChange = jest.fn();
		const view = renderInput(
			<TextField.Input
				accessibilityLabel="name"
				value="one"
				onChange={onChange}
			/>,
		);
		fireEvent.changeText(screen.getByLabelText("name"), "two");
		expect(onChange).toHaveBeenCalledTimes(1);
		view.rerender(
			<InputStateInspectionProvider>
				<TextField.Input
					accessibilityLabel="name"
					value="three"
					onChange={onChange}
				/>
				<InspectionValue />
			</InputStateInspectionProvider>,
		);
		await waitFor(() =>
			expect(screen.getByTestId("inspection-value")).toHaveTextContent("three"),
		);
	});

	it("renders public TextField controlled value and updates input plus inspection", async () => {
		const onChange = jest.fn();
		const view = renderInput(
			<TextField
				label="이름"
				accessibilityLabel="public-name"
				value="one"
				onChange={onChange}
			/>,
		);
		fireEvent.changeText(screen.getByLabelText("public-name"), "two");
		expect(onChange).toHaveBeenCalledTimes(1);
		view.rerender(
			<InputStateInspectionProvider>
				<TextField
					label="이름"
					accessibilityLabel="public-name"
					value="three"
					onChange={onChange}
				/>
				<InspectionValue />
			</InputStateInspectionProvider>,
		);
		await waitFor(() => {
			expect(screen.getByLabelText("public-name").props.value).toBe("three");
			expect(screen.getByTestId("inspection-value")).toHaveTextContent("three");
		});
	});

	it("renders public TextField bound to external state and follows path changes", async () => {
		const state = observable({ name: "one", other: "two" });
		const view = renderInput(
			<TextField accessibilityLabel="bound-name" state={state} path="name" />,
		);
		runInAction(() => {
			state.name = "three";
		});
		await waitFor(() =>
			expect(screen.getByLabelText("bound-name").props.value).toBe("three"),
		);
		view.rerender(
			<InputStateInspectionProvider>
				<TextField accessibilityLabel="bound-name" state={state} path="other" />
				<InspectionValue />
			</InputStateInspectionProvider>,
		);
		await waitFor(() =>
			expect(screen.getByLabelText("bound-name").props.value).toBe("two"),
		);
	});
});
