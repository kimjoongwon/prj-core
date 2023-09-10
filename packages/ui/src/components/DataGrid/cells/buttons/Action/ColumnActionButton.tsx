'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Column } from '@tanstack/react-table';

interface ColumnActionButtonProps {
  column: Column<any, unknown>;
}

export const ColumnActionButton = (props: ColumnActionButtonProps) => {
  const { column } = props;

  const onClickPin = () => {
    if (column.getIsPinned()) {
      return column.pin(false);
    }
    column.pin('left');
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <VerticalDotsIcon className="text-default-300" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onClick={onClickPin}>Pin To Left</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const VerticalDotsIcon = ({ strokeWidth = 1.5, ...otherProps }) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...otherProps}
  >
    <path
      d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={strokeWidth}
    />
  </svg>
);
