import { Outlet, createFileRoute } from "@tanstack/react-router";

const GroundIdRouteComponent = () => {
  const { groundId } = Route.useParams();

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">그라운드 상세 ({groundId})</h3>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard/space-service/grounds/$groundId")({
  component: GroundIdRouteComponent,
});