"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import { Input } from "@heroui/react";
import { useDebouncedCallback } from "@cocrepo/hook";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

interface SearchInputProps {
	config: InputConfig;
	queryStates: MetaDataGridQueryStates;
	setQueryStates: MetaDataGridSetQueryStates;
}

export const SearchInput = observer(({
	config,
	queryStates,
	setQueryStates,
}: SearchInputProps) => {
	const queryKey = config.props?.queryKey ?? config.id;
	const query =
		typeof queryStates[queryKey] === "string"
			? (queryStates[queryKey] as string)
			: "";
	const [inputValue, setInputValue] = useState(query);

	useEffect(() => {
		setInputValue(query);
	}, [query]);

	const debouncedSetQuery = useDebouncedCallback(
		(value: string) => setQueryStates({ [queryKey]: value || null }),
		config.props?.debounceMs ?? 300,
	);

	return (
		<Input
			placeholder={config.placeholder}
			value={inputValue}
			onValueChange={(value) => {
				setInputValue(value);
				debouncedSetQuery(value);
			}}
			startContent={<Search size={16} className="text-default-400" />}
			classNames={{
				base: "max-w-xs",
				inputWrapper: "h-10",
			}}
			isClearable
			onClear={() => {
				setInputValue("");
				void setQueryStates({ [queryKey]: null });
			}}
		/>
	);
});
