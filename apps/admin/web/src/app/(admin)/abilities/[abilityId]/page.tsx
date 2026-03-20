"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const AbilityDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type AbilityDetailPageParams = {
	abilityId: string;
};

export default function AbilityDetailPage() {
	const { abilityId } = useParams<AbilityDetailPageParams>();

	return <AbilityDetailPageClient abilityId={abilityId} />;
}
