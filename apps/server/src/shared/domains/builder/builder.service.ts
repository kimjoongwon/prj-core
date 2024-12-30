import { Injectable } from '@nestjs/common';
import { loginPage } from './routes/login.page';
import { type RouteBuilder, type AppBuilder } from '@shared/types';
import { categoriesPage } from './pages/categories.page';
import { categoryAddPage } from './pages/category-add.page';
import { ServicesService } from '../../entities/services';
import { categoryNewEditPage } from './pages/category-new-edit.page';
import { categoryEditPage } from './pages/category-edit.page';
import { groupNewEditPage } from './pages/group-new-edit.page';
import { groupsPage } from './pages/groups.page';
import { groupEditPage } from './pages/group-edit.page';
import { usersPage } from './pages/users.page';
import { spacesPage } from './pages/spaces.page';
import { getGroupDetailPage } from './pages/group-detail.page';

@Injectable()
export class BuilderService {
  constructor(private readonly servicesService: ServicesService) {}

  async getRoutes(): Promise<RouteBuilder[]> {
    const services = await this.servicesService.findManyByQuery();
    return [
      {
        name: 'ROOT',
        pathname: '/',
        layout: {
          name: 'ROOT',
          type: 'Root',
          page: {
            name: 'ROOT',
            type: 'Outlet',
          },
        },
        children: [
          {
            name: '어드민',
            pathname: 'admin',
            layout: {
              type: 'Admin',
              page: {
                name: '어드민',
                type: 'Outlet',
              },
            },
            children: [
              {
                name: '메인',
                pathname: 'main',
                layout: {
                  type: 'Main',
                  page: {
                    name: '메인',
                    type: 'Outlet',
                  },
                },
                children: [
                  {
                    name: '서비스',
                    pathname: 'services',
                    layout: {
                      type: 'Services',
                      page: {
                        name: '서비스',
                        type: 'Outlet',
                      },
                    },
                    children: services.map((service) => ({
                      name: service.label,
                      pathname: service.id,
                      layout: {
                        type: 'Service',
                        page: {
                          name: '서비스아이템',
                          type: 'Outlet',
                        },
                      },
                      children: [
                        {
                          name: service.label,
                          pathname: service.name,
                          layout: {
                            type: 'Master',
                            page: {
                              USER: usersPage,
                              SPACE: spacesPage,
                            }[service.name],
                          },
                        },
                        {
                          name: '카테고리',
                          pathname: 'categories',
                          layout: {
                            type: 'Master',
                            page: categoriesPage,
                          },
                          children: [
                            {
                              name: '카테고리 추가',
                              pathname: ':parentId/add',
                              layout: {
                                type: 'Form',
                                page: categoryAddPage,
                              },
                            },
                            {
                              name: '카테고리 수정',
                              pathname: ':resourceId/edit',
                              layout: {
                                type: 'Form',
                                page: categoryEditPage,
                              },
                            },
                            {
                              name: '카테고리 새편집',
                              pathname: 'new/edit',
                              layout: {
                                type: 'Form',
                                page: categoryNewEditPage,
                              },
                            },
                          ],
                        },
                        {
                          name: '그룹',
                          pathname: 'groups',
                          layout: {
                            type: 'Master',
                            page: groupsPage,
                          },
                          children: [
                            {
                              name: '생성',
                              pathname: 'new/edit',
                              layout: {
                                name: '생성',
                                type: 'Form',
                                page: groupNewEditPage,
                              },
                            },
                            {
                              name: '수정',
                              pathname: ':resourceId/edit',
                              layout: {
                                name: '수정',
                                type: 'Form',
                                page: groupEditPage,
                              },
                            },
                            {
                              name: '상세',
                              pathname: ':resourceId',
                              layout: {
                                name: '상세',
                                type: 'Detail',
                                page: getGroupDetailPage(),
                              },
                            },
                          ],
                        },
                        ,
                      ],
                    })),
                  },
                ],
              },
              {
                name: '인증',
                pathname: 'auth',
                layout: {
                  page: {
                    type: 'Outlet',
                  },
                },
                children: [
                  {
                    name: '로그인',
                    pathname: 'login',
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

  async getAppBuilder() {
    const appBuilder: AppBuilder = {
      name: 'ILLIT',
      routes: await this.getRoutes(),
    };
    return appBuilder;
  }
}
