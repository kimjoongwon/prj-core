import { useMenus } from './useMenus';

export const useReservationPage = () => {
  const menus = useMenus();

  return { menus };
};
