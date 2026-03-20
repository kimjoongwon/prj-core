"use client";

import dynamic from "next/dynamic";

const SecurityPolicyPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function SecurityPolicyPage() {
	return <SecurityPolicyPageClient />;
}
