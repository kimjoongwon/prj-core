import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinkCell } from "./LinkCell";

describe("LinkCell", () => {
	it("Given href and children When rendered Then it renders a link with the provided content", () => {
		render(<LinkCell href="/users/user-1">홍길동</LinkCell>);

		const link = screen.getByRole("link", { name: "홍길동" });

		expect(link).toHaveAttribute("href", "/users/user-1");
		expect(link).toHaveClass("text-accent", "hover:underline");
	});

	it("Given no href When rendered Then it displays a placeholder without a link", () => {
		render(<LinkCell>홍길동</LinkCell>);

		expect(screen.queryByRole("link")).not.toBeInTheDocument();
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("Given no children When rendered Then it displays a placeholder without a link", () => {
		render(<LinkCell href="/users/user-1" />);

		expect(screen.queryByRole("link")).not.toBeInTheDocument();
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("Given link attributes When rendered Then it forwards them to the link", () => {
		render(
			<LinkCell
				aria-label="회원 상세"
				className="font-semibold"
				href="/users/user-1"
				rel="noreferrer"
				target="_blank"
			>
				홍길동
			</LinkCell>,
		);

		const link = screen.getByRole("link", { name: "회원 상세" });

		expect(link).toHaveClass("font-semibold");
		expect(link).toHaveAttribute("rel", "noreferrer");
		expect(link).toHaveAttribute("target", "_blank");
	});
});
