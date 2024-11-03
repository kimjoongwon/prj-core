'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import { useMenus } from './_hooks/useMenus';
import Link from 'next/link';

const SpaceServicePage = () => {
  const menus = useMenus();

  return (
    <Listbox variant="solid">
      {menus.map(menu => (
        <ListboxItem as={Link} href={menu.href} {...menu} key={menu.key}>
          {menu.children}
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default SpaceServicePage;
