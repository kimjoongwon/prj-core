import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponseEntity, Auth } from '../../../decorators';
import { ResponseEntity } from '../../../entities';
import { PrismaService } from 'nestjs-prisma';
import { ContextProvider } from '../../../providers';
import { TenanciesPage } from '../pages/tenancies.page';
import { CategoriesPage } from '../pages/categories.page';
import { CategoryEditPage } from '../pages/category-edit.page';
import { CategoryPage } from '../pages/category.page';
import { GroupsPage } from '../pages/groups.page';
import { GroupEditPage } from '../pages/group-edit.page';
import { TimelinesPage } from '../pages/timelines.page';
import { TimelineEditPage } from '../pages/timeline-edit.page';
import { SessionsPage } from '../pages/sessions.page';
import { SessionEditPage } from '../pages/session-edit.page';
import { RoutinesPage } from '../pages/routines.page';
import { RoutineEditPage } from '../pages/routine-edit.page';

@Controller()
export class AdminMainRouteController {
  constructor(
    readonly tenanciesPage: TenanciesPage,
    readonly categoriesPage: CategoriesPage,
    readonly categoryEditPage: CategoryEditPage,
    readonly categoryPage: CategoryPage,
    readonly groupsPage: GroupsPage,
    readonly groupEditPage: GroupEditPage,
    readonly timelinesPage: TimelinesPage,
    readonly timelineEditPage: TimelineEditPage,
    readonly sessionsPage: SessionsPage,
    readonly sessinoEditPage: SessionEditPage,
    readonly routinesPage: RoutinesPage,
    readonly routineEditPage: RoutineEditPage,
    readonly prisma: PrismaService,
  ) {}

  @Auth()
  @Get('tenancies')
  @ApiResponseEntity(Object)
  getAdminMainTenanciesPage() {
    const route = this.tenanciesPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Tenancies is OK', route);
  }

  @Auth()
  @ApiResponseEntity(Object)
  @Get('categories')
  getAdminMainCategoriesPage() {
    const route = this.categoriesPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Categories is OK', route);
  }

  @Auth()
  @Get('categories/:categoryId')
  @ApiResponseEntity(Object)
  async getAdminMainCategoryPage(@Param('categoryId') categoryId: string) {
    const route = await this.categoryPage.getMeta(categoryId);
    return new ResponseEntity(HttpStatus.OK, 'Categories is OK', route);
  }

  @Auth()
  @Get('categories/:categoryId/:type')
  @ApiResponseEntity(Object)
  async getAdminMainCategoriesEditPage(
    @Param('categoryId') categoryId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.categoryEditPage.getMeta(categoryId, type);
    return new ResponseEntity(HttpStatus.OK, 'Categories Edit is OK', route);
  }

  @Auth()
  @Get('services')
  @ApiResponseEntity(Object, HttpStatus.OK, { isArray: true })
  async getAdminMainServicesPage() {
    const tenancyId = ContextProvider.getTenancyId();
    const services = await this.prisma.service.findMany();
    const servicePages = services.map((service) => {
      return {
        name: service.name,
        pathname: `/admin/main/tenancies/${tenancyId}/services/${service.id}`,
      };
    });

    return new ResponseEntity(HttpStatus.OK, 'Services is OK', servicePages);
  }

  @Auth()
  @Get('groups')
  @ApiResponseEntity(Object, HttpStatus.OK, { isArray: true })
  async getAdminMainGroupsPage() {
    const route = await this.groupsPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Groups is OK', route);
  }

  @Auth()
  @Get('groups/:groupId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainGroupEditPage(
    @Param('groupId') groupId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.groupEditPage.getMeta(groupId, type);
    return new ResponseEntity(HttpStatus.OK, 'Groups Edit is OK', route);
  }

  @Auth()
  @Get('timelines')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainTimelinesPage() {
    const route = await this.timelinesPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'OK', route);
  }

  @Auth()
  @Get('timelines/:timelineId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainTimelineEditPage(
    @Param('timelineId') timelineId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.timelineEditPage.getMeta(timelineId, type);
    console.log('route', route);
    return new ResponseEntity(HttpStatus.OK, 'OK', route);
  }

  @Auth()
  @Get('sessions')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainSessionsPage() {
    const route = this.sessionsPage.getMeta();
    return new ResponseEntity(HttpStatus.OK, 'Sessions is OK', route);
  }

  @Auth()
  @Get('sessions/:sessionId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainSessionEditPage(
    @Param('sessionId') sessionId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.sessinoEditPage.getMeta(sessionId, type);
    console.log('route', route);
    return new ResponseEntity(HttpStatus.OK, 'Sessions Edit is OK', route);
  }

  @Auth()
  @Get('routines')
  @ApiResponseEntity(Object, HttpStatus.OK)
  getAdminMainRoutinesPage() {
    const route = this.routinesPage.getMeta();
    return ResponseEntity.WITH_ROUTE(route);
  }

  @Auth()
  @Get('routines/:routineId/:type')
  @ApiResponseEntity(Object, HttpStatus.OK)
  async getAdminMainRoutineEditPage(
    @Param('routineId') routineId: string,
    @Param('type') type: 'edit' | 'add',
  ) {
    const route = await this.routineEditPage.getMeta(routineId, type);
    return ResponseEntity.WITH_ROUTE(route);
  }
}
