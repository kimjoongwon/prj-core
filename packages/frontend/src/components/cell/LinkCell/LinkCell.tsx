import { Link, LinkProps } from "@heroui/react";

interface LinkCellViewProps extends LinkProps {
	value: string;
}

export const LinkCell = (props: LinkCellViewProps) => {
	const { value, ...linkProps } = props;
	return <Link {...linkProps}>{value}</Link>;
};
