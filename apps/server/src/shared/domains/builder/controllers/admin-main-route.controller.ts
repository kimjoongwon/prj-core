import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponseEntity, Auth } from '../../../decorators';
import { ResponseEntity } from '../../../entities';
import { TenanciesRoute } from '../routes/tenancies.route';
import { CategoriesRoute } from '../routes/categories.route';
import { CategoryEditRoute } from '../routes/category-edit.route';
import { CategoryRoute } from '../routes/category.route';
import { PrismaService } from 'nestjs-prisma';
import { ContextProvider } from '../../../providers';
import { GroupEditRoute, GroupsRoute } from '../routes';

@Controller()
export class AdminMainRouteController {
  constructor(
    readonly tenanciesRoute: TenanciesRoute,
    readonly categoriesRoute: CategoriesRoute,
    readonly categoryEditRoute: CategoryEditRoute,
    readonly categoryRoute: CategoryRoute,
    readonly groupsRoute: GroupsRoute,
    readonly groupEditRoute: GroupEditRoute,
    readonly prisma: PrismaService,
  ) {}

  @Get('tenancies')
  @ApiResponseEntity(Object)
  getAdminMainTenanciesRoute() {
    const route = this.tenanciesRoute.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Tenancies is OK', route);
  }

  @Get('categories')
  @ApiResponseEntity(Object)
  getAdminMainCategoriesRoute() {
    const route = this.categoriesRoute.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Categories is OK', route);
  }

  @Get('categories/:categoryId')
  @ApiResponseEntity(Object)
  async getAdminMainCategoryRoute(@Param('categoryId') categoryId: string) {
    const route = await this.categoryRoute.getMeta(categoryId);
    return new ResponseEntity(HttpStatus.OK, 'Categories is OK', route);
  }

  @Get('categories/:categoryId/:type')
  @ApiResponseEntity(Object)
  async getAdminMainCategoriesEditRoute(
    @Param('categoryId') categoryId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.categoryEditRoute.getMeta(categoryId, type);
    return new ResponseEntity(HttpStatus.OK, 'Categories Edit is OK', route);
  }

  @Auth()
  @Get('services')
  @ApiResponseEntity(Object, HttpStatus.OK, { isArray: true })
  async getAdminMainServicesRoute() {
    const tenancyId = ContextProvider.getTanancyId();
    const services = await this.prisma.service.findMany();
    console.log('tenancyId');
    const serviceRoutes = services.map((service) => {
      return {
        name: service.name,
        pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}`,
      };
    });

    return new ResponseEntity(HttpStatus.OK, 'Services is OK', serviceRoutes);
  }

  @Auth()
  @Get('groups')
  @ApiResponseEntity(Object, HttpStatus.OK, { isArray: true })
  async getAdminMainGroupsRoute() {
    const route = await this.groupsRoute.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Groups is OK', route);
  }

  @Auth()
  @Get('groups/:groupId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainGroupEditRoute(
    @Param('groupId') groupId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.groupEditRoute.getMeta(groupId, type);
    return new ResponseEntity(HttpStatus.OK, 'Groups Edit is OK', route);
  }
}
