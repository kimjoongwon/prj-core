"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const AbilitySubjectsPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type AbilitySubjectsPageParams = {
	roleId: string;
	abilityId: string;
};

export default function AbilitySubjectsPage() {
	const { roleId, abilityId } = useParams<AbilitySubjectsPageParams>();

	return <AbilitySubjectsPageClient roleId={roleId} abilityId={abilityId} />;
}
