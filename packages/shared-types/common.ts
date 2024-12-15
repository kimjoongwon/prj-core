export interface Route {
  name: string;
  pathname: string;
  active?: boolean;
  params: any;
  icon?: string;
  visible?: boolean;
  onClick?: () => void;
  children?: Route[];
}
