import { Link, LinkProps } from "@heroui/react";
import { observer } from "mobx-react-lite";

interface LinkCellViewProps extends LinkProps {
	value: string;
}

export const LinkCell = observer((props: LinkCellViewProps) => {
	const { value, ...linkProps } = props;
	return <Link {...linkProps}>{value}</Link>;
});
