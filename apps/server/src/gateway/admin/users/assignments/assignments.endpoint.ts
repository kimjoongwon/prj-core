import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponseEntity, Auth, CreateUserAssignmentDto, UserService } from '@shared';

@Controller()
export class AssignmentsEndpoint {
  constructor(private readonly userService: UserService) {}

  @Auth([])
  @ApiResponseEntity(Object, HttpStatus.OK)
  @Post()
  createUserAssignment(@Body() createUserAssignmentDto: CreateUserAssignmentDto) {
    return this.userService.createUserAssignment(createUserAssignmentDto);
  }
}
