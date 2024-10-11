import { useMenus } from './useMenus';
import { useQueries } from '../sessions/_hooks/useQueries';

export const useReservationPage = () => {
  const menus = useMenus();
  const queries = useQueries();

  return { menus, queries };
};
