import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, Public } from '@common';
import { TestTestsService } from './test-tests.service';
import { PaginatedTestTest, TestTest, TestTestForm } from './models';
import {
  CreateTestTestInput,
  GetTestTestsArgs,
  UpdateTestTestInput,
} from './dto';

@Resolver(() => TestTest)
@UseGuards(GqlAuthGuard)
export class TestTestsResolver {
  constructor(private readonly testTestsService: TestTestsService) {}

  @Public()
  @Mutation(() => TestTest)
  createTestTest(
    @Args('createTestTestInput')
    createTestTestInput: CreateTestTestInput,
  ) {
    return this.testTestsService.create(createTestTestInput);
  }

  @Public()
  @Mutation(() => TestTest)
  updateTestTest(
    @Args('updateTestTestInput')
    updateTestTestInput: UpdateTestTestInput,
  ) {
    return this.testTestsService.update(updateTestTestInput);
  }

  @Public()
  @Mutation(() => TestTest)
  deleteTestTest(@Args('id') id: string) {
    return this.testTestsService.delete(id);
  }

  @Public()
  @Query(() => TestTest, { name: 'test_test' })
  getTestTest(@Args('id') id: string) {
    return this.testTestsService.findOne(id);
  }

  @Public()
  @Query(() => TestTestForm, { name: 'test_testForm' })
  getTestTestForm() {
    return this.testTestsService.findForm();
  }

  @Public()
  @Query(() => PaginatedTestTest, { name: 'test_tests' })
  getTestTests(@Args() args: GetTestTestsArgs) {
    return this.testTestsService.findPaginatedTestTest(args);
  }
}
