import { Injectable } from '@nestjs/common';
import { loginPage } from './routes/login.page';
import { type RouteBuilder, type AppBuilder } from '@shared/types';
import { categoriesPage } from './pages/categories.page';
import { getCategoryEditPage } from './pages/category-edit.page';
import { ServicesService } from '../../entities/services';
import { ContextProvider } from '../../providers';

@Injectable()
export class BuilderService {
  constructor(private readonly servicesService: ServicesService) {}

  async getRoutes(): Promise<RouteBuilder[]> {
    const services = await this.servicesService.findManyByQuery();
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
                    children: services.map((service) => ({
                      name: service.label,
                      pathname: service.id,
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
                              name: '추가',
                              pathname: ':id/:type',
                              active: false,
                              layout: {
                                page: getCategoryEditPage(ContextProvider.getTenantId()),
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
                    })),
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

  async getAppBuilder() {
    console.log('tenantId', ContextProvider.getTenantId());
    const appBuilder: AppBuilder = {
      name: 'ILLIT',
      routes: await this.getRoutes(),
    };
    return appBuilder;
  }
}
