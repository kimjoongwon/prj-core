import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { GroupsService } from './groups.service';
import { ApiResponse } from '@nestjs/swagger';
import { GroupDto } from './dto/group.dto';
import { Public } from '../../decorators';

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
  @Post('test')
  test() {
    console.log('test4')
    return this.groupsService.create({
      name: 'test',
      serviceId: 'test333',
      spaceId: 'test',
    });
  }

  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: GroupDto,
    isArray: true,
  })
  @Public()
  @Get()
  findAll() {
    return this.groupsService.findAll();
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
