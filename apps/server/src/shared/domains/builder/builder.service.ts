import { type RouteBuilder, type AppBuilder } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { serviceLayout } from './layouts/service.layout';
import { rootRoute } from './routes/root.route';
import { adminRoute } from './routes/admin.route';
import { spaceIdRoute } from './routes/space-id.route';
import { servicesRoute } from './routes/services.route';
import { categoriesRoute } from './routes/categories.route';
import { categoryAddRoute } from './routes/category-add.route';
import { categoryEditRoute } from './routes/category-edit.route';
import { categoryNewEdit } from './routes/category-new-edit.route';
import { groupsRoute } from './routes/groups.route';
import { groupNewEditRoute } from './routes/group-new-edit.route';
import { groupEditRoute } from './routes/group-edit.route';
import { groupIdRoute } from './routes/group-id.route';
import { groupIdUsersRoute } from './routes/group-id-users.route';
import { groupIdAssociationsRoute } from './routes/group-id-associations.route';
import { authRoute } from './routes/auth.route';
import { loginRoute } from './routes/login.route';
import { spacesRoute } from './routes/spaces.route';
import { getEntitiesRoute } from './routes/entities.route';

@Injectable()
export class BuilderService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoutes(): Promise<RouteBuilder[]> {
    const services = await this.prisma.service.findMany();
    return [
      {
        ...rootRoute,
        children: [
          {
            ...adminRoute,
            children: [
              {
                ...spaceIdRoute,
                children: [
                  {
                    ...servicesRoute,
                    children: services.map((service) => ({
                      name: service.label,
                      pathname: service.id,
                      layout: serviceLayout,
                      children: [
                        {
                          ...getEntitiesRoute(service.name),
                        },
                        {
                          ...categoriesRoute,
                          children: [categoryAddRoute, categoryEditRoute, categoryNewEdit],
                        },
                        {
                          ...groupsRoute,
                          children: [
                            groupNewEditRoute,
                            groupEditRoute,
                            {
                              ...groupIdRoute,
                              children: [groupIdUsersRoute, groupIdAssociationsRoute],
                            },
                          ],
                        },
                      ],
                    })),
                  },
                ],
              },
              {
                ...authRoute,
                children: [loginRoute, spacesRoute],
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
