import { ArgsType } from '@nestjs/graphql';
import { QueryArgs } from '../../../common/dto';

@ArgsType()
export class GetGroupsArgs extends QueryArgs {}
