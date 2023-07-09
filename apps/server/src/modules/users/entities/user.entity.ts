import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../../common/models/base.model';
import { Profile } from '../../profiles/entities/profile.entity';

@ObjectType()
export class User extends BaseModel {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  profile: Profile;
}
