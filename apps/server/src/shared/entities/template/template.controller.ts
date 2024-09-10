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
import { TenancyDto } from '../tenancy';
import {
  TemplateService,
  CreateTemplateDto,
  TemplateDto,
  UpdateTemplateDto,
  TemplateQueryDto,
} from '../template';
import { ApiEndpoints } from '../../types/enums/api-endpoints';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';

@ApiTags('ADMIN_TEMPLATES')
@Controller(ApiEndpoints.ADMIN_TEMPLATES)
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TenancyDto, HttpStatus.OK)
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    const template = await this.templateService.create(createTemplateDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Get(':templateId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async getTemplate(@Param('templateId') templateId: string) {
    const template = await this.templateService.getUnique(templateId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async removeTemplates(@Body() templateIds: string[]) {
    const templates = await this.templateService.removeMany(templateIds);
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
    const template = await this.templateService.update(templateId, updateTemplateDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Patch(':templateId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async removeTemplate(@Param('templateId') templateId: string) {
    const template = await this.templateService.remove(templateId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Delete(':templateId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK)
  async deleteTemplate(@Param('templateId') templateId: string) {
    const template = await this.templateService.delete(templateId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(TemplateDto, template));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(TemplateDto, HttpStatus.OK, { isArray: true })
  async getTemplatesByQuery(@Query() templateQueryDto: TemplateQueryDto) {
    const { count, templates } = await this.templateService.getManyByQuery(templateQueryDto);

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
