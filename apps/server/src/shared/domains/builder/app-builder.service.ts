import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import path from 'path';
import { ContextProvider } from '../../providers';
import { $Enums } from '@prisma/client';

@Injectable()
export class BuilderService {
  constructor(readonly prisma: PrismaService) {}
  async getRoute() {
    const services = await this.prisma.service.findMany();
    const tenancyId = ContextProvider.getTenantId();
    const userService = services.find((service) => service.name === $Enums.ServiceNames.USER);
    const spaceService = services.find((service) => service.name === $Enums.ServiceNames.SPACE);

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
                name: 'tenancies',
                pathname: '/admin/main/tenancies',
                children: [
                  {
                    name: 'services',
                    pathname: `/admin/main/tenancies/:tenancyId/services`,
                    children: services.map((service) => ({
                      name: service.name,
                      pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}`,
                      children: [
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
                      ],
                    })),
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
}
