"use client";

import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface ProgramPickerOption {
	id: string;
	name: string;
	subtitle?: string;
}

export interface ProgramPickerModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	searchLabel: string;
	searchPlaceholder: string;
	searchValue: string;
	onSearchValueChange: (value: string) => void;
	options: ProgramPickerOption[];
	onSelect: (id: string) => void;
	selectedId?: string;
}

export const ProgramPickerModal = observer(function ProgramPickerModal({
	isOpen,
	onClose,
	title,
	searchLabel,
	searchPlaceholder,
	searchValue,
	onSearchValueChange,
	options,
	onSelect,
	selectedId,
}: ProgramPickerModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>
					<Input
						label={searchLabel}
						labelPlacement="outside"
						placeholder={searchPlaceholder}
						value={searchValue}
						onValueChange={onSearchValueChange}
					/>
					<div className="flex max-h-80 flex-col gap-2 overflow-auto">
						{options.map((option) => (
							<button
								type="button"
								key={option.id}
								onClick={() => {
									onSelect(option.id);
									onClose();
								}}
								aria-pressed={selectedId === option.id}
								className={`rounded-md px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
									selectedId === option.id
										? "bg-primary/15 text-primary"
										: "bg-content2 hover:bg-content3"
								}`}
							>
								<p className="font-medium">{option.name}</p>
								{option.subtitle && (
									<p className="text-xs text-default-500">{option.subtitle}</p>
								)}
							</button>
						))}
						{options.length === 0 && (
							<p className="text-sm text-default-500">검색 결과가 없습니다.</p>
						)}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant="flat" onPress={onClose}>
						닫기
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

ProgramPickerModal.displayName = "ProgramPickerModal";
