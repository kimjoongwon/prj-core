"use client";

import { SearchField as HeroSearchField } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ComponentProps } from "react";

export type SearchFieldProps = ComponentProps<typeof HeroSearchField>;

const SearchFieldBase = (props: SearchFieldProps) => {
	return <HeroSearchField {...props} />;
};

export const SearchField = Object.assign(
	observer(SearchFieldBase),
	HeroSearchField,
) as unknown as typeof HeroSearchField;
