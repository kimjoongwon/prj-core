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
import { PostsService, CreatePostDto, PostDto, UpdatePostDto, PostQueryDto } from '.';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseEntity } from '../../decorators/api-response-entity.decorator';

@ApiTags('ADMIN_TEMPLATES')
@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PostDto, HttpStatus.OK)
  async createPost(@Body() createPostDto: CreatePostDto) {
    const post = await this.postsService.create(createPostDto);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PostDto, post));
  }

  @Get(':postId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PostDto, HttpStatus.OK)
  async getPost(@Param('postId') postId: string) {
    const post = await this.postsService.getUnique(postId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PostDto, post));
  }

  @Patch('removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PostDto, HttpStatus.OK)
  async removePosts(@Body() postIds: string[]) {
    const posts = await this.postsService.removeMany(postIds);
    return new ResponseEntity(HttpStatus.OK, '성공', posts.count);
  }

  @Patch(':postId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PostDto, HttpStatus.OK)
  async updatePost(@Param('postId') postId: string, @Body() updatePostDto: UpdatePostDto) {
    const post = await this.postsService.update({
      where: {
        id: postId,
      },
      data: updatePostDto,
    });
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PostDto, post));
  }

  @Patch(':postId/removedAt')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PostDto, HttpStatus.OK)
  async removePost(@Param('postId') postId: string) {
    const post = await this.postsService.remove(postId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PostDto, post));
  }

  @Delete(':postId')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PostDto, HttpStatus.OK)
  async deletePost(@Param('postId') postId: string) {
    const post = await this.postsService.delete(postId);
    return new ResponseEntity(HttpStatus.OK, '성공', plainToInstance(PostDto, post));
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiResponseEntity(PostDto, HttpStatus.OK, { isArray: true })
  async getPostsByQuery(@Query() postQueryDto: PostQueryDto) {
    const { count, posts } = await this.postsService.getManyByQuery(postQueryDto);

    return new ResponseEntity(
      HttpStatus.OK,
      'success',
      posts.map((post) => plainToInstance(PostDto, post)),
      new PageMetaDto(postQueryDto.skip, postQueryDto.take, count),
    );
  }
}
