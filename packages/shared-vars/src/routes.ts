// Local type definition to avoid circular dependency
type RouteBuilder = {
  name: string;
  relativePath: string;
  layout?: {
    type: string;
    name?: string;
  };
  children?: RouteBuilder[];
  icon?: string;
};

/**
 * 상수형으로 routes에서 사용되는 name들을 모두 정의
 * 이렇게 하면 타입스크립트가 const assertion을 통해 정확한 타입을 유추할 수 있음
 */
export const ROUTE_NAMES = {
  ADMIN: '관리자',
  AUTH: '인증',
  LOGIN: '로그인',
  TENANT_SELECT: '테넌트 선택',
  TENANT: '테넌트',
  DASHBOARD: '대시보드',
  USER_SERVICE: '유저 서비스',
  USERS: '유저',
  SPACE_SERVICE: '공간 서비스',
  GROUND: '그라운드',
  GROUND_LIST: '그라운드 리스트',
  GROUND_DETAIL: '그라운드 상세',
  GROUND_CREATE: '그라운드 생성',
  GROUND_MODIFY: '그라운드 수정',
  GROUND_CATEGORY: '그라운드 카테고리',
  GROUND_CATEGORY_DETAIL: '그라운드 카테고리 디테일',
  GROUND_CATEGORY_CREATE: '그라운드 카테고리 생성',
  GROUND_CATEGORY_MODIFY: '그라운드 카테고리 수정',
  GROUND_CATEGORY_ADD: '그라운드 카테고리 추가',
  GROUND_GROUP: '그라운드 그룹',
  GROUND_GROUP_DETAIL: '그라운드 그룹 디테일',
  GROUND_GROUP_CREATE: '그라운드 그룹 생성',
  GROUND_GROUP_MODIFY: '그라운드 그룹 수정',
} as const;

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
          },
        ],
      },
      {
        name: ROUTE_NAMES.TENANT_SELECT,
        relativePath: 'tenant-select',
        layout: {
          type: 'Modal',
        },
      },
      {
        name: ROUTE_NAMES.DASHBOARD,
        relativePath: 'dashboard',
        icon: 'LayoutDashboard',
        layout: {
          type: 'Dashboard',
        },
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
                children: [
                  {
                    name: ROUTE_NAMES.GROUND,
                    relativePath: ':id',
                    icon: 'MapPin',
                    children: [
                      {
                        name: ROUTE_NAMES.GROUND_CREATE,
                        relativePath: 'create',
                        icon: 'Edit',
                        layout: {
                          name: '그라운드',
                          type: 'Modal',
                        },
                      },
                      {
                        name: ROUTE_NAMES.GROUND_DETAIL,
                        relativePath: 'detail',
                        icon: 'Edit',
                        layout: {
                          name: '그라운드',
                          type: 'Modal',
                        },
                      },
                      {
                        name: ROUTE_NAMES.GROUND_MODIFY,
                        relativePath: 'modify',
                        icon: 'Edit',
                        layout: {
                          name: '그라운드',
                          type: 'Modal',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: ROUTE_NAMES.GROUND_CATEGORY,
                relativePath: 'categories',
                icon: 'Folder',
                children: [
                  {
                    name: ROUTE_NAMES.GROUND_CATEGORY,
                    relativePath: ':id',
                    icon: 'FolderOpen',
                    children: [
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_CREATE,
                        relativePath: 'create',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                      },
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_DETAIL,
                        relativePath: 'detail',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                      },
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_MODIFY,
                        relativePath: 'modify',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                      },
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY_ADD,
                        relativePath: 'add',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: ROUTE_NAMES.GROUND_GROUP,
                relativePath: 'groups',
                icon: 'Group',
                children: [
                  {
                    name: ROUTE_NAMES.GROUND_GROUP,
                    relativePath: ':id',
                    icon: 'Users',
                    children: [
                      {
                        name: ROUTE_NAMES.GROUND_GROUP_CREATE,
                        relativePath: 'create',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                      },
                      {
                        name: ROUTE_NAMES.GROUND_GROUP_DETAIL,
                        relativePath: 'detail',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
                      },
                      {
                        name: ROUTE_NAMES.GROUND_GROUP_MODIFY,
                        relativePath: 'modify',
                        icon: 'Edit',
                        layout: {
                          type: 'Modal',
                        },
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
