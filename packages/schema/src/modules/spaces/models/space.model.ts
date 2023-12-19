import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Space as CoCSpace } from '@prisma/client';
import { Base } from '../../../common/interfaces';
import { EmailAddressResolver } from 'graphql-scalars';

@ObjectType()
@InputType('SpaceInput')
export class Space extends Base implements CoCSpace {
  @Field(type => String)
  name: string;

  @Field(type => String)
  phone: string;

  @Field(type => EmailAddressResolver)
  address: string;
}
