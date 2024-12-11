import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, ApiResponseEntity, Auth } from '../../decorators';
import { ResponseEntity } from '../common';
import { GroupDto, CreateGroupDto, GroupQueryDto, UpdateGroupDto } from './dtos';
import { GroupsService } from './groups.service';
import { plainToInstance } from 'class-transformer';
import { PaginationUtil } from '@shared/utils';

@ApiTags('ADMIN_GROUPS')
@Controller()
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Auth([], { public: false })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: GroupDto,
  })
  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto, @Headers('tenantId') tenantId: string) {
    createGroupDto.tenantId = tenantId;
    console.log('createGroupDto', createGroupDto);
    return this.groupService.create(createGroupDto);
  }

  @Public()
  @ApiResponseEntity(GroupDto, HttpStatus.OK, { isArray: true })
  @Get()
  async getGroupsByQuery(@Query() query: GroupQueryDto, @Headers('tenantId') tenantId: string) {
    const args = query.toArgs(tenantId);
    const { count, groups } = await this.groupService.getManyByQuery(args);
    const { skip, take } = query;
    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 페이지 데이터 리턴 성공',
      groups.map((group) => plainToInstance(GroupDto, group)),
      {
        skip,
        take,
        hasNextPage: groups.length === take,
        hasPreviousPage: PaginationUtil.getPage({ skip, take }) > 1,
        itemCount: count,
        pageCount: 0,
      },
    );
  }

  @ApiResponseEntity(GroupDto, HttpStatus.OK)
  @Get(':groupId')
  async getGroup(@Param('groupId') groupId: string) {
    const group = await this.groupService.get(groupId);

    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 데이터 리턴 성공',
      group ? plainToInstance(GroupDto, group) : null,
    );
  }

  @ApiResponseEntity(GroupDto, HttpStatus.OK)
  @Patch(':groupId')
  async updateGroup(@Param('groupId') groupId: string, @Body() updateGroupDto: UpdateGroupDto) {
    const group = await this.groupService.update(groupId, updateGroupDto);
    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 데이터 업데이트 성공',
      plainToInstance(GroupDto, group),
    );
  }

  @ApiResponseEntity(Number, HttpStatus.OK)
  @Patch(':groupIds')
  async removeGroups(@Param('groupIds') ids: string[]) {
    const groups = await this.groupService.removeMany(ids);
    return new ResponseEntity(HttpStatus.OK, '그룹 데이터 제거 성공', groups.count);
  }

  @ApiResponseEntity(Number, HttpStatus.OK)
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: string) {
    const group = await this.groupService.delete(groupId);
    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 데이터 삭제 성공',
      plainToInstance(GroupDto, group),
    );
  }
}
