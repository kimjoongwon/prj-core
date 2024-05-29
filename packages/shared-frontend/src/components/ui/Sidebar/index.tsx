import { NavItem } from '../Navbar';
import { observer } from 'mobx-react-lite';
import { router } from '../../../stores/routerStore';
import Button from '../Button';
import { v4 } from 'uuid';
import { VStack } from '../VStack';

interface SidebarProps {
  navItems?: NavItem[];
}

export const Sidebar = observer((props: SidebarProps) => {
  const { navItems = [] } = props;

  return (
    <VStack className="flex-grow-0 basis-44 border-1 mt-4 p-2">
      {navItems?.map(navItem => {
        return (
          <Button
            key={v4()}
            variant="light"
            className="font-bold"
            color={navItem.active ? 'primary' : 'default'}
            onClick={() => router.push({ url: navItem.url || '/admin/main' })}
          >
            {navItem.text}
          </Button>
        );
      })}
    </VStack>
  );
});
