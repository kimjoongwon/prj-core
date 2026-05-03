"use client";

import type { InputConfig, DataGridState } from "@cocrepo/type";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useT } from "../../i18n";

interface SearchInputProps {
	config: InputConfig;
	state: DataGridState;
}

export const SearchInput = observer(({ config, state }: SearchInputProps) => {
	const t = useT();
	const queryKey = config.props?.queryKey ?? config.id;
	const query =
		typeof state.query.values[queryKey] === "string"
			? (state.query.values[queryKey] as string)
			: "";
	const [inputValue, setInputValue] = useState(query);

	useEffect(() => {
		setInputValue(query);
	}, [query]);

	const commitQuery = () => {
		void state.query.setValues({
			[queryKey]: inputValue.trim() || null,
			skip: 0,
		});
	};

	const handleValueChange = (value: string) => {
		setInputValue(value);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") {
			return;
		}

		event.preventDefault();
		commitQuery();
	};

	const handleClear = () => {
		setInputValue("");
		void state.query.setValues({
			[queryKey]: null,
			skip: 0,
		});
	};

	return (
		<Input
			placeholder={config.placeholder ? t(config.placeholder) : undefined}
			value={inputValue}
			onValueChange={handleValueChange}
			onKeyDown={handleKeyDown}
			startContent={<Search size={16} className="text-default-400" />}
			classNames={{
				base: "max-w-xs",
				inputWrapper: "h-10",
			}}
			isClearable
			onClear={handleClear}
		/>
	);
});
