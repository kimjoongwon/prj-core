"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const AbilityActionsPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type AbilityActionsPageParams = {
	roleId: string;
	abilityId: string;
};

export default function AbilityActionsPage() {
	const { roleId, abilityId } = useParams<AbilityActionsPageParams>();

	return <AbilityActionsPageClient roleId={roleId} abilityId={abilityId} />;
}
