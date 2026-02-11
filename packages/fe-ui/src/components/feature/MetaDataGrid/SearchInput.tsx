"use client";

import type { InputConfig } from "@cocrepo/type";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { parseAsString, useQueryState } from "nuqs";
import { useDebouncedCallback } from "../../../hooks";

interface SearchInputProps {
	config: InputConfig;
}

export const SearchInput = observer(({ config }: SearchInputProps) => {
	const queryKey = config.props?.queryKey ?? config.id;
	const [query, setQuery] = useQueryState(
		queryKey,
		parseAsString.withDefault(""),
	);

	const debouncedSetQuery = useDebouncedCallback(
		(value: string) => setQuery(value || null),
		config.props?.debounceMs ?? 300,
	);

	return (
		<Input
			placeholder={config.placeholder}
			defaultValue={query}
			onChange={(e) => debouncedSetQuery(e.target.value)}
			startContent={<Search size={16} className="text-default-400" />}
			classNames={{
				base: "max-w-xs",
				inputWrapper: "h-10",
			}}
			isClearable
			onClear={() => setQuery(null)}
		/>
	);
});
