import { ArgsType } from '@nestjs/graphql';
import { QueryArgs } from '../../../common/dto';

@ArgsType()
export class GetTenantsArgs extends QueryArgs {}
