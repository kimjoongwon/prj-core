import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User as BaseUser,
} from '@nextui-org/react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../../stores/authStore';

export const User = observer(() => {
  const email = authStore.user?.email;
  return (
    <Dropdown>
      <DropdownTrigger>
        <BaseUser
          isFocusable
          name={email}
          avatarProps={{
            size: 'sm',
            isBordered: true,
            isFocusable: true,
            as: 'button',
          }}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{email}</p>
        </DropdownItem>
        <DropdownItem key="space" className="h-14 gap-2">
          <p className="font-semibold">
            {/* @ts-ignore */}
            소속: {authStore.user?.tenants?.[0]?.space?.name}
          </p>
          <DropdownItem>설정</DropdownItem>
        </DropdownItem>
        <DropdownItem color="danger" className="text-danger">
          로그아웃
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
});
