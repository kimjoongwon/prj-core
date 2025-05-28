import { Controller } from '@nestjs/common';
import {
  CreateRoleClassificationDto,
  UpdateRoleClassificationDto,
  RoleClassificationDto,
  QueryRoleClassificationDto,
} from '../dto';
import { SmartBaseController, SmartCrudController } from './smart-base.controller';
import { RoleClassificationsService } from '../service/role-classifications.service';

@SmartCrudController(RoleClassificationDto, {
  tag: 'ROLE-CLASSIFICATIONS',
  entityName: 'RoleClassification',
  createDto: CreateRoleClassificationDto,
  updateDto: UpdateRoleClassificationDto,
})
@Controller()
export class RoleClassificationsController extends SmartBaseController<
  RoleClassificationDto,
  CreateRoleClassificationDto,
  UpdateRoleClassificationDto,
  QueryRoleClassificationDto,
  RoleClassificationsService
> {
  protected readonly dtoClass = RoleClassificationDto;

  constructor(protected readonly service: RoleClassificationsService) {
    super();
  }
}
