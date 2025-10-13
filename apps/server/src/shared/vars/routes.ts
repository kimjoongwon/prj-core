export interface RouteBuilder {
  name?: string;
  relativePath?: string;
  params?: object;
  children?: RouteBuilder[];
  icon?: string;
}
export const rawRoutes: RouteBuilder[] = [];
