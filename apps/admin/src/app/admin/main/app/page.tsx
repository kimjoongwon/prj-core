'use client';

import React from 'react';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { useMenus } from './_hooks/useMenus';
import { ListboxWrapper, VStack } from '@shared/frontend';
import Link from 'next/link';

const AppPage = () => {
  const menus = useMenus();
  return (
    <VStack className="p-4">
      <ListboxWrapper>
        <Listbox>
          {menus.map(menu => (
            <ListboxItem
              as={Link}
              href={menu.pathname}
              variant="faded"
              color="primary"
              key={menu.pathname}
              className="font-pretendard"
            >
              {menu.title}
            </ListboxItem>
          ))}
        </Listbox>
      </ListboxWrapper>
    </VStack>
  );
};

export default AppPage;
