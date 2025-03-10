import { Link, LinkProps } from '@heroui/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

interface LinkCellViewProps extends LinkProps {
  value: string;
}

export const LinkCell = observer((props: LinkCellViewProps) => {
  const { value, href } = props;
  return <Link href={href}>{value}</Link>;
});
