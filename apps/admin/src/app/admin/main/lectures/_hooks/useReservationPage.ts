import { useMenus } from './useMenus';
import { useQueries } from '../[lectureId]/sessions/_hooks/useQueries';

export const useReservationPage = () => {
  const menus = useMenus();
  const queries = useQueries();

  return { menus, queries };
};
