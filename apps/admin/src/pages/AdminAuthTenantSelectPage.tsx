import {
  Button,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState } from "react";

interface Tenant {
  id: string;
  name: string;
}

interface AdminAuthTenantSelectPageProps {
  tenants: Tenant[];
  onSelect: (tenantId: string) => void;
}

export const AdminAuthTenantSelectPage = ({
  tenants,
  onSelect,
}: AdminAuthTenantSelectPageProps) => {
  const [selectedTenant, setSelectedTenant] = useState("");

  const handleSelect = () => {
    if (!selectedTenant) {
      alert("그라운드를 선택해주세요.");
      return;
    }
    onSelect(selectedTenant);
  };

  return (
    <Modal isOpen={true} size="lg">
      <ModalContent>
        <ModalHeader>그라운드 선택</ModalHeader>
        <ModalBody>
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
              <ListboxItem key={tenant.id}>{tenant.name}</ListboxItem>
            ))}
          </Listbox>
          <ModalFooter>
            <Button color="primary" size="md" className="w-full" onPress={handleSelect}>
              선택
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
