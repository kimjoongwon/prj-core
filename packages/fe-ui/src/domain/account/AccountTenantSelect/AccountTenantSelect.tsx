"use client";

import { useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { Select } from "../../../input/Select/Select";
import { useAccountTenantSelection } from "./useAccountTenantSelection";

const accountTenantSelectClassNames = {
	trigger:
		"inline-flex h-10 w-40 shrink-0 flex-nowrap items-center justify-start gap-2 rounded-lg border border-border bg-surface px-3 text-foreground hover:bg-surface-hover sm:w-52 lg:w-60",
	value: "min-w-0 flex-1 truncate text-left text-sm text-foreground",
	indicator: "h-4 w-4 shrink-0 text-muted",
	popover: "min-w-40 sm:min-w-52 lg:min-w-60",
	listbox: "min-w-40 sm:min-w-52 lg:min-w-60",
};

/** Account 상태와 API를 연결해 현재 Tenant 선택을 모두 처리합니다. */
export const AccountTenantSelect = observer(function AccountTenantSelect() {
	const account = useApp().account;
	const selection = useAccountTenantSelection();

	return (
		<Select
			aria-label="Space 선택"
			value={selection.currentTenantId}
			onValueChange={selection.selectTenant}
			placeholder={account.currentFitnessCenterName ?? "Space 확인 중"}
			options={selection.options}
			isDisabled={selection.isPending || selection.options.length === 0}
			classNames={accountTenantSelectClassNames}
		/>
	);
});

AccountTenantSelect.displayName = "AccountTenantSelect";
