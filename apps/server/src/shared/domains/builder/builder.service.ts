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
                      type: 'Main',
                      page: {
                        type: 'Outlet',
                      },
                    },
                    children: [
                      {
                        name: '유저 서비스',
                        pathname: 'user-service',
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
                      {
                        name: '공간 서비스',
                        pathname: 'space-service',
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
