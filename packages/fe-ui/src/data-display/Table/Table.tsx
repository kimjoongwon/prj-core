import {
	Table as HeroTable,
	type TableProps as HeroTableProps,
} from "@heroui/react";

type LegacyTableVariant = HeroTableProps["variant"] | "flat" | "bordered";

const mapTableVariant = (
	variant?: LegacyTableVariant,
): HeroTableProps["variant"] | undefined => {
	if (variant === "flat" || variant === "bordered") {
		return "secondary";
	}

	return variant;
};

export interface TableProps extends Omit<HeroTableProps, "variant"> {
	variant?: LegacyTableVariant;
}

const TableInternal = ({ variant, ...props }: TableProps) => {
	return <HeroTable {...props} variant={mapTableVariant(variant)} />;
};

export const Table = Object.assign(TableInternal, HeroTable);
