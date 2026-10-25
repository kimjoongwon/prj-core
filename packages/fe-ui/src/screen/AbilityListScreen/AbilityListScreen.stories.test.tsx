import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import meta, {
	AbilityListScreenStoryHarness,
} from "./AbilityListScreen.stories";

describe("AbilityListScreen story harness", () => {
	it("reflects search and filter reset through the rendered harness", async () => {
		const user = userEvent.setup();
		render(<AbilityListScreenStoryHarness args={meta.args as never} />);
		const search = screen.getByRole("textbox", { name: "권한 이름 검색" });
		await user.type(search, "예약");
		expect(search).toHaveValue("예약");
		await user.click(screen.getByRole("button", { name: "필터 초기화" }));
		expect(search).toHaveValue("");
	});

	it("updates the displayed page through the pagination query contract", async () => {
		const user = userEvent.setup();
		render(<AbilityListScreenStoryHarness args={meta.args as never} />);
		const secondPage = screen.getByRole("button", { name: "2" });
		expect(secondPage).not.toBeDisabled();
		await user.click(secondPage);
		expect(secondPage).toHaveAttribute("aria-current", "page");
		expect(screen.getByText("Cannot 접근 일괄 삭제")).toBeInTheDocument();
	});
});
