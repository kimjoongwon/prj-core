'use client';

import { Listbox, ListboxItem } from '@nextui-org/react';
import { cn } from '@nextui-org/react';
import { useReservationPage } from './_hooks/useReservationPage';
import Link from 'next/link';

const ReservationPage = () => {
  const { menus } = useReservationPage();

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

export default ReservationPage;

export const IconWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      className,
      'flex items-center rounded-small justify-center w-7 h-7',
    )}
  >
    {children}
  </div>
);
