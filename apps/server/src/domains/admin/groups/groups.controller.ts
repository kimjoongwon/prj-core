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
import {
  ApiResponseEntity,
  CreateGroupDto,
  GroupDto,
  GroupPageOptionsDto,
  GroupsService,
  PaginationMananger,
  Public,
  ResponseEntity,
  UpdateGroupDto,
} from '@shared';

@ApiTags('groups')
@Controller()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: GroupDto,
  })
  @Post()
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Public()
  @ApiResponseEntity(GroupDto, { isArray: true })
  @Get()
  async getGroupsByPageOptions(@Query() pageOptions: GroupPageOptionsDto) {
    const { count, groups } = await this.groupsService.getGroupsByPageOptions(pageOptions);
    const { skip, take } = pageOptions;
    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 페이지 데이터 리턴 성공',
      groups.map((group) => new GroupDto(group)),
      {
        skip,
        take,
        hasNextPage: groups.length === take,
        hasPreviousPage: PaginationMananger.getPage({ skip, take }) > 1,
        itemCount: count,
        pageCount: 0,
      },
    );
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
    type: GroupDto,
  })
  @Get(':groupId')
  findGroupById(@Param('groupId') id: string) {
    return this.groupsService.findOneById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: GroupDto,
  })
  @Patch(':groupId')
  updateGroupById(@Param('groupId') groupId: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.updateById(groupId, updateGroupDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully removed.',
    type: GroupDto,
  })
  @Delete(':groupId')
  removeGroupById(@Param('groupId') groupId: string) {
    return this.groupsService.removeById(groupId);
  }
}
