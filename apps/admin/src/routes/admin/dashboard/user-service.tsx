import { Outlet, createFileRoute } from "@tanstack/react-router";

const UserServiceRouteComponent = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">사용자 서비스</h2>
      <Outlet />
    </div>
  );
};

export const Route = createFileRoute("/admin/dashboard/user-service")({
  component: UserServiceRouteComponent,
});