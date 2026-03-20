"use client";

import dynamic from "next/dynamic";

const AccountsPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function AccountsPage() {
	return <AccountsPageClient />;
}
