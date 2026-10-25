import { InputStateInspectionProvider, useInputStateInspection } from "@cocrepo/hook/input-state-inspection";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { type ReactNode } from "react";
import { Text } from "react-native";
import { Checkbox } from "./index";

jest.mock("heroui-native", () => {
	const { Pressable } = require("react-native");
	const Root = ({ isSelected, onSelectedChange, children, ...props }: { isSelected?: boolean; onSelectedChange?: (value: boolean) => void; children?: ReactNode; [key: string]: unknown }) => (
		<Pressable accessibilityRole="checkbox" onPress={() => onSelectedChange?.(!isSelected)} {...props}>{children}</Pressable>
	);
	Root.Indicator = () => null;
	return { Checkbox: Root, checkboxClassNames: () => ({}), useCheckbox: () => ({}) };
});

const ReadValue = () => {
	const inspection = useInputStateInspection();
	const id = inspection?.entries()[0];
	return <Text testID="checkbox-inspection">{String(id ? inspection.read(id) : "")}</Text>;
};

const Wrapper = ({ children }: { children: ReactNode }) => (
	<InputStateInspectionProvider>{children}<ReadValue /></InputStateInspectionProvider>
);

describe("Checkbox controlled state", () => {
	it("does not mutate a controlled false value and reports one callback", async () => {
		const onChange = jest.fn();
		render(<Wrapper><Checkbox isSelected={false} onChange={onChange} /></Wrapper>);
		fireEvent.press(screen.getByRole("checkbox"));
		expect(onChange).toHaveBeenCalledTimes(1);
		await waitFor(() => expect(screen.getByTestId("checkbox-inspection")).toHaveTextContent("false"));
	});
});
