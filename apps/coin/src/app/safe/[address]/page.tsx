"use client";

import { use } from "react";
import { SafeDashboard } from "@/components/safe/SafeDashboard";

interface SafePageProps {
	params: Promise<{ address: string }>;
}

export default function SafePage({ params }: SafePageProps) {
	const { address } = use(params);

	return (
		<main className="min-h-screen bg-gray-100 py-8">
			<SafeDashboard safeAddress={address} />
		</main>
	);
}
