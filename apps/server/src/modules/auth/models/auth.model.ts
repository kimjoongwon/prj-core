import { Field, ObjectType } from '@nestjs/graphql';
import { Token } from './token.model';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Auth extends Token {
  @Field()
  user?: User;
}
