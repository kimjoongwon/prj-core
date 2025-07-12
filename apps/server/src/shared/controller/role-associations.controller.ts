import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateRoleAssociationDto,
  QueryRoleAssociationDto,
  ResponseEntity,
  RoleAssociationDto,
  UpdateRoleAssociationDto,
} from '@shared/schema';
import { plainToInstance } from 'class-transformer';
import { ApiResponseEntity } from '../decorator/api-response-entity.decorator';
import { Auth } from '../decorator/auth.decorator';
import { RoleAssociationsService } from '../service/role-associations.service';

@ApiTags('ROLE-ASSOCIATIONS')
@Controller()
export class RoleAssociationsController {
  constructor(private readonly service: RoleAssociationsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
  async createRoleAssociation(@Body() createRoleAssociationDto: CreateRoleAssociationDto) {
    const roleAssociation = await this.service.create(createRoleAssociationDto);

    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(RoleAssociationDto, roleAssociation)
    );
  }

  @Get(':roleAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
  async getRoleAssociation(@Param('roleAssociationId') roleAssociationId: string) {
    const roleAssociation = await this.service.getUnique({
      where: { id: roleAssociationId },
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(RoleAssociationDto, roleAssociation)
    );
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
  async removeRoleAssociations(@Body() roleAssociationIds: string[]) {
    const roleAssociations = await this.service.updateMany({
      where: { id: { in: roleAssociationIds } },
      data: { removedAt: new Date() },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', roleAssociations.count);
  }

  @Patch(':roleAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
  async updateRoleAssociation(
    @Param('roleAssociationId') roleAssociationId: string,
    @Body() updateRoleAssociationDto: UpdateRoleAssociationDto
  ) {
    const roleAssociation = await this.service.update({
      where: { id: roleAssociationId },
      data: updateRoleAssociationDto,
    });
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(RoleAssociationDto, roleAssociation)
    );
  }

  @Patch(':roleAssociationId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
  async removeRoleAssociation(@Param('roleAssociationId') roleAssociationId: string) {
    const roleAssociation = await this.service.remove(roleAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(RoleAssociationDto, roleAssociation)
    );
  }

  @Delete(':roleAssociationId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleAssociationDto, HttpStatus.OK)
  async deleteRoleAssociation(@Param('roleAssociationId') roleAssociationId: string) {
    const roleAssociation = await this.service.deleteById(roleAssociationId);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(RoleAssociationDto, roleAssociation)
    );
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleAssociationDto, HttpStatus.OK, { isArray: true })
  async getRoleAssociationsByQuery(@Query() query: QueryRoleAssociationDto) {
    const { roleAssociations, count } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      '성공',
      plainToInstance(RoleAssociationDto, roleAssociations),
      query.toPageMetaDto(count)
    );
  }
}
