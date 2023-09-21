import { User } from '@modules/users/entities/user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Workspace {
  @Field()
  name: string;

  @Field(() => User, { description: 'Example field (placeholder)' })
  owner: User;
}
