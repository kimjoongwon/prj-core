import { Suspense } from "react";
import { Dashboard } from "@/components/Dashboard";
import { Header } from "@/components/Header";

export default function Home() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="container mx-auto p-6">
				<Suspense fallback={<LoadingSkeleton />}>
					<Dashboard />
				</Suspense>
			</main>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div
					key={i}
					className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
				/>
			))}
		</div>
	);
}
