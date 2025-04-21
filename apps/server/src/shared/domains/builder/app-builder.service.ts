import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ContextProvider } from '../../providers';
import { ServiceNames } from '@prisma/client';

@Injectable()
export class BuilderService {
  constructor(readonly prisma: PrismaService) {}

  async build() {
    const services = await this.prisma.service.findMany({});
    return {
      routes: this.getRoute(),
      services,
    };
  }

  getRoute() {
    const routes = [
      {
        name: 'admin',
        pathname: '/admin',
        children: [
          {
            name: 'main',
            pathname: '/admin/main',
            children: [
              {
                name: 'tenants',
                pathname: '/admin/main/tenants',
                children: [
                  {
                    name: 'services',
                    pathname: `/admin/main/tenants/:tenantId/services`,
                    children: [this.getSpaceServiceRoute()],
                  },
                ],
              },
              {
                name: 'categories',
                pathname: '/admin/main/categories',
                children: [
                  {
                    name: 'edit',
                    pathname: '/admin/main/categories/:categoryId/edit',
                  },
                ],
              },
            ],
          },
          {
            name: 'auth',
            pathname: '/admin/auth',
            children: [
              {
                name: 'login',
                pathname: '/admin/auth/login',
              },
            ],
          },
        ],
      },
    ];

    return routes;
  }

  getSpaceServiceRoute() {
    const tenantId = ContextProvider.getTenantId();

    const children = [
      {
        name: '그라운드',
        pathname: `/admin/main/tenants/${tenantId}/services/space/grounds`,
        children: [
          {
            name: '편집',
            pathname: `/admin/main/tenants/${tenantId}/services/space/grounds/:groundId/:type`,
          },
        ],
      },
    ].concat(this.getCommonRoutes('space'));

    return {
      name: '공간 서비스',
      pathname: `/admin/main/tenants/${tenantId}/services/space`,
      children,
    };
  }

  getCategoryRoute(serviceName: ServiceNames) {
    const tenantId = ContextProvider.getTenantId();
    return {
      name: '카테고리',
      pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/categories`,
      children: [
        {
          name: '편집',
          pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/categories/:categoryId/:type`,
        },
      ],
    };
  }

  getGroupRoute(serviceName: ServiceNames) {
    const tenantId = ContextProvider.getTenantId();
    return {
      name: '그룹',
      pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/groups`,
      children: [
        {
          name: '편집',
          pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/groups/:groupId/:type`,
        },
      ],
    };
  }

  getCommonRoutes(serviceName: ServiceNames) {
    const tenantId = ContextProvider.getTenantId();
    return [
      {
        name: '카테고리',
        pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/categories`,
        children: [
          {
            name: '편집',
            pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/categories/:categoryId/:type`,
          },
        ],
      },
      {
        name: '그룹',
        pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/groups`,
        children: [
          {
            name: '편집',
            pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/groups/:groupId/:type`,
          },
        ],
      },
    ];
  }
}
