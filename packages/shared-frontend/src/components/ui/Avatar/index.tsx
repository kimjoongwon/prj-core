'use client';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { AvatarProps } from '@shared/types';
import { observer } from 'mobx-react-lite';

export const Avatar = observer((props: AvatarProps) => {
  const { className } = props;
  return (
    <Dropdown className={className}>
      <DropdownTrigger>
        <User {...props} />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="setting">
          <p className="font-semibold">프로필 정보</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
});
