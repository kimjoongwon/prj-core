import { QueryArgs } from '../../../common/dto/query.args';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetSessionsArgs extends QueryArgs {}
