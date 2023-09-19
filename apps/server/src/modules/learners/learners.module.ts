import { Module } from '@nestjs/common';
import { LearnersService } from './learners.service';
import { LearnersResolver } from './learners.resolver';

@Module({
  providers: [LearnersResolver, LearnersService],
})
export class LearnersModule {}
