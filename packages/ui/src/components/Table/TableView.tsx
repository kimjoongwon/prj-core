import { ContainerProps } from '../../..';

interface TableHeaderLeftProps extends ContainerProps {}
interface TableHeaderRightProps extends ContainerProps {}
interface TableFooterProps extends ContainerProps {}
interface TableContentProps extends ContainerProps {}
interface TableContainerProps extends ContainerProps {}
interface TableHeaderContainerProps extends ContainerProps {}

export const Table = {
  Container: (props: TableContainerProps) => <div>{props.children}</div>,
  Header: (props: TableHeaderContainerProps) => <div>{props.children}</div>,
  HeaderLeft: (props: TableHeaderLeftProps) => <div>{props.children}</div>,
  HeaderRight: (props: TableHeaderRightProps) => <div>{props.children}</div>,
  Content: (props: TableContentProps) => <div>{props.children}</div>,
  Footer: (props: TableFooterProps) => <div>{props.children}</div>,
};
