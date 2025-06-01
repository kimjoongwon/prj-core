import { RouteBuilder } from './types';

/**
 * 상수형으로 routes에서 사용되는 name들을 모두 정의
 * 이렇게 하면 타입스크립트가 const assertion을 통해 정확한 타입을 유추할 수 있음
 */
export const ROUTE_NAMES = {
  ADMIN: '관리자',
  AUTH: '인증',
  LOGIN: '로그인',
  SPACE: '공간',
  SERVICE: '서비스',
  DASHBOARD: '대시보드',
  GROUND: '그라운드',
  GROUND_LIST: '그라운드 리스트',
  GROUND_DETAIL: '그라운드 상세',
  GROUND_EDIT: '그라운드 편집',
  GROUND_CATEGORY: '그라운드 카테고리',
  GROUND_CATEGORY_DETAIL: '그라운드 카테고리 디테일',
  GROUND_CATEGORY_EDIT: '그라운드 카테고리 편집',
  GROUND_GROUP: '그라운드 그룹',
  GROUND_GROUP_DETAIL: '그라운드 그룹 디테일',
  GROUND_GROUP_EDIT: '그라운드 그룹 편집',
} as const;

/**
 * ROUTE_NAMES 객체의 값들을 union 타입으로 추출
 * 이렇게 하면 rawRoutes가 변경되어도 ROUTE_NAMES만 업데이트하면 타입이 자동으로 갱신됨
 */
export type RouteNames = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES];

export const rawRoutes: RouteBuilder[] = [
  {
    name: ROUTE_NAMES.ADMIN,
    pathname: 'admin',
    layout: {
      type: 'Root',
    },
    children: [
      {
        name: ROUTE_NAMES.AUTH,
        pathname: 'auth',
        layout: {
          type: 'Auth',
        },
        children: [
          {
            name: ROUTE_NAMES.LOGIN,
            pathname: 'login',
          },
        ],
      },
      {
        name: ROUTE_NAMES.SPACE,
        pathname: 'spaces',
        children: [
          {
            name: ROUTE_NAMES.SERVICE,
            pathname: ':id',
            children: [
              {
                name: ROUTE_NAMES.DASHBOARD,
                pathname: 'dashboard',
                children: [
                  {
                    name: ROUTE_NAMES.GROUND,
                    pathname: 'ground',
                    children: [
                      {
                        name: ROUTE_NAMES.GROUND_LIST,
                        pathname: 'resources',
                        children: [
                          {
                            name: ROUTE_NAMES.GROUND_DETAIL,
                            pathname: ':id',
                            children: [
                              {
                                name: ROUTE_NAMES.GROUND_EDIT,
                                pathname: ':type',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: ROUTE_NAMES.GROUND_CATEGORY,
                        pathname: 'categories',
                        children: [
                          {
                            name: ROUTE_NAMES.GROUND_CATEGORY_DETAIL,
                            pathname: ':id',
                            children: [
                              {
                                name: ROUTE_NAMES.GROUND_CATEGORY_EDIT,
                                pathname: ':type',
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: ROUTE_NAMES.GROUND_GROUP,
                        pathname: 'groups',
                        children: [
                          {
                            name: ROUTE_NAMES.GROUND_GROUP_DETAIL,
                            pathname: ':id',
                            children: [
                              {
                                name: ROUTE_NAMES.GROUND_GROUP_EDIT,
                                pathname: ':type',
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
        ],
      },
    ],
  },
];
