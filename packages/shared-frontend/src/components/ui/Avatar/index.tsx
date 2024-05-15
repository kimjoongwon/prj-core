import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  UserProps,
} from '@nextui-org/react';

export const Avatar = (props: UserProps) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <User {...props} />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="setting">
          <p className="font-semibold">Signed in as</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
