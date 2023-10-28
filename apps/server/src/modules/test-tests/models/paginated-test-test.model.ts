import { Paginated } from '@common';
import { ObjectType } from '@nestjs/graphql';
import { TestTest } from './test-test.model';

@ObjectType()
export class PaginatedTestTest extends Paginated(TestTest) {}
