import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./Section";

describe("Section", () => {
	it("Given section header props When rendered Then section title, description, and actions are available", () => {
		render(
			<Section>
				<Section.Header
					title="기본 정보"
					description="주요 필드를 입력합니다."
					actions={<button type="button">편집</button>}
				/>
			</Section>,
		);

		expect(
			screen.getByRole("heading", { level: 2, name: "기본 정보" }),
		).toBeInTheDocument();
		expect(screen.getByText("주요 필드를 입력합니다.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "편집" })).toBeInTheDocument();
	});
});
