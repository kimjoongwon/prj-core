export const useMenus = () => {
  const menus = [
    {
      title: '서비스 관리',
      pathname: '/admin/main/app/services',
    },
    {
      title: '템플릿 관리',
      pathname: '/admin/main/app/templates',
    },
  ];

  return menus;
};
