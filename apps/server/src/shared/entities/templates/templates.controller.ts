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
import {
  CreateTemplateDto,
  TemplateDto,
  UpdateTemplateDto,
  TemplateQueryDto,
} from '../templates/dtos';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { TemplatesService } from './templates.service';
import { SystemEmailDto } from '../system-emails/dtos/system-email.dto';

@ApiTags('ADMIN_TEMPLATES')
@Controller(ApiEndpoints.ADMIN_TEMPLATES)
export class TemplatesController {
  constructor(private readonly service: TemplatesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(SystemEmailDto, HttpStatus.OK)
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    const { post, ...rawCreateTemplateDto } = createTemplateDto;
    const template = await this.service.create({
      data: {
        ...rawCreateTemplateDto,
        post: {
          create: post,
        },
      },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Get(':templateId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async getTemplate(@Param('templateId') templateId: string) {
    const template = await this.service.getUnique({ where: { id: templateId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async removeTemplates(@Body() templateIds: string[]) {
    const templates = await this.service.removeMany(templateIds);
    return new ResponseEntity(HttpStatus.OK, '성공', templates.count);
  }

  @Patch(':templateId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async updateTemplate(
    @Param('templateId') templateId: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    const { post, ...rawUpdateTemplateDto } = updateTemplateDto;
    const template = await this.service.update({
      where: { id: templateId },
      data: {
        ...rawUpdateTemplateDto,
        post: {
          update: post,
        },
      },
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Patch(':templateId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async removeTemplate(@Param('templateId') templateId: string) {
    const template = await this.service.remove(templateId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Delete(':templateId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async deleteTemplate(@Param('templateId') templateId: string) {
    const template = await this.service.delete(templateId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK, { isArray: true })
  async getTemplatesByQuery(@Query() query: TemplateQueryDto) {
    const { count, templates } = await this.service.getManyByQuery(query);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      templates.map((template) => plainToInstance(TemplateDto, template)),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}
