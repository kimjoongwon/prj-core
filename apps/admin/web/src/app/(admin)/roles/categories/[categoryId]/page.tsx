"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoleCategoryDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoleCategoryDetailPageParams = {
	categoryId: string;
};

export default function RoleCategoryDetailPage() {
	const { categoryId } = useParams<RoleCategoryDetailPageParams>();

	return <RoleCategoryDetailPageClient categoryId={categoryId} />;
}
