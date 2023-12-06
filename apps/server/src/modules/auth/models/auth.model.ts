import { Field, ObjectType } from '@nestjs/graphql';
import { Token } from './token.model';
import { User } from '../../users/models/user.model';
import { loggerMiddleware } from '../../../common/field-middlewares';

@ObjectType()
export class Auth extends Token {
  @Field()
  user?: User;
}
