import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import meta, {
	TaskExerciseEditScreenStoryHarness,
	createTaskExerciseEditScreenStoryState,
} from "./TaskExerciseEditScreen.stories";

describe("TaskExerciseEditScreen story state", () => {
	it("does not expose its factory as a Storybook story", () => {
		expect(meta.excludeStories).toContain("createTaskExerciseEditScreenStoryState");
	});
	it("opens and closes the asset browser state", () => {
		const state = createTaskExerciseEditScreenStoryState({
			name: "운동", durationMin: 10, durationSec: 0, count: 1,
			description: "", imageFileId: "image-1", videoFileId: "video-1", errors: {},
		});
		expect(state.isAssetBrowserOpen).toBe(false);
		state.openAssetBrowser();
		expect(state.isAssetBrowserOpen).toBe(true);
		state.closeAssetBrowser();
		expect(state.isAssetBrowserOpen).toBe(false);
	});

	it("opens and closes the modal through the rendered harness", async () => {
		const user = userEvent.setup();
		render(<TaskExerciseEditScreenStoryHarness args={meta.args as never} />);
		await user.click(screen.getAllByRole("button", { name: "다시 선택" })[0]);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Dismiss" }));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
