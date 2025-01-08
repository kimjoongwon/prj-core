import { Injectable } from '@nestjs/common';
import { loginPage } from './routes/login.page';
import { type RouteBuilder, type AppBuilder } from '@shared/types';
import { categoriesPage } from './pages/categories.page';
import { categoryAddPage } from './pages/category-add.page';
import { categoryNewEditPage } from './pages/category-new-edit.page';
import { categoryEditPage } from './pages/category-edit.page';
import { groupNewEditPage } from './pages/group-new-edit.page';
import { groupsPage } from './pages/groups.page';
import { groupEditPage } from './pages/group-edit.page';
import { spacesPage } from './pages/spaces.page';
import { getGroupPage } from './pages/group.page';
import { getGroupUsersPage } from './pages/group-users.page';
import { getAssociationsPage } from './pages/assignments.page';
import { PrismaService } from 'nestjs-prisma';
import { getTenanciesLayout } from './layouts/tenancies.layout';

@Injectable()
export class BuilderService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoutes(): Promise<RouteBuilder[]> {
    const services = await this.prisma.service.findMany();
    return [
      {
        name: 'ROOT',
        pathname: '/',
        layout: {
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
                name: '공간',
                pathname: 'spaces/:spaceId',
                layout: {
                  type: 'Root',
                  page: {
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
                              name: '그룹 생성',
                              pathname: 'new/edit',
                              layout: {
                                type: 'Form',
                                page: groupNewEditPage,
                              },
                            },
                            {
                              name: '그룹 수정',
                              pathname: ':resourceId/edit',
                              layout: {
                                type: 'Form',
                                page: groupEditPage,
                              },
                            },
                            {
                              name: '그룹 상세',
                              pathname: ':resourceId',
                              layout: {
                                type: 'Detail',
                                page: getGroupPage(),
                              },
                              children: [
                                {
                                  name: '그룹 사용자',
                                  pathname: 'users',
                                  layout: {
                                    type: 'Root',
                                    page: getGroupUsersPage(),
                                  },
                                },
                                {
                                  name: '그룹 할당',
                                  pathname: 'associations',
                                  layout: {
                                    type: 'Root',
                                    page: getAssociationsPage(),
                                  },
                                },
                              ],
                            },
                          ],
                        },
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
                  {
                    name: '공간',
                    pathname: 'spaces',
                    layout: getTenanciesLayout(),
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
