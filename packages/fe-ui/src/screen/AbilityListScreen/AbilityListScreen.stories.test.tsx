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

	it("filters the rendered rows by selected subject and action", async () => {
		const user = userEvent.setup();
		render(<AbilityListScreenStoryHarness args={meta.args as never} />);
		await user.click(screen.getByRole("button", { name: /대상 선택/ }));
		await user.click(screen.getByRole("option", { name: "예약" }));
		await user.click(screen.getByRole("button", { name: /행동 선택/ }));
		await user.click(screen.getByRole("option", { name: "수정" }));

		expect(screen.getByText("대상: 예약")).toBeInTheDocument();
		expect(screen.getByText("행동: 수정")).toBeInTheDocument();
		expect(screen.getByText("Can 수정 예약")).toBeInTheDocument();
		expect(screen.getByText("총 1건")).toBeInTheDocument();
	});
});
