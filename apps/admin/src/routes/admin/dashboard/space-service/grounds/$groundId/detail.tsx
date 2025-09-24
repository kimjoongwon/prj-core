import { createFileRoute, Outlet } from "@tanstack/react-router";

const GroundDetailRouteComponent = () => {
	return (
		<div>
			<nav className="mb-6 flex space-x-4">
				<a href="info" className="text-blue-600 hover:text-blue-800">
					정보
				</a>
				<a href="members" className="text-blue-600 hover:text-blue-800">
					멤버
				</a>
			</nav>
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute(
	"/admin/dashboard/space-service/grounds/$groundId/detail",
)({
	component: GroundDetailRouteComponent,
});
