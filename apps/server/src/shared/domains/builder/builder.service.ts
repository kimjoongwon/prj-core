import { Injectable } from '@nestjs/common';
import { AppBuilder, RouteBuilder } from '@shared/types';
import { loginPage } from './routes/login.page';

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
                              page: {
                                type: 'Outlet',
                              },
                            },
                            children: [
                              {
                                pathname: 'category/detail',
                                name: '카테고리 상세',
                                active: false,
                                layout: {
                                  type: 'Form',
                                },
                              },
                              {
                                pathname: 'category/create',
                                name: '카테고리',
                                active: false,
                                layout: {
                                  type: 'Form',
                                },
                              },
                              {
                                pathname: 'category/modify',
                                name: '카테고리',
                                active: false,
                                layout: {
                                  type: 'Form',
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
