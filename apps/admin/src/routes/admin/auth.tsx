import { Outlet, createFileRoute } from "@tanstack/react-router";

const AuthRouteComponent = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/admin/auth")({
  component: AuthRouteComponent,
});