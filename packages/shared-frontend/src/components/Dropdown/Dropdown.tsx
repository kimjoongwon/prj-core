'use client';

import React from 'react';
import {
  Dropdown as HeroUIDropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownProps as HeroUIDropdownProps,
  DropdownItemProps as HeroUIDropdownItemProps,
} from '@heroui/react';
import { observer } from 'mobx-react-lite';

export interface DropdownItemProps extends Omit<HeroUIDropdownItemProps, 'children'> {
  key: string;
  label: string;
  onClick?: () => void;
}

export interface DropdownProps extends Omit<HeroUIDropdownProps, 'children' | 'trigger'> {
  trigger: React.ReactNode;
  dropdownItems: DropdownItemProps[];
  onAction?: (key: string) => void;
}

export const Dropdown = observer((props: DropdownProps) => {
  const { trigger, dropdownItems, onAction, ...dropdownProps } = props;

  const handleAction = (key: React.Key) => {
    const stringKey = String(key);
    const item = dropdownItems.find(item => item.key === stringKey);
    
    // Call item's onClick if it exists
    item?.onClick?.();
    
    // Call the dropdown's onAction if it exists
    onAction?.(stringKey);
  };

  return (
    <HeroUIDropdown {...dropdownProps}>
      <DropdownTrigger>
        {trigger}
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Dropdown menu"
        onAction={handleAction}
        variant="flat"
      >
        {dropdownItems.map((item) => {
          const { key, label, onClick, ...itemProps } = item;
          return (
            <DropdownItem
              key={key}
              {...itemProps}
            >
              {label}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </HeroUIDropdown>
  );
});

Dropdown.displayName = 'Dropdown';
