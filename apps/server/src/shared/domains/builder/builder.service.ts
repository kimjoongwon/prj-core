import { Injectable } from '@nestjs/common';
import { AppBuilder, RouteBuilder } from '@shared/types';
import { loginPage } from './routes/login.page';
import { type InputProps } from '@shared/frontend';
import { date } from 'nestjs-zod/z';

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
                            layout: {
                              type: 'Table',
                              page: {
                                type: 'Table',
                                table: {
                                  queryKey: 'useGetCategoriesByQuery',
                                  query: {},
                                  columns: [
                                    {
                                      accessorKey: 'name',
                                      type: 'expand',
                                    },
                                  ],
                                },
                                form: {
                                  name: '카테고리',
                                  button: {
                                    children: '검색',
                                    fullWidth: true,
                                    color: 'primary',
                                    flow: {
                                      mutation: 'getToken',
                                      try: {
                                        message: '카테고리를 생성중입니다...',
                                        severity: 'success',
                                        pathname: '/admin/main/services/user-service/categories',
                                      },
                                      catch: {
                                        message: '카테고리 생성에 실패했습니다.',
                                        severity: 'error',
                                        pathname: '/admin/main/services/user-service/categories',
                                      },
                                      finally: {
                                        message: '카테고리 생성에 성공했습니다.',
                                        pathname: '/admin/main/services/user-service/categories',
                                      },
                                    },
                                  },
                                  sections: [
                                    {
                                      name: '카테고리',
                                      payload: {
                                        data: {
                                          name: '',
                                        },
                                      },
                                      gridProps: {
                                        xs: 12,
                                      },
                                      components: [
                                        {
                                          type: 'Input',
                                          gridProps: {
                                            xs: 12,
                                          },
                                          path: 'name',
                                          props: {
                                            fullWidth: true,
                                            value: '',
                                            label: '카테고리 이름',
                                            placeholder: '카테고리 이름을 입력해주세요.',
                                          } as InputProps<any>,
                                        },
                                      ],
                                    },
                                  ],
                                },
                              },
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
