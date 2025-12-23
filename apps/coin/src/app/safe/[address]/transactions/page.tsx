"use client";

import { use } from "react";
import { TransactionList } from "@/components/safe/TransactionList";

interface TransactionsPageProps {
	params: Promise<{ address: string }>;
}

export default function TransactionsPage({ params }: TransactionsPageProps) {
	const { address } = use(params);

	return (
		<main className="min-h-screen bg-gray-100 py-8">
			<TransactionList safeAddress={address} />
		</main>
	);
}
