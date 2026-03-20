"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoleGroupDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoleGroupDetailPageParams = {
	groupId: string;
};

export default function RoleGroupDetailPage() {
	const { groupId } = useParams<RoleGroupDetailPageParams>();

	return <RoleGroupDetailPageClient groupId={groupId} />;
}
