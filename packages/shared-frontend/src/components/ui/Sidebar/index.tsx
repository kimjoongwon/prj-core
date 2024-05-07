import { uniqueId } from 'lodash-es';
import { NavItem } from '../Navbar';
import { observer } from 'mobx-react-lite';
import { router } from '../../../stores/routerStore';
import { Text } from '../Text';
import { tv } from 'tailwind-variants';
import Button from '../Button';

interface SidebarProps {
  navItems?: NavItem[];
}

export const Sidebar = observer((props: SidebarProps) => {
  const { navItems = [] } = props;

  const item = tv({
    base: 'text-gray-700 font-semibold',
    variants: {
      color: {
        active: 'text-primary',
        inactive: 'text-gray-700',
      },
    },
  });

  return (
    <ol className="border-1 mt-4 rounded-lg p-4">
      {navItems?.map(navItem => {
        return (
          <Button
            variant="light"
            className="font-bold"
            color={navItem.active ? 'primary' : 'default'}
            onClick={() => router.push({ url: navItem.url || '/admin/main' })}
          >
            {navItem.text}
          </Button>
        );
      })}
    </ol>
  );
});
