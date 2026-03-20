"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const SubjectDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type SubjectDetailPageParams = {
	subjectId: string;
};

export default function SubjectDetailPage() {
	const { subjectId } = useParams<SubjectDetailPageParams>();

	return <SubjectDetailPageClient subjectId={subjectId} />;
}
