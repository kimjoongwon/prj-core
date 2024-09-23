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
import { TenancyDto } from '../tenancies';
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

@ApiTags('ADMIN_TEMPLATES')
@Controller(ApiEndpoints.ADMIN_TEMPLATES)
export class TemplatesController {
  constructor(private readonly service: TemplatesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    const template = await this.service.create(createTemplateDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Get(':templateId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async getTemplate(@Param('templateId') templateId: string) {
    const template = await this.service.getUnique(templateId);
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
    const template = await this.service.update(templateId, updateTemplateDto);
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
  async getTemplatesByQuery(@Query() templateQueryDto: TemplateQueryDto) {
    const { count, templates } = await this.service.getManyByQuery(templateQueryDto);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      templates.map((template) => plainToInstance(TemplateDto, template)),
      new PageMetaDto({
        pageQueryDto: templateQueryDto,
        itemCount: count,
      }),
    );
  }
}
