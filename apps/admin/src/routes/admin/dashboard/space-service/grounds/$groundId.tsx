import { createFileRoute, Outlet } from "@tanstack/react-router";

const GroundIdRouteComponent = () => {
	const { groundId } = Route.useParams();

	return (
		<div>
			<h3 className="mb-4 font-medium text-gray-900 text-lg">
				그라운드 상세 ({groundId})
			</h3>
			<Outlet />
		</div>
	);
};

export const Route = createFileRoute(
	"/admin/dashboard/space-service/grounds/$groundId",
)({
	component: GroundIdRouteComponent,
});
