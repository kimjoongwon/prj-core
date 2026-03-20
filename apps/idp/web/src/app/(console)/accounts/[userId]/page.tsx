"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const AccountDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type AccountDetailPageParams = {
	userId: string;
};

export default function AccountDetailPage() {
	const { userId } = useParams<AccountDetailPageParams>();

	return <AccountDetailPageClient userId={userId} />;
}
