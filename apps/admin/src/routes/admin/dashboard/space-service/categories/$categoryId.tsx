import { createFileRoute, Outlet } from "@tanstack/react-router";

const CategoryIdRouteComponent = () => {
  return <Outlet />;
};

export const Route = createFileRoute("/admin/dashboard/space-service/categories/$categoryId")({
  component: CategoryIdRouteComponent,
});
