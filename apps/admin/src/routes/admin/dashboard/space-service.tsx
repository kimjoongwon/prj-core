import { createFileRoute, Outlet } from "@tanstack/react-router";

const SpaceServiceRouteComponent = () => {
	return (
		<div>
			<h2 className="mb-4 font-semibold text-gray-900 text-lg">공간 서비스</h2>
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute("/admin/dashboard/space-service")({
	component: SpaceServiceRouteComponent,
});
