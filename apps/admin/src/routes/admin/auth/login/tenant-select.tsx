import { Button, Listbox, ListboxItem } from "@heroui/react";
import { VStack } from "@shared/frontend";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const TenantSelectRouteComponent = () => {
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState("");
  
  // Mock tenant data - in real app this would come from API
  const tenants = [
    { id: "1", name: "서울 그라운드" },
    { id: "2", name: "부산 그라운드" },
    { id: "3", name: "대구 그라운드" },
  ];

  const handleSelect = () => {
    if (!selectedTenant) {
      alert("그라운드를 선택해주세요.");
      return;
    }
    
    // Navigate to dashboard
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <VStack className="space-y-6 max-w-md mx-auto mt-16">
      <h2 className="text-xl font-bold text-center">그라운드 선택</h2>
      <Listbox
        aria-label="그라운드 선택"
        selectionMode="single"
        selectedKeys={selectedTenant ? new Set([selectedTenant]) : new Set()}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          setSelectedTenant(selected);
        }}
      >
        {tenants.map((tenant) => (
          <ListboxItem key={tenant.id}>
            {tenant.name}
          </ListboxItem>
        ))}
      </Listbox>
      <Button
        color="primary"
        size="md"
        className="w-full"
        onPress={handleSelect}
      >
        선택
      </Button>
    </VStack>
  );
};

export const Route = createFileRoute("/admin/auth/login/tenant-select")({
  component: TenantSelectRouteComponent,
});
