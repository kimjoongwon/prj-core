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
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '../common/response.entity';
import { plainToInstance } from 'class-transformer';
import { PageMetaDto } from '../common';
import { TenancyDto } from '../tenancy';
import { CreateRoleDto, RoleDto, UpdateRoleDto, RoleQueryDto } from './dto';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { RoleService } from './role.service';

@ApiTags('ADMIN_ROLES')
@Controller(ApiEndpoints.ADMIN_ROLES)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.roleService.create(createRoleDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Get(':roleId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async getRole(@Param('roleId') roleId: string) {
    const role = await this.roleService.getUnique(roleId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async removeRoles(@Body() roleIds: string[]) {
    const roles = await this.roleService.removeMany(roleIds);
    return new ResponseEntity(HttpStatus.OK, '성공', roles.count);
  }

  @Patch(':roleId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async updateRole(@Param('roleId') roleId: string, @Body() updateRoleDto: UpdateRoleDto) {
    const role = await this.roleService.update(roleId, updateRoleDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Patch(':roleId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async removeRole(@Param('roleId') roleId: string) {
    const role = await this.roleService.remove(roleId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Delete(':roleId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK)
  async deleteRole(@Param('roleId') roleId: string) {
    const role = await this.roleService.delete(roleId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(RoleDto, role));
  }

  @Get()
  @Auth([], { public: true })
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
  async getRolesByQuery(@Query() roleQueryDto: RoleQueryDto) {
    console.log('roleQueryDto', roleQueryDto);
    const { count, roles } = await this.roleService.getManyByQuery(roleQueryDto);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      roles.map((role) => plainToInstance(RoleDto, role)),
      new PageMetaDto({
        pageQueryDto: roleQueryDto,
        itemCount: count,
      }),
    );
  }
}
