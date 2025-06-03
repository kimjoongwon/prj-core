import { Paths } from '../../../constants/Paths';
import { NavbarItemView } from './NavbarItemView';

export interface NavbarItemProps {
  url: Paths;
  text: string;
  active: boolean;
  params?: object;
}

export { NavbarItemView as NavBarItem };
