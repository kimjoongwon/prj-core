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
import { ResponseEntity } from '../common/entities/response.entity';
import { plainToInstance } from 'class-transformer';
import { PageMetaDto } from '../common';
import { CreateUserDto, UserDto, UpdateUserDto, UserQueryDto } from '../users/dtos';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { UsersService } from './users.service';

@ApiTags('ADMIN_USERS')
@Controller()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserDto, HttpStatus.OK)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.service.create({
      data: createUserDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(UserDto, user));
  }

  @Get(':userId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserDto, HttpStatus.OK)
  async getUser(@Param('userId') userId: string) {
    const user = await this.service.getUnique({ where: { id: userId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(UserDto, user));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserDto, HttpStatus.OK)
  async removeUsers(@Body() userIds: string[]) {
    const users = await this.service.removeMany(userIds);
    return new ResponseEntity(HttpStatus.OK, '성공', users.count);
  }

  @Patch(':userId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserDto, HttpStatus.OK)
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.service.update({
      where: { id: userId },
      data: updateUserDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(UserDto, user));
  }

  @Patch(':userId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserDto, HttpStatus.OK)
  async removeUser(@Param('userId') userId: string) {
    const user = await this.service.remove(userId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(UserDto, user));
  }

  @Delete(':userId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserDto, HttpStatus.OK)
  async deleteUser(@Param('userId') userId: string) {
    const user = await this.service.delete({ where: { id: userId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(UserDto, user));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(UserDto, HttpStatus.OK, { isArray: true })
  async getUsersByQuery(@Query() query: UserQueryDto) {
    const { count, users } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      users.map((user) => plainToInstance(UserDto, user)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
