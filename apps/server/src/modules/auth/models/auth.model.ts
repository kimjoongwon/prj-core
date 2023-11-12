import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@modules/users/models';
import { Token } from './token.model';

@ObjectType()
export class Auth extends Token {
  @Field()
  user?: User;
}
