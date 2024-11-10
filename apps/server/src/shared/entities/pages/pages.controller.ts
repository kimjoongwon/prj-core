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
import { CreatePageDto, PageDto, UpdatePageDto, CPageQueryDto } from './dtos';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';
import { PagesService } from './pages.service';

@ApiTags('ADMIN_PAGES')
@Controller()
export class PagesController {
  constructor(private readonly service: PagesService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PageDto, HttpStatus.OK)
  async createPage(@Body() createPageDto: CreatePageDto) {
    const page = await this.service.create({
      data: createPageDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PageDto, page));
  }

  @Get(':pageId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PageDto, HttpStatus.OK)
  async getPage(@Param('pageId') pageId: string) {
    const page = await this.service.getUnique({ where: { id: pageId } });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PageDto, page));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PageDto, HttpStatus.OK)
  async removePages(@Body() pageIds: string[]) {
    const pages = await this.service.removeMany(pageIds);
    return new ResponseEntity(HttpStatus.OK, '성공', pages.count);
  }

  @Patch(':pageId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PageDto, HttpStatus.OK)
  async updatePage(@Param('pageId') pageId: string, @Body() updatePageDto: UpdatePageDto) {
    const page = await this.service.update({
      where: {
        id: pageId,
      },
      data: updatePageDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PageDto, page));
  }

  @Patch(':pageId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PageDto, HttpStatus.OK)
  async removePage(@Param('pageId') pageId: string) {
    const page = await this.service.remove(pageId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PageDto, page));
  }

  @Delete(':pageId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PageDto, HttpStatus.OK)
  async deletePage(@Param('pageId') pageId: string) {
    const page = await this.service.delete(pageId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PageDto, page));
  }

  @Get()
  @Auth([], { public: true })
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PageDto, HttpStatus.OK, { isArray: true })
  async getPagesByQuery(@Query() query: CPageQueryDto) {
    const pageQuery = plainToInstance(CPageQueryDto, query);
    const pages = [
      {
        name: '로그인',
        pathname: '/admin/auth/login',
        queryKey: 'useGetUsersByQuery',
        elements: [
          {
            type: 'Input',
          },
        ],
      },
    ];

    return new ResponseEntity(HttpStatus.OK, 'success', pages);
    // return new ResponseEntity(
    //   HttpStatus.OK,
    //   'success',
    //   pages.map((page) => plainToInstance(PageDto, page)),
    //   query.toPageMetaDto(count),
    // );
  }
}
