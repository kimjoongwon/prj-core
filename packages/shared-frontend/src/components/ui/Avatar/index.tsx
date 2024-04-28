import {
  Avatar as BaseAvatar,
  AvatarProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

export const Avatar = (props: AvatarProps) => {
  const { size, ...rest } = props;
  return (
    <Dropdown>
      <DropdownTrigger>
        <BaseAvatar {...rest} size={'sm'} />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem>설정</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
