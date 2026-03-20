"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoleGroupEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoleGroupEditPageParams = {
	groupId: string;
};

export default function RoleGroupEditPage() {
	const { groupId } = useParams<RoleGroupEditPageParams>();

	return <RoleGroupEditPageClient groupId={groupId} />;
}
