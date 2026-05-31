"use client";

import type { InputConfig } from "@cocrepo/type";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "../../design-system/primitives";
import { useT } from "../../i18n";

interface DropdownInputProps {
	config: InputConfig;
}

export const DropdownInput = observer(({ config }: DropdownInputProps) => {
	const t = useT();
	const items = config.props?.items ?? [];

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button
					variant={config.props?.variant ?? "flat"}
					endContent={<ChevronDown size={16} />}
				>
					{config.label ? t(config.label) : null}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label={config.label ? t(config.label) : config.id}
				onAction={(key) => {
					const item = items.find((i) => i.key === key);
					item?.onClick?.();
				}}
			>
				{items.map((item) => (
					<DropdownItem key={item.key}>{t(item.label)}</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
});
