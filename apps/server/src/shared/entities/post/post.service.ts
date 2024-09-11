import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostRepository } from './post.repository';
import { PostPageQueryDto } from './dtos/post-page-query.dto';
import { PaginationMananger } from '../../utils';
import { IService } from '../../types/interfaces/service.interface';

@Injectable()
export class PostService implements IService {
  constructor(private readonly repository: PostRepository) {}

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
    const args = PaginationMananger.toArgs(pageQuery);
    const posts = await this.repository.findMany(args);
    const count = await this.repository.count(args);
    return {
      posts,
      count,
    };
  }

  update(postId: string, updatePostDto: UpdatePostDto) {
    return this.repository.update({
      where: {
        id: postId,
      },
      data: updatePostDto,
    });
  }

  remove(id: string) {
    return this.repository.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}
