import { LinkCellView } from './LinkCellView';

export interface LinkCellProps {
  value: string;
  href: string;
}

export const LinkCell = (props: LinkCellProps) => {
  const { value, href } = props;

  return <LinkCellView value={value} href={href} />;
};
