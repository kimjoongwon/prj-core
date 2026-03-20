"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoleEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoleEditPageParams = {
	roleId: string;
};

export default function RoleEditPage() {
	const { roleId } = useParams<RoleEditPageParams>();

	return <RoleEditPageClient roleId={roleId} />;
}
