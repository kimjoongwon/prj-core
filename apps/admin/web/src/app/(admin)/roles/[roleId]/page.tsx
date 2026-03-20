"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoleDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoleDetailPageParams = {
	roleId: string;
};

export default function RoleDetailPage() {
	const { roleId } = useParams<RoleDetailPageParams>();

	return <RoleDetailPageClient roleId={roleId} />;
}
