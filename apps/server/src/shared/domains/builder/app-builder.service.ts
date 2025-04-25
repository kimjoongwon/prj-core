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
    return [
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
                    children: [
                      this.getServiceRoute('space', '그라운드 서비스', 'grounds'),
                      this.getServiceRoute('program', '프로그램 서비스', 'programs'),
                      this.getServiceRoute('task', 'TASK 서비스', 'tasks'),
                      this.getServiceRoute('timeline', '타임라인 서비스', 'timelines'),
                    ],
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
  }

  getServiceRoute(serviceName: ServiceNames, displayName: string, resource: string) {
    const tenantId = ContextProvider.getTenantId();
    const children = [
      {
        name: displayName,
        pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/${resource}`,
        children: [
          {
            name: '편집',
            pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}/${resource}/:id/:type`,
          },
        ],
      },
      ...this.getCommonRoutes(serviceName),
    ];

    return {
      name: displayName,
      pathname: `/admin/main/tenants/${tenantId}/services/${serviceName}`,
      children,
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
