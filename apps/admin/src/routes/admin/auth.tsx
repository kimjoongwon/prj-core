import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthRouteComponent = () => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md space-y-8">
				<Outlet />
			</div>
		</div>
	);
};

export const Route = createFileRoute("/admin/auth")({
	component: AuthRouteComponent,
});
