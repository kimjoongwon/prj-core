"use client";

import { use } from "react";
import { SendForm } from "@/components/safe/SendForm";

interface SendPageProps {
	params: Promise<{ address: string }>;
}

export default function SendPage({ params }: SendPageProps) {
	const { address } = use(params);

	return (
		<main className="min-h-screen bg-gray-100 py-8">
			<SendForm safeAddress={address} />
		</main>
	);
}
