import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';

import { galaxy } from '../../../../providers/App';
import { NavbarItemProps } from './index';
import { Button } from '../../Button';

export const NavbarItemView = observer((props: NavbarItemProps) => {
  const { text, active, url, params } = props;

  const onClickNavItem = () => {
    galaxy?.router.push({
      url,
      params,
    });
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
