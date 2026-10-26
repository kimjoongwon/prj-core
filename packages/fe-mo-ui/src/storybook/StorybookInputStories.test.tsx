import { InputStateInspectionProvider } from "@cocrepo/hook/input-state-inspection";
import {
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react-native";
import { type ReactNode } from "react";
import { DesignSystemProvider } from "../design-system/provider";
import {
	ControlFieldDefaultHarness,
	ControlFieldExternalStateHarness,
} from "../input/ControlField/ControlField.stories";
import {
	DateStripDefaultHarness,
	DateStripExternalStateHarness,
} from "../input/DateStrip/DateStrip.stories";
import { StorybookStatePreview } from "./StorybookStatePreview";

// Storybook's helper only needs the inspection hook; avoid loading the full
// web-oriented hook barrel (which includes nuqs' ESM-only module) in Jest.
jest.mock("@cocrepo/hook", () =>
	require("@cocrepo/hook/input-state-inspection"),
);

const renderStoryHarness = (children: ReactNode) =>
	render(
		<InputStateInspectionProvider>
			<DesignSystemProvider config={{ animation: "disable-all", toast: false }}>
				<StorybookStatePreview source="story-source">
					{children}
				</StorybookStatePreview>
			</DesignSystemProvider>
		</InputStateInspectionProvider>,
	);

describe("mobile Storybook input stories", () => {
	it("renders ControlField default and external story harnesses with live panel state", async () => {
		const basic = renderStoryHarness(<ControlFieldDefaultHarness />);
		expect(screen.getByText("현재 state")).toBeTruthy();
		await waitFor(() =>
			expect(screen.getAllByText(/true/).length).toBeGreaterThan(0),
		);
		fireEvent.press(screen.getByRole("switch"));
		await waitFor(() =>
			expect(screen.getAllByText(/false/).length).toBeGreaterThan(0),
		);
		basic.unmount();
		renderStoryHarness(<ControlFieldExternalStateHarness />);
		await waitFor(() =>
			expect(screen.getAllByText(/false/).length).toBeGreaterThan(0),
		);
		fireEvent.press(screen.getByRole("switch"));
		await waitFor(() =>
			expect(screen.getAllByText(/true/).length).toBeGreaterThan(0),
		);
	});

	it("renders DateStrip default and external story harnesses with live panel state", async () => {
		const basic = renderStoryHarness(<DateStripDefaultHarness />);
		expect(screen.getByText("현재 state")).toBeTruthy();
		expect(screen.getAllByText(/2026-05-13/).length).toBeGreaterThan(0);
		fireEvent.press(screen.getByLabelText("목 14"));
		await waitFor(() =>
			expect(screen.getAllByText(/2026-05-14/).length).toBeGreaterThan(0),
		);
		basic.unmount();
		renderStoryHarness(<DateStripExternalStateHarness />);
		await waitFor(() =>
			expect(screen.getAllByText(/2026-05-13/).length).toBeGreaterThan(0),
		);
		fireEvent.press(screen.getByLabelText("목 14"));
		await waitFor(() =>
			expect(screen.getAllByText(/2026-05-14/).length).toBeGreaterThan(0),
		);
	});
});
