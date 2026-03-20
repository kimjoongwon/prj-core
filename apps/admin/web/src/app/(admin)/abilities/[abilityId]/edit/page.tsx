"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const AbilityEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type AbilityEditPageParams = {
	abilityId: string;
};

export default function AbilityEditPage() {
	const { abilityId } = useParams<AbilityEditPageParams>();

	return <AbilityEditPageClient abilityId={abilityId} />;
}
