"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const GroundEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type GroundEditPageParams = {
	spaceId: string;
};

export default function GroundEditPage() {
	const { spaceId } = useParams<GroundEditPageParams>();

	return <GroundEditPageClient spaceId={spaceId} />;
}
