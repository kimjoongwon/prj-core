import { uniqueId } from 'lodash-es';
import { NavItem } from '../Navbar';
import { observer } from 'mobx-react-lite';
import { router } from '../../../stores/routerStore';
import { Text } from '../Text';

interface SidebarProps {
  navItems?: NavItem[];
}

export const Sidebar = observer((props: SidebarProps) => {
  const { navItems = [] } = props;
  return (
    <ol className="border-r-1 p-2">
      {navItems?.map(navItem => {
        return (
          <li
            className="w-36 transition-colors select-none duration-200 hover:bg-gray-200 py-2 px-4 rounded-md"
            key={uniqueId()}
            onClick={() =>
              router.push({ url: navItem.link?.href || '/admin/main' })
            }
          >
            <Text className="text-gray-700 font-semibold">
              {navItem.button.children}
            </Text>
          </li>
        );
      })}
    </ol>
  );
});
