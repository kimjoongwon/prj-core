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
  GroupsService,
  Public,
  ResponseEntity,
  UpdateGroupDto,
} from '@shared';
import { GroupPageOptionsDto } from './dtos/group-page-options.dto';

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
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Public()
  @ApiResponseEntity(GroupDto, { isArray: true })
  @Get()
  async findByPageOptions(@Query() pageOptions: GroupPageOptionsDto) {
    const { count, groups } =
      await this.groupsService.findByPageOptions(pageOptions);

    return new ResponseEntity(
      HttpStatus.OK,
      '그룹 페이지 데이터 리턴 성공',
      groups.map((group) => new GroupDto(group)),
      {
        page: pageOptions.page,
        limit: pageOptions.limit,
        hasNextPage: groups.length === pageOptions.limit,
        hasPreviousPage: pageOptions.page > 1,
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
  findOneById(@Param('groupId') id: string) {
    return this.groupsService.findOneById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: GroupDto,
  })
  @Patch(':groupId')
  updateById(
    @Param('groupId') groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.updateById(groupId, updateGroupDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully removed.',
    type: GroupDto,
  })
  @Delete(':id')
  removeById(@Param('id') groupId: string) {
    return this.groupsService.removeById(groupId);
  }
}
