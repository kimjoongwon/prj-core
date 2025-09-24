import { createFileRoute, Outlet } from "@tanstack/react-router";

const DashboardRouteComponent = () => {
	return (
		<div className="min-h-screen bg-gray-100">
			{/* Dashboard Layout */}
			<nav className="border-gray-200 border-b bg-white px-6 py-4 shadow-sm">
				<h1 className="font-semibold text-gray-900 text-xl">Admin Dashboard</h1>
			</nav>

			<div className="flex">
				{/* Sidebar */}
				<aside className="min-h-screen w-64 bg-white shadow-sm">
					<nav className="mt-5 px-2">
						<div className="space-y-1">
							<a
								href="/admin/dashboard/user-service/users"
								className="group flex items-center rounded-md px-2 py-2 font-medium text-gray-600 text-sm hover:text-gray-900"
							>
								사용자 관리
							</a>
							<a
								href="/admin/dashboard/space-service/grounds"
								className="group flex items-center rounded-md px-2 py-2 font-medium text-gray-600 text-sm hover:text-gray-900"
							>
								그라운드 관리
							</a>
							<a
								href="/admin/dashboard/space-service/categories"
								className="group flex items-center rounded-md px-2 py-2 font-medium text-gray-600 text-sm hover:text-gray-900"
							>
								카테고리 관리
							</a>
						</div>
					</nav>
				</aside>

				{/* Main content */}
				<main className="flex-1 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export const Route = createFileRoute("/admin/dashboard")({
	component: DashboardRouteComponent,
});
