import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminAuthTenantSelectPage } from "../../../../pages/AdminAuthTenantSelectPage";

const TenantSelectRouteComponent = () => {
  const navigate = useNavigate();

  // Mock tenant data - in real app this would come from API
  const tenants = [
    { id: "1", name: "서울 그라운드" },
    { id: "2", name: "부산 그라운드" },
    { id: "3", name: "대구 그라운드" },
  ];

  const handleSelect = (tenantId: string) => {
    // Navigate to dashboard with selected tenant
    console.log("Selected tenant:", tenantId);
    navigate({ to: "/admin/dashboard" });
  };

  return <AdminAuthTenantSelectPage tenants={tenants} onSelect={handleSelect} />;
};

export const Route = createFileRoute("/admin/auth/login/tenant-select")({
  component: TenantSelectRouteComponent,
});
