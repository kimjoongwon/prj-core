---
to: src/shared/controllers/<%= h.inflection.pluralize(name) %>.controller.ts
---
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
import { plainToInstance } from 'class-transformer';
import { Auth, ApiResponseEntity } from '../decorators';
import { <%= h.changeCase.pascal(name) %>Dto, Create<%= h.changeCase.pascal(name) %>Dto, <%= h.changeCase.pascal(name) %>QueryDto } from '../dtos';
import { PageMetaDto } from '../dtos/query/page-meta.dto';
import { ResponseEntity } from '../entities/response.entity';
import { <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Service } from '../services/<%= h.inflection.pluralize(name) %>.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('<%= h.inflection.pluralize(name).toUpperCase() %>')
@Controller()
export class <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Controller {
  constructor(private readonly service: <%= h.inflection.pluralize(h.changeCase.pascal(name)) %>Service) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(<%= h.changeCase.pascal(name) %>Dto, HttpStatus.OK)
  async create<%= h.changeCase.pascal(name) %>(@Body() create<%= h.changeCase.pascal(name) %>Dto: Create<%= h.changeCase.pascal(name) %>Dto) {
    const <%= name %> = await this.service.create(create<%= h.changeCase.pascal(name) %>Dto);

    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(<%= h.changeCase.pascal(name) %>Dto, <%= name %>));
  }

  @Get(':<%= name %>Id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(<%= h.changeCase.pascal(name) %>Dto, HttpStatus.OK)
  async get<%= h.changeCase.pascal(name) %>(@Param('<%= name %>Id') <%= name %>Id: string) {
    const <%= name %> = await this.service.getById(<%= name %>Id);
    return new ResponseEntity(HttpStatus.OK, '성공', <%= name %>.toDto());
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(<%= h.changeCase.pascal(name) %>Dto, HttpStatus.OK)
  async remove<%= h.inflection.pluralize(h.changeCase.pascal(name)) %>(@Body() <%= name %>Ids: string[]) {
    const <%= name %>s = await this.service.removeManyByIds(<%= name %>Ids);
    return new ResponseEntity(HttpStatus.OK, '성공', <%= name %>s.count);
  }

  @Patch(':<%= name %>Id/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(<%= h.changeCase.pascal(name) %>Dto, HttpStatus.OK)
  async remove<%= h.changeCase.pascal(name) %>ById(@Param('<%= name %>Id') <%= name %>Id: string) {
    const <%= name %> = await this.service.removeById(<%= name %>Id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(<%= h.changeCase.pascal(name) %>Dto, <%= name %>));
  }

  @Delete(':<%= name %>Id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(<%= h.changeCase.pascal(name) %>Dto, HttpStatus.OK)
  async delete<%= h.changeCase.pascal(name) %>(@Param('<%= name %>Id') <%= name %>Id: string) {
    const <%= name %> = await this.service.deleteById(<%= name %>Id);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(<%= h.changeCase.pascal(name) %>Dto, <%= name %>));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(<%= h.changeCase.pascal(name) %>Dto, HttpStatus.OK, { isArray: true })
  async get<%= h.inflection.pluralize(h.changeCase.pascal(name)) %>ByQuery(@Query() query: <%= h.changeCase.pascal(name) %>QueryDto) {
    const { count, <%= name %>s } = await this.service.getManyByQuery(query);
    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      <%= name %>s.map((<%= name %>) => <%= name %>.toDto()),
      new PageMetaDto(query.skip, query.take, count),
    );
  }
}