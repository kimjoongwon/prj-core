"use client";

import { AccountTenantSelect } from "@cocrepo/ui";

/** 서버에 저장할 현재 Tenant membership을 선택합니다. */
function SelectSpacePage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-6">
			<section className="w-full max-w-md rounded-2xl border border-border bg-content1 p-8 shadow-sm">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
					Current Space
				</p>
				<h1 className="mt-2 text-2xl font-semibold text-foreground">
					작업할 공간을 선택하세요
				</h1>
				<p className="mt-2 text-sm text-muted">
					선택한 공간은 계정에 저장되어 다음 접속에도 유지됩니다.
				</p>
				<div className="mt-6">
					<AccountTenantSelect />
				</div>
			</section>
		</main>
	);
}

export default SelectSpacePage;
