import { QueryArgs } from '@common/dto';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetRolesArgs extends QueryArgs {}
