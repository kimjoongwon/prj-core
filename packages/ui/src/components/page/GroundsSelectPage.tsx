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

interface Ground {
	id: string;
	name: string;
}

export interface GroundsSelectPageProps {
	grounds: Ground[];
	onSelect: (groundId: string) => void;
}

export const GroundsSelectPage = ({
	grounds,
	onSelect,
}: GroundsSelectPageProps) => {
	const [selectedGround, setSelectedGround] = useState("");

	const handleSelect = () => {
		if (!selectedGround) {
			alert("그라운드를 선택해주세요.");
			return;
		}
		onSelect(selectedGround);
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
							selectedGround ? new Set([selectedGround]) : new Set()
						}
						onSelectionChange={(keys) => {
							const selected = Array.from(keys)[0] as string;
							setSelectedGround(selected);
						}}
					>
						{grounds.map((ground) => (
							<ListboxItem key={ground.id}>{ground.name}</ListboxItem>
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
};
