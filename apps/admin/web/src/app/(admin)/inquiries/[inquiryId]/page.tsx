"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const InquiryDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type InquiryDetailPageParams = {
	inquiryId: string;
};

export default function InquiryDetailPage() {
	const { inquiryId } = useParams<InquiryDetailPageParams>();

	return <InquiryDetailPageClient inquiryId={inquiryId} />;
}
