"use client";

import type { InputConfig } from "@cocrepo/type";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";

interface DropdownInputProps {
	config: InputConfig;
}

export const DropdownInput = observer(({ config }: DropdownInputProps) => {
	const items = config.props?.items ?? [];

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button
					variant={config.props?.variant ?? "flat"}
					endContent={<ChevronDown size={16} />}
				>
					{config.label}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label={config.label ?? config.id}
				onAction={(key) => {
					const item = items.find((i) => i.key === key);
					item?.onClick?.();
				}}
			>
				{items.map((item) => (
					<DropdownItem key={item.key}>{item.label}</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
});
