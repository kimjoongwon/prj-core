import {
  Link,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';

interface NavItem {
  text: string;
  href: string;
}

interface NavbarProps {
  items: NavItem[];
  rightContents?: React.ReactNode;
  leftContents?: React.ReactNode;
}

export function Navbar(props: NavbarProps) {
  const { rightContents = <div>left</div>, leftContents = <div>right</div> } =
    props;
  const {
    items = [
      {
        text: '1',
        href: '1',
      },
      {
        text: '2',
        href: '2',
      },
    ],
  } = props;

  const renderItem = (item: NavItem) => (
    <NavbarItem key={item.text}>
      <Link href={item.href}>{item.text}</Link>
    </NavbarItem>
  );

  return (
    <>
      <NextUINavbar isBordered>
        <NavbarBrand>{leftContents}</NavbarBrand>
        <NavbarContent>{items.map(renderItem)}</NavbarContent>
        <NavbarContent justify="end">{rightContents}</NavbarContent>
      </NextUINavbar>
    </>
  );
}
