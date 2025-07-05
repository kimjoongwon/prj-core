import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Patch,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorator';
import {
  ActionDto,
  CreateActionDto,
  UpdateActionDto,
  QueryActionDto,
} from '@shared/schema';
import { PageMetaDto } from '@shared/schema';
import { ResponseEntity } from '@shared/schema';
import { ActionsService } from '../service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ACTION')
@Controller()
export class ActionsController {
  constructor(private readonly service: ActionsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ActionDto, HttpStatus.OK)
  async createAction(@Body() createActionDto: CreateActionDto) {
    const action = await this.service.create(createActionDto);

    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ActionDto, action),
    );
  }

  @Get(':actionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ActionDto, HttpStatus.OK)
  async getAction(@Param('actionId') actionId: string) {
    const action = await this.service.getUnique({
      where: { id: actionId },
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ActionDto, action),
    );
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ActionDto, HttpStatus.OK)
  async removeActions(@Body() actionIds: string[]) {
    const actions = await this.service.updateMany({
      where: { id: { in: actionIds } },
      data: { removedAt: new Date() },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', actions.count);
  }

  @Patch(':actionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ActionDto, HttpStatus.OK)
  async updateAction(
    @Param('actionId') actionId: string,
    @Body() updateActionDto: UpdateActionDto,
  ) {
    const action = await this.service.update({
      where: { id: actionId },
      data: updateActionDto as any,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ActionDto, action),
    );
  }

  @Patch(':actionId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ActionDto, HttpStatus.OK)
  async removeAction(@Param('actionId') actionId: string) {
    const action = await this.service.remove(actionId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ActionDto, action),
    );
  }

  @Delete(':actionId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ActionDto, HttpStatus.OK)
  async deleteAction(@Param('actionId') actionId: string) {
    const action = await this.service.deleteById(actionId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(ActionDto, action),
    );
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(ActionDto, HttpStatus.OK, { isArray: true })
  async getActionsByQuery(@Query() query: QueryActionDto) {
    const { count, actions } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      actions.map(action => action?.toDto?.() ?? action),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
