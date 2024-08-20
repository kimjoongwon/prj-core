import { v4 } from 'uuid';
import { observer } from 'mobx-react-lite';

import Button from '../../Button';

import { galaxy } from '../../../../providers/App';
import { NavbarItemProps } from './index';

export const NavbarItemView = observer((props: NavbarItemProps) => {
  const { children, text, active, url, params } = props;

  const onClickNavItem = () => {
    galaxy?.router.push({
      url,
      params,
    });
  };

  if (children) {
    return children?.map(props => <NavbarItemView {...props} />);
  }

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
