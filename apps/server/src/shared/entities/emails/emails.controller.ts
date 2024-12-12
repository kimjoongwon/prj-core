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
import { CreateEmailDto, EmailDto, UpdateEmailDto, EmailQueryDto } from './dtos';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { EmailsService } from './emails.service';
import { query } from 'express';

@ApiTags('ADMIN_EMAILS')
@Controller()
export class EmailsController {
  constructor(private readonly service: EmailsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(EmailDto, HttpStatus.OK)
  async createEmail(@Body() createEmailDto: CreateEmailDto) {
    const email = await this.service.create(createEmailDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(EmailDto, email));
  }

  @Get(':emailId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(EmailDto, HttpStatus.OK)
  async getEmail(@Param('emailId') emailId: string) {
    const email = await this.service.getUnique({ where: { id: emailId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(EmailDto, email));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(EmailDto, HttpStatus.OK)
  async removeEmails(@Body() emailIds: string[]) {
    const emails = await this.service.removeMany(emailIds);
    return new ResponseEntity(HttpStatus.OK, '성공', emails.count);
  }

  @Patch(':emailId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(EmailDto, HttpStatus.OK)
  async updateEmail(@Param('emailId') emailId: string, @Body() updateEmailDto: UpdateEmailDto) {
    const email = await this.service.update({
      where: { id: emailId },
      data: updateEmailDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(EmailDto, email));
  }

  @Patch(':emailId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(EmailDto, HttpStatus.OK)
  async removeEmail(@Param('emailId') emailId: string) {
    const email = await this.service.remove(emailId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(EmailDto, email));
  }

  @Delete(':emailId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(EmailDto, HttpStatus.OK)
  async deleteEmail(@Param('emailId') emailId: string) {
    const email = await this.service.delete(emailId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(EmailDto, email));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(EmailDto, HttpStatus.OK, { isArray: true })
  async getEmailsByQuery(@Query() query: EmailQueryDto) {
    const { count, emails } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      emails.map((email) => plainToInstance(EmailDto, email)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
