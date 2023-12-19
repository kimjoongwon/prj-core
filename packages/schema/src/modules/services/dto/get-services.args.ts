import { ArgsType } from '@nestjs/graphql';
import { QueryArgs } from '../../../common/dto';

@ArgsType()
export class GetServicesArgs extends QueryArgs {}
