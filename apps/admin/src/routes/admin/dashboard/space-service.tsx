import { Outlet, createFileRoute } from "@tanstack/react-router";

const SpaceServiceRouteComponent = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">공간 서비스</h2>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard/space-service")({
  component: SpaceServiceRouteComponent,
});