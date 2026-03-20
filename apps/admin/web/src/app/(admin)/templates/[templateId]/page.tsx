"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TemplateDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type TemplateDetailPageParams = {
	templateId: string;
};

export default function TemplateDetailPage() {
	const { templateId } = useParams<TemplateDetailPageParams>();

	return <TemplateDetailPageClient templateId={templateId} />;
}
