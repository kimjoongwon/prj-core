"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const GroundDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type GroundDetailPageParams = {
	spaceId: string;
};

export default function GroundDetailPage() {
	const { spaceId } = useParams<GroundDetailPageParams>();

	return <GroundDetailPageClient spaceId={spaceId} />;
}
