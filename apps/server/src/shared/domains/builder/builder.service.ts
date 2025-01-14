import { type RouteBuilder, type AppBuilder } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { serviceLayout } from './layouts/service.layout';
import { rootRoute } from './routes/root.route';
import { adminRoute } from './routes/admin.route';
import { tenancyIdRoute } from './routes/tenancy-id.route';
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
import { tenancies } from './routes/tenancies.route';
import { usersRoute } from './routes/users.route';
import { SpacesRoute } from './routes/spaces.route';
import { SpaceNewEditRoute } from './routes/space-new-edit';
import { CategoryRoute } from './routes/category.route';
import { rolesRoute } from './routes/roles.route';
import { RoleNewEditRoute } from './routes/role-new-edit.route';
import { actionsRoute } from './routes/actions.route';
import { ActionNewEditRoute } from './routes/action-new-edit.route';
import { AbilitiesRoute } from './routes/abilities.route';

@Injectable()
export class BuilderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spaceNewEditRoute: SpaceNewEditRoute,
    private readonly roleNewEditRoute: RoleNewEditRoute,
    private readonly categoryRoute: CategoryRoute,
    private readonly spaceRoute: SpacesRoute,
    private readonly actionNewEdit: ActionNewEditRoute,
    private readonly abilitiesRoute: AbilitiesRoute,
  ) {}

  async getRoutes(): Promise<RouteBuilder[]> {
    const services = await this.prisma.service.findMany();
    const spaceNewEditRoute = await this.spaceNewEditRoute.getRoute();
    const categoryRoute = await this.categoryRoute.getRoute();
    const roleNewEditRoute = await this.roleNewEditRoute.getRoute();
    const spacesRoute = await this.spaceRoute.getRoute();
    const actionNewEditRoute = await this.actionNewEdit.getRoute();
    const abilitiesRoute = await this.abilitiesRoute.getRoute();

    return [
      {
        ...rootRoute,
        children: [
          {
            ...adminRoute,
            children: [
              {
                ...tenancyIdRoute,
                children: [
                  {
                    ...servicesRoute,
                    children: services.map((service) => {
                      const routes = {
                        name: service.label,
                        pathname: service.id,
                        layout: serviceLayout,
                        children: [
                          {
                            ROLE: {
                              ...rolesRoute,
                              children: [roleNewEditRoute],
                            },
                            SPACE: {
                              ...spacesRoute,
                              children: [spaceNewEditRoute],
                            },
                            USER: { ...usersRoute, children: [] },
                          }?.[service.name] as RouteBuilder,
                          {
                            ...categoriesRoute,
                            children: [
                              categoryRoute,
                              categoryAddRoute,
                              categoryEditRoute,
                              categoryNewEdit,
                            ],
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
                      };

                      if (service.name === 'ROLE') {
                        routes.children.push(abilitiesRoute);

                        routes.children.push({
                          ...actionsRoute,
                          children: [actionNewEditRoute],
                        });
                      }

                      return routes;
                    }),
                  },
                ],
              },
              {
                ...authRoute,
                children: [loginRoute, tenancies],
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
