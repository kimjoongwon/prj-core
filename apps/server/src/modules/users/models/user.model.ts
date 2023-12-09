import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Base } from '../../../common/interfaces/base.interface';
import { Tenant } from '../../tenants/models/tenant.model';
import { Profile } from '../../profiles/models/profile.model';
import { User as CoCUser } from '@prisma/client';
import { Relation } from '../../../common/types';
import { loggerMiddleware } from '../../../common/field-middlewares';

export type WrapperType<T> = T;

@ObjectType()
@InputType('UserInputType')
export class User extends Base implements Omit<CoCUser, 'password'> {
  @Field(type => String, { middleware: [loggerMiddleware] })
  email: string;

  @Field(type => String)
  name: string;

  @Field(type => [Profile], { nullable: true })
  profiles?: Relation<Profile>[];

  @Field(type => [Tenant], { nullable: true })
  tenants?: Relation<Tenant>[];
}
