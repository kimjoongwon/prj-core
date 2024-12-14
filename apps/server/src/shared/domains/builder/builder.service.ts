import { Injectable } from '@nestjs/common';
import { loginPage } from './routes/login.page';
import { type RouteBuilder, type AppBuilder } from '@shared/types';
import { categoriesPage } from './pages/categories.page';
import { categoryEditPage } from './pages/category-edit.page';

@Injectable()
export class BuilderService {
  getRoutes(): RouteBuilder[] {
    return [
      {
        name: 'ROOT',
        pathname: '/',
        active: false,
        layout: {
          type: 'Root',
          page: {
            type: 'Outlet',
          },
        },
        children: [
          {
            name: '어드민',
            pathname: 'admin',
            active: false,
            layout: {
              type: 'Admin',
              page: {
                type: 'Outlet',
              },
            },
            children: [
              {
                name: '메인',
                pathname: 'main',
                active: false,
                layout: {
                  type: 'Main',
                  page: {
                    type: 'Outlet',
                  },
                },
                children: [
                  {
                    name: '서비스',
                    pathname: 'services',
                    active: false,
                    layout: {
                      type: 'Services',
                      page: {
                        type: 'Outlet',
                      },
                    },
                    children: [
                      {
                        name: '유저 서비스',
                        pathname: 'user-service',
                        active: false,
                        layout: {
                          type: 'Service',
                          page: {
                            type: 'Outlet',
                          },
                        },
                        children: [
                          {
                            name: '카테고리',
                            pathname: 'categories',
                            active: false,
                            layout: {
                              type: 'Table',
                              page: categoriesPage,
                            },
                            children: [
                              {
                                name: '수정',
                                pathname: ':categoryId/edit',
                                active: false,
                                layout: {
                                  page: categoryEditPage,
                                },
                              },
                            ],
                          },
                          {
                            name: '그룹',
                            pathname: 'groups',
                            active: false,
                            children: [],
                            layout: {
                              type: 'Table',
                            },
                          },
                        ],
                      },
                      {
                        name: '공간 서비스',
                        pathname: 'space-service',
                        layout: {
                          type: 'Service',
                          page: {
                            type: 'Outlet',
                          },
                        },
                        active: false,
                        children: [
                          {
                            name: '카테고리',
                            pathname: 'categories',
                            active: false,
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: '인증',
                pathname: 'auth',
                active: false,
                layout: {
                  page: {
                    type: 'Outlet',
                  },
                },
                children: [
                  {
                    name: '로그인',
                    pathname: 'login',
                    active: false,
                    children: [],
                    layout: {
                      type: 'Auth',
                      page: loginPage,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  getAppBuilder() {
    const appBuilder: AppBuilder = {
      name: 'ILLIT',
      routes: this.getRoutes(),
    };
    return appBuilder;
  }
}
