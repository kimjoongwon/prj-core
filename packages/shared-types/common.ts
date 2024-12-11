export interface Route {
  name: string;
  pathname: string;
  active?: boolean;
  icon?: string;
  visible?: boolean;
  onClick?: () => void;
  children?: Route[];
}
