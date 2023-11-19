import { InputType, OmitType } from '@nestjs/graphql';
import { User } from '../models/user.model';

@InputType()
export class CreateUserInput extends OmitType(
  User,
  ['createdAt', 'deletedAt', 'id', 'updatedAt'],
  InputType,
) {}
