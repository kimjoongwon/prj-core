"use client";

import type { InputConfig } from "@cocrepo/type";
import { Dropdown } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { Button } from "../../../input/Button/Button";
import { useHandlers } from "./useHandlers";

export interface DropdownInputProps {
	config: InputConfig;
}

export const DropdownInput = observer((state: DropdownInputProps) => {
	const { config } = state;
	const t = useT();
	const items = config.props?.items ?? [];
	const handlers = useHandlers(state);

	return (
		<Dropdown>
			<Dropdown.Trigger>
				<Button variant={handlers.buttonVariant}>
					{config.label ? t(config.label) : null}
					<ChevronDown size={16} aria-hidden />
				</Button>
			</Dropdown.Trigger>
			<Dropdown.Menu
				aria-label={config.label ? t(config.label) : config.id}
				onAction={handlers.activateMenuItem}
			>
				{items.map((item) => (
					<Dropdown.Item key={item.key}>{t(item.label)}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
});
