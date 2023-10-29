import { QueryArgs } from '@common';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetRolesArgs extends QueryArgs {}
