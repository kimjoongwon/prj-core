import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ContextProvider } from '../../providers';

@Injectable()
export class BuilderService {
  constructor(readonly prisma: PrismaService) {}
  async getRoute() {
    const services = await this.prisma.service.findMany();
    const tenancyId = ContextProvider.getTenantId();

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
                name: 'tenancies',
                pathname: '/admin/main/tenancies',
                children: [
                  {
                    name: 'services',
                    pathname: `/admin/main/tenancies/:tenancyId/services`,
                    children: services.map((service) => {
                      const serviceChildren = [
                        {
                          name: '카테고리',
                          pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/categories`,
                          children: [
                            {
                              name: '편집',
                              pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/categories/:categoryId/:type`,
                            },
                          ],
                        },
                        {
                          name: '그룹',
                          pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/groups`,
                          children: [
                            {
                              name: '편집',
                              pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/groups/:groupId/:type`,
                            },
                          ],
                        },
                      ];

                      if (service.name === 'TIMELINE') {
                        serviceChildren.unshift({
                          name: '목록',
                          pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/timelines`,
                          children: [],
                        });

                        serviceChildren.push({
                          name: '세션',
                          pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/sessions`,
                          children: [
                            {
                              name: '편집',
                              pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/sessions/:sessionId/:type`,
                            },
                          ],
                        });
                      }

                      if (service.name === 'ROUTINE') {
                        serviceChildren.unshift({
                          name: '목록',
                          pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/routines`,
                          children: [
                            {
                              name: '편집',
                              pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/routines/:routineId/:type`,
                            },
                          ],
                        });

                        serviceChildren.push({
                          name: '운동',
                          pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/exercises`,
                          children: [
                            {
                              name: '편집',
                              pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}/exercises/:exerciseId/:type`,
                            },
                          ],
                        });
                      }

                      return {
                        name: service.label,
                        pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}`,
                        children: serviceChildren,
                      };
                    }),
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
}
