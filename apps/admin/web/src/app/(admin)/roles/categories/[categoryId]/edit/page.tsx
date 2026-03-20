"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoleCategoryEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoleCategoryEditPageParams = {
	categoryId: string;
};

export default function RoleCategoryEditPage() {
	const { categoryId } = useParams<RoleCategoryEditPageParams>();

	return <RoleCategoryEditPageClient categoryId={categoryId} />;
}
