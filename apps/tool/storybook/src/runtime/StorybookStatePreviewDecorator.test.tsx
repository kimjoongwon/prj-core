import { TextField } from "@cocrepo/ui";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { withStorybookStatePreview } from "./StorybookStatePreviewDecorator";

describe("withStorybookStatePreview", () => {
	it("shares one inspection provider with the real TextField story", async () => {
		render(
			withStorybookStatePreview(() => <TextField label="Email" />, {
				title: "input/TextField",
			} as never),
		);

		const input = screen.getByLabelText("Email");
		await waitFor(() => expect(screen.getByText(/입력 state/)).toBeTruthy());

		fireEvent.change(input, { target: { value: "ops@example.com" } });
		await waitFor(() =>
			expect(
				screen.getAllByText(/ops@example.com/).length,
			).toBeGreaterThanOrEqual(2),
		);
	});
});
