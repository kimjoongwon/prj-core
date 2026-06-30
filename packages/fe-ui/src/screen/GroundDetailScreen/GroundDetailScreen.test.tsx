import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { GroundDetailScreen } from "./GroundDetailScreen";

vi.mock("@cocrepo/ui", () => {
	const SectionInternal = ({ children }: { children?: ReactNode }) => (
		<section>{children}</section>
	);

	return {
		Chip: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
		PageTitleBar: ({
			actions,
			description,
			level,
			title,
		}: {
			actions?: ReactNode;
			description?: ReactNode;
			level?: number;
			title: ReactNode;
		}) => (
			<header>
				{level === 2 ? <h2>{title}</h2> : <h1>{title}</h1>}
				{description ? <p>{description}</p> : null}
				{actions}
			</header>
		),
		Section: Object.assign(SectionInternal, {
			Body: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
			Header: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
		}),
		SectionSurface: ({ children }: { children?: ReactNode }) => (
			<div>{children}</div>
		),
		VStack: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
	};
});

const ground = {
	address: "address-1",
	email: "member1@example.com",
	label: "샘플 label 1",
	name: "샘플 시설 1",
	phone: "010-1234-5670",
};

describe("GroundDetailScreen", () => {
	it("renders only essential ground identity and contact fields", () => {
		render(
			<GroundDetailScreen
				ground={ground}
				isNotFound={false}
				onClickBackButton={vi.fn()}
				onClickEditButton={vi.fn()}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "샘플 시설 1" }),
		).toBeInTheDocument();
		expect(screen.getByText("샘플 label 1")).toBeInTheDocument();
		expect(screen.getByText("address-1")).toBeInTheDocument();
		expect(screen.getByText("010-1234-5670")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "member1@example.com" }),
		).toHaveAttribute("href", "mailto:member1@example.com");
		expect(screen.queryByText("사업자등록번호")).not.toBeInTheDocument();
		expect(screen.queryByText("등록일")).not.toBeInTheDocument();
		expect(screen.queryByText("수정일")).not.toBeInTheDocument();
		expect(screen.queryByText("Space ID")).not.toBeInTheDocument();
		expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
	});

	it("delegates not found back action to the page event prop", () => {
		const onClickBackButton = vi.fn();

		render(
			<GroundDetailScreen
				isNotFound
				onClickBackButton={onClickBackButton}
				onClickEditButton={vi.fn()}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "목록으로" }));

		expect(
			screen.getAllByText("시설 detail을 찾을 수 없습니다.").length,
		).toBeGreaterThan(0);
		expect(onClickBackButton).toHaveBeenCalledTimes(1);
	});
});
