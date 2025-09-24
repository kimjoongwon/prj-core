import { createFileRoute, Outlet } from "@tanstack/react-router";

const UserServiceRouteComponent = () => {
	return (
		<div>
			<h2 className="mb-4 font-semibold text-gray-900 text-lg">
				사용자 서비스
			</h2>
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute("/admin/dashboard/user-service")({
	component: UserServiceRouteComponent,
});
