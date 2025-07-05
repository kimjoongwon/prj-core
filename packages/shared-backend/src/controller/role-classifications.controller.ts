import { Controller, Type } from '@nestjs/common';
import {
  CreateRoleClassificationDto,
  UpdateRoleClassificationDto,
  RoleClassificationDto,
  QueryRoleClassificationDto,
} from '@shared/schema';
import { RoleClassificationsService } from '../service/role-classifications.service';
import { AutoBaseController } from './auto-base.controller';
import { CrudController } from './crud.decorator';

@CrudController({
  entityName: 'RoleClassification',
  tag: 'ROLE_CLASSIFICATIONS',
})
@Controller()
export class RoleClassificationsController extends AutoBaseController<
  RoleClassificationDto,
  CreateRoleClassificationDto,
  UpdateRoleClassificationDto,
  QueryRoleClassificationDto,
  RoleClassificationsService
> {
  protected readonly service: RoleClassificationsService;
  protected readonly dtoClass: Type<RoleClassificationDto> = RoleClassificationDto;
  protected readonly queryDtoClass: Type<QueryRoleClassificationDto> = QueryRoleClassificationDto;
  protected readonly entityName: string = 'RoleClassification';

  constructor(service: RoleClassificationsService) {
    super();
    this.service = service;
  }
}
