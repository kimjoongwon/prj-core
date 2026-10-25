import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import meta, { SpaceCreateScreenStoryHarness } from "./SpaceCreateScreen.stories";

describe("SpaceCreateScreen story harness", () => {
	it("recomputes controlled props when a field changes", async () => {
		const user = userEvent.setup();
		render(<SpaceCreateScreenStoryHarness args={meta.args as never} />);
		const nameInput = screen.getByRole("textbox", { name: /시설명/ });
		await user.clear(nameInput);
		await user.type(nameInput, "새 스페이스");
		expect(nameInput).toHaveValue("새 스페이스");
	});
});
