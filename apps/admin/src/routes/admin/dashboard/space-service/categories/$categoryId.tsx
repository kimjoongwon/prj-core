import { RouteBuilder, Plate } from "@shared/frontend";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const CategoryIdRouteComponent = () => {
  // Find the category route from the route builders  
  const adminRoutes = Plate.navigation.routes;
  const adminRoute = adminRoutes.find(route => route.relativePath === "admin");
  const dashboardRoute = adminRoute?.children?.find(route => route.relativePath === "dashboard");
  const spaceServiceRoute = dashboardRoute?.children?.find(route => route.relativePath === "space-service");
  const categoriesRoute = spaceServiceRoute?.children?.find(route => route.relativePath === "categories");
  const categoryRoute = categoriesRoute?.children?.find(route => route.relativePath === ":categoryId");
  
  if (!categoryRoute) {
    return <Outlet />; // Just render children if route not found
  }

  return (
    <>
      <RouteBuilder routeBuilder={categoryRoute} />
      <Outlet />
    </>
  );
};

export const Route = createFileRoute("/admin/dashboard/space-service/categories/$categoryId")({
  component: CategoryIdRouteComponent,
});