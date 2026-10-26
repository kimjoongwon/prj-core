import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountTenantSelect } from "./AccountTenantSelect";

const mocks = vi.hoisted(() => ({
	account: {
		currentFitnessCenterName: "Fitness Center A" as string | null,
	},
	selection: {
		currentTenantId: "tenant-a" as string | null,
		isPending: false,
		options: [
			{ value: "tenant-a", text: "Fitness Center A" },
			{ value: "tenant-b", text: "Fitness Center B" },
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
		mocks.account.currentFitnessCenterName = "Fitness Center A";
		mocks.selection.currentTenantId = "tenant-a";
		mocks.selection.isPending = false;
		mocks.selection.options = [
			{ value: "tenant-a", text: "Fitness Center A" },
			{ value: "tenant-b", text: "Fitness Center B" },
		];
		mocks.selection.selectTenant.mockReset();
	});

	it("Given 현재 피트니스센터와 선택 Option이 있을 때, When selector를 렌더링하면, Then 현재 Tenant와 피트니스센터 이름을 표시한다", () => {
		render(<AccountTenantSelect />);

		expect(screen.getByLabelText("Space 선택")).toHaveValue("tenant-a");
		expect(screen.getByText("Fitness Center B")).toBeInTheDocument();
		expect(screen.getByLabelText("Space 선택")).toHaveAttribute(
			"data-placeholder",
			"Fitness Center A",
		);
	});

	it("Given 선택 가능한 피트니스센터가 있을 때, When 선택을 변경하면, Then tenantId만 선택 훅에 전달한다", () => {
		render(<AccountTenantSelect />);

		fireEvent.change(screen.getByLabelText("Space 선택"), {
			target: { value: "tenant-b" },
		});

		expect(mocks.selection.selectTenant).toHaveBeenCalledWith("tenant-b");
	});

	it("Given mutation이 pending일 때, When selector를 렌더링하면, Then selector를 비활성화한다", () => {
		mocks.selection.isPending = true;
		render(<AccountTenantSelect />);

		expect(screen.getByLabelText("Space 선택")).toBeDisabled();
	});

	it("Given 선택 가능한 Option이 없을 때, When selector를 렌더링하면, Then selector를 비활성화한다", () => {
		mocks.selection.currentTenantId = null;
		mocks.selection.options = [];
		render(<AccountTenantSelect />);

		expect(screen.getByLabelText("Space 선택")).toBeDisabled();
	});
});
