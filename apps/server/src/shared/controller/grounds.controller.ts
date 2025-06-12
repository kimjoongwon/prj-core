import { Controller, Type } from '@nestjs/common';
import { CreateGroundDto, UpdateGroundDto, GroundDto, QueryGroundDto } from '../dto';
import { GroundsService } from '../service/grounds.service';
import { AutoBaseController } from './auto-base.controller';
import { ApiTags } from '@nestjs/swagger';
import { CrudController } from './crud.decorator';

@ApiTags('GROUNDS')
@CrudController({
  entityName: 'Ground',
  tag: 'GROUNDS',
})
@Controller()
export class GroundsController extends AutoBaseController<
  GroundDto,
  CreateGroundDto,
  UpdateGroundDto,
  QueryGroundDto,
  GroundsService
> {
  protected readonly service: GroundsService;
  protected readonly dtoClass: Type<GroundDto> = GroundDto;
  protected readonly entityName: string = 'Ground';

  constructor(service: GroundsService) {
    super();
    this.service = service;
  }
}
