"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ActionDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type ActionDetailPageParams = {
	actionId: string;
};

export default function ActionDetailPage() {
	const { actionId } = useParams<ActionDetailPageParams>();

	return <ActionDetailPageClient actionId={actionId} />;
}
