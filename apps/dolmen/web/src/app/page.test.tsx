import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import Page from "./page";

vi.mock("@cocrepo/ui", () => ({
	Container: ({ children }: { children: ReactNode }) => <main>{children}</main>,
	Chip: ({ children }: { children: ReactNode }) => <span>{children}</span>,
	Typography: {
		Heading: ({ children }: { children: ReactNode }) => <h1>{children}</h1>,
		Paragraph: ({ children }: { children: ReactNode }) => <p>{children}</p>,
	},
}));
vi.mock("../components/ChatPanel", () => ({ ChatPanel: () => null }));

afterEach(cleanup);

it("면접 주제와 AI의 이력서 근거 범위를 방문자에게 안내한다", () => {
	const { container } = render(<Page />);
	expect(
		screen.getByRole("heading", { name: "MOMO 이력서 Q&A" }),
	).toBeInTheDocument();
	expect(container.querySelector("footer")).toHaveTextContent(
		"MOMO는 등록된 이력서를 바탕으로 답하는 AI입니다.",
	);
	expect(container.querySelector("footer")).toHaveTextContent(
		"이력서에 없는 내용은 추측하지 않습니다.",
	);
	expect(container).not.toHaveTextContent(
		/온보딩|위키|hello-agents|임베딩|SSE|서비스 연결|근거 \d+개/,
	);
});
