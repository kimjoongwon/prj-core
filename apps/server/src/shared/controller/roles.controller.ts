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
  CreateRoleDto,
  QueryRoleDto,
  ResponseEntity,
  RoleDto,
  UpdateRoleDto,
} from '@shared/schema';
import { plainToInstance } from 'class-transformer';
import { ApiResponseEntity, Auth } from '../decorator';
import { RolesService } from '../service/services';

@ApiTags('SPACES')
@Controller()
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.service.createRoleDto(createRoleDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Get(':roleId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async getRole(@Param('roleId') roleId: string) {
    const role = await this.service.getUnique({ where: { id: roleId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Patch(':roleId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async updateRole(@Param('roleId') roleId: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.service.update(roleId, updateRoleDto);
    return new ResponseEntity(HttpStatus.OK, '성공', role?.toDto?.() ?? role);
  }

  @Patch(':roleId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async removeRole(@Param('roleId') roleId: string) {
    const role = await this.service.remove(roleId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Delete(':roleId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async deleteRole(@Param('roleId') roleId: string) {
    const role = await this.service.delete(roleId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
  async getRolesByQuery(@Query() query: QueryRoleDto) {
    const { count, roles } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      roles.map((role) => role?.toDto?.() ?? role),
      query.toPageMetaDto(count)
    );
  }
}
