'use client';

import { ButtonGroup, DataGrid, Pagination } from '@coc/ui';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

export default function Page() {
  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button>test</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="test1">test</DropdownItem>
          <DropdownItem key="test2">test</DropdownItem>
          <DropdownItem key="test3">test</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
