import { observer } from 'mobx-react-lite';
import { Button } from '../Button';
import { MainNavBarViewProps } from '@shared/types';
import { Link } from '@nextui-org/react';

export const MainServiceNavBarView = observer((props: MainNavBarViewProps) => {
  const { navItems, value, onClickNavBarItem } = props;
  return (
    <>
      {navItems.map((navItem, index) => {
        return (
          <Button
            key={index}
            color={value === navItem.href ? 'primary' : 'default'}
            variant="light"
            as={Link}
            value={navItem.href}
            onClick={() => onClickNavBarItem(navItem.href)}
          >
            {navItem.children}
          </Button>
        );
      })}
    </>
  );
});
