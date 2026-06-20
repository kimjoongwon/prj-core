"use client";

import type { InputConfig } from "@cocrepo/type";
import { Dropdown } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { useT } from "../../i18n";

interface DropdownInputProps {
	config: InputConfig;
}

export const DropdownInput = observer(({ config }: DropdownInputProps) => {
	const t = useT();
	const items = config.props?.items ?? [];

	return (
		<Dropdown>
			<Dropdown.Trigger>
				<Button
					variant={config.props?.variant ?? "flat"}
					endContent={<ChevronDown size={16} />}
				>
					{config.label ? t(config.label) : null}
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
