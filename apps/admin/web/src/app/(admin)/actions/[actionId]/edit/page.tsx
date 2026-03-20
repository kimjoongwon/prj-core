"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ActionEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type ActionEditPageParams = {
	actionId: string;
};

export default function ActionEditPage() {
	const { actionId } = useParams<ActionEditPageParams>();

	return <ActionEditPageClient actionId={actionId} />;
}
