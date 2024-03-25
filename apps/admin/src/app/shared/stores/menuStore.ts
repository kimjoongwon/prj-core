import { observable } from 'mobx';

export const menuStore = observable({
  currentPath: '/admin/dashboard',
  menuItems: [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      title: 'Auth',
      path: '/admin/auth',
    },
  ],
});
