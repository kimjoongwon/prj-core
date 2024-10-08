import { Link } from '@nextui-org/react';
import { LinkCellProps } from '.';
import { observer } from 'mobx-react-lite';

interface LinkCellViewProps extends LinkCellProps {}

export const LinkCellView = observer((props: LinkCellViewProps) => {
  const { value, href } = props;
  return <Link href={href}>{value}</Link>;
});
