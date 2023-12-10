import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ProfileEntity } from './profile.entity';
import { User } from '../../users/models/user.model';
import { Relation } from '../../../common/types';

@ObjectType()
@InputType('ProfileInputType')
export class Profile extends ProfileEntity {
  @Field(type => User, { nullable: true })
  user?: Relation<User>;
}
