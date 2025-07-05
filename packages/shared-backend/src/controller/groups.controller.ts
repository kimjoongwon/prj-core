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
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Auth, Public, ApiResponseEntity } from '../decorator';
import { GroupDto, CreateGroupDto, QueryGroupDto, UpdateGroupDto } from '@shared/schema';
import { ResponseEntity } from '@shared/schema';
import { GroupsService } from '../service';

@ApiTags('GROUPS')
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
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Public()
  @ApiResponseEntity(GroupDto, HttpStatus.OK, { isArray: true })
  @Get()
  async getGroupsByQuery(@Query() query: QueryGroupDto) {
    const { totalCount, groups } = await this.groupService.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 페이지 데이터 리턴 성공',
      groups.map((group) => group?.toDto?.() ?? group),
      query.toPageMetaDto(totalCount),
    );
  }

  @ApiResponseEntity(GroupDto, HttpStatus.OK)
  @Get(':groupId')
  async getGroupById(@Param('groupId') groupId: string) {
    const group = await this.groupService.get(groupId);

    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 데이터 리턴 성공',
      group ? plainToInstance(GroupDto, group) : null,
    );
  }

  @ApiResponseEntity(GroupDto, HttpStatus.OK)
  @Patch(':groupId')
  async updateGroupById(@Param('groupId') groupId: string, @Body() updateGroupDto: UpdateGroupDto) {
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
