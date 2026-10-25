import meta, { createTemplateFormStoryState } from "./TemplateForm.stories";

describe("TemplateForm story state", () => {
	it("does not expose its factory as a Storybook story", () => {
		expect(meta.excludeStories).toContain("createTemplateFormStoryState");
	});
	it("keeps form fields and variable edits isolated per story instance", () => {
		const first = createTemplateFormStoryState({
			formData: { type: "EMAIL", code: "A", name: "첫 템플릿", description: "", subject: "", content: "" },
			variables: [],
			errors: {},
		});
		const second = createTemplateFormStoryState({
			formData: { type: "EMAIL", code: "B", name: "두 번째 템플릿", description: "", subject: "", content: "" },
			variables: [],
			errors: {},
		});

		first.formData.name = "수정된 템플릿";
		expect(first.formData.name).toBe("수정된 템플릿");
		expect(second.formData.name).toBe("두 번째 템플릿");
	});
});
