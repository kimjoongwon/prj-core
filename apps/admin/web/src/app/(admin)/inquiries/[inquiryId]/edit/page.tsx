"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const InquiryEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type InquiryEditPageParams = {
	inquiryId: string;
};

export default function InquiryEditPage() {
	const { inquiryId } = useParams<InquiryEditPageParams>();

	return <InquiryEditPageClient inquiryId={inquiryId} />;
}
