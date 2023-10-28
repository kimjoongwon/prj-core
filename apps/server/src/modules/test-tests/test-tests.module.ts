import { Module } from '@nestjs/common';
import { TestTestsService } from './test-tests.service';
import { TestTestsResolver } from './test-tests.resolver';

@Module({
  providers: [TestTestsResolver, TestTestsService],
})
export class TestTestsModule {}
