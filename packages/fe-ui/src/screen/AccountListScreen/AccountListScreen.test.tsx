import type { IdpAccountDto } from "@cocrepo/api/idp/idp-accounts";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DataGridState } from "../../data-grid/DataGrid";
import {
	AccountListScreen,
	type AccountListScreenProps,
} from "./AccountListScreen";

vi.mock("@cocrepo/ui", async (importOriginal) => {
	const ui = await importOriginal<typeof import("@cocrepo/ui")>();
	return {
		...ui,
		DataGrid: ({ state }: { state: DataGridState<IdpAccountDto> }) => (
			<div>
				<div data-testid="account-names">
					{state.table.rows.map((account) => account.name).join(", ")}
				</div>
				<output data-testid="account-count">
					{state.pagination.totalCount}
				</output>
				<output data-testid="account-sorting">
					{JSON.stringify(state.query.sort)}
				</output>
				<output data-testid="account-pagination">
					{JSON.stringify(state.query.pagination)}
				</output>
			</div>
		),
	};
});

const initialAccounts: IdpAccountDto[] = [
	{
		id: "ACC00000000000000000000001",
		name: "기존 계정",
		email: "initial@example.com",
		createdAt: new Date("2026-10-01T00:00:00.000Z"),
		isActive: true,
		failedLoginAttempts: 0,
		isPermanentlyLocked: false,
	},
];

const refreshedAccounts: IdpAccountDto[] = [
	{
		...initialAccounts[0],
		id: "ACC00000000000000000000002",
		name: "새 응답 계정",
		email: "refreshed@example.com",
	},
];

describe("AccountListScreen", () => {
	it("조회 응답과 query props가 바뀌면 행·총건수·정렬·페이지를 함께 갱신한다", () => {
		const initialProps: AccountListScreenProps = {
			accounts: initialAccounts,
			totalCount: 12,
			queryStates: { take: 10, skip: 0, search: "", sort: ["name"] },
			setQueryStates: async () => new URLSearchParams(),
			onClickUnlockAccountButton: vi.fn(),
		};
		const { rerender } = render(<AccountListScreen {...initialProps} />);

		expect(screen.getByTestId("account-names")).toHaveTextContent("기존 계정");
		expect(screen.getByTestId("account-count")).toHaveTextContent("12");
		expect(screen.getByTestId("account-sorting")).toHaveTextContent(
			JSON.stringify([{ id: "name", desc: false }]),
		);

		const refreshedQuery: AccountListScreenProps["queryStates"] = {
			take: 5,
			skip: 5,
			search: "새",
			sort: ["-email"],
		};
		rerender(
			<AccountListScreen {...initialProps} queryStates={refreshedQuery} />,
		);

		expect(screen.getByTestId("account-sorting")).toHaveTextContent(
			JSON.stringify([{ id: "email", desc: true }]),
		);
		expect(screen.getByTestId("account-pagination")).toHaveTextContent(
			JSON.stringify({ take: 5, skip: 5 }),
		);

		rerender(
			<AccountListScreen
				{...initialProps}
				accounts={refreshedAccounts}
				queryStates={refreshedQuery}
			/>,
		);

		expect(screen.getByTestId("account-names")).toHaveTextContent(
			"새 응답 계정",
		);
		expect(screen.getByTestId("account-names")).not.toHaveTextContent(
			"기존 계정",
		);
		expect(screen.getByTestId("account-count")).toHaveTextContent("12");

		rerender(
			<AccountListScreen
				{...initialProps}
				accounts={refreshedAccounts}
				queryStates={refreshedQuery}
				totalCount={2}
			/>,
		);

		expect(screen.getByTestId("account-count")).toHaveTextContent("2");
	});
});
