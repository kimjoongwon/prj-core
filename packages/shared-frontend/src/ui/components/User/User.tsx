import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  UserProps,
} from '@nextui-org/react';

export interface BaseUserProps extends UserProps {}

export const BaseUser = (props: BaseUserProps) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          {...props}
          isFocusable
          avatarProps={{
            color: 'primary',
            isBordered: true,
            isFocusable: true,
            as: 'button',
          }}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">zoey@example.com</p>
        </DropdownItem>
        <DropdownItem>설정</DropdownItem>
        <DropdownItem color="danger" className="text-danger">
          로그아웃
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
