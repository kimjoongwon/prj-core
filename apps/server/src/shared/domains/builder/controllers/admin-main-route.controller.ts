import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponseEntity, Auth } from '../../../decorators';
import { ResponseEntity } from '../../../entities';
import { TenanciesRoute } from '../routes/tenancies.route';
import { CategoriesRoute } from '../routes/categories.route';
import { CategoryEditRoute } from '../routes/category-edit.route';
import { CategoryRoute } from '../routes/category.route';
import { PrismaService } from 'nestjs-prisma';
import { ContextProvider } from '../../../providers';
import { GroupEditRoute, GroupsRoute, RoutineEditRoute } from '../routes';
import { TimelinesRoute } from '../routes/timelines.route';
import { TimelineEditRoute } from '../routes/timeline-edit.route';
import { SessionsRoute } from '../routes/sessions.route';
import { SessionEditRoute } from '../routes/session-edit.route';
import { RoutinesRoute } from '../routes/routines.route';

@Controller()
export class AdminMainRouteController {
  constructor(
    readonly tenanciesRoute: TenanciesRoute,
    readonly categoriesRoute: CategoriesRoute,
    readonly categoryEditRoute: CategoryEditRoute,
    readonly categoryRoute: CategoryRoute,
    readonly groupsRoute: GroupsRoute,
    readonly groupEditRoute: GroupEditRoute,
    readonly timelinesRoute: TimelinesRoute,
    readonly timelineEditRoute: TimelineEditRoute,
    readonly sessionsRoute: SessionsRoute,
    readonly sessinoEditRoute: SessionEditRoute,
    readonly routinesRoute: RoutinesRoute,
    readonly routineEditRoute: RoutineEditRoute,
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

  @Auth()
  @Get('timelines')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainTimelinesRoute() {
    const route = await this.timelinesRoute.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'OK', route);
  }

  @Auth()
  @Get('timelines/:timelineId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainTimelineEditRoute(
    @Param('timelineId') timelineId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.timelineEditRoute.getMeta(timelineId, type);
    console.log('route', route);
    return new ResponseEntity(HttpStatus.OK, 'OK', route);
  }

  @Auth()
  @Get('sessions')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainSessionsRoute() {
    const route = this.sessionsRoute.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Sessions is OK', route);
  }

  @Auth()
  @Get('sessions/:sessionId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainSessionEditRoute(
    @Param('sessionId') sessionId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.sessinoEditRoute.getMeta(sessionId, type);
    console.log('route', route);
    return new ResponseEntity(HttpStatus.OK, 'Sessions Edit is OK', route);
  }

  @Auth()
  @Get('routines')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainRoutinesRoute() {
    const route = this.routinesRoute.getMeta();
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('routines/:routineId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainRoutineEditRoute(
    @Param('routineId') routineId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.routineEditRoute.getMeta(routineId, type);
    return ResponseEntity.WITH_ROUTE(route);
  }
}
