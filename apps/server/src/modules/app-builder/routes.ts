// Import RㅇUTE_NAMES from shared vars
import { ROUTE_NAMES } from '@shared/vars';

// Import page functions
import { getLoginPage } from './components/pages/login.page';
import { getTenantSelectPage } from './components/pages/tenant-select.page';
import { getDashboardPage } from './components/pages/dashboard.page';
import { getUsersPage } from './components/pages/users.page';
import { getGroundsPage } from './components/pages/grounds.page';
import { getGroundPage } from './components/pages/ground.page';
import { getCategoriesPage } from './components/pages/categories.page';
import { getGroupsPage } from './components/pages/groups.page';
import { getCategoryPage } from './components/pages/category.page';
import { getGroupPage } from './components/pages/group.page';
import { getGroundMembersPage } from './components/pages/ground-members.page';
import { RouteBuilder } from '@shared/types';

export const rawRoutes: RouteBuilder[] = [
  {
    name: ROUTE_NAMES.ADMIN,
    relativePath: 'admin',
    children: [
      {
        name: ROUTE_NAMES.AUTH,
        relativePath: 'auth',
        layout: {
          type: 'Auth',
        },
        children: [
          {
            name: ROUTE_NAMES.LOGIN,
            relativePath: 'login',
            page: getLoginPage(),
            children: [
              {
                name: ROUTE_NAMES.TENANT_SELECT,
                relativePath: 'tenant-select',
                layout: {
                  type: 'Modal',
                },
                page: getTenantSelectPage(),
              },
            ],
          },
        ],
      },
      {
        name: ROUTE_NAMES.DASHBOARD,
        relativePath: 'dashboard',
        icon: 'LayoutDashboard',
        layout: {
          type: 'Dashboard',
        },
        page: getDashboardPage(),
        children: [
          {
            name: ROUTE_NAMES.USER_SERVICE,
            relativePath: 'user-service',
            icon: 'Users',
            children: [
              {
                name: ROUTE_NAMES.USERS,
                relativePath: 'users',
                icon: 'User',
                page: getUsersPage(),
              },
            ],
          },
          {
            name: ROUTE_NAMES.SPACE_SERVICE,
            relativePath: 'space-service',
            icon: 'MapPin',
            children: [
              {
                name: ROUTE_NAMES.GROUND_LIST,
                relativePath: 'grounds',
                layout: {
                  type: 'Root',
                },
                icon: 'Map',
                page: getGroundsPage(),
                children: [
                  {
                    name: ROUTE_NAMES.GROUND,
                    relativePath: ':groundId',
                    icon: 'MapPin',
                    layout: {
                      name: '그라운드',
                      type: 'Modal',
                    },
                    page: {
                      elements: [
                        {
                          name: 'Outlet',
                        },
                      ],
                    },
                    children: [
                      {
                        name: ROUTE_NAMES.GROUND_CREATE,
                        relativePath: 'create',
                        icon: 'Edit',
                        page: getGroundPage('create'),
                      },
                      {
                        name: ROUTE_NAMES.GROUND_DETAIL,
                        relativePath: 'detail',
                        icon: 'Edit',
                        layout: {
                          type: 'Tab',
                          tabs: {
                            defaultTab: 'info',
                            options: [
                              {
                                key: 'info',
                                text: '상세',
                                value: 'info',
                              },
                              {
                                key: 'members',
                                text: '멤버',
                                value: 'members',
                              },
                            ],
                          },
                        },
                        children: [
                          {
                            name: ROUTE_NAMES.GROUND_DETAIL_INFO,
                            relativePath: 'info',
                            page: getGroundPage('detail'),
                          },
                          {
                            name: ROUTE_NAMES.GROUND_MEMBER_LIST,
                            relativePath: 'members',
                            page: getGroundMembersPage(),
                          },
                        ],
                      },
                      {
                        name: ROUTE_NAMES.GROUND_MODIFY,
                        relativePath: 'modify',
                        icon: 'Edit',
                        page: getGroundPage('modify'),
                      },
                    ],
                  },
                ],
              },
              {
                name: ROUTE_NAMES.GROUND_CATEGORY,
                relativePath: 'categories',
                icon: 'Folder',
                page: getCategoriesPage('Space'),
                children: [
                  {
                    name: ROUTE_NAMES.GROUND_CATEGORY,
                    relativePath: ':categoryId',
                    icon: 'FolderOpen',
                    children: [
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_CREATE,
                        relativePath: 'create',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                        page: getCategoryPage('create', 'Space'),
                      },
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_DETAIL,
                        relativePath: 'detail',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                        page: getCategoryPage('detail', 'Space'),
                      },
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_MODIFY,
                        relativePath: 'modify',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                        page: getCategoryPage('modify', 'Space'),
                      },
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_ADD,
                        relativePath: 'add',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                        page: getCategoryPage('add', 'Space'),
                      },
                    ],
                  },
                ],
              },
              {
                name: ROUTE_NAMES.GROUND_GROUP,
                relativePath: 'groups',
                icon: 'Group',
                page: getGroupsPage('Space'),
                children: [
                  {
                    name: ROUTE_NAMES.GROUND_GROUP,
                    relativePath: ':groupId',
                    icon: 'Users',
                    children: [
                      {
                        name: ROUTE_NAMES.GROUND_GROUP_CREATE,
                        relativePath: 'create',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                        page: getGroupPage('create', 'Space'),
                      },
                      {
                        name: ROUTE_NAMES.GROUND_GROUP_DETAIL,
                        relativePath: 'detail',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                        page: getGroupPage('detail', 'Space'),
                      },
                      {
                        name: ROUTE_NAMES.GROUND_GROUP_MODIFY,
                        relativePath: 'modify',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                        page: getGroupPage('modify', 'Space'),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
