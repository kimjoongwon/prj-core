import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../../common/models/base.model';

@ObjectType()
export class Profile extends BaseModel {
  @Field()
  phone: string;

  @Field()
  nickname: string;

  @Field()
  userId: string;
}
