import { Link } from '@heroui/react';
import { LinkCellProps } from '@shared/frontend';
import { observer } from 'mobx-react-lite';
import React from 'react';

interface LinkCellViewProps extends LinkCellProps {}

export const LinkCell = observer((props: LinkCellViewProps) => {
  const { value, href } = props;
  return <Link href={href}>{value}</Link>;
});
