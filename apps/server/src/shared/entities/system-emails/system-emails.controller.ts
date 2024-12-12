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
import {
  CreateSystemEmailDto,
  SystemEmailDto,
  UpdateSystemEmailDto,
  SystemEmailQueryDto,
} from './dtos';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { SystemEmailsService } from './system-emails.service';

@ApiTags('ADMIN_TEMPLATES')
@Controller()
export class SystemEmailsController {
  constructor(private readonly service: SystemEmailsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async createSystemEmail(@Body() createSystemEmailDto: CreateSystemEmailDto) {
    const email = await this.service.create({
      data: createSystemEmailDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SystemEmailDto, email));
  }

  @Get(':emailId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async getSystemEmail(@Param('emailId') emailId: string) {
    const email = await this.service.getUnique({ where: { id: emailId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SystemEmailDto, email));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async removeSystemEmails(@Body() emailIds: string[]) {
    const emails = await this.service.removeMany(emailIds);
    return new ResponseEntity(HttpStatus.OK, '성공', emails.count);
  }

  @Patch(':systemEmailId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async updateSystemEmail(
    @Param('systemEmailId') systemEmailId: string,
    @Body() updateSystemEmailDto: UpdateSystemEmailDto,
  ) {
    const email = await this.service.update({
      where: {
        id: systemEmailId,
      },
      data: updateSystemEmailDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SystemEmailDto, email));
  }

  @Patch(':emailId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async removeSystemEmail(@Param('emailId') emailId: string) {
    const email = await this.service.remove(emailId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SystemEmailDto, email));
  }

  @Delete(':emailId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async deleteSystemEmail(@Param('emailId') emailId: string) {
    const email = await this.service.delete(emailId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(SystemEmailDto, email));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK, { isArray: true })
  async getSystemEmailsByQuery(@Query() query: SystemEmailQueryDto) {
    const { count, systemEmails } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      systemEmails.map((email) => plainToInstance(SystemEmailDto, email)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
