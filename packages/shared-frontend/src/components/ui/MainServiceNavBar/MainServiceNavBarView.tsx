import { observer } from 'mobx-react-lite';
import { Button } from '../Button';
import { MainNavBarViewProps } from '../../../types/components';
import { Link } from '@nextui-org/react';

export const MainServiceNavBarView = observer((props: MainNavBarViewProps) => {
  const { navItems, value, onClickNavBarItem } = props;
  return (
    <>
      {navItems.map((navItem, index) => {
        // @ts-ignore
        console.log(navItem.active);
        return (
          <Button
            key={index}
            // @ts-ignore
            color={navItem.active ? 'primary' : 'default'}
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
