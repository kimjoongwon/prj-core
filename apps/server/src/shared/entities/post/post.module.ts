import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';

@Module({
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
