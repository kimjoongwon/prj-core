

import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { Button } from '../Button';

export interface NavbarItemProps {
  url: string;
  text: string;
  active: boolean;
  params?: object;
}

export const NavbarItem = observer((props: NavbarItemProps) => {
  const { text, active } = props;

  const onClickNavItem = () => {
    // galaxy?.router.push({
    //   url,
    //   params,
    // });
  };

  return (
    <Button
      key={v4()}
      variant="light"
      className="font-semibold"
      color={active ? 'primary' : 'default'}
      onClick={onClickNavItem}
    >
      {text}
    </Button>
  );
});
