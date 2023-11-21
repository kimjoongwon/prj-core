import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../models/user.model';
import { CreateProfileInput } from '../../profiles/dto/create-profile.input';
import { CreateTenantInput } from '../../tenants/dto/create-tenant.input';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class CreateUserInput
  extends OmitType(
    User,
    ['createdAt', 'deletedAt', 'id', 'updatedAt', 'tenants', 'profiles'],
    InputType,
  )
  implements
    Omit<CreateProfileInput, 'userId'>,
    Omit<CreateTenantInput, 'userId'>
{
  @Field(type => String, { nullable: true })
  roleId: string;

  @Field(type => String, { nullable: true })
  spaceId: string;

  @Field(type => String, { nullable: true })
  phone: string;

  @Field(type => String, { nullable: true })
  nickname: string;
}
