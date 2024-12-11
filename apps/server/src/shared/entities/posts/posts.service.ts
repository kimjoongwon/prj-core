import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsRepository } from './posts.repository';
import { PostPageQueryDto } from './dtos/post-page-query.dto';
import { Prisma } from '@prisma/client';
import { PaginationUtil } from '@shared/utils';

@Injectable()
export class PostsService {
  constructor(private readonly repository: PostsRepository) {}
  getUnique(id: string) {
    return this.repository.findUnique({ where: { id } });
  }

  getFirst(id: string) {
    return this.repository.findFirst({ where: { id } });
  }

  removeMany(ids: string[]) {
    return this.repository.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        removedAt: new Date(),
      },
    });
  }

  delete(id: string) {
    return this.repository.delete({ where: { id } });
  }

  create(createPostDto: CreatePostDto) {
    return this.repository.create({ data: createPostDto });
  }

  async getManyByQuery(pageQuery: PostPageQueryDto) {
    const args = PaginationUtil.toArgs(pageQuery);
    const posts = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      posts,
      count,
    };
  }

  update(args: Prisma.PostUpdateArgs) {
    return this.repository.update(args);
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
