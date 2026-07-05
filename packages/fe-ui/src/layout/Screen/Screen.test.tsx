import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Screen } from "./Screen";

describe("Screen", () => {
	it("Given screen header props When rendered Then page title, description, and actions are available", () => {
		render(
			<Screen>
				<Screen.Header
					title="사용자 목록"
					description="서비스 사용자를 관리합니다."
					actions={<button type="button">사용자 추가</button>}
				/>
			</Screen>,
		);

		expect(
			screen.getByRole("heading", { level: 1, name: "사용자 목록" }),
		).toBeInTheDocument();
		expect(screen.getByText("서비스 사용자를 관리합니다.")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "사용자 추가" }),
		).toBeInTheDocument();
	});
});
