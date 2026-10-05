"use client";

import type { InputConfig } from "@cocrepo/type";
import { Dropdown } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Button, type ButtonProps } from "../../input/Button/Button";

interface DropdownInputProps {
	config: InputConfig;
}

function resolveButtonVariant(variant: string | undefined): ButtonProps["variant"] {
	return variant === "solid" ? "primary" : variant === "bordered" ? "outline" : "ghost";
}

export const DropdownInput = observer(({ config }: DropdownInputProps) => {
	const t = useT();
	const items = config.props?.items ?? [];

	return (
		<Dropdown>
			<Dropdown.Trigger>
				<Button
					variant={resolveButtonVariant(config.props?.variant)}
				>
					{config.label ? t(config.label) : null}
					<ChevronDown size={16} aria-hidden />
				</Button>
			</Dropdown.Trigger>
			<Dropdown.Menu
				aria-label={config.label ? t(config.label) : config.id}
				onAction={(key) => {
					const item = items.find((i) => i.key === key);
					item?.onClick?.();
				}}
			>
				{items.map((item) => (
					<Dropdown.Item key={item.key}>{t(item.label)}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
});
