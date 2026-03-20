"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TemplateEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type TemplateEditPageParams = {
	templateId: string;
};

export default function TemplateEditPage() {
	const { templateId } = useParams<TemplateEditPageParams>();

	return <TemplateEditPageClient templateId={templateId} />;
}
