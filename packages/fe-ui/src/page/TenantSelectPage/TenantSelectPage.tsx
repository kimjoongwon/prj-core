"use client";

import {
	Button,
	Listbox,
	ListboxItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";

import { useState } from "react";

/** 테넌트 정보 */
interface Tenant {
	/** 테넌트 ID */
	id: string;
	/** 테넌트 이름 */
	name: string;
}

export interface TenantSelectPageProps {
	/** 테넌트 목록 */
	tenants: Tenant[];
	/** 테넌트 선택 핸들러 */
	onSelect: (tenantId: string) => void;
}

/**
 * TenantSelectPage 컴포넌트
 * 테넌트(그라운드) 선택 모달 페이지입니다.
 * 로그인 후 여러 테넌트에 속한 사용자가 접근할 테넌트를 선택합니다.
 *
 * @example
 * ```tsx
 * <TenantSelectPage
 *   tenants={[
 *     { id: "1", name: "본사" },
 *     { id: "2", name: "지사" },
 *   ]}
 *   onSelect={(tenantId) => router.push(`/dashboard?tenant=${tenantId}`)}
 * />
 * ```
 */
export const TenantSelectPage = observer(
	({ tenants, onSelect }: TenantSelectPageProps) => {
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
							selectedKeys={
								selectedTenant ? new Set([selectedTenant]) : new Set()
							}
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
							<Button
								color="primary"
								size="md"
								className="w-full"
								onPress={handleSelect}
							>
								선택
							</Button>
						</ModalFooter>
					</ModalBody>
				</ModalContent>
			</Modal>
		);
	},
);

TenantSelectPage.displayName = "TenantSelectPage";
