import { Controller } from '@nestjs/common';
import { GroundDto, CreateGroundDto, QueryGroundDto, UpdateGroundDto } from '../dto';
import { SmartBaseController, SmartCrudController } from './smart-base.controller';
import { GroundsService } from '../service/grounds.service';

@SmartCrudController(GroundDto, {
  tag: 'GROUNDS',
  entityName: 'Ground',
  createDto: CreateGroundDto,
  updateDto: UpdateGroundDto,
})
@Controller()
export class GroundsController extends SmartBaseController<
  GroundDto,
  CreateGroundDto,
  UpdateGroundDto,
  QueryGroundDto,
  GroundsService
> {
  protected readonly dtoClass = GroundDto;

  constructor(protected readonly service: GroundsService) {
    super();
  }
}
