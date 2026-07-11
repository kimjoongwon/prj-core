import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountTenantSelect } from "./AccountTenantSelect";

const mocks = vi.hoisted(() => ({
	account: {
		currentGroundName: "Ground A" as string | null,
	},
	selection: {
		currentTenantId: "tenant-a" as string | null,
		isPending: false,
		options: [
			{ value: "tenant-a", text: "Ground A" },
			{ value: "tenant-b", text: "Ground B" },
		],
		selectTenant: vi.fn(),
	},
}));

vi.mock("@cocrepo/store", () => ({
	useApp: () => ({ account: mocks.account }),
}));

vi.mock("./useAccountTenantSelection", () => ({
	useAccountTenantSelection: () => mocks.selection,
}));

vi.mock("../../../input/Select/Select", () => ({
	Select: ({
		"aria-label": ariaLabel,
		isDisabled,
		onValueChange,
		options = [],
		placeholder,
		value,
	}: {
		"aria-label": string;
		isDisabled?: boolean;
		onValueChange?: (value: string) => void;
		options?: Array<{ value: string | number; text: string }>;
		placeholder?: string;
		value?: string | null;
	}) => (
		<select
			aria-label={ariaLabel}
			data-placeholder={placeholder}
			disabled={isDisabled}
			onChange={(event) => onValueChange?.(event.target.value)}
			value={value ?? ""}
		>
			<option value="">선택</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.text}
				</option>
			))}
		</select>
	),
}));

describe("AccountTenantSelect", () => {
	beforeEach(() => {
		mocks.account.currentGroundName = "Ground A";
		mocks.selection.currentTenantId = "tenant-a";
		mocks.selection.isPending = false;
		mocks.selection.options = [
			{ value: "tenant-a", text: "Ground A" },
			{ value: "tenant-b", text: "Ground B" },
		];
		mocks.selection.selectTenant.mockReset();
	});

	it("Account 상태와 선택 훅으로 현재 tenant를 표시한다", () => {
		render(<AccountTenantSelect />);

		expect(screen.getByLabelText("Space 선택")).toHaveValue("tenant-a");
		expect(screen.getByText("Ground B")).toBeInTheDocument();
		expect(screen.getByLabelText("Space 선택")).toHaveAttribute(
			"data-placeholder",
			"Ground A",
		);
	});

	it("선택 변경 시 tenantId만 전달한다", () => {
		render(<AccountTenantSelect />);

		fireEvent.change(screen.getByLabelText("Space 선택"), {
			target: { value: "tenant-b" },
		});

		expect(mocks.selection.selectTenant).toHaveBeenCalledWith("tenant-b");
	});

	it("mutation이 pending이면 비활성화한다", () => {
		mocks.selection.isPending = true;
		render(<AccountTenantSelect />);

		expect(screen.getByLabelText("Space 선택")).toBeDisabled();
	});

	it("선택 가능한 Option이 없으면 비활성화한다", () => {
		mocks.selection.currentTenantId = null;
		mocks.selection.options = [];
		render(<AccountTenantSelect />);

		expect(screen.getByLabelText("Space 선택")).toBeDisabled();
	});
});
