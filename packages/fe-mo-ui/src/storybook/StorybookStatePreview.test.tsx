import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { StorybookStatePreview } from "./StorybookStatePreview";

jest.mock("../data-display/Typography", () => ({
	Typography: ({ children }: { children: ReactNode }) => {
		const { Text } = require("react-native");
		return <Text>{children}</Text>;
	},
}));

jest.mock("@cocrepo/hook", () => ({
	useInputStateInspection: () => ({
		entries: () => ["email"],
		read: () => ({ value: "first@example.com" }),
	}),
}));

describe("StorybookStatePreview", () => {
	it("renders state and keeps source collapsed by default", () => {
		render(
			<StorybookStatePreview
				readState={() => ({ value: "first@example.com" })}
				source={'<TextField state={state} path="value" />'}
			/>,
		);

		expect(screen.getByText("현재 state")).toBeTruthy();
		expect(screen.getAllByText(/first@example.com/).length).toBe(2);
		expect(screen.getByText("사용 코드 보기")).toBeTruthy();
	});
});
