import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Base } from '../../../common/interfaces/base.interface';
import { Tenant } from '../../tenants/models/tenant.model';
import { Profile } from '../../profiles/models/profile.model';
import { User as CoCUser } from '@prisma/client';
@ObjectType()
@InputType('UserInputType')
export class User extends Base implements CoCUser {
  @Field(type => String)
  email: string;

  @Field(type => String)
  password: string;

  @Field(type => String)
  name: string;

  @Field(type => [Profile])
  profiles?: Profile[];

  @Field(type => [Tenant])
  tenants?: Tenant[];
}
