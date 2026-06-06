"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";
import { Input } from "../../control/Input";
import { Modal, useOverlayState } from "@heroui/react";
import { useT } from "../../i18n";

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
	const t = useT();
	const modalState = useOverlayState({
		isOpen,
		onOpenChange: (open) => {
			if (!open) {
				onClose();
			}
		},
	});

	return (
		<Modal state={modalState}>
			<Modal.Backdrop><Modal.Container><Modal.Dialog>
				<Modal.Header>{t(title)}</Modal.Header>
				<Modal.Body>
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
										? "bg-accent/15 text-accent"
										: "bg-surface-secondary hover:bg-surface-tertiary"
								}`}
							>
								<p className="font-medium">{option.name}</p>
								{option.subtitle && (
									<p className="text-xs text-muted">{option.subtitle}</p>
								)}
							</button>
						))}
						{options.length === 0 && (
							<p className="text-sm text-muted">
								{t("검색 결과가 없습니다.")}
							</p>
						)}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="flat" onPress={onClose}>
						닫기
					</Button>
				</Modal.Footer>
			</Modal.Dialog></Modal.Container></Modal.Backdrop>
		</Modal>
	);
});

ProgramPickerModal.displayName = "ProgramPickerModal";
