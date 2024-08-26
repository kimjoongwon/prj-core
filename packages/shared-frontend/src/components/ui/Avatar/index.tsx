import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
  UserProps,
} from '@nextui-org/react';
import { observer } from 'mobx-react-lite';

export const Avatar = observer((props: UserProps) => {
  return (
    <Dropdown>
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
