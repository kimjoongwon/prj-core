import { createFileRoute } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";
import { AdminAuthLoginPage } from "../../../pages/AdminAuthLoginPage.tsx";
import { useAdminAuthLoginRoute } from "../../../hooks/useAdminLoginRoute.ts";

const LoginRouteComponent = observer(() => {
  const route = useAdminAuthLoginRoute();

  return <AdminAuthLoginPage {...route} />;
});

export const Route = createFileRoute("/admin/auth/login")({
  component: LoginRouteComponent,
});
